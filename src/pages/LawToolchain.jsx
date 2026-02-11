import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';



const LawParsing = () => {
  // 设置页面标题
  useEffect(() => {
    document.title = 'EyeLaw-控制台';
  }, []);
  
  // 响应式数据
  const [activeTab, setActiveTab] = React.useState('convert');
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

  return (
    <div className="min-h-screen">
      {/* 页面标题区域 - 全宽蓝色背景 */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 py-16 px-4 w-full">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="text-white text-5xl">📄</div>
            <div>
              <h2 className="text-4xl font-bold text-white">CAM-CEE 合约要素提取模型</h2>
              <p className="text-xl text-blue-100 font-light italic">Contract Analysis Model - Contract Element Extraction</p>
            </div>
          </div>
        </div>
      </div>

      {/* 功能模块选择 - 全宽白色背景 */}
      <div className="bg-white py-8 w-full">
        <div className="max-w-6xl mx-auto">
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
            {activeTab === 'extraction' && (
              <div className="bg-blue-50 py-8 px-4 w-full">
                <div className="max-w-6xl mx-auto">
                  <ExtractionModule />
                </div>
              </div>
            )}
            {activeTab === 'training' && (
              <div className="bg-green-50 py-8 px-4 w-full">
                <div className="max-w-6xl mx-auto">
                  <TrainingModule />
                </div>
              </div>
            )}
            {activeTab === 'dataset' && (
              <div className="bg-purple-50 py-8 px-4 w-full">
                <div className="max-w-6xl mx-auto">
                  <DatasetModule />
                </div>
              </div>
            )}
            {activeTab === 'evaluation' && (
              <div className="bg-orange-50 py-8 px-4 w-full">
                <div className="max-w-6xl mx-auto">
                  <EvaluationModule />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const IntelligentMatching = () => {
  const [loading, setLoading] = React.useState({
    legalbert: false,
    bert: false,
    roberta: false
  });
  const [results, setResults] = React.useState([]);
  const [currentExecution, setCurrentExecution] = React.useState({
    model: null,
    startTime: null
  });
  const [progressPercentage, setProgressPercentage] = React.useState(0);
  const [showInputModal, setShowInputModal] = React.useState(false);
  const [selectedModel, setSelectedModel] = React.useState(null);
  const [inputText, setInputText] = React.useState('');

  // 计算是否有任何模型正在加载
  const isAnyLoading = Object.values(loading).some(status => status);

  // 获取模型显示名称
  const getModelDisplayName = (model) => {
    const names = {
      legalbert: 'LegalBERT',
      bert: 'BERT',
      roberta: 'RoBERTa'
    };
    return names[model] || model.toUpperCase();
  };

  // 获取模型图标
  const getModelIcon = (model) => {
    const icons = {
      legalbert: '📚',
      bert: '💻',
      roberta: '⚙️'
    };
    return icons[model] || '📄';
  };

  // 获取模型的默认输入示例
const getModelExample = (modelType) => {
  const examples = {
    legalbert: `业主在出售或拍卖其出租的复式公寓前，需至少提前30天以书面形式通知当前租客。租客有权以与外部买方相同条件优先购买该物业。如业主未履行通知义务，应向租客赔偿相应损失。`,
    
    bert: `如果甲方活动策划公司未能按照合同要求完成会议或活动的策划和组织工作，乙方有权自行安排其他公司或团队接手，并从应支付给甲方的费用中扣除额外支出。乙方保留因活动策划不当造成的额外损害赔偿的权利。`,
    
    roberta: `债权人在转让债权时，应书面通知债务人，并提供有关债权转让的详细信息，包括受让方的身份和联系方式。通知后，债务人有权对受让方提出抗辩或请求抵销。`
  };
  
  // 添加返回语句
  return examples[modelType] || '请输入合同内容...';
};

// 获取模型的输出结果
const getModelOutput = (modelType, inputText) => {
  // 如果没有提供 inputText，使用默认示例
  if (!inputText) {
    const exampleText = getModelExample(modelType);
    inputText = exampleText;
  }
  
  const modelOutputs = {
    legalbert: `=== LegalBERT 分析结果 ===

模型：LegalBERT (法律专用BERT)
分析时间：${new Date().toLocaleString('zh-CN')}

📋 相关条款：

1. "出租人出卖租赁房屋的，应当在出卖之前的合理期限内通知承租人，承租人享有以同等条件优先购买的权利；但是，房屋按份共有人行使优先购买权或者出租人将房屋出卖给近亲属的除外。出租人履行通知义务后，承租人在十五日内未明确表示购买的，视为承租人放弃优先购买权。"

2. "出租人委托拍卖人拍卖租赁房屋的，应当在拍卖五日前通知承租人。承租人未参加拍卖的，视为放弃优先购买权。"

3. "出租人未通知承租人或者有其他妨害承租人行使优先购买权情形的，承租人可以请求出租人承担赔偿责任。但是，出租人与第三人订立的房屋买卖合同的效力不受影响。"
`,
    
    bert: `=== BERT 通用模型分析结果 ===

模型：BERT (通用预训练模型)
分析时间：${new Date().toLocaleString('zh-CN')}

📋 相关条款：

1. "买受人在检验期间,质量保证期间,合理期间内提出质量异议,出卖人未按要求予以修理或者因情况紧急,买受人自行或者通过第三人修理标的物后,主张出卖人负担因此发生的合理费用的,人民法院应予支持。"

2. "出卖人交付的标的物不符合质量要求的,买受人可以依据本法第五百八十二条至第五百八十四条的规定请求承担违约责任。"

3. "履行不符合约定的,应当按照当事人的约定承担违约责任.对违约责任没有约定或者约定不明确,依据本法第五百一十条的规定仍不能确定的,受损害方根据标的的性质以及损失的大小,可以合理选择请求对方承担修理,重作,更换,退货,减少价款或者报酬等违约责任。"
`,
    
    roberta: `=== RoBERTa 优化模型分析结果 ===

模型：RoBERTa (优化的BERT模型)
分析时间：${new Date().toLocaleString('zh-CN')}

📋 相关条款：

1. "债权人转让债权,未通知债务人的,该转让对债务人不发生效力.债权转让的通知不得撤销,但是经受让人同意的除外。"

2. "债务人接到债权转让通知后,债务人对让与人的抗辩,可以向受让人主张。"

3. "有下列情形之一的,债务人可以向受让人主张抵销:(一)债务人接到债权转让通知时,债务人对让与人享有债权,且债务人的债权先于转让的债权到期或者同时到期;(二)债务人的债权与转让的债权是基于同一合同产生。"
`
  };
  
  return modelOutputs[modelType] || '模型分析结果将显示在这里';
};

  // 进度模拟
  const simulateProgress = () => {
    setProgressPercentage(0);
    const interval = setInterval(() => {
      setProgressPercentage(prev => {
        if (prev < 90) {
          return prev + Math.random() * 10;
        }
        return prev;
      });
      if (!isAnyLoading) {
        setProgressPercentage(100);
        setTimeout(() => {
          clearInterval(interval);
          setProgressPercentage(0);
        }, 500);
      }
    }, 1000);
    return interval;
  };

  // 运行模型
  const runModel = (modelType) => {
    setSelectedModel(modelType);
    setInputText(getModelExample(modelType));
    setShowInputModal(true);
  };

  // 确认输入并执行模型
  const handleConfirmInput = async () => {
    if (!inputText.trim() || !selectedModel) return;
    
    setShowInputModal(false);
    setLoading(prev => ({ ...prev, [selectedModel]: true }));
    setCurrentExecution({
      model: selectedModel,
      startTime: Date.now()
    });

    // 开始进度模拟
    const interval = simulateProgress();

    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 5000));

      // 模拟成功结果
      const result = {
        model: selectedModel,
        timestamp: new Date().toLocaleString('zh-CN'),
        success: true,
        input: inputText,
        output: getModelOutput(selectedModel, inputText),
        error: '',
        duration: 4200
      };

      setResults(prev => [result, ...prev]);
    } catch (error) {
      // 模拟错误结果
      const result = {
        model: selectedModel,
        timestamp: new Date().toLocaleString('zh-CN'),
        success: false,
        input: inputText,
        output: '',
        error: `执行 ${getModelDisplayName(selectedModel)} 模型时发生错误：\n${error.message}`,
        duration: 2500
      };

      setResults(prev => [result, ...prev]);
    } finally {
      setLoading(prev => ({ ...prev, [selectedModel]: false }));
      setCurrentExecution({
        model: null,
        startTime: null
      });
      // 清除进度模拟的定时器
      clearInterval(interval);
    }
  };

  // 清空结果
  const clearResults = () => {
    setResults([]);
  };

  // 编译器模块将在文件后续部分定义

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8 px-4">
      {/* 输入模态框 */}
      {showInputModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            {/* 模态框头部 */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl text-white">📝</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">输入合约内容</h3>
                    <p className="text-purple-100">请为 {getModelDisplayName(selectedModel)} 模型提供输入</p>
                    <p className="text-purple-200 text-sm mt-1">
                      {selectedModel === 'legalbert' ? '适合分析：租赁合同、买卖合同' : 
                       selectedModel === 'bert' ? '适合分析：合作协议、服务合同' : 
                       '适合分析：劳动合同、知识产权协议'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowInputModal(false);
                    setSelectedModel(null);
                    setInputText('');
                  }}
                  className="text-white hover:text-purple-200 text-2xl transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* 模态框内容 */}
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="text-xl">📄</div>
                    <span>合约内容</span>
                  </div>
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`请输入需要分析的合约内容...`}
                  className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200"
                  autoFocus
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">
                    {selectedModel === 'legalbert' ? '示例：租赁合同' : 
                     selectedModel === 'bert' ? '示例：合作协议' : 
                     '示例：劳动合同补充协议'}
                  </span>
                  <span className={`text-sm ${inputText.length > 2000 ? 'text-red-500' : 'text-gray-500'}`}>
                    {inputText.length}/2000 字符
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowInputModal(false);
                    setSelectedModel(null);
                    setInputText('');
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmInput}
                  disabled={!inputText.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center gap-2"
                >
                  <span>🚀</span>
                  开始分析
                </button>
              </div>
            </div>
            
            {/* 模态框底部提示 */}
            <div className="bg-gray-50 border-t border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div className="text-blue-500 text-xl">💡</div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">提示：</span>
                    {selectedModel === 'legalbert' ? 'LegalBERT专门针对法律文本优化，适合分析各类法律合同条款，特别是租赁、买卖等标准合同。' : 
                     selectedModel === 'bert' ? 'BERT是通用语言模型，适合分析各类合作协议、服务合同等商业文书。' : 
                     'RoBERTa是优化版BERT模型，在处理复杂法律条文和专业技术文档方面表现更佳。'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 页面标题 */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="text-purple-600 text-5xl">📄</div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">合约一致性判定模型</h2>
            <p className="text-xl text-gray-600 font-light">ProvBench - 基于深度学习的智能合约分析平台</p>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto">
        {/* 模型选择卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[
            { 
              id: 'legalbert', 
              title: 'LegalBERT', 
              description: '专门针对法律文本优化的BERT模型，在法律领域数据上进行预训练，擅长分析租赁合同、买卖合同等标准法律文书', 
              tags: ['法律专用', '高精度', '租赁合同'], 
              icon: '📚', 
              color: 'primary' 
            },
            { 
              id: 'bert', 
              title: 'BERT', 
              description: '经典的双向编码器表示模型，在多种NLP任务中表现优异，适合分析合作协议、服务合同等商业文书', 
              tags: ['经典模型', '通用性强', '合作协议'], 
              icon: '💻', 
              color: 'success' 
            },
            { 
              id: 'roberta', 
              title: 'RoBERTa', 
              description: '优化的BERT模型，采用改进的预训练策略和更大的训练数据，在处理复杂法律条文方面表现更佳', 
              tags: ['优化版本', '性能提升', '劳动合同'], 
              icon: '⚙️', 
              color: 'warning' 
            }
          ].map((model) => (
            <div 
              key={model.id} 
              className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{ borderLeft: `4px solid ${model.color === 'primary' ? '#3b82f6' : model.color === 'success' ? '#10b981' : '#f59e0b'}` }}
            >
              <div className="p-6">
                <div className="text-4xl mb-4">{model.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{model.title}</h3>
                <p className="text-gray-600 mb-4 min-h-[48px]">{model.description}</p>
                <div className="flex gap-2 mb-6 flex-wrap">
                  {model.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className={`px-3 py-1 text-xs font-medium rounded-full ${model.color === 'primary' ? 'bg-blue-100 text-blue-800' : model.color === 'success' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => runModel(model.id)}
                  disabled={isAnyLoading}
                  className={`w-full py-3 px-6 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${model.color === 'primary' ? 'bg-blue-600 hover:bg-blue-700' : model.color === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'} text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                  style={{ height: '48px' }}
                >
                  {loading[model.id] ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      执行中...
                    </>
                  ) : (
                    <>
                      ▶️
                      运行模型
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* 执行状态 */}
        {currentExecution.model && (
          <div className="mb-10">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-6">
                <div className="text-4xl text-blue-600 animate-spin">🔄</div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">模型执行中</h4>
                  <p className="text-gray-600">正在运行 {getModelDisplayName(currentExecution.model)} 模型，请耐心等待...</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentExecution.model === 'legalbert' ? '分析租赁合同法律条款...' : 
                     currentExecution.model === 'bert' ? '分析合作协议关键要素...' : 
                     '深度分析劳动合同条款...'}
                  </p>
                </div>
                <div className="w-48">
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 结果显示区域 */}
        {results.length > 0 ? (
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                📊
                执行结果
                <span className="text-sm font-normal text-gray-600">({results.length} 个分析记录)</span>
              </h3>
              <button
                onClick={clearResults}
                disabled={isAnyLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🗑️
                清空结果
              </button>
            </div>

            <div className="space-y-6">
              {results.map((result, index) => (
                <div 
                  key={index} 
                  className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden"
                >
                  {/* 结果头部 */}
                  <div className="bg-gray-50 border-b border-gray-200 p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getModelIcon(result.model)}</div>
                        <div>
                          <span className="text-xl font-bold text-gray-900">{getModelDisplayName(result.model)}</span>
                          <p className="text-sm text-gray-500">
                            {result.model === 'legalbert' ? '法律专用模型' : 
                             result.model === 'bert' ? '通用语言模型' : 
                             '优化版模型'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {result.success ? '执行成功' : '执行失败'}
                        </span>
                        <span className="text-sm text-gray-500">{result.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* 结果内容 */}
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="text-xl">📋</div>
                        <h4 className="font-semibold text-gray-900">输入合同内容</h4>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {result.model === 'legalbert' ? '租赁合同' : 
                           result.model === 'bert' ? '合作协议' : 
                           '劳动合同补充协议'}
                        </span>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto max-h-[240px]">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">{result.input}</pre>
                      </div>
                    </div>
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="text-xl">📊</div>
                        <h4 className="font-semibold text-gray-900">模型分析结果</h4>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto max-h-[360px]">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">{result.output}</pre>
                      </div>
                    </div>

                    {result.error && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          ⚠️
                          <h4 className="font-semibold text-red-600">错误信息</h4>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 overflow-auto max-h-[80px]">
                          <pre className="text-sm text-red-700 whitespace-pre-wrap">{result.error}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* 空状态 */
          <div className="text-center py-20">
            <div className="text-purple-600 text-6xl mb-6">📄</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">请选择一个模型开始分析</h3>
            <p className="text-gray-600">每个模型针对不同类型的合同有专门优化，点击模型卡片查看详情</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-blue-500 text-xl mb-2">📚</div>
                <h4 className="font-semibold text-blue-800 mb-1">LegalBERT</h4>
                <p className="text-sm text-gray-600">专业分析租赁合同、买卖合同等标准法律文书</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-500 text-xl mb-2">💻</div>
                <h4 className="font-semibold text-green-800 mb-1">BERT</h4>
                <p className="text-sm text-gray-600">通用分析合作协议、服务合同等商业文书</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="text-amber-500 text-xl mb-2">⚙️</div>
                <h4 className="font-semibold text-amber-800 mb-1">RoBERTa</h4>
                <p className="text-sm text-gray-600">深度分析劳动合同、知识产权协议等复杂文档</p>
              </div>
            </div>
          </div>
        )}
      {/* 实验对比图 */}
      <div className="mt-16">
        <div className="max-w-6xl mx-auto">
          {/* 标题居中 */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">📈 模型性能实验对比</h3>
            <p className="text-gray-600">不同文本编码器在法律条文推荐任务上的实验结果对比（数据来源于Table 3）</p>
          </div>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6">
            {/* 图例 - 四个指标的颜色 - 居中 */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {['R@1', 'R@3', 'R@5', 'Top-3 EM'].map((metric, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ 
                      backgroundColor: idx === 0 ? '#3b82f6' : 
                                    idx === 1 ? '#10b981' : 
                                    idx === 2 ? '#8b5cf6' : '#f59e0b' 
                    }}
                  ></div>
                  <span className="text-sm text-gray-700">{metric}</span>
                </div>
              ))}
            </div>
            
            {/* 柱状图容器 - 居中 */}
            <div className="relative overflow-x-auto">
              <div className="flex h-96 min-w-max mx-auto justify-center">
                {/* 柱状图主体 */}
                <div className="flex items-end gap-8 px-8 h-full relative">
                  {/* 背景网格线 */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[...Array(5)].map((_, idx) => (
                      <div 
                        key={idx} 
                        className="border-t border-gray-100"
                      ></div>
                    ))}
                  </div>
                  
                  {/* T5 */}
                  <div className="flex flex-col items-center z-10 h-full">
                    <div className="text-sm font-medium text-gray-700 mb-2 h-6">T5</div>
                    <div className="flex items-end gap-1 flex-1 w-full relative">
                      <div 
                        className="w-6 bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all relative group" 
                        style={{ height: '86.38%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          R@1: 86.38%
                        </div>
                      </div>
                      <div 
                        className="w-6 bg-green-500 rounded-t-sm hover:bg-green-600 transition-all relative group" 
                        style={{ height: '95.09%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          R@3: 95.09%
                        </div>
                      </div>
                      <div 
                        className="w-6 bg-purple-500 rounded-t-sm hover:bg-purple-600 transition-all relative group" 
                        style={{ height: '97.10%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          R@5: 97.10%
                        </div>
                      </div>
                      <div 
                        className="w-6 bg-amber-500 rounded-t-sm hover:bg-amber-600 transition-all relative group" 
                        style={{ height: '60.94%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          Top-3 EM: 60.94%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* BERT */}
                  <div className="flex flex-col items-center z-10 h-full">
                    <div className="text-sm font-medium text-gray-700 mb-2 h-6">BERT</div>
                    <div className="flex items-end gap-1 flex-1 w-full relative">
                      <div 
                        className="w-6 bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all relative group" 
                        style={{ height: '90.63%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          R@1: 90.63%
                        </div>
                      </div>
                      <div 
                        className="w-6 bg-green-500 rounded-t-sm hover:bg-green-600 transition-all relative group" 
                        style={{ height: '96.86%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          R@3: 96.86%
                        </div>
                      </div>
                      <div 
                        className="w-6 bg-purple-500 rounded-t-sm hover:bg-purple-600 transition-all relative group" 
                        style={{ height: '98.21%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          R@5: 98.21%
                        </div>
                      </div>
                      <div 
                        className="w-6 bg-amber-500 rounded-t-sm hover:bg-amber-600 transition-all relative group" 
                        style={{ height: '76.79%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          Top-3 EM: 76.79%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* RoBERTa */}
                  <div className="flex flex-col items-center z-10 h-full">
                    <div className="text-sm font-medium text-gray-700 mb-2 h-6">RoBERTa</div>
                    <div className="flex items-end gap-1 flex-1 w-full relative">
                      <div 
                        className="w-6 bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all relative group" 
                        style={{ height: '89.96%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          R@1: 89.96%
                        </div>
                      </div>
                      <div 
                        className="w-6 bg-green-500 rounded-t-sm hover:bg-green-600 transition-all relative group" 
                        style={{ height: '95.31%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          R@3: 95.31%
                        </div>
                      </div>
                      <div 
                        className="w-6 bg-purple-500 rounded-t-sm hover:bg-purple-600 transition-all relative group" 
                        style={{ height: '97.54%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          R@5: 97.54%
                        </div>
                      </div>
                      <div 
                        className="w-6 bg-amber-500 rounded-t-sm hover:bg-amber-600 transition-all relative group" 
                        style={{ height: '70.31%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          Top-3 EM: 70.31%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* LegalBERT */}
                  <div className="flex flex-col items-center z-10 h-full">
                    <div className="text-sm font-medium text-gray-700 mb-2 h-6">LegalBERT</div>
                    <div className="flex items-end gap-1 flex-1 w-full relative">
                      <div 
                        className="w-6 bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all relative group" 
                        style={{ height: '92.19%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          R@1: 92.19%
                        </div>
                      </div>
                      <div 
                        className="w-6 bg-green-500 rounded-t-sm hover:bg-green-600 transition-all relative group" 
                        style={{ height: '97.77%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          R@3: 97.77%
                        </div>
                      </div>
                      <div 
                        className="w-6 bg-purple-500 rounded-t-sm hover:bg-purple-600 transition-all relative group" 
                        style={{ height: '98.88%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          R@5: 98.88%
                        </div>
                      </div>
                      <div 
                        className="w-6 bg-amber-500 rounded-t-sm hover:bg-amber-600 transition-all relative group" 
                        style={{ height: '73.88%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          Top-3 EM: 73.88%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mamba */}
                  <div className="flex flex-col items-center z-10 h-full">
                    <div className="text-sm font-medium text-gray-700 mb-2 h-6">Mamba</div>
                    <div className="flex items-end gap-1 flex-1 w-full relative">
                      <div 
                        className="w-6 bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all relative group" 
                        style={{ height: '91.29%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          R@1: 91.29%
                        </div>
                      </div>
                      <div 
                        className="w-6 bg-green-500 rounded-t-sm hover:bg-green-600 transition-all relative group" 
                        style={{ height: '97.99%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          R@3: 97.99%
                        </div>
                      </div>
                      <div 
                        className="w-6 bg-purple-500 rounded-t-sm hover:bg-purple-600 transition-all relative group" 
                        style={{ height: '99.33%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          R@5: 99.33%
                        </div>
                      </div>
                      <div 
                        className="w-6 bg-amber-500 rounded-t-sm hover:bg-amber-600 transition-all relative group" 
                        style={{ height: '57.37%' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                          Top-3 EM: 57.37%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 数据表格 */}
            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">TextEncoder</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">R@1</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">R@3</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">R@5</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">Top-3 EM</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b font-medium text-blue-600">T5</td>
                    <td className="py-3 px-4 border-b">86.38</td>
                    <td className="py-3 px-4 border-b">95.09</td>
                    <td className="py-3 px-4 border-b">97.10</td>
                    <td className="py-3 px-4 border-b">60.94</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b font-medium text-green-600">BERT</td>
                    <td className="py-3 px-4 border-b">90.63</td>
                    <td className="py-3 px-4 border-b">96.86</td>
                    <td className="py-3 px-4 border-b">98.21</td>
                    <td className="py-3 px-4 border-b">76.79</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b font-medium text-purple-600">RoBERTa</td>
                    <td className="py-3 px-4 border-b">89.96</td>
                    <td className="py-3 px-4 border-b">95.31</td>
                    <td className="py-3 px-4 border-b">97.54</td>
                    <td className="py-3 px-4 border-b">70.31</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b font-medium text-amber-600">LegalBERT</td>
                    <td className="py-3 px-4 border-b">92.19</td>
                    <td className="py-3 px-4 border-b">97.77</td>
                    <td className="py-3 px-4 border-b">98.88</td>
                    <td className="py-3 px-4 border-b">73.88</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-red-600">Mamba</td>
                    <td className="py-3 px-4">91.29</td>
                    <td className="py-3 px-4">97.99</td>
                    <td className="py-3 px-4">99.33</td>
                    <td className="py-3 px-4">57.37</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>注：R@1、R@3、R@5表示召回率，Top-3 EM表示前3个结果的精确匹配率。LegalBERT在法律条文推荐任务中综合表现最佳。</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

const AutoContractTag = () => {
  // 响应式数据
  const [services, setServices] = React.useState({
    webserver: {
      running: false,
      starting: false,
      pid: null,
      error: null
    },
    task: {
      running: false,
      starting: false,
      pid: null,
      error: null
    },
    extract: {
      running: false,
      starting: false,
      pid: null,
      error: null,
      scriptOutput: null
    }
  });

  const [runningDiagnostics, setRunningDiagnostics] = React.useState(false);
  const [diagnosticVisible, setDiagnosticVisible] = React.useState(false);
  const [diagnosticResult, setDiagnosticResult] = React.useState(null);

  const [checkingPorts, setCheckingPorts] = React.useState(false);
  const [portStatus, setPortStatus] = React.useState(null);

  const [checkingProcesses, setCheckingProcesses] = React.useState(false);
  const [processInfo, setProcessInfo] = React.useState(null);

  const [gettingLogs, setGettingLogs] = React.useState(false);
  const [gettingExtractLogs, setGettingExtractLogs] = React.useState(false);
  const [scriptLogs, setScriptLogs] = React.useState(null);

  const [troubleshooting, setTroubleshooting] = React.useState(false);

  const [refreshing, setRefreshing] = React.useState(false);
  const [startingAll, setStartingAll] = React.useState(false);
  const [stoppingAll, setStoppingAll] = React.useState(false);

  const [autoScrollLogs, setAutoScrollLogs] = React.useState(true);
  const [logs, setLogs] = React.useState([]);

  // 检查是否有任何服务正在加载
  const isAnyLoading = React.useMemo(() => {
    return (
      services.webserver.starting ||
      services.task.starting ||
      services.extract.starting ||
      runningDiagnostics ||
      checkingPorts ||
      checkingProcesses ||
      gettingLogs ||
      gettingExtractLogs ||
      troubleshooting
    );
  }, [services, runningDiagnostics, checkingPorts, checkingProcesses, gettingLogs, gettingExtractLogs, troubleshooting]);

  // 添加日志
  const addLog = (service, level, message) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();

    setLogs(prev => {
      const newLogs = [
        { time: timeStr, service, level, message },
        ...prev
      ];
      // 限制日志数量
      if (newLogs.length > 200) {
        return newLogs.slice(0, 100);
      }
      return newLogs;
    });
  };

  // 清空日志
  const clearLogs = () => {
    setLogs([]);
  };

  // 获取服务状态类型
  const getServiceStatusType = (service) => {
    const s = services[service];
    if (s.starting) return 'warning';
    if (s.running) return 'success';
    if (s.error) return 'danger';
    return 'info';
  };

  // 获取服务状态文本
  const getServiceStatusText = (service) => {
    const s = services[service];
    if (s.starting) return '启动中';
    if (s.running) return '运行中';
    if (s.error) return '错误';
    return '未运行';
  };

  // 完整诊断
  const runFullDiagnostics = async () => {
    setRunningDiagnostics(true);
    try {
      addLog('system', 'info', '开始运行完整诊断...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = {
        backend_connected: true,
        port_8000_active: true,
        port_8000_status: '运行中',
        port_8001_active: false,
        port_8001_status: '未运行',
        services: {
          webserver: { running: true, pid: 1234, error: null, logs: 'Web服务运行正常' },
          task: { running: true, pid: 5678, error: null, logs: '任务服务运行正常' },
          extract: { running: false, pid: null, error: '服务未启动', logs: '' }
        },
        recommendations: ['启动Extract服务', '检查8001端口配置']
      };
      setDiagnosticResult(result);
      setDiagnosticVisible(true);
      addLog('system', 'success', '完整诊断完成');
    } catch (err) {
      addLog('system', 'error', `诊断失败: ${err.message}`);
    } finally {
      setRunningDiagnostics(false);
    }
  };

  // 检查端口状态
  const checkPorts = async () => {
    setCheckingPorts(true);
    try {
      addLog('system', 'info', '检查端口状态...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = {
        port8000: { active: true, status: '运行中' },
        port8001: { active: false, status: '未运行' }
      };
      setPortStatus(result);
      addLog('system', 'info', `端口检查完成: 8000=${result.port8000.status}, 8001=${result.port8001.status}`);
    } catch (err) {
      addLog('system', 'error', `端口检查失败: ${err.message}`);
    } finally {
      setCheckingPorts(false);
    }
  };

  // 检查进程状态
  const checkProcesses = async () => {
    setCheckingProcesses(true);
    try {
      addLog('system', 'info', '检查进程状态...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = {
        webserver: { running: true, pid: 1234 },
        task: { running: true, pid: 5678 },
        extract: { running: false, pid: null }
      };
      setProcessInfo(result);
      addLog('system', 'info', '进程状态检查完成');
    } catch (err) {
      addLog('system', 'error', `进程检查失败: ${err.message}`);
    } finally {
      setCheckingProcesses(false);
    }
  };

  // 获取脚本日志
  const getScriptLogs = async () => {
    setGettingLogs(true);
    try {
      addLog('system', 'info', '获取脚本日志...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = {
        logs: ['服务启动成功', '处理了10个文件', '出现错误: 端口已被占用', '尝试重启服务', '服务重启成功']
      };
      setScriptLogs(result.logs);
      addLog('system', 'info', '脚本日志获取完成');
    } catch (err) {
      addLog('system', 'error', `获取日志失败: ${err.message}`);
    } finally {
      setGettingLogs(false);
    }
  };

  // 获取提取脚本日志
  const getExtractLogs = async () => {
    setGettingExtractLogs(true);
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = {
        logs: ['提取服务启动', '监听端口8001', '接收请求', '处理完成', '出现错误: 连接超时']
      };
      
      if (result.logs && result.logs.length > 0) {
        setServices(prev => ({
          ...prev,
          extract: {
            ...prev.extract,
            scriptOutput: result.logs.slice(-3).join(' | ')
          }
        }));
        addLog('extract', 'info', `脚本输出: ${result.logs.slice(-1)[0]}`);
      } else {
        addLog('extract', 'warning', '没有找到脚本输出日志');
      }
    } catch (err) {
      addLog('extract', 'error', `获取提取脚本日志失败: ${err.message}`);
    } finally {
      setGettingExtractLogs(false);
    }
  };

  // 测试端口连接
  const testPort = async (port) => {
    try {
      addLog('system', 'info', `测试端口 ${port} 连接...`);
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      addLog('system', 'success', `端口 ${port} 连接成功`);
    } catch (err) {
      addLog('system', 'error', `端口 ${port} 连接失败: ${err.message}`);
    }
  };

  // 故障排除8001端口
  const troubleshootExtract = async () => {
    setTroubleshooting(true);
    try {
      addLog('system', 'info', '开始排除8001端口故障...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = {
        message: '故障排除完成',
        success: true,
        recommendations: ['重启Extract服务', '检查端口占用情况', '查看服务日志']
      };
      
      addLog('system', 'info', `故障排除结果: ${result.message}`);
      
      if (result.recommendations) {
        result.recommendations.forEach(rec => {
          addLog('system', 'warning', `建议: ${rec}`);
        });
      }
    } catch (err) {
      addLog('system', 'error', `故障排除失败: ${err.message}`);
    } finally {
      setTroubleshooting(false);
    }
  };

  // 服务管理方法
  const startWebServer = async () => {
    setServices(prev => ({
      ...prev,
      webserver: {
        ...prev.webserver,
        starting: true
      }
    }));
    try {
      addLog('webserver', 'info', '正在启动 Doccano Web 服务器...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      setServices(prev => ({
        ...prev,
        webserver: {
          ...prev.webserver,
          running: true,
          pid: Math.floor(Math.random() * 10000),
          error: null,
          starting: false
        }
      }));
      addLog('webserver', 'success', `Web 服务器启动成功 (PID: ${services.webserver.pid})`);
    } catch (err) {
      setServices(prev => ({
        ...prev,
        webserver: {
          ...prev.webserver,
          error: err.message,
          starting: false
        }
      }));
      addLog('webserver', 'error', `Web 服务器启动失败: ${err.message}`);
    }
  };

  const startTaskWorker = async () => {
    setServices(prev => ({
      ...prev,
      task: {
        ...prev.task,
        starting: true
      }
    }));
    try {
      addLog('task', 'info', '正在启动任务处理器...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      setServices(prev => ({
        ...prev,
        task: {
          ...prev.task,
          running: true,
          pid: Math.floor(Math.random() * 10000),
          error: null,
          starting: false
        }
      }));
      addLog('task', 'success', `任务处理器启动成功 (PID: ${services.task.pid})`);
    } catch (err) {
      setServices(prev => ({
        ...prev,
        task: {
          ...prev.task,
          error: err.message,
          starting: false
        }
      }));
      addLog('task', 'error', `任务处理器启动失败: ${err.message}`);
    }
  };

  const startExtractScript = async () => {
    setServices(prev => ({
      ...prev,
      extract: {
        ...prev.extract,
        starting: true
      }
    }));
    try {
      addLog('extract', 'info', '正在启动合同提取脚本...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      setServices(prev => ({
        ...prev,
        extract: {
          ...prev.extract,
          running: true,
          pid: Math.floor(Math.random() * 10000),
          error: null,
          starting: false
        }
      }));
      addLog('extract', 'success', `提取脚本启动成功 (PID: ${services.extract.pid})`);
      
      // 等待几秒后自动获取日志
      setTimeout(() => {
        getExtractLogs();
      }, 3000);
    } catch (err) {
      setServices(prev => ({
        ...prev,
        extract: {
          ...prev.extract,
          error: err.message,
          starting: false
        }
      }));
      addLog('extract', 'error', `提取脚本启动失败: ${err.message}`);
    }
  };

  const stopWebServer = async () => {
    try {
      setServices(prev => ({
        ...prev,
        webserver: {
          ...prev.webserver,
          running: false,
          pid: null
        }
      }));
      addLog('webserver', 'info', 'Web 服务器已停止');
    } catch (err) {
      addLog('webserver', 'error', `停止失败: ${err.message}`);
    }
  };

  const stopTaskWorker = async () => {
    try {
      setServices(prev => ({
        ...prev,
        task: {
          ...prev.task,
          running: false,
          pid: null
        }
      }));
      addLog('task', 'info', '任务处理器已停止');
    } catch (err) {
      addLog('task', 'error', `停止失败: ${err.message}`);
    }
  };

  const stopExtractScript = async () => {
    try {
      setServices(prev => ({
        ...prev,
        extract: {
          ...prev.extract,
          running: false,
          pid: null,
          scriptOutput: null
        }
      }));
      addLog('extract', 'info', '提取脚本已停止');
    } catch (err) {
      addLog('extract', 'error', `停止失败: ${err.message}`);
    }
  };

  const startAllServices = async () => {
    setStartingAll(true);
    try {
      addLog('system', 'info', '开始启动所有服务...');
      
      // 模拟启动所有服务
      await startWebServer();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await startTaskWorker();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await startExtractScript();
      
      addLog('system', 'success', '所有服务启动完成');
    } catch (err) {
      addLog('system', 'error', `启动服务失败: ${err.message}`);
    } finally {
      setStartingAll(false);
    }
  };

  const stopAllServices = async () => {
    setStoppingAll(true);
    try {
      await Promise.all([
        stopWebServer(),
        stopTaskWorker(),
        stopExtractScript()
      ]);
      addLog('system', 'info', '所有服务已停止');
    } finally {
      setStoppingAll(false);
    }
  };

  const refreshAllStatus = async () => {
    setRefreshing(true);
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      const status = {
        webserver: { running: true, pid: 1234 },
        task: { running: true, pid: 5678 },
        extract: { running: false, pid: null }
      };
      
      setServices(prev => {
        const updated = { ...prev };
        for (const [serviceName, serviceStatus] of Object.entries(status)) {
          if (updated[serviceName]) {
            updated[serviceName].running = serviceStatus.running;
            updated[serviceName].pid = serviceStatus.pid;
          }
        }
        return updated;
      });
      
      addLog('system', 'info', '状态已刷新');
    } catch (err) {
      addLog('system', 'error', `刷新状态失败: ${err.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  // 界面访问
  const openDoccanoUI = () => {
    window.open('http://127.0.0.1:8000', '_blank');
    addLog('system', 'info', '尝试打开 Doccano UI');
  };

  const openExtractUI = () => {
    window.open('http://127.0.0.1:8001', '_blank');
    addLog('system', 'info', '尝试打开提取界面');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8 px-4">
      {/* 页面标题 */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="text-orange-600 text-5xl">⚙️</div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">服务管理系统</h1>
            <p className="text-xl text-gray-600 font-light italic">Service Management System - 调试版本</p>
          </div>
        </div>
      </div>

      {/* 服务状态卡片 */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(services).map(([serviceName, service]) => (
            <div key={serviceName} className={`bg-white rounded-xl shadow-lg p-6 border ${service.running ? 'border-green-400' : 'border-gray-200'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{serviceName === 'webserver' ? 'Web 服务器' : serviceName === 'task' ? '任务处理器' : '提取服务'}</h3>
                  <p className={`text-sm font-medium ${service.running ? 'text-green-600' : 'text-red-600'}`}>
                    {service.running ? '运行中' : '已停止'}
                  </p>
                </div>
                <div className={`text-4xl ${service.running ? 'text-green-500' : 'text-red-500'}`}>
                  {service.running ? '✅' : '❌'}
                </div>
              </div>
              
              {service.pid && (
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-600 mb-1">进程 ID</p>
                  <p className="text-lg font-mono text-gray-900">{service.pid}</p>
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={() => service.running ? (serviceName === 'webserver' ? stopWebServer() : serviceName === 'task' ? stopTaskWorker() : stopExtractScript()) : (serviceName === 'webserver' ? startWebServer() : serviceName === 'task' ? startTaskWorker() : startExtractScript())}
                  disabled={service.starting || (service.running && (serviceName === 'webserver' ? services.webserver.stopping : serviceName === 'task' ? services.task.stopping : services.extract.stopping))}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${service.running ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'} ${(service.starting || (service.running && (serviceName === 'webserver' ? services.webserver.stopping : serviceName === 'task' ? services.task.stopping : services.extract.stopping))) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {service.starting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {service.running ? '停止中...' : '启动中...'}
                    </span>
                  ) : service.running ? '停止服务' : '启动服务'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">服务管理</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={startAllServices}
              disabled={isAnyLoading || startingAll}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {startingAll ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  启动中...
                </span>
              ) : (
                <>
                  <span>🚀</span>
                  启动所有服务
                </>
              )}
            </button>
            <button
              onClick={stopAllServices}
              disabled={isAnyLoading || stoppingAll}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {stoppingAll ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  停止中...
                </span>
              ) : (
                <>
                  <span>🛑</span>
                  停止所有服务
                </>
              )}
            </button>
            <button
              onClick={refreshAllStatus}
              disabled={refreshing}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {refreshing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  刷新中...
                </span>
              ) : (
                <>
                  <span>🔄</span>
                  刷新状态
                </>
              )}
            </button>
            <button
              onClick={runFullDiagnostics}
              disabled={runningDiagnostics}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {runningDiagnostics ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  诊断中...
                </span>
              ) : (
                <>
                  <span>🔍</span>
                  运行诊断
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 界面访问 */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">界面访问</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-blue-600 text-2xl">📝</div>
                <div>
                  <h4 className="text-lg font-semibold text-blue-800">Doccano UI</h4>
                  <p className="text-blue-600 text-sm">数据标注界面</p>
                </div>
              </div>
              <button
                onClick={openDoccanoUI}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2 justify-center"
              >
                <span>🌐</span>
                打开 Doccano UI
              </button>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-green-600 text-2xl">🔧</div>
                <div>
                  <h4 className="text-lg font-semibold text-green-800">提取界面</h4>
                  <p className="text-green-600 text-sm">数据提取工具</p>
                </div>
              </div>
              <button
                onClick={openExtractUI}
                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2 justify-center"
              >
                <span>🌐</span>
                打开提取界面
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 系统日志 */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">系统日志</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={clearLogs}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1"
              >
                <span>🗑️</span>
                清空日志
              </button>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={autoScrollLogs}
                  onChange={(e) => setAutoScrollLogs(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                自动滚动
              </label>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 h-96 overflow-y-auto font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className={`mb-2 ${log.level === 'error' ? 'text-red-600' : log.level === 'info' ? 'text-blue-600' : 'text-gray-600'}`}>
                <span className="text-gray-400">[{log.time}]</span>
                <span className="mx-2">[{log.service}]</span>
                <span className="font-medium">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 合同生成系统组件
const ContractGenerator = () => {
  // 响应式数据
  const [originalContract, setOriginalContract] = useState(`省级红色文化遗址保护标志树立项目

合同草案条款
甲方（釆购人）：晋中市文化和旅游局
统一社会信用代码：11140800558745220K
乙方（成交人）：山西晋韵古建筑有限公司 统一社会信用代码：91140106713678575D
鉴于2022年10月17日在山西汇鑫源工程招标代理有限公司组织进行的省 级红色文化遗址保护标志树立釆购项目（项目编号：sxhxy竞字［20221008）中， 经谈判小组评定，确定乙方为成交供应商。根据《中华人民共和国政府采购法》、 《中华人民共和国民法典》等相关法律法规及本项目谈判文件的规定，经双方协 商一致，签订本合同，并共同遵守。
一、设备条款
乙方向甲方提供供货明细表（附件一）中所列产品及相关服务，详细 参数见乙方响应文件。
　　二、合同总金额
　　人民币（大写）：壹拾玖万元整
　　　　　（小写）：￥ 190000.00 	
本合同总金额除双方另有约定外，包括与交货有关的费用（包括但不仅 限于运输费、包装费、保险费、税费等）等标准伴随服务的费用。此价格为合同 执行不变价，不因国家政策及市场价格变化而变化。
三、支付方式
1、本合同项下所有款项均以人民币支付。
2、付款方式：付款方式是合同签订后支付百分之68,验收合格后支付剩余部分。
3、付款时，乙方须出具符合税务部门要求的发票。
四、交货
1、 交货地点：晋中市文化和旅游局
2 、交货时间：2022年12月10日 	
3、在合同标的物之外，乙方不得提供、甲方不得接受赠品。
　　4、乙方应在产品送至交货地点时提交如下资料：
　　(1)有乙方、送货单位盖章确认的送货单原件。
　　(2)有乙方与第三方签订的釆购订单原件。
　　(3)合同约定的交货文件；
　　(4)其他相关文件。
如乙方未按约定完全提供上述资料，甲方有权要求乙方在五日内予以 补齐，并在补齐前不予支付货款(或要求退回已付款项)，对此不视为甲方违约。
5、乙方提供的产品包装应能适应各种运输装卸，如甲方对产品包装 有要求的，还应按甲方要求包装，包装物处理按甲方要求。
五、质量及验收
1、质量标准：参照山西省红色文化遗址保护规格
2、验收程序：安装完毕按技术参数标准验收
3、质量异议：甲方对产品的质量提出异议时，甲方可要求乙方把产 品送有相应资质的部门检验鉴定。乙方应在收到质量异议七日内送检，送 检费用由乙方承担。若乙方不同意将产品送检或因乙方原因未送检的，视 为乙方认可甲方对产品质量提出的异议。
六、售后服务
1、质量保证期(2)年自甲方最终在《验收结算报告》上签字之日算 起。
2、其它服务承诺详见乙方投标文件。
七、甲方责任
1、组织验收并及时办理付款手续。
2、项目验收合格后。
八、乙方责任
1、权利保证
1.乙方应保证甲方在使用该货物或其任何一部分时不受第三方提出侵犯其专 利权、版权、商标权或其他权利的起诉。一旦出现侵权，乙方应承担全部责任。
　　2,保证所供货物均为响应文件承诺货物，符合相关质量检测标准， 具有该产品的出厂标准或国家鉴定证书。
　　3、保证货物的售后服务，严格依据响应文件及相关承诺，对货物及 系统进行保修、维护等服务。
　　九、违约责任
　　1,如果甲方逾期付款，超过10日后，每日应向乙方偿付应付款项的 0.5%作为违约金；
　　2,如果乙方没有按合同规定提供货物或维修服务的，每延迟一天扣 除合同总金额的0.5%的违约金，直至按合同交货或提供服务为止。违约金 最高限额为合同总金额的5%. 一旦达到该最高限额，甲方有权终止合同。 因此造成甲方损失的，乙方还应承担赔偿责任。
　　3,乙方产品经经验收不合格的，乙方应负责免费更换-若无法更换 的，甲方有权拒收，若给甲方造成损失，乙方还应承担赔偿责任。
　　十、补充条款
　　　　无
　　十—、不可抗力
　　甲乙双方的任何一方由于不可抗力的原因不能履行合同时，应及时向对方通报不能履行或不能完全履行理由；在取得有关主管机关证明以后， 允许延期履行、部分履行或者不履行合同，并根据情况可部分或全部免予 承担违约责任。
　　十二、争议解决
　　1、因履行本合同发生的争议，由甲乙双方协商解决-协商不成的， 依法向甲方所在地人民法院起诉。
　　2、当产生任何争议及争议正在诉讼程序时，除争议事项，双方应继 续行使其剩余的相关权利，履行本合同的其他义务。
　　十三、合同生效及其他
　　1、合同由甲乙双方法人或委托代理人签章确认并加盖骑缝章后，即行生效。
　　2、本合同一式四份，甲乙双方各一份，山西汇鑫源工程招标代理有限公司两份。
　　4、合同执行过程中出现的未尽事宜，双方在不违背合同和招标文件的前提下协商解决。协商结果以"补充合同"形式作为合同附件，与合同具有同等效力。
　　5、本合同第十四、十五条款所列文件均为本合同不可分割的一部分，与本合同具有同等法律效力。
　　十四、下列文件为本合同不可分割部分
　　1、谈判文件
　　2、响应文件
　　3、乙方所做的其他承诺
　　十五、附件明细
　　1、供货明细表
　　2、采购需求
　　

甲方（盖章)

单位名称:晋中市文化和旅游局

单位地址:晋中市榆次区顺城街80号

法人或委托代理人:程红解


日期:2022年10月20日

乙方（盖章)

单位名称:山西晋韵古建筑有限公司

单位地址:太原市迎泽区老军营南区11号楼

法人或委托代理人:能四升

开户行:交通银行太啤新建南路支行
账号:141000614018170030782
行号:301161000203
日期:2022年10月20日
`);

const [generatedContract, setGeneratedContract] = useState('');
const [isGenerating, setIsGenerating] = useState(false);
const [downloadUrl, setDownloadUrl] = useState('');
const [fileInputRef] = useState(React.createRef());
const [isAnnotationModalOpen, setIsAnnotationModalOpen] = useState(false);

  // 响应式数据
  const [services, setServices] = React.useState({
    webserver: {
      running: false,
      starting: false,
      pid: null,
      error: null
    },
    task: {
      running: false,
      starting: false,
      pid: null,
      error: null
    },
    extract: {
      running: false,
      starting: false,
      pid: null,
      error: null,
      scriptOutput: null
    }
  });

  const [runningDiagnostics, setRunningDiagnostics] = React.useState(false);
  const [diagnosticVisible, setDiagnosticVisible] = React.useState(false);
  const [diagnosticResult, setDiagnosticResult] = React.useState(null);

  const [checkingPorts, setCheckingPorts] = React.useState(false);
  const [portStatus, setPortStatus] = React.useState(null);

  const [checkingProcesses, setCheckingProcesses] = React.useState(false);
  const [processInfo, setProcessInfo] = React.useState(null);

  const [gettingLogs, setGettingLogs] = React.useState(false);
  const [gettingExtractLogs, setGettingExtractLogs] = React.useState(false);
  const [scriptLogs, setScriptLogs] = React.useState(null);

  const [troubleshooting, setTroubleshooting] = React.useState(false);

  const [refreshing, setRefreshing] = React.useState(false);
  const [startingAll, setStartingAll] = React.useState(false);
  const [stoppingAll, setStoppingAll] = React.useState(false);

  const [autoScrollLogs, setAutoScrollLogs] = React.useState(true);
  const [logs, setLogs] = React.useState([]);

  // 检查是否有任何服务正在加载
  const isAnyLoading = React.useMemo(() => {
    return (
      services.webserver.starting ||
      services.task.starting ||
      services.extract.starting ||
      runningDiagnostics ||
      checkingPorts ||
      checkingProcesses ||
      gettingLogs ||
      gettingExtractLogs ||
      troubleshooting
    );
  }, [services, runningDiagnostics, checkingPorts, checkingProcesses, gettingLogs, gettingExtractLogs, troubleshooting]);

  // 添加日志
  const addLog = (service, level, message) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();

    setLogs(prev => {
      const newLogs = [
        { time: timeStr, service, level, message },
        ...prev
      ];
      // 限制日志数量
      if (newLogs.length > 200) {
        return newLogs.slice(0, 100);
      }
      return newLogs;
    });
  };

  // 清空日志
  const clearLogs = () => {
    setLogs([]);
  };

  // 获取服务状态类型
  const getServiceStatusType = (service) => {
    const s = services[service];
    if (s.starting) return 'warning';
    if (s.running) return 'success';
    if (s.error) return 'danger';
    return 'info';
  };

  // 获取服务状态文本
  const getServiceStatusText = (service) => {
    const s = services[service];
    if (s.starting) return '启动中';
    if (s.running) return '运行中';
    if (s.error) return '错误';
    return '未运行';
  };

  // 完整诊断
  const runFullDiagnostics = async () => {
    setRunningDiagnostics(true);
    try {
      addLog('system', 'info', '开始运行完整诊断...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = {
        backend_connected: true,
        port_8000_active: true,
        port_8000_status: '运行中',
        port_8001_active: false,
        port_8001_status: '未运行',
        services: {
          webserver: { running: true, pid: 1234, error: null, logs: 'Web服务运行正常' },
          task: { running: true, pid: 5678, error: null, logs: '任务服务运行正常' },
          extract: { running: false, pid: null, error: '服务未启动', logs: '' }
        },
        recommendations: ['启动Extract服务', '检查8001端口配置']
      };
      setDiagnosticResult(result);
      setDiagnosticVisible(true);
      addLog('system', 'success', '完整诊断完成');
    } catch (err) {
      addLog('system', 'error', `诊断失败: ${err.message}`);
    } finally {
      setRunningDiagnostics(false);
    }
  };

  // 检查端口状态
  const checkPorts = async () => {
    setCheckingPorts(true);
    try {
      addLog('system', 'info', '检查端口状态...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = {
        port8000: { active: true, status: '运行中' },
        port8001: { active: false, status: '未运行' }
      };
      setPortStatus(result);
      addLog('system', 'info', `端口检查完成: 8000=${result.port8000.status}, 8001=${result.port8001.status}`);
    } catch (err) {
      addLog('system', 'error', `端口检查失败: ${err.message}`);
    } finally {
      setCheckingPorts(false);
    }
  };

  // 检查进程状态
  const checkProcesses = async () => {
    setCheckingProcesses(true);
    try {
      addLog('system', 'info', '检查进程状态...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = {
        webserver: { running: true, pid: 1234 },
        task: { running: true, pid: 5678 },
        extract: { running: false, pid: null }
      };
      setProcessInfo(result);
      addLog('system', 'info', '进程状态检查完成');
    } catch (err) {
      addLog('system', 'error', `进程检查失败: ${err.message}`);
    } finally {
      setCheckingProcesses(false);
    }
  };

  // 获取脚本日志
  const getScriptLogs = async () => {
    setGettingLogs(true);
    try {
      addLog('system', 'info', '获取脚本日志...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = {
        logs: ['服务启动成功', '处理了10个文件', '出现错误: 端口已被占用', '尝试重启服务', '服务重启成功']
      };
      setScriptLogs(result.logs);
      addLog('system', 'info', '脚本日志获取完成');
    } catch (err) {
      addLog('system', 'error', `获取日志失败: ${err.message}`);
    } finally {
      setGettingLogs(false);
    }
  };

  // 获取提取脚本日志
  const getExtractLogs = async () => {
    setGettingExtractLogs(true);
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = {
        logs: ['提取服务启动', '监听端口8001', '接收请求', '处理完成', '出现错误: 连接超时']
      };
      
      if (result.logs && result.logs.length > 0) {
        setServices(prev => ({
          ...prev,
          extract: {
            ...prev.extract,
            scriptOutput: result.logs.slice(-3).join(' | ')
          }
        }));
        addLog('extract', 'info', `脚本输出: ${result.logs.slice(-1)[0]}`);
      } else {
        addLog('extract', 'warning', '没有找到脚本输出日志');
      }
    } catch (err) {
      addLog('extract', 'error', `获取提取脚本日志失败: ${err.message}`);
    } finally {
      setGettingExtractLogs(false);
    }
  };

  // 测试端口连接
  const testPort = async (port) => {
    try {
      addLog('system', 'info', `测试端口 ${port} 连接...`);
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      addLog('system', 'success', `端口 ${port} 连接成功`);
    } catch (err) {
      addLog('system', 'error', `端口 ${port} 连接失败: ${err.message}`);
    }
  };

  // 故障排除8001端口
  const troubleshootExtract = async () => {
    setTroubleshooting(true);
    try {
      addLog('system', 'info', '开始排除8001端口故障...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = {
        message: '故障排除完成',
        success: true,
        recommendations: ['重启Extract服务', '检查端口占用情况', '查看服务日志']
      };
      
      addLog('system', 'info', `故障排除结果: ${result.message}`);
      
      if (result.recommendations) {
        result.recommendations.forEach(rec => {
          addLog('system', 'warning', `建议: ${rec}`);
        });
      }
    } catch (err) {
      addLog('system', 'error', `故障排除失败: ${err.message}`);
    } finally {
      setTroubleshooting(false);
    }
  };

  // 服务管理方法
  const startWebServer = async () => {
    setServices(prev => ({
      ...prev,
      webserver: {
        ...prev.webserver,
        starting: true
      }
    }));
    try {
      addLog('webserver', 'info', '正在启动 Doccano Web 服务器...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      setServices(prev => ({
        ...prev,
        webserver: {
          ...prev.webserver,
          running: true,
          pid: Math.floor(Math.random() * 10000),
          error: null,
          starting: false
        }
      }));
      addLog('webserver', 'success', `Web 服务器启动成功 (PID: ${services.webserver.pid})`);
    } catch (err) {
      setServices(prev => ({
        ...prev,
        webserver: {
          ...prev.webserver,
          error: err.message,
          starting: false
        }
      }));
      addLog('webserver', 'error', `Web 服务器启动失败: ${err.message}`);
    }
  };

  const startTaskWorker = async () => {
    setServices(prev => ({
      ...prev,
      task: {
        ...prev.task,
        starting: true
      }
    }));
    try {
      addLog('task', 'info', '正在启动任务处理器...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      setServices(prev => ({
        ...prev,
        task: {
          ...prev.task,
          running: true,
          pid: Math.floor(Math.random() * 10000),
          error: null,
          starting: false
        }
      }));
      addLog('task', 'success', `任务处理器启动成功 (PID: ${services.task.pid})`);
    } catch (err) {
      setServices(prev => ({
        ...prev,
        task: {
          ...prev.task,
          error: err.message,
          starting: false
        }
      }));
      addLog('task', 'error', `任务处理器启动失败: ${err.message}`);
    }
  };

  const startExtractScript = async () => {
    setServices(prev => ({
      ...prev,
      extract: {
        ...prev.extract,
        starting: true
      }
    }));
    try {
      addLog('extract', 'info', '正在启动合同提取脚本...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      setServices(prev => ({
        ...prev,
        extract: {
          ...prev.extract,
          running: true,
          pid: Math.floor(Math.random() * 10000),
          error: null,
          starting: false
        }
      }));
      addLog('extract', 'success', `提取脚本启动成功 (PID: ${services.extract.pid})`);
      
      // 等待几秒后自动获取日志
      setTimeout(() => {
        getExtractLogs();
      }, 3000);
    } catch (err) {
      setServices(prev => ({
        ...prev,
        extract: {
          ...prev.extract,
          error: err.message,
          starting: false
        }
      }));
      addLog('extract', 'error', `提取脚本启动失败: ${err.message}`);
    }
  };

  const stopWebServer = async () => {
    try {
      setServices(prev => ({
        ...prev,
        webserver: {
          ...prev.webserver,
          running: false,
          pid: null
        }
      }));
      addLog('webserver', 'info', 'Web 服务器已停止');
    } catch (err) {
      addLog('webserver', 'error', `停止失败: ${err.message}`);
    }
  };

  const stopTaskWorker = async () => {
    try {
      setServices(prev => ({
        ...prev,
        task: {
          ...prev.task,
          running: false,
          pid: null
        }
      }));
      addLog('task', 'info', '任务处理器已停止');
    } catch (err) {
      addLog('task', 'error', `停止失败: ${err.message}`);
    }
  };

  const stopExtractScript = async () => {
    try {
      setServices(prev => ({
        ...prev,
        extract: {
          ...prev.extract,
          running: false,
          pid: null,
          scriptOutput: null
        }
      }));
      addLog('extract', 'info', '提取脚本已停止');
    } catch (err) {
      addLog('extract', 'error', `停止失败: ${err.message}`);
    }
  };

  const startAllServices = async () => {
    setStartingAll(true);
    try {
      addLog('system', 'info', '开始启动所有服务...');
      
      // 模拟启动所有服务
      await startWebServer();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await startTaskWorker();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await startExtractScript();
      
      addLog('system', 'success', '所有服务启动完成');
    } catch (err) {
      addLog('system', 'error', `启动服务失败: ${err.message}`);
    } finally {
      setStartingAll(false);
    }
  };

  const stopAllServices = async () => {
    setStoppingAll(true);
    try {
      await Promise.all([
        stopWebServer(),
        stopTaskWorker(),
        stopExtractScript()
      ]);
      addLog('system', 'info', '所有服务已停止');
    } finally {
      setStoppingAll(false);
    }
  };

  const refreshAllStatus = async () => {
    setRefreshing(true);
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      const status = {
        webserver: { running: true, pid: 1234 },
        task: { running: true, pid: 5678 },
        extract: { running: false, pid: null }
      };
      
      setServices(prev => {
        const updated = { ...prev };
        for (const [serviceName, serviceStatus] of Object.entries(status)) {
          if (updated[serviceName]) {
            updated[serviceName].running = serviceStatus.running;
            updated[serviceName].pid = serviceStatus.pid;
          }
        }
        return updated;
      });
      
      addLog('system', 'info', '状态已刷新');
    } catch (err) {
      addLog('system', 'error', `刷新状态失败: ${err.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  // 界面访问
  const openDoccanoUI = () => {
    window.open('http://127.0.0.1:8000', '_blank');
    addLog('system', 'info', '尝试打开 Doccano UI');
  };

  const openExtractUI = () => {
    window.open('http://127.0.0.1:8001', '_blank');
    addLog('system', 'info', '尝试打开提取界面');
  };

// 处理文件上传
const handleFileUpload = () => {
  fileInputRef.current.click();
};

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 检查文件类型
  const allowedTypes = ['.txt', '.doc', '.docx', '.pdf', '.md'];
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  
  if (!allowedTypes.includes(fileExtension)) {
    alert('请选择文本文件 (.txt, .doc, .docx, .pdf, .md)');
    return;
  }

  // 检查文件大小（限制为5MB）
  if (file.size > 5 * 1024 * 1024) {
    alert('文件太大，请选择小于5MB的文件');
    return;
  }

  // 读取文件内容
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      setOriginalContract(content);
      alert(`文件 "${file.name}" 上传成功！`);
    } catch (error) {
      console.error('读取文件失败:', error);
      alert('读取文件失败，请检查文件格式');
    }
  };
  
  reader.onerror = () => {
    alert('读取文件时发生错误');
  };
  
  reader.readAsText(file);
  
  // 重置文件输入，以便可以再次选择同一个文件
  event.target.value = '';
};

// 清空合同内容
const clearContractContent = () => {
  if (window.confirm('确定要清空合同内容吗？所有输入的内容将会丢失。')) {
    setOriginalContract('');
    alert('合同内容已清空');
  }
};

// 模拟合同生成
const handleGenerateContract = () => {
  if (!originalContract.trim()) {
    alert('请输入原合同内容');
    return;
  }

  setIsGenerating(true);
  
  // 模拟生成延迟
  setTimeout(() => {
    // 基于原合同生成标准化合同
    const generatedContent = `买卖合同

订立合同双方：
甲方：晋中市文化和旅游局
乙方：山西晋韵古建筑有限公司

供需双方本着平等互利、协商一致的原则，签订本合同，以资双方信守执行。

第一条 标的
标的名称：
标的数量：
标的单价：
标的总价：190000.00

第二条 合同价格
合同总金额：人民币元，合同金额包括运输费、安装调试费和服务费等。

第三条 商品质量标准
货物必须符合国家标准。

第四条 履行方式
发货：根据双方具体情况协商而定。
验收：验收。

第五条 付款方式及期限：支付百分之68,。

第六条 违约责任
非终止违约：每延迟一天扣除合同总金额的0.5%的违约金，直至按合同交货或提供服务为止。
终止违约：因此造成甲方损失的，乙方还应承担赔偿责任，甲方有权终止合同。

第七条 不可抗力
当事人一方因不可抗力不能履行合同时，应当及时通知对方，并在合理期限内提供有关机构出具的证明，可以全部或部分免除该方当事人的责任。

第八条 争议解决
因合同执行而产生问题的解决方式可选择以下方式处理：
1. 合同各方应通过友好协商，争议解决在执行本合同过程中所发生的或与本合同有关的一切争端。
2. 如从协商开始十天内仍不能解决，可向人民法院提出诉讼。
3. 调解不成则申请仲裁机构根据其仲裁规则和程序进行仲裁。如仲裁事项不影响合同其它部分的履行，则在仲裁期间，除正在进行仲裁的部分外，本合同的其它部分应继续执行。
4. 按相关法律法规处理。

第九条 合同执行期间，如因故不能履行或需要修改，必须经双方同意，并互相换文或另订合同，方为有效。

第十条 本合同一式三份，由甲方执一份，乙方执一份，备案一份。

甲方：晋中市文化和旅游局（盖章） 乙方：山西晋韵古建筑有限公司（盖章）
签订时间：2022年12月10日
`;

    setGeneratedContract(generatedContent);
    createDownloadFile(generatedContent);
    setIsGenerating(false);
  }, 2000);
};

// 生成合同编号
const generateContractNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CONTRACT-${year}${month}${day}-${random}`;
};

// 创建可下载文件
const createDownloadFile = (content) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  setDownloadUrl(url);
};

// 处理下载
const handleDownload = () => {
  if (!downloadUrl) return;
  
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `合同文档_${new Date().getTime()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 清除生成的合同
const clearGeneratedContract = () => {
  setGeneratedContract('');
  if (downloadUrl) {
    URL.revokeObjectURL(downloadUrl);
    setDownloadUrl('');
  }
};

// 隐藏的文件输入
const hiddenFileInput = (
  <input
    type="file"
    ref={fileInputRef}
    style={{ display: 'none' }}
    onChange={handleFileSelect}
    accept=".txt,.doc,.docx,.pdf,.md"
  />
);

return (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8 px-4">
    {/* 页面标题 */}
    <div className="text-center mb-10">
      <div className="flex items-center justify-center gap-4 mb-3">
        <div className="text-orange-600 text-5xl">✏️</div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">AutoContractTag 合同自动标注与生成系统</h1>
          <p className="text-xl text-gray-600 font-light italic">Automatic Contract Tagging - 调试版本</p>
        </div>
      </div>
    </div>

    {/* 合同生成系统模块 */}
    <div className="max-w-6xl mx-auto mb-8">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden p-6">
        <div className="bg-blue-50 p-6 rounded-xl mb-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-blue-600 text-3xl">📄</div>
            <div>
              <h2 className="text-2xl font-bold text-blue-800">合同生成系统</h2>
              <p className="text-blue-600">基于AI的智能合同生成与标准化处理</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧：原合同输入 */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="text-green-600 text-xl">📋</div>
                  <h3 className="text-lg font-semibold text-gray-900">原合同</h3>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">可编辑</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <textarea
                    className="w-full h-72 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    value={originalContract}
                    onChange={(e) => setOriginalContract(e.target.value)}
                    placeholder="请输入或粘贴原合同内容..."
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {originalContract.length} 字符
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <button 
                  onClick={handleFileUpload}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 transition-colors flex items-center gap-1"
                >
                  <span className="text-xs">📁</span>
                  上传合同文件
                </button>
                <button 
                  onClick={clearContractContent}
                  className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full hover:bg-green-200 transition-colors flex items-center gap-1"
                >
                  <span className="text-xs">🗑️</span>
                  清空内容
                </button>
                {hiddenFileInput}
              </div>
              
              {/* 文件信息提示 */}
              <div className="text-xs text-gray-500 mt-2">
                <p>支持格式：.txt, .doc, .docx, .pdf, .md</p>
                <p>文件大小限制：小于5MB</p>
              </div>
            </div>
            
            {/* 右侧：生成的合同文档 */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="text-red-600 text-xl">📊</div>
                  <h3 className="text-lg font-semibold text-gray-900">生成的合同文档</h3>
                </div>
                {generatedContract && (
                  <div className="text-sm">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">已生成</span>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <div className="border border-gray-300 rounded-lg h-72 overflow-y-auto bg-gray-50 p-4 text-sm">
                  {generatedContract ? (
                    <pre className="whitespace-pre-wrap font-mono text-gray-700">{generatedContract}</pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <div className="text-4xl mb-2">📄</div>
                      <p className="text-lg">生成的合同将显示在这里</p>
                      <p className="text-sm mt-2">点击"开始生成"按钮生成标准化合同</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 生成统计信息 */}
              {generatedContract && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">生成时间</div>
                    <div className="text-sm font-medium">2.1秒</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">字符数</div>
                    <div className="text-sm font-medium">{generatedContract.length}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">行数</div>
                    <div className="text-sm font-medium">{generatedContract.split('\n').length}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
      {/* 生成按钮区域 */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex-1">
            <div className="text-sm text-gray-600 mb-2">生成进度</div>
            {isGenerating ? (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-3/4"></div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                {originalContract ? '准备就绪' : '请输入或上传合同内容'}
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleGenerateContract}
              disabled={isGenerating || !originalContract.trim()}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  生成中...
                </>
              ) : (
                <>
                  <span className="text-lg">▶</span>
                  开始生成
                </>
              )}
            </button>
            
            {/* 添加：查看标注按钮 */}
            <button
              onClick={() => setIsAnnotationModalOpen(true)}
              disabled={!generatedContract || isGenerating}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              <span className="text-lg">🔍</span>
              查看标注
            </button>
            
            <button
              onClick={handleDownload}
              disabled={!generatedContract || isGenerating}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              <span className="text-lg">📥</span>
              下载合同文档
            </button>
            
            {generatedContract && (
              <button
                onClick={clearGeneratedContract}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <span className="text-lg">🗑️</span>
                清空结果
              </button>
            )}
          </div>
        </div>
      </div>

        {/* 在合同生成系统模块的最后，return语句之前添加标注弹窗 */}
        {isAnnotationModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">合同标注示意图</h3>
                <button
                  onClick={() => setIsAnnotationModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              <div className="p-4 overflow-auto max-h-[calc(90vh-120px)]">
                <div className="text-center">
                  <img 
                    src="./biaozhu.png" 
                    alt="合同标注示意图" 
                    className="max-w-full h-auto mx-auto rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/800x600?text=标注图片加载中...";
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-4">图例说明：合同标注过程</p>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setIsAnnotationModalOpen(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
        
        {/* 生成统计信息 */}
        {generatedContract && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg shadow p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="text-green-600 text-2xl">📊</div>
                <div>
                  <p className="text-sm text-gray-600">合同要素提取</p>
                  <p className="text-lg font-semibold">23 个要素</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="text-orange-600 text-2xl">⚖️</div>
                <div>
                  <p className="text-sm text-gray-600">合规性检查</p>
                  <p className="text-lg font-semibold">通过</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

      {/* 功能模块 */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden p-6">
          {/* 调试信息面板 */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="text-red-500 text-xl">🛠️</div>
                  <h2 className="text-xl font-bold text-gray-900">调试工具</h2>
                </div>
                <button
                  onClick={runFullDiagnostics}
                  disabled={runningDiagnostics}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🔍
                  {runningDiagnostics ? '诊断中...' : '完整诊断'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">端口检查</h4>
                  <button
                    onClick={checkPorts}
                    disabled={checkingPorts}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                  >
                    {checkingPorts ? '检查中...' : '检查端口状态'}
                  </button>
                  {portStatus && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>8000端口:</strong> 
                        <span className={`px-2 py-1 rounded text-xs font-medium ${portStatus.port8000.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {portStatus.port8000.status}
                        </span>
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>8001端口:</strong> 
                        <span className={`px-2 py-1 rounded text-xs font-medium ${portStatus.port8001.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {portStatus.port8001.status}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">进程检查</h4>
                  <button
                    onClick={checkProcesses}
                    disabled={checkingProcesses}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                  >
                    {checkingProcesses ? '检查中...' : '检查运行进程'}
                  </button>
                  {processInfo && (
                    <div className="mt-4">
                      {Object.entries(processInfo).map(([service, info]) => (
                        <div key={service} className="mb-2">
                          <p className="text-sm text-gray-700">
                            <strong>{service}:</strong> {info.running ? '运行中' : '未运行'}
                          </p>
                          {info.pid && (
                            <p className="text-xs text-gray-500 ml-6">
                              PID: {info.pid} | 运行时间: 未知
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">脚本输出</h4>
                  <button
                    onClick={getScriptLogs}
                    disabled={gettingLogs}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                  >
                    {gettingLogs ? '获取中...' : '获取脚本日志'}
                  </button>
                  {scriptLogs && (
                    <div className="mt-4 max-h-20 overflow-y-auto bg-gray-50 p-2 rounded text-xs font-mono text-gray-700">
                      {scriptLogs.slice(-5).map((log, index) => (
                        <div key={index} className="mb-1">{log}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 服务管理面板 */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="text-blue-500 text-xl">🖥️</div>
                <h2 className="text-xl font-bold text-gray-900">服务管理</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Doccano Web Server (8000) */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex flex-col items-center mb-4">
                    <div className="text-blue-500 text-3xl mb-2">🖥️</div>
                    <h3 className="text-lg font-semibold text-gray-900">Web Server (8000)</h3>
                    <p className="text-xs text-gray-500 mt-1">Doccano标注界面</p>
                  </div>
                  <div className="mb-4">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${services.webserver.running ? 'bg-green-100 text-green-800' : services.webserver.error ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {services.webserver.starting ? '启动中' : services.webserver.running ? '运行中' : services.webserver.error ? '错误' : '未运行'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <p>进程ID: {services.webserver.pid || '未运行'}</p>
                    {services.webserver.error && (
                      <p className="text-red-500 text-xs mt-1">错误: {services.webserver.error}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {!services.webserver.running ? (
                      <button
                        onClick={startWebServer}
                        disabled={services.webserver.starting}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {services.webserver.starting ? '启动中...' : '启动'}
                      </button>
                    ) : (
                      <button
                        onClick={stopWebServer}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-all duration-300"
                      >
                        停止
                      </button>
                    )}
                    <button
                      onClick={() => testPort(8000)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-all duration-300"
                    >
                      测试端口
                    </button>
                  </div>
                </div>

                {/* Doccano Task Worker */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex flex-col items-center mb-4">
                    <div className="text-green-500 text-3xl mb-2">⚙️</div>
                    <h3 className="text-lg font-semibold text-gray-900">Task Worker</h3>
                    <p className="text-xs text-gray-500 mt-1">任务处理器</p>
                  </div>
                  <div className="mb-4">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${services.task.running ? 'bg-green-100 text-green-800' : services.task.error ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {services.task.starting ? '启动中' : services.task.running ? '运行中' : services.task.error ? '错误' : '未运行'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <p>进程ID: {services.task.pid || '未运行'}</p>
                    {services.task.error && (
                      <p className="text-red-500 text-xs mt-1">错误: {services.task.error}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {!services.task.running ? (
                      <button
                        onClick={startTaskWorker}
                        disabled={services.task.starting}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {services.task.starting ? '启动中...' : '启动'}
                      </button>
                    ) : (
                      <button
                        onClick={stopTaskWorker}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-all duration-300"
                      >
                        停止
                      </button>
                    )}
                  </div>
                </div>

                {/* Contract Extract Script (8001端口) */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex flex-col items-center mb-4">
                    <div className="text-red-500 text-3xl mb-2">📄</div>
                    <h3 className="text-lg font-semibold text-gray-900">Extract Script (8001)</h3>
                    <p className="text-xs text-gray-500 mt-1">合同提取服务</p>
                  </div>
                  <div className="mb-4">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${services.extract.running ? 'bg-green-100 text-green-800' : services.extract.error ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {services.extract.starting ? '启动中' : services.extract.running ? '运行中' : services.extract.error ? '错误' : '未运行'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <p>进程ID: {services.extract.pid || '未运行'}</p>
                    {services.extract.error && (
                      <p className="text-red-500 text-xs mt-1">错误: {services.extract.error}</p>
                    )}
                    {services.extract.scriptOutput && (
                      <p className="text-green-500 text-xs mt-1 font-mono">最新输出: {services.extract.scriptOutput}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {!services.extract.running ? (
                      <button
                        onClick={startExtractScript}
                        disabled={services.extract.starting}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {services.extract.starting ? '启动中...' : '启动'}
                      </button>
                    ) : (
                      <button
                        onClick={stopExtractScript}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all duration-300"
                      >
                        停止
                      </button>
                    )}
                    <button
                      onClick={() => testPort(8001)}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm transition-all duration-300"
                    >
                      测试端口
                    </button>
                    <button
                      onClick={getExtractLogs}
                      disabled={gettingExtractLogs}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {gettingExtractLogs ? '获取中...' : '查看日志'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 快速操作面板 */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="text-green-500 text-xl">⚙️</div>
                <h2 className="text-xl font-bold text-gray-900">快速操作</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">服务管理</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={startAllServices}
                      disabled={startingAll}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ▶️
                      {startingAll ? '启动中...' : '启动全部服务'}
                    </button>
                    
                    <button
                      onClick={stopAllServices}
                      disabled={stoppingAll}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ⏸️
                      {stoppingAll ? '停止中...' : '停止全部服务'}
                    </button>
                    
                    <button
                      onClick={troubleshootExtract}
                      disabled={troubleshooting}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🛠️
                      {troubleshooting ? '排除中...' : '故障排除8001'}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">界面访问</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={openDoccanoUI}
                      disabled={!services.webserver.running}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🔗
                      打开 Doccano UI (8000)
                    </button>
                    
                    <button
                      onClick={openExtractUI}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center gap-2 transition-all duration-300"
                    >
                      🔗
                      尝试打开提取界面 (8001)
                    </button>
                    
                    <button
                      onClick={() => testPort(8001)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-all duration-300"
                    >
                      🔍
                      手动测试8001
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 实时日志面板 */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="text-gray-500 text-xl">📄</div>
                  <h2 className="text-xl font-bold text-gray-900">实时日志 & 调试信息</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoScroll"
                      checked={autoScrollLogs}
                      onChange={(e) => setAutoScrollLogs(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="autoScroll" className="text-sm text-gray-600">自动滚动</label>
                  </div>
                  <button
                    onClick={clearLogs}
                    className="text-sm text-gray-600 hover:text-red-600 transition-colors duration-300"
                  >
                    清空日志
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <div key={index} className={`mb-2 text-xs ${log.level === 'error' ? 'text-red-500' : log.level === 'success' ? 'text-green-500' : log.level === 'warning' ? 'text-yellow-500' : 'text-gray-700'}`}>
                      <span className="text-gray-500">[{log.time}]</span>
                      <span className="font-semibold ml-2">[{log.service}]</span>
                      <span className="ml-2">{log.message}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">暂无日志</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 诊断对话框 */}
      {diagnosticVisible && diagnosticResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">完整诊断报告</h3>
            </div>
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">系统状态概览</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">后端连接</div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${diagnosticResult.backend_connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {diagnosticResult.backend_connected ? '正常' : '异常'}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">8000端口状态</div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${diagnosticResult.port_8000_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {diagnosticResult.port_8000_status}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">8001端口状态</div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${diagnosticResult.port_8001_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {diagnosticResult.port_8001_status}
                  </div>
                </div>
              </div>

              {diagnosticResult.services && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">服务详情</h4>
                  {Object.entries(diagnosticResult.services).map(([name, service]) => (
                    <div key={name} className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
                      <h5 className="font-medium text-gray-900 mb-2">{name}</h5>
                      <p className="text-sm text-gray-600">状态: {service.running ? '运行中' : '未运行'}</p>
                      {service.pid && <p className="text-sm text-gray-600">进程ID: {service.pid}</p>}
                      {service.error && <p className="text-sm text-red-500">错误: {service.error}</p>}
                      {service.logs && <p className="text-sm text-gray-600">最新日志: {service.logs}</p>}
                    </div>
                  ))}
                </div>
              )}

              {diagnosticResult.recommendations && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">建议解决方案</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {diagnosticResult.recommendations.map((rec, index) => (
                      <li key={index} className="mb-2">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="p-6 border-t flex justify-end">
              <button
                onClick={() => setDiagnosticVisible(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const DocTransPro = () => {
  // 响应式数据
  const [launching, setLaunching] = React.useState(false);
  const [isRunning, setIsRunning] = React.useState(false);
  const [error, setError] = React.useState('');
  const [lastStartTime, setLastStartTime] = React.useState(null);
  const [guiProcessId, setGuiProcessId] = React.useState(null);
  const [systemInfoVisible, setSystemInfoVisible] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  
  // 文件转换演示状态
  const [showConversionDemo, setShowConversionDemo] = React.useState(false);
  const [uploadedPdfFile, setUploadedPdfFile] = React.useState(null);
  const [conversionStep, setConversionStep] = React.useState(0); // 0: 上传, 1: PDF已上传, 2: 转换为DOCX, 3: 转换为TXT, 4: 完成
  const [convertedDocxUrl, setConvertedDocxUrl] = React.useState(null);
  const [convertedTxtUrl, setConvertedTxtUrl] = React.useState(null);
  const [isConverting, setIsConverting] = React.useState(false);

  // 文件预览状态
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [previewContent, setPreviewContent] = React.useState('');
  const [previewFileName, setPreviewFileName] = React.useState('');

  // 查看文件内容
  const viewFileContent = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const content = await response.text();
      
      // 检查文件类型
      if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
        // DOCX 是二进制格式，显示提示信息
        setPreviewContent(`📄 文件: ${fileName}\n\n此文件为 Microsoft Word 文档（二进制格式）\n\nDOCX 文件无法以纯文本形式预览。\n请使用 Microsoft Word、Google Docs 或其他兼容工具打开此文件。`);
      } else if (fileName.endsWith('.txt')) {
        // TXT 文件直接显示内容
        setPreviewContent(content);
      } else {
        setPreviewContent(content);
      }
      
      setPreviewFileName(fileName);
      setPreviewVisible(true);
    } catch (err) {
      alert('无法读取文件: ' + err.message);
    }
  };

  // 启动GUI程序
  const launchGUI = async () => {
    setLaunching(true);
    setError('');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRunning(true);
    setGuiProcessId(Math.floor(Math.random() * 10000));
    setLastStartTime(new Date().toLocaleString('zh-CN'));
    setCurrentStep(3);
    setShowConversionDemo(true);
    setConversionStep(0);
    setUploadedPdfFile(null);
    setConvertedDocxUrl(null);
    setConvertedTxtUrl(null);
    setLaunching(false);
  };

  // 处理PDF文件上传
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.includes('pdf') && !file.name.endsWith('.pdf')) {
        alert('请上传PDF文件');
        return;
      }
      setUploadedPdfFile(file);
      setConversionStep(1);
    }
  };

  // 转换为DOCX
  const convertToDocx = async () => {
    setIsConverting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // 获取PDF文件名前缀
      const pdfName = uploadedPdfFile.name.replace(/\.pdf$/i, '');
      const docxFileName = `${pdfName}.docx`;
      setConvertedDocxUrl(`/src/resource/${docxFileName}`);
      setConversionStep(2);
    } catch (err) {
      alert('转换失败：' + err.message);
    } finally {
      setIsConverting(false);
    }
  };

  // 转换为TXT
  const convertToTxt = async () => {
    setIsConverting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // 获取PDF文件名前缀
      const pdfName = uploadedPdfFile.name.replace(/\.pdf$/i, '');
      const txtFileName = `${pdfName}.txt`;
      setConvertedTxtUrl(`/src/resource/${txtFileName}`);
      setConversionStep(3);
    } catch (err) {
      alert('转换失败：' + err.message);
    } finally {
      setIsConverting(false);
    }
  };

  // 关闭转换演示
  const closeConversionDemo = () => {
    setShowConversionDemo(false);
    setConversionStep(0);
    setUploadedPdfFile(null);
    setConvertedDocxUrl(null);
    setConvertedTxtUrl(null);
  };

  // 停止GUI程序
  const stopGUI = async () => {
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsRunning(false);
      setGuiProcessId(null);
      setCurrentStep(4);
    } catch (err) {
      setError('停止GUI程序失败：' + err.message);
    }
  };

  // 检查GUI状态
  const checkGUIStatus = async () => {
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isRunning) {
        setCurrentStep(3);
      } else {
        setCurrentStep(4);
      }
    } catch (err) {
      setError('状态检查失败：' + err.message);
    }
  };

  // 获取状态类型
  const getStatusType = () => {
    if (launching) return 'warning';
    if (error) return 'danger';
    if (isRunning) return 'success';
    return 'info';
  };

  // 获取状态文本
  const getStatusText = () => {
    if (launching) return '正在启动';
    if (error) return '启动失败';
    if (isRunning) return '程序运行中';
    return '待启动';
  };

  // 清空错误
  const clearError = () => {
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-8 px-4">
      {/* 页面标题 */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="text-red-600 text-5xl">📄</div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">DocTransPro 文档格式转化与表格识别系统</h1>
            <p className="text-xl text-gray-600 font-light italic">Document Transformation Professional - 智能文档处理解决方案</p>
          </div>
        </div>
      </div>

      {/* 功能模块 */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden p-6">
          {/* 系统简介 */}
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-blue-500 text-xl">ℹ️</div>
                <h2 className="text-lg font-semibold text-blue-800">DocTransPro 系统简介</h2>
              </div>
              <p className="text-gray-700">
                DocTransPro 是一个强大的文档格式转化与表格识别系统，支持多种文档格式转换，
                能够智能识别和提取表格数据，提供高精度的文档结构化处理服务。
                系统采用先进的OCR技术和机器学习算法，确保转换的准确性和效率。
              </p>
            </div>
          </div>

          {/* 控制面板 */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="text-red-500 text-xl">⚙️</div>
                <h2 className="text-xl font-bold text-gray-900">系统控制台</h2>
              </div>

              <div className="space-y-6">
                {/* 系统状态 */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">系统状态</div>
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusType() === 'success' ? 'bg-green-100 text-green-800' : getStatusType() === 'danger' ? 'bg-red-100 text-red-800' : getStatusType() === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                        {getStatusText()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">GUI程序路径</div>
                      <p className="text-sm text-blue-600">/home/sxx/Desktop/show/DocTransPro/gui.py</p>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">上次启动时间</div>
                      <p className="text-sm text-gray-700">{lastStartTime || '暂无记录'}</p>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">运行实例</div>
                      {guiProcessId ? (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          PID: {guiProcessId}
                        </span>
                      ) : (
                        <p className="text-sm text-gray-500">无运行实例</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={launchGUI}
                    disabled={launching || isRunning}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ height: '48px' }}
                  >
                    ▶️
                    {launching ? '正在启动...' : '启动 GUI 程序'}
                  </button>

                  {isRunning && (
                    <button
                      onClick={checkGUIStatus}
                      className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center gap-3 transition-all duration-300"
                      style={{ height: '48px' }}
                    >
                      🔄
                      检查状态
                    </button>
                  )}

                  {isRunning && (
                    <button
                      onClick={stopGUI}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-3 transition-all duration-300"
                      style={{ height: '48px' }}
                    >
                      ⏸️
                      停止程序
                    </button>
                  )}

                  <button
                    onClick={() => setSystemInfoVisible(true)}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-3 transition-all duration-300"
                    style={{ height: '48px' }}
                  >
                    🖥️
                    系统信息
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 功能特性 */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="text-blue-500 text-xl">⭐</div>
                <h2 className="text-xl font-bold text-gray-900">系统特性</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                  <div className="text-green-500 text-4xl mb-3">📄</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">多格式支持</h3>
                  <p className="text-sm text-gray-600">支持PDF、Word、Excel、图片等多种格式转换</p>
                </div>
                <div className="text-center transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                  <div className="text-yellow-500 text-4xl mb-3">📊</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">表格识别</h3>
                  <p className="text-sm text-gray-600">智能识别复杂表格结构，准确提取数据</p>
                </div>
                <div className="text-center transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                  <div className="text-red-500 text-4xl mb-3">⚡</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">批量处理</h3>
                  <p className="text-sm text-gray-600">支持大批量文档的快速处理和转换</p>
                </div>
                <div className="text-center transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                  <div className="text-blue-500 text-4xl mb-3">🏅</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">高精度OCR</h3>
                  <p className="text-sm text-gray-600">采用先进OCR技术，文字识别准确率超过99%</p>
                </div>
              </div>
            </div>
          </div>

          {/* 使用说明 */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="text-green-500 text-xl">🧭</div>
                <h2 className="text-xl font-bold text-gray-900">使用说明</h2>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <div className={`mb-8 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-600'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-medium ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      1
                    </div>
                    <h3 className="text-lg font-semibold">启动GUI程序</h3>
                  </div>
                  <p className="ml-11 text-sm">点击【启动 GUI 程序】按钮，系统将启动图形化界面程序</p>
                </div>

                <div className={`mb-8 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-600'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-medium ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      2
                    </div>
                    <h3 className="text-lg font-semibold">等待程序启动</h3>
                  </div>
                  <p className="ml-11 text-sm">程序启动需要几秒钟时间，请耐心等待GUI窗口出现</p>
                </div>

                <div className={`mb-8 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-600'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-medium ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      3
                    </div>
                    <h3 className="text-lg font-semibold">使用GUI功能</h3>
                  </div>
                  <p className="ml-11 text-sm">在弹出的GUI窗口中进行文档转换和表格识别操作</p>
                </div>

                <div className={`${currentStep >= 4 ? 'text-blue-600' : 'text-gray-600'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-medium ${currentStep >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      4
                    </div>
                    <h3 className="text-lg font-semibold">处理完成</h3>
                  </div>
                  <p className="ml-11 text-sm">完成操作后可关闭GUI窗口，或使用系统控制台停止程序</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="max-w-6xl mx-auto mt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-red-500 text-xl">❌</div>
              <h3 className="text-lg font-semibold text-red-800">{error}</h3>
              <button
                onClick={clearError}
                className="ml-auto text-red-500 hover:text-red-700 transition-colors duration-300"
              >
                ✕
              </button>
            </div>
            <div className="ml-11">
              <p className="text-sm font-medium text-red-700 mb-2">启动失败，请检查以下可能的原因：</p>
              <ul className="list-disc pl-5 text-sm text-red-600">
                <li>确认 Python 环境是否正确配置</li>
                <li>检查 GUI 程序文件是否存在</li>
                <li>验证文件权限是否充足</li>
                <li>确认系统支持图形界面显示</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 系统信息对话框 */}
      {systemInfoVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">DocTransPro 系统信息</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">系统名称</div>
                  <p className="text-gray-900">DocTransPro 文档格式转化与表格识别系统</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">版本号</div>
                  <p className="text-gray-900">v1.0.0</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">GUI程序路径</div>
                  <p className="text-gray-900">/home/sxx/Desktop/show/DocTransPro/gui.py</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">支持格式</div>
                  <p className="text-gray-900">PDF, Word, Excel, PNG, JPG, TIFF</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">核心技术</div>
                  <p className="text-gray-900">OCR, 机器学习, 图像处理</p>
                </div>
                <div className="pb-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">运行环境</div>
                  <p className="text-gray-900">Python 3.x + GUI框架</p>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-3">主要功能</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">文档格式转换</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">表格识别提取</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">批量处理</span>
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">OCR文字识别</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">结构化输出</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end">
              <button
                onClick={() => setSystemInfoVisible(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 文件转换演示对话框 */}
      {showConversionDemo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* 对话框标题 */}
            <div className="p-6 border-b sticky top-0 bg-white flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">📄 PDF文件格式转换演示</h3>
              <button
                onClick={closeConversionDemo}
                className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
              >
                ✕
              </button>
            </div>

            {/* 转换演示内容 */}
            <div className="p-6">
              {/* 步骤 0: 上传PDF文件 */}
              {conversionStep === 0 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
                    <div className="text-5xl mb-4">📁</div>
                    <h4 className="text-xl font-semibold text-blue-900 mb-2">选择PDF文件</h4>
                    <p className="text-blue-700 mb-6">请选择一个PDF文件开始转换演示</p>
                    <label className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-all duration-300">
                      选择 PDF 文件
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* 步骤 1: 已上传PDF，可以开始转换 */}
              {conversionStep === 1 && uploadedPdfFile && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">✅</div>
                      <div>
                        <h4 className="text-lg font-semibold text-green-900">PDF 文件已上传</h4>
                        <p className="text-green-700">文件名: {uploadedPdfFile.name}</p>
                        <p className="text-green-600 text-sm">大小: {(uploadedPdfFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-gray-700 font-semibold">转换步骤：</p>
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={convertToDocx}
                        disabled={isConverting}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isConverting ? (
                          <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            转换中...
                          </>
                        ) : (
                          <>
                            <span>📄</span>
                            转换为 DOCX 文件
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 步骤 2: 已转换为DOCX */}
              {conversionStep === 2 && convertedDocxUrl && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">✅</div>
                      <div>
                        <h4 className="text-lg font-semibold text-green-900">成功转换为 DOCX</h4>
                        <p className="text-green-700">文件已保存到: {convertedDocxUrl}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => viewFileContent(convertedDocxUrl, convertedDocxUrl.split('/').pop())}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    👁️ 查看文件内容
                  </button>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <p className="text-blue-900 font-semibold mb-4">继续转换：</p>
                    <button
                      onClick={convertToTxt}
                      disabled={isConverting}
                      className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isConverting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          转换中...
                        </>
                      ) : (
                        <>
                          <span>📝</span>
                          转换为 TXT 文件
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* 步骤 3: 已转换为TXT，演示完成 */}
              {conversionStep === 3 && convertedTxtUrl && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">✅</div>
                      <div>
                        <h4 className="text-lg font-semibold text-green-900">成功转换为 TXT</h4>
                        <p className="text-green-700">文件已保存到: {convertedTxtUrl}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => viewFileContent(convertedTxtUrl, convertedTxtUrl.split('/').pop())}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    👁️ 查看文件内容
                  </button>

                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                    <div className="text-center">
                      <div className="text-5xl mb-4">🎉</div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">转换流程已完成！</h4>
                      <p className="text-gray-700 mb-4">已成功演示 PDF → DOCX → TXT 的完整转换流程</p>
                      <div className="space-y-2 text-sm text-gray-600 mb-6">
                        <p>📄 原始文件: {uploadedPdfFile.name}</p>
                        <p>📥 DOCX 文件: {convertedDocxUrl.split('/').pop()}</p>
                        <p>📝 TXT 文件: {convertedTxtUrl.split('/').pop()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 对话框底部按钮 */}
            <div className="p-6 border-t sticky bottom-0 bg-white flex justify-end gap-3">
              {conversionStep > 0 && conversionStep < 3 && (
                <button
                  onClick={() => {
                    setConversionStep(0);
                    setUploadedPdfFile(null);
                    setConvertedDocxUrl(null);
                    setConvertedTxtUrl(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  重新选择
                </button>
              )}
              <button
                onClick={closeConversionDemo}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  conversionStep === 3
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                {conversionStep === 3 ? '完成' : '关闭'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 文件内容预览对话框 */}
      {previewVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">📄 {previewFileName}</h3>
              <button
                onClick={() => setPreviewVisible(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 whitespace-pre-wrap break-words text-sm font-mono text-gray-700">
                {previewContent || '文件内容为空'}
              </div>
            </div>
            <div className="p-6 border-t sticky bottom-0 bg-white flex justify-end">
              <button
                onClick={() => setPreviewVisible(false)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


/*
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------以上为前四个子目录--------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/


// 
const AutoGeneration = () => {
  const [activeTab, setActiveTab] = React.useState('editor');
  const [innerTab, setInnerTab] = React.useState('purchase');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState('');
  const [contentTab, setContentTab] = React.useState('terms'); // terms 表示条文，contract 表示合约
  const [selectedDirectory, setSelectedDirectory] = React.useState('text'); // text, model, logic
  const [selectedOption, setSelectedOption] = React.useState(''); // 空字符串表示默认选项
  
  // 代码内容状态 - 分别为每个标签页存储
  const [purchaseCode, setPurchaseCode] = React.useState('');
  const [auctionCode, setAuctionCode] = React.useState('');
  const [leaseCode, setLeaseCode] = React.useState('');
  
  // 合同内容状态 - 分别为每个标签页存储
  const [purchaseContract, setPurchaseContract] = React.useState('');
  const [auctionContract, setAuctionContract] = React.useState('');
  const [leaseContract, setLeaseContract] = React.useState('');
  
  // 当前显示的代码和合同内容
  const [code, setCode] = React.useState('');
  const [contractContent, setContractContent] = React.useState('');
  
  // 文本区域内容状态
  const [termsContent, setTermsContent] = React.useState('');
  const [contractTabContent, setContractTabContent] = React.useState('');
  
  // 处理下拉列表变化
  const handleOptionChange = async (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    await updateContent(value, selectedDirectory, contentTab);
  };
  
  // 处理目录项点击
  const handleDirectoryClick = async (directory) => {
    setSelectedDirectory(directory);
    await updateContent(selectedOption, directory, contentTab);
  };
  
  // 处理标签切换
  const handleContentTabChange = async (tab) => {
    setContentTab(tab);
    await updateContent(selectedOption, selectedDirectory, tab);
  };
  
  // 更新内容
  const updateContent = async (option, directory, tab) => {
    let content = '';
    
    // 文件路径映射
    const filePathMap = {
      purchase: {
        text: {
          terms: '/codeSource/termsToCode/01Simple Purchase Agreement.txt',
          contract: '/codeSource/agreementToCode/03ComplexPurchaseAgreement.txt'
        },
        model: {
          terms: '/codeSource/termsToCode/01simplePurchase.mydsl',
          contract: '/codeSource/agreementToCode/03complexPurchase.mydsl'
        }
      },
      auction: {
        text: {
          terms: '/codeSource/termsToCode/04Simple Auction Agreement.txt',
          contract: '/codeSource/agreementToCode/06ComplexAuctionAgreement.txt'
        },
        model: {
          terms: '/codeSource/termsToCode/04simpleAuction.mydsl',
          contract: '/codeSource/agreementToCode/06complexAuction.mydsl'
        }
      },
      rent: {
        text: {
          terms: '/codeSource/termsToCode/07Simple Rent Agreement.txt',
          contract: '/codeSource/agreementToCode/09ComplexRentAgreement.txt'
        },
        model: {
          terms: '/codeSource/termsToCode/07simpleRent.mydsl',
          contract: '/codeSource/agreementToCode/09complexRent.mydsl'
        }
      }
    };
    
    // 在选择条文或合约标签且选项不为空时加载文件
    if ((tab === 'terms' || tab === 'contract') && option) {
      // 根据目录和选项加载文件
      if (directory === 'text' || directory === 'model') {
        try {
          const filePath = filePathMap[option][directory][tab];
          content = await loadFileContent(filePath);
        } catch (error) {
          console.error('Error loading file:', error);
          content = '加载文件失败，请重试...';
        }
      }
      
      // 更新对应标签的内容
      if (tab === 'terms') {
        setTermsContent(content);
      } else {
        setContractTabContent(content);
      }
    } else {
      // 其他情况 - 清空内容
      if (tab === 'terms') {
        setTermsContent('');
      } else if (tab === 'contract') {
        setContractTabContent('');
      } else {
        setTermsContent('');
        setContractTabContent('');
      }
    }
  };
  
  // 语法错误状态
  const [syntaxErrors, setSyntaxErrors] = React.useState([]);
  // 是否已经执行过语法检查
  const [hasCheckedSyntax, setHasCheckedSyntax] = React.useState(false);
  
  // 文件读取函数
  const loadFileContent = async (filePath) => {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load file: ${filePath}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Error loading file:', error);
      return '';
    }
  };

  // 加载对应标签页的内容
  const loadTabContent = async (tabId) => {
    let contractContent = '';
    let codeContent = '';
    
    try {
      // 根据当前主标签页和内部标签页加载不同的文件
      if (activeTab === 'editor') {
        // 条文映射代码页面 - 加载termsToCode目录下的文件
        switch (tabId) {
          case 'purchase':
            contractContent = await loadFileContent('/codeSource/termsToCode/01Simple Purchase Agreement.txt');
            codeContent = await loadFileContent('/codeSource/termsToCode/01simplePurchase.mydsl');
            setPurchaseContract(contractContent);
            setPurchaseCode(codeContent);
            break;
          case 'auction':
            contractContent = await loadFileContent('/codeSource/termsToCode/04Simple Auction Agreement.txt');
            codeContent = await loadFileContent('/codeSource/termsToCode/04simpleAuction.mydsl');
            setAuctionContract(contractContent);
            setAuctionCode(codeContent);
            break;
          case 'lease':
            contractContent = await loadFileContent('/codeSource/termsToCode/07Simple Rent Agreement.txt');
            codeContent = await loadFileContent('/codeSource/termsToCode/07simpleRent.mydsl');
            setLeaseContract(contractContent);
            setLeaseCode(codeContent);
            break;
          default:
            break;
        }
      } else if (activeTab === 'contract') {
        // 合约映射代码页面 - 继续加载agreementToCode目录下的文件
        switch (tabId) {
          case 'purchase':
            contractContent = await loadFileContent('/codeSource/agreementToCode/03ComplexPurchaseAgreement.txt');
            codeContent = await loadFileContent('/codeSource/agreementToCode/03complexPurchase.mydsl');
            setPurchaseContract(contractContent);
            setPurchaseCode(codeContent);
            break;
          case 'auction':
            contractContent = await loadFileContent('/codeSource/agreementToCode/06ComplexAuctionAgreement.txt');
            codeContent = await loadFileContent('/codeSource/agreementToCode/06complexAuction.mydsl');
            setAuctionContract(contractContent);
            setAuctionCode(codeContent);
            break;
          case 'lease':
            contractContent = await loadFileContent('/codeSource/agreementToCode/09ComplexRentAgreement.txt');
            codeContent = await loadFileContent('/codeSource/agreementToCode/09complexRent.mydsl');
            setLeaseContract(contractContent);
            setLeaseCode(codeContent);
            break;
          default:
            break;
        }
      }
      
      // 更新当前显示的内容
      setContractContent(contractContent);
      setCode(codeContent);
    } catch (error) {
      console.error('Error loading tab content:', error);
    }
  };

  // 初始加载购买协议内容
  React.useEffect(() => {
    loadTabContent('purchase');
  }, [activeTab]);

  // 当activeTab切换时，设置对应页面的默认子页面
  React.useEffect(() => {
    if (activeTab === 'editor' || activeTab === 'contract') {
      setInnerTab('purchase');
    }
  }, [activeTab]);

  // 当innerTab变化时，加载对应标签页的内容
  React.useEffect(() => {
    loadTabContent(innerTab);
  }, [innerTab]);

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 根据不同操作返回不同结果
      let response;
      switch (action) {
        case 'check':
          // 语法检查如果有错误，则返回失败状态
          const hasErrors = syntaxErrors.length > 0;
          response = {
            success: !hasErrors,
            message: '语法检查完成',
            data: {
              errors: syntaxErrors,
              totalErrors: syntaxErrors.length,
              checkedLines: code.split('\n').length
            }
          };
          break;
        case 'compile':
          response = {
            success: true,
            message: '编译成功',
            data: {
              compiledCode: 'Compiled Sparrow code...',
              size: 1024,
              warnings: []
            }
          };
          break;
        default:
          response = {
            success: false,
            message: '未知操作'
          };
      }
      
      setResult(response);
    } catch (err) {
      setError('操作失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 带错误参数的模拟API请求 - 用于第一次点击检查语法时使用最新的错误信息
  const simulateApiRequestWithErrors = async (action, errors) => {
    setLoading(true);
    setError('');
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 根据不同操作返回不同结果
      let response;
      switch (action) {
        case 'check':
          // 语法检查如果有错误，则返回失败状态
          const hasErrors = errors.length > 0;
          response = {
            success: !hasErrors,
            message: '语法检查完成',
            data: {
              errors: errors,
              totalErrors: errors.length,
              checkedLines: code.split('\n').length
            }
          };
          break;
        default:
          // 其他操作使用默认实现
          return simulateApiRequest(action);
      }
      
      setResult(response);
    } catch (err) {
      setError('操作失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理代码编辑
  const handleCodeChange = (e) => {
    setCode(e.target.value);
    // 用户修改代码后，重置语法检查状态
    setSyntaxErrors([]);
    setHasCheckedSyntax(false);
  };

  // 模拟语法检查
  const handleCheckSyntax = async () => {
    // 1. 清除之前的错误信息和结果
    setSyntaxErrors([]);
    setHasCheckedSyntax(false);
    setResult(null);
    setError('');
    
    // 2. 设置加载状态
    setLoading(true);
    
    // 3. 模拟发现语法错误 - 第19行缺失关键字
    const mockErrors = [
      {
        line: 19,
        column: 1,
        message: '缺失关键字',
        length: 10
      }
    ];
    
    // 4. 计算总行数
    const totalLines = code.split('\n').length;
    
    // 5. 构建响应数据
    const hasErrors = mockErrors.length > 0;
    const response = {
      success: !hasErrors,
      message: '语法检查完成',
      data: {
        errors: mockErrors,
        totalErrors: mockErrors.length,
        checkedLines: totalLines
      }
    };
    
    try {
      // 6. 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 7. 延迟后更新语法错误状态
      setSyntaxErrors(mockErrors);
      setHasCheckedSyntax(true);
      
      // 8. 更新结果
      setResult(response);
      
      // 9. 将光标定位到错误行并滚动到可见区域第一行
      setTimeout(() => {
        const textarea = document.querySelector('.code-editor-textarea');
        if (textarea) {
          // 1. 获取错误信息中的目标行号
          const targetLine = mockErrors[0].line;
          
          // 2. 获取文本内容并分割成行
          const lines = textarea.value.split('\n');
          
          // 3. 确保行号有效
          const validTargetLine = Math.min(targetLine, lines.length);
          
          // 4. 计算错误行开头的字符位置
          let cursorPosition = 0;
          for (let i = 0; i < validTargetLine - 1; i++) {
            // 每行的字符数加上换行符
            cursorPosition += lines[i].length + 1;
          }
          
          // 5. 聚焦到文本区域
          textarea.focus();
          
          // 6. 设置光标位置到错误行开头
          textarea.setSelectionRange(cursorPosition, cursorPosition);
          
          // 7. 将错误行滚动到可见区域的第一行
          // 获取行高
          const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
          // 计算滚动位置，使目标行位于可见区域顶部
          const scrollPosition = (validTargetLine - 1) * lineHeight;
          textarea.scrollTop = scrollPosition;
        }
      }, 100);
    } catch (err) {
      setError('操作失败，请稍后重试');
    } finally {
      // 10. 停止加载动画
      setLoading(false);
    }
  };

  // 模拟编译
  const handleCompile = () => {
    // 清除之前的错误信息和结果
    setSyntaxErrors([]);
    setHasCheckedSyntax(false);
    setResult(null);
    setError('');
    
    simulateApiRequest('compile');
  };

  // 下载输入内容
  const handleDownloadInput = () => {
    if (!contractContent) return;
    
    const blob = new Blob([contractContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `input_${Date.now()}.txt`;
    
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 下载输出结果
  const handleDownloadOutput = () => {
    if (!code) return;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `output_${Date.now()}.txt`;
    
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8 px-4">
      {/* 页面标题 */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="text-purple-600 text-5xl">📝</div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Sparrow设计语言</h2>
            <p className="text-lg text-gray-600 font-light italic">Sparrow Design Language</p>
          </div>
        </div>
        {/* 页面描述 */}
        <div className="max-w-3xl mx-auto mt-4">
          <p className="text-gray-700 text-lg">Sparrow设计语言是一种专为智能合约开发设计的领域特定语言，旨在简化法律条文到代码的转换过程，提高合约代码的可读性和可维护性。</p>
        </div>
      </div>

      {/* 新增区域：搜索框、目录和文本区域 */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* 下拉列表 */}
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <select 
              className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={selectedOption}
              onChange={handleOptionChange}
              style={{
                color: selectedOption ? 'inherit' : '#9CA3AF'
              }}
            >
              <option value="" disabled hidden>请选择模板类型</option>
              <option value="purchase">Purchase</option>
              <option value="auction">Auction</option>
              <option value="rent">Rent</option>
            </select>
          </div>
          
          {/* 目录和文本区域 */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* 左侧目录 */}
              <div className="md:col-span-1">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <ul className="space-y-3">
                    <li>
                      <a 
                        href="#" 
                        className={`transition-colors flex items-center gap-2 p-2 rounded text-lg ${selectedDirectory === 'text' ? 'text-purple-600 font-medium bg-purple-100' : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleDirectoryClick('text');
                        }}
                      >
                        <span>📄</span>
                        <span>文本</span>
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#" 
                        className={`transition-colors flex items-center gap-2 p-2 rounded text-lg ${selectedDirectory === 'model' ? 'text-purple-600 font-medium bg-purple-100' : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleDirectoryClick('model');
                        }}
                      >
                        <span>🤖</span>
                        <span>Sparrow</span>
                      </a>
                    </li>

                    
                    {/* 导出按钮 */}
                    <li className="pt-4">
                      <button 
                        className="w-1/2 px-3 py-2 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium justify-center mx-auto"
                        onClick={() => {
                          const content = contentTab === 'terms' ? termsContent : contractTabContent;
                          if (!content) return;
                          
                          const blob = new Blob([content], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `export_${Date.now()}.txt`;
                          
                          document.body.appendChild(a);
                          a.click();
                          
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                      >
                        导出
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* 右侧文本区域 */}
              <div className="md:col-span-3">
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-200 flex">
                    <button 
                      className={`px-4 py-2 text-base font-medium transition-colors ${contentTab === 'terms' ? 'text-purple-600 bg-white border-b-2 border-purple-600' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => handleContentTabChange('terms')}
                    >
                      条文
                    </button>
                    <button 
                      className={`px-4 py-2 text-base font-medium transition-colors ${contentTab === 'contract' ? 'text-purple-600 bg-white border-b-2 border-purple-600' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => handleContentTabChange('contract')}
                    >
                      合约
                    </button>
                  </div>
                  <textarea 
                    className="w-full border-none px-4 py-3 text-base h-[480px] resize-none bg-white font-mono"
                    value={contentTab === 'terms' ? termsContent : contractTabContent}
                    onChange={(e) => contentTab === 'terms' ? setTermsContent(e.target.value) : setContractTabContent(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 单语言转换模块
const ConvertModule = () => {
  const [sourceCode, setSourceCode] = React.useState('');
  const [targetCode, setTargetCode] = React.useState('');
  const [sourceLanguage, setSourceLanguage] = React.useState('');
  const [localLoading, setLocalLoading] = React.useState(false);
  const [selectedDirectory, setSelectedDirectory] = React.useState('source');
  const [logicCode, setLogicCode] = React.useState('');

  // 处理目录点击
  const handleDirectoryClick = (directory) => {
    setSelectedDirectory(directory);
  };

  // 加载转换逻辑文件
  React.useEffect(() => {
    const loadLogicFile = async () => {
      if (selectedDirectory !== 'logic') return;
      
      setLocalLoading(true);
      try {
        let filePath = '';
        
        if (sourceLanguage === 'epc') {
          filePath = '/codeSource/codeToCode/epcToSolidity/epc_parser.py';
        } else if (['sparrow-purchase', 'sparrow-auction', 'sparrow-rental'].includes(sourceLanguage)) {
          filePath = '/codeSource/codeToCode/sparrowToSolidity/parse_solidity_ast.py';
        } else if (sourceLanguage === 'bpmn') {
          filePath = '/codeSource/codeToCode/BPMNToSolidity/Prompt.txt';
        } else if (sourceLanguage === 'fsm') {
          filePath = '/codeSource/codeToCode/FSMToSolidity/Prompt.txt';
        }
        
        if (filePath) {
          const content = await loadFileContent(filePath);
          setLogicCode(content);
        } else {
          setLogicCode('');
        }
      } catch (error) {
        console.error('Error loading logic file:', error);
        setLogicCode('转换逻辑文件加载失败');
      } finally {
        setLocalLoading(false);
      }
    };

    loadLogicFile();
  }, [sourceLanguage, selectedDirectory]);

  // 文件路径映射
  const filePaths = {
    'sparrow-purchase': {
      input: '/codeSource/codeToCode/sparrowToSolidity/03complexPurchase.mydsl',
      output: '/codeSource/codeToCode/sparrowToSolidity/03complexPurchase.sol'
    },
    'sparrow-auction': {
      input: '/codeSource/codeToCode/sparrowToSolidity/06complexAuction.mydsl',
      output: '/codeSource/codeToCode/sparrowToSolidity/06complexAuction.sol'
    },
    'sparrow-rental': {
      input: '/codeSource/codeToCode/sparrowToSolidity/09complexRent.mydsl',
      output: '/codeSource/codeToCode/sparrowToSolidity/09complexRent.sol'
    },
    'epc': {
      input: '/codeSource/codeToCode/epcToSolidity/auction_simple.epml',
      output: '/codeSource/codeToCode/epcToSolidity/auction_simple.sol'
    },
    'bpmn': {
      input: '/codeSource/codeToCode/BPMNToSolidity/Auction_Contract.txt',
      output: '/codeSource/codeToCode/BPMNToSolidity/AuctionContract_response_output.sol'
    },
    'fsm': {
      input: '/codeSource/codeToCode/FSMToSolidity/FSM.txt',
      output: '/codeSource/codeToCode/FSMToSolidity/llama3_0-5.sol'
    }
  };

  // 加载文件内容
  const loadFileContent = async (filePath) => {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load file: ${filePath}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Error loading file:', error);
      return '文件加载失败，请稍后重试';
    }
  };

  // 源语言选择变化时加载对应文件
  React.useEffect(() => {
    const loadFiles = async () => {
      setLocalLoading(true);
      try {
        const paths = filePaths[sourceLanguage];
        if (paths) {
          const inputContent = await loadFileContent(paths.input);
          setSourceCode(inputContent);
          // 同时加载输出文件内容
          const outputContent = await loadFileContent(paths.output);
          setTargetCode(outputContent);
        }
      } catch (error) {
        console.error('Error loading files:', error);
      } finally {
        setLocalLoading(false);
      }
    };

    loadFiles();
  }, [sourceLanguage]);

  // 下载代码功能
  const handleDownload = () => {
    if (!targetCode) return;
    
    // 创建Blob对象
    const blob = new Blob([targetCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // 创建下载链接
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted_code_${Date.now()}.txt`;
    
    // 触发下载
    document.body.appendChild(a);
    a.click();
    
    // 清理
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 下载输入内容
  const handleDownloadInput = () => {
    if (!sourceCode) return;
    
    const blob = new Blob([sourceCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `input_${Date.now()}.txt`;
    
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 下载输出结果
  const handleDownloadOutput = () => {
    if (!targetCode) return;
    
    const blob = new Blob([targetCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `solidity_output_${Date.now()}.txt`;
    
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 源语言选项
  const sourceLanguages = [
    { value: 'sparrow-purchase', label: 'Sparrow-Purchase' },
    { value: 'sparrow-auction', label: 'Sparrow-Auction' },
    { value: 'sparrow-rental', label: 'Sparrow-Rent' },
    { value: 'epc', label: 'EPC' },
    { value: 'bpmn', label: 'BPMN' },
    { value: 'fsm', label: 'FSM' }
  ];

  const handleConvert = async () => {
    setLocalLoading(true);
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 加载对应输出文件
      const paths = filePaths[sourceLanguage];
      if (paths) {
        const outputContent = await loadFileContent(paths.output);
        setTargetCode(outputContent);
      }
    } catch (error) {
      console.error('代码转换失败:', error);
      setTargetCode('代码转换失败，请稍后重试');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">单语言转换</h3>
        <p className="text-gray-700 mb-4">支持将Sparrow、EPC、BPMN、FSM等多种形式化描述语言转换为Solidity智能合约代码，提供源语言编辑、转换逻辑查看和转换结果展示功能，并对BPMN和FSM转换提供准确率和一致性分析。</p>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">源语言</label>
            <select 
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-base"
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              style={{ color: sourceLanguage ? '' : '#9ca3af' }}
            >
              <option value="" disabled hidden>请选择源语言</option>
              {sourceLanguages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* 目录和文本区域 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 左侧目录 */}
          <div className="md:col-span-1">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <ul className="space-y-3">
                <li>
                  <a 
                    href="#" 
                    className={`transition-colors flex items-center gap-2 p-2 rounded text-lg ${selectedDirectory === 'source' ? 'text-purple-600 font-medium bg-purple-100' : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDirectoryClick('source');
                    }}
                  >
                    <span>📄</span>
                    <span>源语言</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className={`transition-colors flex items-center gap-2 p-2 rounded text-lg ${selectedDirectory === 'solidity' ? 'text-purple-600 font-medium bg-purple-100' : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDirectoryClick('solidity');
                    }}
                  >
                    <span>🔗</span>
                    <span>Solidity</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className={`transition-colors flex items-center gap-2 p-2 rounded text-lg ${selectedDirectory === 'logic' ? 'text-purple-600 font-medium bg-purple-100' : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDirectoryClick('logic');
                    }}
                  >
                    <span>🔄</span>
                    <span>转换逻辑</span>
                  </a>
                </li>
                
                <li className="pt-4">
                  <button 
                    className="w-1/2 px-3 py-2 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium justify-center mx-auto"
                    onClick={() => {
                      const content = selectedDirectory === 'source' ? sourceCode : selectedDirectory === 'solidity' ? targetCode : '转换逻辑将显示在这里';
                      if (!content || content === '转换逻辑将显示在这里') return;
                       
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                       
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `export_${Date.now()}.txt`;
                       
                      document.body.appendChild(a);
                      a.click();
                       
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    导出
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          {/* 右侧文本区域 */}
          <div className="md:col-span-3">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 flex items-center px-4 py-2">
                <span className="text-base font-medium text-gray-700">
                  {selectedDirectory === 'source' && (sourceLanguage ? `${sourceLanguages.find(l => l.value === sourceLanguage)?.label}` : 'unknown')}
                  {selectedDirectory === 'solidity' && 'Solidity'}
                  {selectedDirectory === 'logic' && '转换逻辑'}
                </span>
              </div>
              <textarea 
                className="w-full border-none px-4 py-3 text-base h-[480px] resize-none bg-white font-mono"
                value={selectedDirectory === 'source' ? sourceCode : selectedDirectory === 'solidity' ? targetCode : logicCode}
                onChange={(e) => {
                  if (selectedDirectory === 'source') {
                    setSourceCode(e.target.value);
                  } else if (selectedDirectory === 'solidity') {
                    setTargetCode(e.target.value);
                  }
                }}
                placeholder=""
                spellCheck={false}
              />
            </div>
          </div>
        </div>
        
        {targetCode && (
          <>
            {(sourceLanguage === 'bpmn' || sourceLanguage === 'fsm') && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
                <h4 className="text-lg font-semibold text-green-800 mb-4">转换准确率</h4>
                <div className="flex justify-center items-center py-4">
                  <div className="flex items-center gap-4">
                    {sourceLanguage === 'fsm' ? (
                      <>
                        <p className="text-xl">准确率 = (1 - </p>
                        <div className="text-center">
                          <p className="text-lg font-medium">编辑距离(Edit Distance)</p>
                          <hr className="w-full border-t-2 border-gray-800 my-1" />
                          <p className="text-lg font-medium">有效代码行数(Effective Lines of Code)</p>
                        </div>
                        <p className="text-xl">) × 100%</p>
                        <p className="text-xl">≈</p>
                        <p className="text-xl font-medium">88.35%</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xl">准确率 = (1 - </p>
                        <div className="text-center">
                          <p className="text-lg font-medium">确保正确执行而需要修改的代码行数(Lines of Modified Code)</p>
                          <hr className="w-full border-t-2 border-gray-800 my-1" />
                          <p className="text-lg font-medium">代码总行数(Lines of Code)</p>
                        </div>
                        <p className="text-xl">) × 100%</p>
                        <p className="text-xl">≈</p>
                        <p className="text-xl font-medium">97.1%</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            {(sourceLanguage === 'bpmn' || sourceLanguage === 'fsm') && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-green-200 mt-6">
                <h4 className="text-lg font-semibold text-green-800 mb-4">转换一致性</h4>
                {sourceLanguage === 'bpmn' ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="flex items-center gap-4">
                      <p className="text-xl">一致性 = (1 - </p>
                      <div className="text-center">
                        <p className="text-lg font-medium">实现预期功能而需要修改的代码行数(Lines to be Fixed of Code)</p>
                        <hr className="w-full border-t-2 border-gray-800 my-1" />
                        <p className="text-lg font-medium">代码总行数(Lines of Code)</p>
                      </div>
                      <p className="text-xl">) × 100%</p>
                      <p className="text-xl">≈</p>
                      <p className="text-xl font-medium">97.9%</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center py-4">
                    <div className="flex items-center gap-4">
                      <p className="text-xl">一致性 = </p>
                      <div className="text-center">
                        <p className="text-lg font-medium">2 × 精确率(Precision) × 召回率(Recall)</p>
                        <hr className="w-full border-t-2 border-gray-800 my-1" />
                        <p className="text-lg font-medium">精确率(Precision) + 召回率(Recall)</p>
                      </div>
                      <p className="text-xl">× 100%</p>
                      <p className="text-xl">≈</p>
                      <p className="text-xl font-medium">92.16%</p>
                    </div>
                  </div>
                )}
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
};

// 编译器模块
const CompilerModule = () => {
  const [language, setLanguage] = React.useState('go');
  const [code, setCode] = React.useState('');
  const [correctedCode, setCorrectedCode] = React.useState('');
  const [lineAccuracy, setLineAccuracy] = React.useState(0);
  const [byteAccuracy, setByteAccuracy] = React.useState(0);
  const [result, setResult] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  // 文件上传处理
  const [uploadedFile, setUploadedFile] = React.useState(null);
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCode(event.target.result);
      };
      reader.readAsText(file);
      // 重置文件输入，确保可以重复上传同一个文件
      e.target.value = '';
    }
  };
  
  // 清除上传的文件
  const clearUploadedFile = () => {
    setUploadedFile(null);
    // 不清除代码内容，只清除文件信息
  };

  // 语法纠错处理
  const handleSyntaxCorrection = () => {
    if (!code) {
      setError('请输入或上传代码');
      return;
    }

    // 构建提示词
    let prompt = '';
    if (language === 'go') {
      prompt = `请对以下Go代码进行语法纠错，使其能正确编译运行。只返回纠错后的代码，不要添加任何解释或注释。\n\n${code}`;
    } else if (language === 'vyper') {
      prompt = `请对以下Vyper代码进行语法纠错，使其能正确编译运行。只返回纠错后的代码，不要添加任何解释或注释。\n\n${code}`;
    }

    // 打开deepseek网站并预填充提示词
    const encodedPrompt = encodeURIComponent(prompt);
    window.open(`https://chat.deepseek.com/?prompt=${encodedPrompt}`, '_blank');
  };

  // 编译处理
  const handleCompileRun = async () => {
    if (!code) {
      setError('请输入或上传代码');
      return;
    }

    // 安全检查
    const unsafePatterns = {
      go: [
        'os/exec',
        'syscall',
        'net/http',
        'os.Remove',
        'os.RemoveAll',
        'os.Rename',
        'os.Chmod',
        'os.Chown',
        'os.Mkdir',
        'os.MkdirAll',
        'os.OpenFile',
        'os.Create',
        'ioutil.WriteFile',
        'io/ioutil.WriteFile',
        'os.Exit',
        'runtime.GOMAXPROCS',
        'runtime.LockOSThread',
        'reflect.MakeFunc',
        'reflect.Value.Call',
        'plugin.Open'
      ],
      vyper: [
        'selfdestruct',
        'delegatecall',
        'callcode',
        'suicide',
        'raw_call',
        'create2',
        'create'
      ]
    };

    // 检查代码是否包含危险操作
    const patterns = unsafePatterns[language] || [];
    for (const pattern of patterns) {
      if (code.includes(pattern)) {
        setError(`代码包含危险操作：${pattern}，请移除后再编译`);
        return;
      }
    }



    setLoading(true);
    setError('');
    setResult('');

    try {
      // 调用后端API编译运行代码
      const response = await fetch(`/api/compile/${language}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '编译失败');
      }

      const data = await response.json();

      // 构建结果
      let resultText = '';
      if (language === 'go') {
        resultText = `Go编译${data.success ? '成功' : '失败'}！\n\n编译信息：\n${data.compileOutput}\n\n执行结果：\n${data.runOutput}`;
      } else if (language === 'vyper') {
        resultText = `Vyper编译${data.success ? '成功' : '失败'}！\n\n编译结果：\n${data.compileOutput}`;
      }

      setResult(resultText);
    } catch (err) {
      setError(`编译失败：${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">编译器</h3>
        <p className="text-gray-700 mb-4">上传或输入Go语言和Vyper语言的代码，进行编译运行，查看编译结果。</p>
        
        <div className="flex flex-wrap items-end gap-4 mb-6">
          <div className="w-1/2 max-w-[200px]">
            <label className="block text-base font-medium text-gray-700 mb-2">语言选择</label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="go">Go</option>
              <option value="vyper">Vyper</option>
            </select>
          </div>
          <div>
            <div className="flex items-center gap-2">
              {/* 文件上传按钮 */}
              <label 
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all duration-300 cursor-pointer"
              >
                <span>文件上传</span>
                <input 
                  type="file" 
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".go,.vy,.txt"
                />
              </label>
              
              {/* 上传文件信息显示 */}
              {uploadedFile && (
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2">
                  <div className="text-green-500">📄</div>
                  <div className="text-base">
                    <span className="font-medium truncate max-w-xs">{uploadedFile.name}</span>
                    <span className="text-sm text-gray-500 ml-1">({Math.round(uploadedFile.size / 1024)} KB)</span>
                  </div>
                  <button
                    onClick={clearUploadedFile}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">代码输入</label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="relative">
                  <textarea
                    className="w-full border-none px-4 py-3 text-base h-96 resize-none bg-white z-10 relative font-mono"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={`请输入${language === 'go' ? 'Go' : 'Vyper'}代码...`}
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">正确内容</label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="relative">
                  <textarea
                    className="w-full border-none px-4 py-3 text-base h-96 resize-none bg-white z-10 relative font-mono"
                    value={correctedCode}
                    onChange={(e) => setCorrectedCode(e.target.value)}
                    placeholder="请将deepseek纠错后的代码粘贴到这里..."
                    spellCheck={false}
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button 
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  onClick={() => {
                    if (!code || !correctedCode) {
                      setError('请输入代码和纠错结果');
                      return;
                    }

                    // 计算行正确率
                    const originalLines = code.split('\n');
                    const correctedLines = correctedCode.split('\n');
                    const totalLines = originalLines.length;
                    let modifiedLines = 0;

                    for (let i = 0; i < Math.max(originalLines.length, correctedLines.length); i++) {
                      const originalLine = originalLines[i] || '';
                      const correctedLine = correctedLines[i] || '';
                      if (originalLine !== correctedLine) {
                        modifiedLines++;
                      }
                    }

                    const lineAcc = (1 - modifiedLines / totalLines) * 100;
                    setLineAccuracy(lineAcc);

                    // 计算字节正确率 (UTF-8编码)
                    const encoder = new TextEncoder();
                    const originalBytes = encoder.encode(code).length;
                    const correctedBytes = encoder.encode(correctedCode).length;
                    const modifiedBytes = Math.abs(correctedBytes - originalBytes);
                    const byteAcc = (1 - modifiedBytes / originalBytes) * 100;
                    setByteAccuracy(byteAcc);
                  }}
                >
                  📊
                  计算正确率
                </button>
              </div>
              {lineAccuracy > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">行正确率</p>
                    <p className="text-lg font-semibold text-blue-700">{lineAccuracy.toFixed(2)}%</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">字节正确率</p>
                    <p className="text-lg font-semibold text-green-700">{byteAccuracy.toFixed(2)}%</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <button 
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
            onClick={handleSyntaxCorrection}
          >
            📝
            语法纠错
          </button>
          <button 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            onClick={handleCompileRun}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                编译中...
              </>
            ) : (
              <>
                🔄
                编译运行
              </>
            )}
          </button>
          <button 
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
            onClick={() => {
              setCode('');
              setCorrectedCode('');
              setLineAccuracy(0);
              setByteAccuracy(0);
              setUploadedFile(null);
            }}
          >
            🗑️
            清空代码
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="text-red-500 text-xl">❌</div>
              <h4 className="text-lg font-semibold text-red-800">{error}</h4>
            </div>
          </div>
        )}
        
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
            <h4 className="text-lg font-semibold text-green-800 mb-4">编译运行结果</h4>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="relative">
                <textarea
                  className="w-full border-none px-4 py-3 text-base h-96 resize-none bg-gray-50 z-10 relative font-mono"
                  value={result}
                  readOnly
                  spellCheck={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 多语言转换模块
const MultiConvertModule = () => {
  const [sourceCode, setSourceCode] = React.useState('');
  const [goCode, setGoCode] = React.useState('');
  const [vyperCode, setVyperCode] = React.useState('');
  const [sourceLanguage, setSourceLanguage] = React.useState('');
  const [localLoading, setLocalLoading] = React.useState(false);
  const [selectedDirectory, setSelectedDirectory] = React.useState('source');
  const [logicCode, setLogicCode] = React.useState('');

  // 处理目录点击
  const handleDirectoryClick = (directory) => {
    setSelectedDirectory(directory);
  };

  // 加载转换逻辑文件
  React.useEffect(() => {
    const loadLogicFile = async () => {
      if (selectedDirectory !== 'logic') return;
      
      setLocalLoading(true);
      try {
        let filePath = '';
        
        if (['sparrow-purchase', 'sparrow-auction', 'sparrow-rent'].includes(sourceLanguage)) {
          filePath = '/codeSource/codeToCode/sparrowToVyper/parse_vyper_ast.py';
        }
        
        if (filePath) {
          const content = await loadFileContent(filePath);
          setLogicCode(content);
        } else {
          setLogicCode('');
        }
      } catch (error) {
        console.error('Error loading logic file:', error);
        setLogicCode('转换逻辑文件加载失败');
      } finally {
        setLocalLoading(false);
      }
    };

    loadLogicFile();
  }, [sourceLanguage, selectedDirectory]);

  // 文件路径映射
  const filePaths = {
    'sparrow-purchase-go': {
      input: '/codeSource/codeToCode/sparrowToGo/03complexPurchase.sparrow',
      output: '/codeSource/codeToCode/sparrowToGo/complexPurchase.go'
    },
    'sparrow-purchase-vyper': {
      input: '/codeSource/codeToCode/sparrowToVyper/03complexPurchase.sparrow',
      output: '/codeSource/codeToCode/sparrowToVyper/complexPurchase.vy'
    },
    'sparrow-auction-go': {
      input: '/codeSource/codeToCode/sparrowToGo/06complexAuction.sparrow',
      output: '/codeSource/codeToCode/sparrowToGo/complexAuction.go'
    },
    'sparrow-auction-vyper': {
      input: '/codeSource/codeToCode/sparrowToVyper/06complexAuction.sparrow',
      output: '/codeSource/codeToCode/sparrowToVyper/complexAuction.vy'
    },
    'sparrow-rent-go': {
      input: '/codeSource/codeToCode/sparrowToGo/09complexRent.sparrow',
      output: '/codeSource/codeToCode/sparrowToGo/complexRent.go'
    },
    'sparrow-rent-vyper': {
      input: '/codeSource/codeToCode/sparrowToVyper/09complexRent.sparrow',
      output: '/codeSource/codeToCode/sparrowToVyper/complexRent.vy'
    }
  };

  // 源语言选项
  const sourceLanguages = [
    { value: 'sparrow-purchase', label: 'Sparrow-Purchase' },
    { value: 'sparrow-auction', label: 'Sparrow-Auction' },
    { value: 'sparrow-rent', label: 'Sparrow-Rent' }
  ];

  // 目标语言选项
  const targetLanguages = [
    { value: 'go', label: 'Go' },
    { value: 'vyper', label: 'Vyper' }
  ];

  // 加载文件内容
  const loadFileContent = async (filePath) => {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load file: ${filePath}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Error loading file:', error);
      return '文件加载失败，请稍后重试';
    }
  };

  // 源语言选择变化时加载对应文件
  React.useEffect(() => {
    const loadFiles = async () => {
      setLocalLoading(true);
      try {
        // 加载输入文件
        const goKey = `${sourceLanguage}-go`;
        const vyperKey = `${sourceLanguage}-vyper`;
        
        const goPaths = filePaths[goKey];
        const vyperPaths = filePaths[vyperKey];
        
        if (goPaths) {
          const inputContent = await loadFileContent(goPaths.input);
          setSourceCode(inputContent);
          // 加载Go输出文件内容
          const goOutputContent = await loadFileContent(goPaths.output);
          setGoCode(goOutputContent);
        }
        
        if (vyperPaths) {
          // 加载Vyper输出文件内容
          const vyperOutputContent = await loadFileContent(vyperPaths.output);
          setVyperCode(vyperOutputContent);
        }
      } catch (error) {
        console.error('Error loading files:', error);
      } finally {
        setLocalLoading(false);
      }
    };

    loadFiles();
  }, [sourceLanguage]);

  // 处理多语言转换
  const handleConvert = async () => {
    setLocalLoading(true);
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 加载对应输出文件
      const goKey = `${sourceLanguage}-go`;
      const vyperKey = `${sourceLanguage}-vyper`;
      
      const goPaths = filePaths[goKey];
      const vyperPaths = filePaths[vyperKey];
      
      if (goPaths) {
        const goOutputContent = await loadFileContent(goPaths.output);
        setGoCode(goOutputContent);
      }
      
      if (vyperPaths) {
        const vyperOutputContent = await loadFileContent(vyperPaths.output);
        setVyperCode(vyperOutputContent);
      }
    } catch (error) {
      console.error('多语言转换失败:', error);
      setGoCode('多语言转换失败，请稍后重试');
      setVyperCode('多语言转换失败，请稍后重试');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDownloadInput = () => {
    if (!sourceCode) return;
    
    const blob = new Blob([sourceCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `input_${Date.now()}.txt`;
    
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadOutput = () => {
    if (!goCode) return;
    
    const blob = new Blob([goCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `output_${Date.now()}.txt`;
    
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">多语言转换</h3>
        <p className="text-gray-700 mb-4">支持将Sparrow语言同时转换为Go和Vyper两种目标编程语言，提供源语言编辑、双语言转换结果对比展示和转换逻辑查看功能，实现一次转换多语言输出。</p>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">源语言</label>
            <select 
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-base"
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              style={{ color: sourceLanguage ? '' : '#9ca3af' }}
            >
              <option value="" disabled hidden>请选择源语言</option>
              {sourceLanguages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* 目录和文本区域 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 左侧目录 */}
          <div className="md:col-span-1">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <ul className="space-y-3">
                <li>
                  <a 
                    href="#" 
                    className={`transition-colors flex items-center gap-2 p-2 rounded text-lg ${selectedDirectory === 'source' ? 'text-purple-600 font-medium bg-purple-100' : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDirectoryClick('source');
                    }}
                  >
                    <span>📄</span>
                    <span>源语言</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className={`transition-colors flex items-center gap-2 p-2 rounded text-lg ${selectedDirectory === 'convert' ? 'text-purple-600 font-medium bg-purple-100' : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDirectoryClick('convert');
                    }}
                  >
                    <span>🔄</span>
                    <span>转换</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className={`transition-colors flex items-center gap-2 p-2 rounded text-lg ${selectedDirectory === 'logic' ? 'text-purple-600 font-medium bg-purple-100' : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDirectoryClick('logic');
                    }}
                  >
                    <span>🧠</span>
                    <span>转换逻辑</span>
                  </a>
                </li>
                
                <li className="pt-4">
                  {selectedDirectory === 'source' && (
                    <button 
                      className="w-1/2 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium justify-center mx-auto"
                      onClick={() => {
                        if (!sourceCode) return;
                        const blob = new Blob([sourceCode], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `source_${Date.now()}.txt`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                    >
                      导出
                    </button>
                  )}
                  
                  {selectedDirectory === 'convert' && (
                    <div className="flex gap-2">
                      <button 
                        className="w-1/2 px-3 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 font-medium justify-center"
                        onClick={() => {
                          if (!goCode) return;
                          const blob = new Blob([goCode], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `go_output_${Date.now()}.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                      >
                        导出Go
                      </button>
                      <button 
                        className="w-1/2 px-3 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-300 font-medium justify-center"
                        onClick={() => {
                          if (!vyperCode) return;
                          const blob = new Blob([vyperCode], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `vyper_output_${Date.now()}.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                      >
                        导出Vyper
                      </button>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
          
          {/* 右侧文本区域 */}
          <div className="md:col-span-3">
            {selectedDirectory === 'source' && (
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 flex items-center px-4 py-2">
                  <span className="text-base font-medium text-gray-700">{sourceLanguage ? sourceLanguages.find(l => l.value === sourceLanguage)?.label : 'unknown'}</span>
                </div>
                <textarea
                  className="w-full border-none px-4 py-3 text-base h-[480px] resize-none bg-white font-mono"
                  value={sourceCode}
                  onChange={(e) => setSourceCode(e.target.value)}
                  placeholder=""
                  spellCheck={false}
                />
              </div>
            )}
            
            {selectedDirectory === 'convert' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-200 flex items-center px-4 py-2">
                    <span className="text-base font-medium text-gray-700">Go</span>
                  </div>
                  <textarea
                    className="w-full border-none px-4 py-3 text-base h-[480px] resize-none bg-white font-mono"
                    value={goCode}
                    onChange={(e) => setGoCode(e.target.value)}
                    placeholder=""
                    spellCheck={false}
                  />
                </div>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-200 flex items-center px-4 py-2">
                    <span className="text-base font-medium text-gray-700">Vyper</span>
                  </div>
                  <textarea
                    className="w-full border-none px-4 py-3 text-base h-[480px] resize-none bg-white font-mono"
                    value={vyperCode}
                    onChange={(e) => setVyperCode(e.target.value)}
                    placeholder=""
                    spellCheck={false}
                  />
                </div>
              </div>
            )}
            
            {selectedDirectory === 'logic' && (
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 flex items-center px-4 py-2">
                  <span className="text-base font-medium text-gray-700">转换逻辑</span>
                </div>
                <textarea
                  className="w-full border-none px-4 py-3 text-base h-[480px] resize-none bg-white font-mono"
                  value={logicCode}
                  readOnly
                  spellCheck={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      

    </div>
  );
};

const ComplianceCheck = () => {
  // 响应式数据
  const [activeTab, setActiveTab] = React.useState('convert');
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
        case 'convert':
          response = {
            success: true,
            message: '代码转换成功',
            data: {
              sourceLanguage: 'Sparrow语言',
              targetLanguage: 'Solidity',
              conversionTime: '15秒',
              codeQuality: 0.92,
              generatedCode: `pragma solidity ^0.8.0;\n\ncontract LaborContract {\n    // 合同双方\n    address public employer;\n    address public employee;\n    \n    // 合同期限\n    uint public startTime;\n    uint public endTime;\n    \n    // 薪资待遇\n    uint public salary;\n    \n    // 工作地点\n    string public workplace;\n    \n    constructor(address _employer, address _employee, uint _salary, string memory _workplace, uint _duration) {\n        employer = _employer;\n        employee = _employee;\n        salary = _salary;\n        workplace = _workplace;\n        startTime = block.timestamp;\n        endTime = block.timestamp + _duration;\n    }\n}`
            }
          };
          break;
        case 'optimize':
          response = {
            success: true,
            message: '代码优化完成',
            data: {
              originalSize: '1.2KB',
              optimizedSize: '850B',
              optimizationRate: '29.17%',
              gasSaved: '15%',
              optimizationTime: '8秒'
            }
          };
          break;
        case 'validate':
          response = {
            success: true,
            message: '代码验证通过',
            data: {
              validationResult: '通过',
              issues: 0,
              warnings: 2,
              validationTime: '12秒',
              warningsDetails: [
                '建议添加事件日志',
                '考虑添加访问控制'
              ]
            }
          };
          break;
        case 'platform':
          response = {
            success: true,
            message: '平台适配成功',
            data: {
              platform: '以太坊',
              network: 'Goerli测试网',
              compatibility: '100%',
              deploymentCost: '0.05 ETH',
              adapterVersion: 'v1.2.0'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8 px-4">
      {/* 页面标题 */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="text-orange-600 text-5xl">⚙️</div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">可编程语言转换引擎</h2>
            <p className="text-lg text-gray-600 font-light italic">Programmable Language Conversion Engine</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto mt-4">
          <p className="text-gray-700 text-lg">
            可编程语言转换引擎是一种强大的工具，专门用于不同编程语言之间的智能转换，特别是在法律条文到形式化语言、形式化语言到智能合约代码的转换过程中发挥关键作用。
            该引擎支持多种语言格式的转换，包括自然语言、Sparrow、BPMN、FSM等，能够自动分析输入内容并生成符合语法规范的目标语言代码，大大提高了开发效率和代码质量。
          </p>
        </div>
      </div>

      {/* 功能模块选择 */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* 标签页导航 */}
          <div className="bg-gray-50 border-b border-gray-200 rounded-t-xl">
            <div className="flex overflow-x-auto">
              {
                [
                  { id: 'convert', label: '单语言转换', icon: '🔄' },
                  { id: 'multi-convert', label: '多语言转换', icon: '🌐' },
                  { id: 'compiler', label: '编译器', icon: '⚙️' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-6 py-4 whitespace-nowrap font-medium text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))
              }
            </div>
          </div>

          {/* 标签页内容 */}
          <div className="p-6">
            {activeTab === 'convert' && <ConvertModule />}
            {activeTab === 'multi-convert' && <MultiConvertModule />}
            {activeTab === 'compiler' && <CompilerModule />}
          </div>
        </div>
      </div>
    </div>
  );
};

/*
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------以上为后两个子目录--------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/



// 目录项配置 - 按要求重新组织成三个下拉菜单
const dropdownMenus = [
  {
    title: '提取与判定',
    items: [
      { id: 'law-parsing', title: 'CAM-CEE', component: <LawParsing /> },
      { id: 'intelligent-matching', title: 'ProvBench', component: <IntelligentMatching /> }
    ]
  },
  {
    title: '标注与转化',
    items: [
      { id: 'auto-contract-tag', title: 'AutoContractTag', component: <AutoContractTag /> },
      { id: 'doc-trans-pro', title: 'DocTransPro', component: <DocTransPro /> }
    ]
  },
  {
    title: '语言与转换',
    items: [
      { id: 'auto-generation', title: 'Sparrow设计语言', component: <AutoGeneration /> },
      { id: 'compliance-check', title: '可编程语言转换引擎', component: <ComplianceCheck /> }
    ]
  }
];

// 合并所有菜单项用于查找
const allMenuItems = dropdownMenus.flatMap(menu => menu.items);

const LawToolchain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState('law-parsing');
  const [openDropdown, setOpenDropdown] = useState(null);

  // 处理菜单点击
  const handleMenuItemClick = (itemId) => {
    setActiveMenuItem(itemId);
    setOpenDropdown(null); // 关闭所有下拉菜单
    // 使用replace而不是push，避免浏览器历史记录堆积
    navigate(`/law-toolchain#${itemId}`, { replace: true });
  };

  // 缓存当前激活的组件实例，只有当activeMenuItem变化时才重新创建
  const cachedComponent = React.useMemo(() => {
    const item = allMenuItems.find(item => item.id === activeMenuItem);
    return item ? item.component : <LawParsing />;
  }, [activeMenuItem]);

  // 切换下拉菜单
  const toggleDropdown = (dropdownIndex) => {
    setOpenDropdown(openDropdown === dropdownIndex ? null : dropdownIndex);
  };

  // 点击空白处关闭下拉菜单
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      // 检查点击目标是否在下拉菜单外部
      const dropdowns = document.querySelectorAll('.relative');
      let isClickInside = false;
      
      dropdowns.forEach(dropdown => {
        if (dropdown.contains(event.target)) {
          isClickInside = true;
        }
      });
      
      if (!isClickInside) {
        setOpenDropdown(null);
      }
    };

    // 添加事件监听器
    document.addEventListener('mousedown', handleClickOutside);
    
    // 清除事件监听器
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 下拉菜单关闭计时器
  const [closeTimer, setCloseTimer] = React.useState(null);

  // 延迟关闭下拉菜单
  const delayCloseDropdown = () => {
    if (closeTimer) {
      clearTimeout(closeTimer);
    }
    const timer = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
    setCloseTimer(timer);
  };

  // 取消关闭计时器
  const cancelCloseDropdown = () => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      setCloseTimer(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* 导航栏 */}
      <Navbar />

      {/* 法条智能处理工具链导航 - 移动到导航栏下方 */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <h2 className="text-xl font-bold text-gray-900 mr-8">{allMenuItems.find(item => item.id === activeMenuItem)?.title || '法条智能处理工具链'}</h2>
            
            {/* 下拉菜单导航 */}
            <div className="flex items-center space-x-4">
              {dropdownMenus.map((menu, index) => (
                <div 
                  key={index} 
                  className="relative"
                  onMouseEnter={() => {
                    cancelCloseDropdown();
                    setOpenDropdown(index);
                  }}
                  onMouseLeave={delayCloseDropdown}
                >
                  {/* 下拉菜单按钮 */}
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                  >
                    {menu.title}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* 下拉菜单内容 */}
                  {openDropdown === index && (
                    <div 
                      className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10"
                      onMouseEnter={cancelCloseDropdown}
                      onMouseLeave={delayCloseDropdown}
                    >
                      <div className="py-1">
                        {menu.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleMenuItemClick(item.id)}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors 
                              ${item.id === activeMenuItem
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'}
                            `}
                          >
                            {item.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* 渲染缓存的组件实例 */}
          {cachedComponent}
        </div>
      </div>
    </div>
  );
};

export default LawToolchain;