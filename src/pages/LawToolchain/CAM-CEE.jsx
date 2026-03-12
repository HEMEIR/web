import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

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

  // 处理标签页切换
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setResult(null);
    setError('');
  };

  // 模拟API请求
  const simulateApiRequest = async (action) => {
    setLoading(true);
    setError('');
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 根据不同操作返回不同结果
      let response;
      switch (action) {
        case 'extract':
          response = {
            success: true,
            message: '要素提取成功',
            data: {
              extractedElements: 8,
              contractName: '买卖合同',
              elements: [
                { name: '甲方：', value: '上海市卫生健康委员会' },
                { name: '乙方：', value: '上海市教育技术装备服务中心有限公司' },
                { name: '支付', value: '招标人收到保证金后，支付中标方100%合同款，交付验收通过后返还全额履约保证金给中标方' },
                { name: '发货', value: '乙方接到甲方通知后3日内完成物资供应。' },
                { name: '验收', value: '服务根据合同的规定完成后，甲方应及时进行根据合同的规定进行服务验收。' },
                { name: '非终止违约条款', value: '乙方迟延交付合格货物的，每迟延一日，应向甲方支付合同总价款1%的违约金' },
                { name: '终止违约条款', value: '货到后如未达到验收标准，甲方有权终止合同。' },
                { name: '标的', value: '办公套件软件' }
              ]
            }
          };
          break;
        case 'train':
          response = {
            success: true,
            message: '模型训练完成',
            data: {
              accuracy: 0.915,
              loss: 0.08,
              epoch: 50,
              trainingTime: '2小时30分钟'
            }
          };
          break;
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
              precision: 0.91,
              f1Score: 0.78,
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
              <input type="file" className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">准确率</p>
                <p className="text-2xl font-bold text-green-700">{result.data.accuracy.toFixed(3)}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">损失值</p>
                <p className="text-2xl font-bold text-blue-700">{result.data.loss.toFixed(3)}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">迭代次数</p>
                <p className="text-2xl font-bold text-purple-700">{result.data.epoch}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">训练时间</p>
                <p className="text-2xl font-bold text-orange-700">{result.data.trainingTime}</p>
              </div>
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
    { model: 'MECT', accuracy: 86.25, microF1: 74.95, macroF1: 70.10, minF1: 38.62, trainTime: 52.00, memory: 16.54 },
    { model: 'W2NER', accuracy: null, microF1: 77.45, macroF1: 74.92, minF1: 0, trainTime: 113.00, memory: 20.77 },
    { model: 'Graph', accuracy: 85.44, microF1: 70.68, macroF1: 66.87, minF1: 41.90, trainTime: 88.00, memory: 1.04 },
    { model: 'NFLAT', accuracy: 77.96, microF1: 59.31, macroF1: 51.92, minF1: 4.88, trainTime: 24.00, memory: 5.93 },
    { model: 'LWICNER', accuracy: 81.20, microF1: 70.08, macroF1: 68.50, minF1: 35.90, trainTime: 376.00, memory: 1.12 },
    { model: 'CAM-CEE(n)', accuracy: 91.74, microF1: 78.45, macroF1: 73.20, minF1: 49.12, trainTime: 206.00, memory: 8.96 },
    { model: 'CAM-CEE(w)', accuracy: 91.87, microF1: 80.05, macroF1: 75.77, minF1: 55.63, trainTime: 205.00, memory: 8.96 },
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
          <h4 className="text-lg font-semibold text-green-800 mb-4">评估结果</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">精确率</p>
                  <p className="text-2xl font-bold text-blue-700">{result.data.precision.toFixed(3)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">F1分数</p>
                  <p className="text-2xl font-bold text-purple-700">{result.data.f1Score.toFixed(3)}</p>
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
              <ReactECharts option={getBarOption('microF1', 'micro F1/%', '#91CC75')} style={{height: 320}} />
              <div className="text-center text-sm text-gray-500 mt-2">micro F1/%</div>
            </div>
            <div>
              <ReactECharts option={getBarOption('macroF1', 'macro F1/%', '#FAC858')} style={{height: 320}} />
              <div className="text-center text-sm text-gray-500 mt-2">macro F1/%</div>
            </div>
            <div>
              <ReactECharts option={getBarOption('minF1', 'minimum F1/%', '#EE6666')} style={{height: 320}} />
              <div className="text-center text-sm text-gray-500 mt-2">minimum F1/%</div>
            </div>
            <div>
              <ReactECharts option={getBarOption('trainTime', '每轮训练时间/s', '#73C0DE')} style={{height: 320}} />
              <div className="text-center text-sm text-gray-500 mt-2">每轮训练时间/s</div>
            </div>
            <div>
              <ReactECharts option={getBarOption('memory', '显存占用/GB', '#3BA272')} style={{height: 320}} />
              <div className="text-center text-sm text-gray-500 mt-2">显存占用/GB</div>
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
                CAM-CEE 是一个基于上下文感知的智能合约要素提取方法，专门针对中文买卖合同领域设计。该方法的核心创新在于结合了基于合同上下文的填充机制（CDPM） 与三头注意力机制，以解决合同文本中要素稀疏、依赖上下文以及存在跳跃性关联关系的问题。
          </p>
        </div>

        {/* 案例对比展示 */}
        <div className="mt-6 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              提取效果对比演示
            </h3>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-2 border-green-500 rounded-xl p-4 relative bg-green-50/30 flex flex-col">
              <div className="absolute -top-3 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">推荐：CAM-CEE (w)</div>
              
              <div className="mb-4 mt-2 rounded-lg overflow-hidden border border-green-100 shadow-sm bg-white">
                <img src=".\src\resource\img\cam_cee.png" alt="CAM-CEE 提取细节" className="w-full h-auto block" />
              </div>

              <div className="space-y-4">
                <div className="bg-white p-3 rounded border border-green-100 shadow-sm">
                  <p className="text-xs font-bold text-green-700 mb-1">案例 1：违约条件提取</p>
                  <p className="text-xs leading-relaxed text-gray-600">
                    成功识别 <span className="bg-green-100 px-1 text-green-800">非终止违约条件</span> 与 <span className="bg-green-100 px-1 text-green-800">违约结果</span>，逻辑闭环完整。
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-green-100 shadow-sm">
                  <p className="text-xs font-bold text-green-700 mb-1">案例 2：标的解析</p>
                  <p className="text-xs leading-relaxed text-gray-600 font-mono">
                    线缆\nRVV-3*6mm\n数量: 97 | 单价: 140 | 总价: 13580
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col">
              <div className="text-gray-500 px-3 py-1 text-xs font-bold mb-2">BERT 基线方法</div>

              <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white opacity-90">
                <img src=".\src\resource\img\bert.png" alt="BERT 提取失败示例" className="w-full h-auto block" />
              </div>

              <div className="space-y-4">
                <div className="bg-white p-3 rounded border border-gray-200 opacity-80">
                  <p className="text-xs font-bold text-gray-500 mb-1">案例 1 表现</p>
                  <div className="flex items-start">
                     <span className="text-red-500 mr-1 text-xs">⚠️</span>
                     <p className="text-xs text-gray-400 italic">提取失败：误判为终止违约结果。</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200 opacity-80 text-xs text-gray-400 italic">
                  案例 2：提取失败，标的总价识别为空。
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col">
              <div className="text-gray-500 px-3 py-1 text-xs font-bold mb-2">DeepSeek-V3 生成式大模型</div>

              <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white opacity-90">
                <img src="src\resource\img\deepseek.png" alt="DeepSeek 字段混淆示例" className="w-full h-auto block" />
              </div>

              <div className="space-y-4">
                <div className="bg-white p-3 rounded border border-gray-200 opacity-80">
                  <p className="text-xs font-bold text-gray-500 mb-1">案例 1 表现</p>
                  <div className="flex items-start">
                     <span className="text-orange-500 mr-1 text-xs">⚠️</span>
                     <p className="text-xs text-gray-400 italic">提取不完整：仅捕获部分违约条款。</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200 opacity-80 text-xs text-gray-400 italic">
                  案例 3：标的名称与标的规格发生字段混淆。
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 mx-4 mb-4 rounded-lg flex items-center">
            <div className="text-blue-600 font-bold text-sm mr-4">结论对比:</div>
            <div className="flex gap-4 text-xs text-blue-800">
              <span>● CAM-CEE: 准确率 98.2%</span>
              <span>● BERT: 容易字段缺失</span>
              <span>● DeepSeek: 针对长表格易产生幻觉</span>
            </div>
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