import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { camceeApi } from '@/utils/apiBase';

const normalizeExtractionResponse = (raw) => {
  const payload = raw?.data && typeof raw.data === 'object' ? raw.data : raw;
  const rawElements =
    payload?.elements ||
    payload?.extractionResults ||
    payload?.extraction_results ||
    payload?.result ||
    payload?.results ||
    [];

  const elements = Array.isArray(rawElements)
    ? rawElements.map((item, index) => {
        if (typeof item === 'string') {
          return { name: `要素${index + 1}`, value: item };
        }

        if (item && typeof item === 'object') {
          const name = item.name || item.key || item.label || item.type || `要素${index + 1}`;
          const value = item.value || item.content || item.text || item.result || JSON.stringify(item);
          return { name, value };
        }

        return { name: `要素${index + 1}`, value: String(item ?? '') };
      })
    : Object.entries(rawElements || {}).map(([name, value]) => ({
        name,
        value: typeof value === 'string' ? value : JSON.stringify(value),
      }));

  return {
    contractName: payload?.contractName || payload?.contract_name || payload?.title || '未返回合同名称',
    extractedElements: Number(payload?.extractedElements || payload?.elementCount || payload?.count || elements.length || 0),
    elements,
  };
};

const extractTrainingStats = (data) => {
  const logText = (data?.trainingLogs || []).join('\n');
  const outputLinesMatch = logText.match(/输出行数:\s*([0-9]+)/);
  const finishedAtMatch = logText.match(/完成时间:\s*([0-9-:\s]+)/);

  return {
    outputLines: outputLinesMatch?.[1] || '-',
    finishedAt: finishedAtMatch?.[1]?.trim() || '-',
    requestedAt: data?.requestedAt || '-',
  };
};

const CAMCEE = () => {
  // 设置页面标题
  useEffect(() => {
    document.title = 'EyeLaw-控制台';
  }, []);
  
  // 响应式数据
  const [activeTab, setActiveTab] = React.useState('extraction');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState(null);

  // 处理标签页切换
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setResult(null);
    setError('');
  };

  const runExtraction = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const requestOptions = { method: 'POST' };
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        requestOptions.body = formData;
      } else {
        requestOptions.headers = { 'Content-Type': 'application/json' };
        requestOptions.body = JSON.stringify({});
      }

      const response = await fetch(camceeApi('/api/camcee/extraction'), requestOptions);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `请求失败(${response.status})`);
      }

      const data = await response.json();
      setResult({
        success: true,
        message: '要素提取成功',
        data: normalizeExtractionResponse(data),
      });
    } catch (err) {
      setError(err.message || '要素提取失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const runTrainingByExtractionApi = async () => {
    setLoading(true);
    setError('');
    const apiPath = '/api/camcee/extraction';
    const startedAt = new Date().toLocaleString();

    setResult({
      success: true,
      message: '训练进行中',
      data: {
        contractName: '-',
        extractedElements: 0,
        elements: [],
        rawResponse: '',
        requestedAt: startedAt,
        requestPath: apiPath,
        trainingLogs: ['开始请求训练接口...'],
        finished: false,
      },
    });

    const appendTrainingLog = (line) => {
      if (!line) return;
      setResult((prev) => {
        if (!prev?.data) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            trainingLogs: [...(prev.data.trainingLogs || []), line].slice(-300),
          },
        };
      });
    };

    const mergeTrainingSnapshot = (payload) => {
      const normalized = normalizeExtractionResponse(payload);
      setResult((prev) => {
        if (!prev?.data) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            contractName: normalized.contractName || prev.data.contractName,
            extractedElements: normalized.extractedElements ?? prev.data.extractedElements,
            elements: normalized.elements?.length ? normalized.elements : prev.data.elements,
          },
        };
      });
    };

    try {
      const response = await fetch(camceeApi(apiPath), {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `请求失败(${response.status})`);
      }

      const contentType = response.headers.get('content-type') || '';
      const isStreamLike = Boolean(response.body) && (
        contentType.includes('text/event-stream') ||
        contentType.includes('text/plain') ||
        contentType.includes('application/x-ndjson')
      );

      if (isStreamLike && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let rawResponseText = '';

        const handleLine = (line) => {
          const trimmed = line.trim();
          if (!trimmed) return;

          const content = trimmed.startsWith('data:') ? trimmed.replace(/^data:\s?/, '') : trimmed;
          if (content === '[DONE]') {
            appendTrainingLog('训练流结束');
            return;
          }

          try {
            const parsed = JSON.parse(content);
            const logLine =
              parsed.message ||
              parsed.log ||
              parsed.status ||
              parsed.progress ||
              parsed.text ||
              parsed.output;
            appendTrainingLog(logLine || JSON.stringify(parsed));
            mergeTrainingSnapshot(parsed);
          } catch {
            appendTrainingLog(content);
          }
        };

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          rawResponseText += chunk;
          buffer += chunk;

          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() || '';
          lines.forEach(handleLine);
        }

        if (buffer.trim()) {
          handleLine(buffer);
        }

        setResult((prev) => ({
          ...prev,
          message: '训练完成',
          data: {
            ...prev.data,
            rawResponse: rawResponseText,
            finished: true,
          },
        }));
      } else if (contentType.includes('application/json')) {
        const payload = await response.json();
        mergeTrainingSnapshot(payload);
        appendTrainingLog('已收到 JSON 结果');
        setResult((prev) => ({
          ...prev,
          message: '训练完成',
          data: {
            ...prev.data,
            rawResponse: payload,
            finished: true,
          },
        }));
      } else {
        const payload = await response.text();
        appendTrainingLog(payload);
        try {
          mergeTrainingSnapshot(JSON.parse(payload));
        } catch {
          // 文本模式下不强制要求 JSON
        }
        setResult((prev) => ({
          ...prev,
          message: '训练完成',
          data: {
            ...prev.data,
            rawResponse: payload,
            finished: true,
          },
        }));
      }
    } catch (err) {
      setError(err.message || '接口请求失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 模拟API请求
  const simulateApiRequest = async (action) => {
    if (action === 'extract') {
      await runExtraction();
      return;
    }

    if (action === 'train') {
      await runTrainingByExtractionApi();
      return;
    }

    setLoading(true);
    setError('');
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 根据不同操作返回不同结果
      let response;
      switch (action) {
        case 'manage':
          response = {
            success: true,
            message: '数据集加载成功',
            data: {
              totalDatasets: 20,
              totalSamples: 5000,
              datasets: [
                { id: 1, name: '买卖合同数据集', samples: 1000, status: '可用' },
                { id: 2, name: '租赁合同数据集', samples: 303, status: '可用' },
                { id: 3, name: '保险合同数据集', samples: 302, status: '可用' }
              ]
            }
          };
          break;
        case 'evaluate':
          response = {
            success: true,
            message: '模型评估完成',
            data: {
              precision:92.33,
              f1Score:85.62,
              confusionMatrix: {
                truePositive: 895,
                falsePositive: 55,
                trueNegative: 905,
                falseNegative: 45
              }
            }
          };
          break;
        default:
          throw new Error('无效操作');
      }
      
      setResult(response);
    } catch (err) {
      setError(err.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 要素提取模块
  const ExtractionModule = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">要素提取数据读取与执行</h3>
        <p className="text-gray-700 mb-4">该模块负责读取法律条文数据并执行要素提取，支持多种格式的数据输入和批量处理。</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择数据文件</label>
            <div className="flex gap-3">
              <input
                type="file"
                onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button
                onClick={() => simulateApiRequest('extract')}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    执行中...
                  </span>
                ) : (
                  '执行提取'
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              未选择文件时将直接请求接口；已选择文件时会以 `file` 字段上传并执行提取。
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">提取参数</label>
            <div className="grid grid-cols-2 gap-3">
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>默认配置</option>
                <option>高精度模式</option>
                <option>快速模式</option>
              </select>
              <input type="number" placeholder="批量大小" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" min="1" max="100" />
            </div>
          </div>
        </div>
      </div>
      
      {/* 结果展示 */}
      {result && result.success && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
          <h4 className="text-lg font-semibold text-green-800 mb-4">提取结果</h4>
          
          {/* 基本信息 */}
          <div className="flex gap-8 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-2">合同名称</p>
              <p className="text-lg font-medium">{result.data.contractName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">提取要素数量</p>
              <p className="text-lg font-medium text-blue-600">{result.data.extractedElements}个</p>
            </div>
          </div>
          
          {/* 主要提取要素 - 表格形式 */}
          <div>
            <p className="text-sm text-gray-600 mb-4 font-semibold">主要提取要素</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-blue-50 border-b border-blue-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-900 w-24">序号</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 w-32">要素名称</th>
                    <th className="px-4 py-3 font-semibold text-gray-900">要素内容</th>
                  </tr>
                </thead>
                <tbody>
                  {result.data.elements.map((element, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{element.name}</td>
                      <td className="px-4 py-3 text-gray-600">{element.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="text-red-500 text-xl">❌</div>
            <h4 className="text-lg font-semibold text-red-800">{error}</h4>
          </div>
        </div>
      )}
    </div>
  );

  // 模型训练模块
  const TrainingModule = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-3">模型训练与优化</h3>
        <p className="text-gray-700 mb-4">该模块负责CAM-CEE模型的训练与优化，支持多种训练策略和超参数调整。</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择训练数据集</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4">
              <option>买卖合同数据集</option>
              <option>租赁合同数据集</option>
              <option>保险合同数据集</option>
            </select>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">学习率</label>
                <input type="number" placeholder="0.001" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" step="0.0001" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">迭代次数</label>
                <input type="number" placeholder="50" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" min="1" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col justify-end">
            <button
              onClick={() => simulateApiRequest('train')}
              disabled={loading}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  训练中...
                </span>
              ) : (
                '开始训练'
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* 训练结果 */}
      {result && result.success && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
          <h4 className="text-lg font-semibold text-green-800 mb-4">训练结果</h4>
          <div className="mb-2 text-xs text-gray-500">
            请求接口：{result.data.requestPath || '/api/camcee/extraction'}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-green-800 mb-2">训练过程日志（动态）</p>
            <div className="max-h-56 overflow-auto bg-white border border-green-100 rounded p-3">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
                {(result.data.trainingLogs || []).join('\n')}
              </pre>
            </div>
            {!result.data.finished && (
              <p className="text-xs text-green-700 mt-2">训练进行中，日志会持续更新...</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">输出行数</p>
              <p className="text-base font-semibold text-green-700">{extractTrainingStats(result.data).outputLines}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">完成时间</p>
              <p className="text-base font-semibold text-blue-700">{extractTrainingStats(result.data).finishedAt}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">请求时间</p>
              <p className="text-base font-semibold text-orange-700">{extractTrainingStats(result.data).requestedAt}</p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="text-red-500 text-xl">❌</div>
            <h4 className="text-lg font-semibold text-red-800">{error}</h4>
          </div>
        </div>
      )}
    </div>
  );

  // 数据集管理模块
  const DatasetModule = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">数据集管理</h3>
        <p className="text-gray-700 mb-4">该模块负责管理用于训练和测试的数据集，支持数据集的上传、下载、标注和预处理。</p>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2">
            📁 上传数据集
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2">
            🔄 刷新列表
          </button>
          <button
            onClick={() => simulateApiRequest('manage')}
            disabled={loading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              '📊 加载数据集'
            )}
          </button>
        </div>
      </div>
      
      {/* 数据集结果 */}
      {result && result.success && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-lg font-semibold text-green-800">数据集列表</h4>
              <p className="text-sm text-gray-600 mt-1">共{result.data.totalDatasets}个数据集，{result.data.totalSamples}个样本</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors">
                全部
              </button>
              <button className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm hover:bg-green-100 transition-colors">
                可用
              </button>
              <button className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm hover:bg-yellow-100 transition-colors">
                处理中
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">ID</th>
                  <th scope="col" className="px-6 py-3">数据集名称</th>
                  <th scope="col" className="px-6 py-3">样本数量</th>
                  <th scope="col" className="px-6 py-3">状态</th>
                  <th scope="col" className="px-6 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {result.data.datasets.map((dataset) => (
                  <tr key={dataset.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{dataset.id}</td>
                    <td className="px-6 py-4">{dataset.name}</td>
                    <td className="px-6 py-4">{dataset.samples}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${dataset.status === '可用' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {dataset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">查看</button>
                        <button className="text-green-600 hover:text-green-800">使用</button>
                        <button className="text-red-600 hover:text-red-800">删除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="text-red-500 text-xl">❌</div>
            <h4 className="text-lg font-semibold text-red-800">{error}</h4>
          </div>
        </div>
      )}
    </div>
  );

  // 实验对比数据
  const experimentData = [
    { model: 'W2NER', accuracy: null, recall: 76.67 },
    { model: 'Graph4CNER', accuracy: 89.15, recall: 62.28},
    { model: 'LWICNER', accuracy: 81.82, recall: 74.62 },
    { model: 'CAM-CEE', accuracy: 92.33, recall: 85.62 },
  ];

  // ECharts 配置
  const getBarOption = (metric, name, color) => ({
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, bottom: 40, top: 40 },
    xAxis: {
      type: 'category',
      data: experimentData.map(d => d.model),
      axisLabel: { rotate: 30 }
    },
    yAxis: {
      type: 'value',
      name,
      min: 0
    },
    series: [
      {
        data: experimentData.map(d => d[metric] !== null ? d[metric] : '-'),
        type: 'bar',
        itemStyle: { color },
        barWidth: 32,
      }
    ]
  });

  // 模型评估模块
  const EvaluationModule = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h3 className="text-lg font-semibold text-orange-800 mb-3">模型评估</h3>
        <p className="text-gray-700 mb-4">该模块负责评估CAM-CEE模型的性能，支持多种评估指标和可视化展示。</p>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择模型版本</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>v1.0.0 (当前版本)</option>
              <option>v0.9.5</option>
              <option>v0.9.0</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => simulateApiRequest('evaluate')}
              disabled={loading}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  评估中...
                </span>
              ) : (
                '开始评估'
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* 评估结果 */}
      {result && result.success && (
        <>
        <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
          <h4 className="text-lg font-semibold text-green-800 mb-4">CAM-CEE 模型评估结果</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">精确率</p>
                  <p className="text-2xl font-bold text-blue-700">{result.data.precision.toFixed(2) + '%'}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">召回率</p>
                  <p className="text-2xl font-bold text-purple-700">{result.data.f1Score.toFixed(2) + '%'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 实验对比方案图 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-orange-200 mt-6">
          <h4 className="text-lg font-semibold text-orange-800 mb-4">实验对比方案图</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ReactECharts option={getBarOption('accuracy', 'Accuracy/%', '#5470C6')} style={{height: 320}} />
              <div className="text-center text-sm text-gray-500 mt-2">Accuracy/%</div>
            </div>
            <div>
              <ReactECharts option={getBarOption('recall', 'Recall/%', '#91CC75')} style={{height: 320}} />
              <div className="text-center text-sm text-gray-500 mt-2">Recall/%</div>
            </div>
          </div>
        </div>
        </>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="text-red-500 text-xl">❌</div>
            <h4 className="text-lg font-semibold text-red-800">{error}</h4>
          </div>
        </div>
      )}
    </div>
  );
  const EChartsComponent = ReactECharts;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      {/* 页面标题 */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="text-blue-600 text-5xl">📄</div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">CAM-CEE 合约要素提取模型</h2>
            <p className="text-xl text-gray-600 font-light italic">Contract Analysis Model - Contract Element Extraction</p>
          </div>
        </div>
      </div>

      {/* 系统简介 */}
      <div className="mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-blue-500 text-xl">ℹ️</div>
            <h2 className="text-lg font-semibold text-blue-800">CAM-CEE 系统简介</h2>
          </div>
          <p className="text-gray-700">
                CAM-CEE 是一个面向智能合约化场景的上下文感知要素提取模型，通过融合上下文语义感知动态填充方法、三重注意力层和要素边缘加权损失函数，有效提升了长文本文档中合约要素的提取性能。该模型在自主构建的中文买卖合约数据集上超越了所有基线模型，并展现出良好的通用性和硬件适应性。
          </p>
        </div>

        {/* 模型架构图 */}
        <div className="mt-4 bg-white border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-blue-500 text-xl">🏗️</div>
            <h2 className="text-lg font-semibold text-blue-800">CAM-CEE 模型架构</h2>
          </div>
          <div className="flex flex-col items-center">
            <img 
              src="../src/resource/img/jiagoutu.png" 
              alt="CAM-CEE模型架构图" 
              className="max-w-full h-auto rounded-lg shadow-md"
            />
            <p className="text-sm text-gray-600 mt-3 text-center">
              图：CAM-CEE模型架构，包含BERT嵌入层、双向GRU层和三重注意力机制（前注意层、自注意层、后注意层），用于捕获合同文本的上下文语义信息。
            </p>
          </div>
        </div>
        
      </div>

      {/* 功能模块选择 */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* 标签页导航 */}
          <div className="bg-gray-50 border-b border-gray-200 rounded-t-xl">
            <div className="flex overflow-x-auto">
              {[
                { id: 'extraction', label: '要素提取数据读取与执行', icon: '📊' },
                { id: 'training', label: '模型训练与优化', icon: '⚙️' },
                { id: 'dataset', label: '数据集管理', icon: '📁' },
                { id: 'evaluation', label: '模型评估', icon: '📈' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-6 py-4 whitespace-nowrap font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 标签页内容 */}
          <div className="p-6">
            {activeTab === 'extraction' && <ExtractionModule />}
            {activeTab === 'training' && <TrainingModule />}
            {activeTab === 'dataset' && <DatasetModule />}
            {activeTab === 'evaluation' && <EvaluationModule />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CAMCEE;
