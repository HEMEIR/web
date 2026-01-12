import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LawParsing = () => {
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
              extractedElements: 15,
              contractName: '劳动合同',
              elements: [
                { name: '合同双方', value: '甲方：XX公司，乙方：张三' },
                { name: '合同期限', value: '3年' },
                { name: '薪资待遇', value: '10000元/月' },
                { name: '工作地点', value: '北京市朝阳区' }
              ]
            }
          };
          break;
        case 'train':
          response = {
            success: true,
            message: '模型训练完成',
            data: {
              accuracy: 0.95,
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
                { id: 1, name: '劳动合同数据集', samples: 1500, status: '可用' },
                { id: 2, name: '租赁合同数据集', samples: 1200, status: '可用' },
                { id: 3, name: '借款合同数据集', samples: 800, status: '处理中' }
              ]
            }
          };
          break;
        case 'evaluate':
          response = {
            success: true,
            message: '模型评估完成',
            data: {
              precision: 0.94,
              recall: 0.95,
              f1Score: 0.945,
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">合同名称</p>
              <p className="text-lg font-medium">{result.data.contractName}</p>
              <p className="text-sm text-gray-600 mt-4 mb-2">提取要素数量</p>
              <p className="text-lg font-medium">{result.data.extractedElements}个</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-3">主要提取要素</p>
              <ul className="space-y-2">
                {result.data.elements.map((element, index) => (
                  <li key={index} className="flex justify-between text-sm">
                    <span className="font-medium">{element.name}:</span>
                    <span className="text-gray-600">{element.value}</span>
                  </li>
                ))}
              </ul>
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
              <option>劳动合同数据集</option>
              <option>租赁合同数据集</option>
              <option>借款合同数据集</option>
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
            <div>
              <p className="text-sm text-gray-600 mb-3">训练过程</p>
              <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-gray-500">训练曲线图</div>
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
        <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
          <h4 className="text-lg font-semibold text-green-800 mb-4">评估结果</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">精确率</p>
                  <p className="text-2xl font-bold text-blue-700">{result.data.precision.toFixed(3)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">召回率</p>
                  <p className="text-2xl font-bold text-green-700">{result.data.recall.toFixed(3)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">F1分数</p>
                  <p className="text-2xl font-bold text-purple-700">{result.data.f1Score.toFixed(3)}</p>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-3">混淆矩阵</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-xs text-gray-600 mb-1">真阳性 (TP)</p>
                    <p className="text-xl font-bold text-green-700">{result.data.confusionMatrix.truePositive}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <p className="text-xs text-gray-600 mb-1">假阳性 (FP)</p>
                    <p className="text-xl font-bold text-red-700">{result.data.confusionMatrix.falsePositive}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <p className="text-xs text-gray-600 mb-1">假阴性 (FN)</p>
                    <p className="text-xl font-bold text-yellow-700">{result.data.confusionMatrix.falseNegative}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-xs text-gray-600 mb-1">真阴性 (TN)</p>
                    <p className="text-xl font-bold text-blue-700">{result.data.confusionMatrix.trueNegative}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-3">评估报告</h5>
              <div className="bg-gray-50 p-4 rounded-lg h-64 overflow-y-auto">
                <p className="text-sm text-gray-700 mb-3">模型评估报告摘要：</p>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                  <li>模型在测试集上表现优异，F1分数达到0.945</li>
                  <li>精确率为0.94，召回率为0.95，整体性能平衡</li>
                  <li>混淆矩阵显示假阳性和假阴性数量较少</li>
                  <li>模型在各类合同要素上的表现一致</li>
                  <li>建议在更多类型的合同数据上进行测试</li>
                </ul>
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

  // 计算属性：是否有任何模型正在加载
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
  const runModel = async (modelType) => {
    setLoading(prev => ({ ...prev, [modelType]: true }));
    setCurrentExecution({
      model: modelType,
      startTime: Date.now()
    });

    // 开始进度模拟
    const interval = simulateProgress();

    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 5000));

      // 模拟成功结果
      const result = {
        model: modelType,
        timestamp: new Date().toLocaleString('zh-CN'),
        success: true,
        output: `模型 ${getModelDisplayName(modelType)} 执行成功！\n\n=== 执行结果 ===\n一致性得分：98.5%\n执行时间：4.2秒\n处理合约数：12\n\n=== 详细报告 ===\n1. 合约1：匹配度 99.2%\n2. 合约2：匹配度 98.7%\n3. 合约3：匹配度 97.9%\n...\n\n=== 结论 ===\n所有合约一致性判定完成，平均匹配度 98.5%`,
        error: '',
        duration: 4200
      };

      setResults(prev => [result, ...prev]);
    } catch (error) {
      // 模拟错误结果
      const result = {
        model: modelType,
        timestamp: new Date().toLocaleString('zh-CN'),
        success: false,
        output: '',
        error: `执行 ${getModelDisplayName(modelType)} 模型时发生错误：\n${error.message}`,
        duration: 2500
      };

      setResults(prev => [result, ...prev]);
    } finally {
      setLoading(prev => ({ ...prev, [modelType]: false }));
      setCurrentExecution({
        model: null,
        startTime: null
      });
    }
  };

  // 清空结果
  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8 px-4">
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
            { id: 'legalbert', title: 'LegalBERT', description: '专门针对法律文本优化的BERT模型，在法律领域数据上进行预训练', tags: ['法律专用', '高精度'], icon: '📚', color: 'primary' },
            { id: 'bert', title: 'BERT', description: '经典的双向编码器表示模型，在多种NLP任务中表现优异', tags: ['经典模型', '通用性强'], icon: '💻', color: 'success' },
            { id: 'roberta', title: 'RoBERTa', description: '优化的BERT模型，采用改进的预训练策略和更大的训练数据', tags: ['优化版本', '性能提升'], icon: '⚙️', color: 'warning' }
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
                        <span className="text-xl font-bold text-gray-900">{getModelDisplayName(result.model)}</span>
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
                        🖥️
                        <h4 className="font-semibold text-gray-900">终端输出</h4>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto max-h-[240px]">
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
            <p className="text-gray-600">从上方选择一个模型并点击「运行模型」按钮开始分析</p>
          </div>
        )}
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
          <div className="text-orange-600 text-5xl">✏️</div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">AutoContractTag 合同自动标注与生成系统</h1>
            <p className="text-xl text-gray-600 font-light italic">Automatic Contract Tagging - 调试版本</p>
          </div>
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

  // 启动GUI程序
  const launchGUI = async () => {
    setLaunching(true);
    setError('');
    setCurrentStep(1);

    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const processId = Math.floor(Math.random() * 10000);
      
      setIsRunning(true);
      setGuiProcessId(processId);
      setLastStartTime(new Date().toLocaleString('zh-CN'));
      setCurrentStep(2);
      
      // 3秒后进入下一步
      setTimeout(() => {
        setCurrentStep(3);
      }, 3000);
    } catch (err) {
      setError('GUI程序启动失败：' + err.message);
      setIsRunning(false);
      setGuiProcessId(null);
      setCurrentStep(0);
    } finally {
      setLaunching(false);
    }
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
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState('');
  
  // 代码内容状态
  const [code, setCode] = React.useState('');
  
  
  // 语法错误状态
  const [syntaxErrors, setSyntaxErrors] = React.useState([]);
  // 是否已经执行过语法检查
  const [hasCheckedSyntax, setHasCheckedSyntax] = React.useState(false);

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
          response = {
            success: true,
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

  // 处理代码编辑
  const handleCodeChange = (e) => {
    setCode(e.target.value);
    // 用户修改代码后，重置语法检查状态
    setSyntaxErrors([]);
    setHasCheckedSyntax(false);
  };

  // 模拟语法检查
  const handleCheckSyntax = () => {
    // 模拟发现语法错误
    const mockErrors = [
      {
        line: 5,
        column: 5,
        message: '未知属性名',
        length: 10
      }
    ];
    setSyntaxErrors(mockErrors);
    setHasCheckedSyntax(true);
    simulateApiRequest('check');
  };

  // 模拟编译
  const handleCompile = () => {
    simulateApiRequest('compile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8 px-4">
      {/* 页面标题 */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="text-purple-600 text-5xl">📝</div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Sparrow设计语言</h2>
            <p className="text-xl text-gray-600 font-light italic">Sparrow Design Language</p>
          </div>
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
                  { id: 'editor', label: '代码编辑器', icon: '✏️' },
                  { id: 'features', label: '核心特性', icon: '✨' },
                  { id: 'application', label: '应用场景', icon: '💡' },
                  { id: 'principles', label: '设计原则', icon: '🎯' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-6 py-4 whitespace-nowrap font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'}`}
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
            {/* 代码编辑器标签页 */}
            {activeTab === 'editor' && (
              <div className="space-y-6">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">Sparrow 程序编辑器</h3>
                  <p className="text-gray-700 mb-4">编写Sparrow程序，支持语法检查和编译功能。</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sparrow 代码</label>
                      <div className="border border-gray-300 rounded-lg overflow-hidden">
                        {/* 编辑器头部 */}
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">代码编辑区</span>
                          <div className="flex items-center gap-3">
                            {hasCheckedSyntax && (
                              syntaxErrors.length > 0 ? (
                                <span className="text-sm text-red-600">发现 {syntaxErrors.length} 个语法错误</span>
                              ) : (
                                <span className="text-sm text-green-600">无语法错误</span>
                              )
                            )}
                            <label className="cursor-pointer px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-300 flex items-center gap-1">
                              📁 上传文件
                              <input
                                type="file"
                                accept=".txt"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      setCode(event.target.result || '');
                                    };
                                    reader.readAsText(file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                        {/* 代码输入区域 */}
                        <textarea
                          className="w-full border-none px-4 py-3 text-sm font-mono h-72 resize-none"
                          value={code}
                          onChange={handleCodeChange}
                          placeholder="在这里编写 Sparrow 程序..."
                          spellCheck={false}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">操作选项</label>
                        <div className="space-y-3">
                          <button
                            onClick={handleCheckSyntax}
                            disabled={loading}
                            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            {loading ? (
                              <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                检查中...
                              </span>
                            ) : (
                              '检查语法'
                            )}
                          </button>
                          <button
                            onClick={handleCompile}
                            disabled={loading}
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            {loading ? (
                              <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                编译中...
                              </span>
                            ) : (
                              '编译代码'
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {/* 语法错误列表 */}
                      {syntaxErrors.length > 0 && (
                        <div className="bg-white border border-red-200 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-red-800 mb-2">语法错误列表</h4>
                          <ul className="list-disc pl-5 text-sm text-red-700 space-y-2 max-h-40 overflow-y-auto">
                            {syntaxErrors.map((error, index) => (
                              <li key={index}>
                                <span className="font-medium">第 {error.line} 行</span>: {error.message}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 操作结果 */}
                {result && result.success && (
                  <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
                    <h4 className="text-lg font-semibold text-green-800 mb-4">操作结果</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">操作类型</p>
                          <p className="text-lg font-medium">{result.message === '语法检查完成' ? '语法检查' : '编译'}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">结果状态</p>
                          <p className="text-lg font-medium text-green-700">成功</p>
                        </div>
                        {result.message === '语法检查完成' && (
                          <>
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">错误数量</p>
                              <p className="text-lg font-medium">{result.data.totalErrors}</p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">检查行数</p>
                              <p className="text-lg font-medium">{result.data.checkedLines}</p>
                            </div>
                          </>
                        )}
                        {result.message === '编译成功' && (
                          <>
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">代码大小</p>
                              <p className="text-lg font-medium">{result.data.size} bytes</p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">警告数量</p>
                              <p className="text-lg font-medium">{result.data.warnings.length}</p>
                            </div>
                          </>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-3">操作选项</p>
                        <div className="flex flex-wrap gap-3">
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2">
                            💾 保存结果
                          </button>
                          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2">
                            ✅ 验证结果
                          </button>
                          <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2">
                            ⚡ 优化代码
                          </button>
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
            )}
            
            {/* 核心特性标签页 */}
            {activeTab === 'features' && (
              <div className="space-y-6">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">核心特性</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-purple-200 rounded-lg p-4 bg-white">
                      <h4 className="text-md font-semibold text-purple-700 mb-2">简洁明了</h4>
                      <p className="text-gray-700">语法设计简洁易懂，降低学习成本，便于快速上手。</p>
                    </div>
                    <div className="border border-purple-200 rounded-lg p-4 bg-white">
                      <h4 className="text-md font-semibold text-purple-700 mb-2">法律条文形式化</h4>
                      <p className="text-gray-700">专门为智能合约法律条文诠释设计，支持精确的形式化描述。</p>
                    </div>
                    <div className="border border-purple-200 rounded-lg p-4 bg-white">
                      <h4 className="text-md font-semibold text-purple-700 mb-2">严格的语法语义</h4>
                      <p className="text-gray-700">具有严格的语法和语义定义，确保计算机可理解和处理。</p>
                    </div>
                    <div className="border border-purple-200 rounded-lg p-4 bg-white">
                      <h4 className="text-md font-semibold text-purple-700 mb-2">双向映射</h4>
                      <p className="text-gray-700">支持与自然语言法律条文的双向映射，保持语义一致性。</p>
                    </div>
                    <div className="border border-purple-200 rounded-lg p-4 bg-white">
                      <h4 className="text-md font-semibold text-purple-700 mb-2">自动验证推理</h4>
                      <p className="text-gray-700">支持自动验证和推理，确保智能合约的合法性和正确性。</p>
                    </div>
                    <div className="border border-purple-200 rounded-lg p-4 bg-white">
                      <h4 className="text-md font-semibold text-purple-700 mb-2">实时预览</h4>
                      <p className="text-gray-700">支持实时查看设计效果，提高开发效率。</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* 应用场景标签页 */}
            {activeTab === 'application' && (
              <div className="space-y-6">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">应用场景</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md border border-purple-100">
                      <div className="text-purple-600 text-3xl mb-3">📄</div>
                      <h4 className="text-md font-semibold text-purple-700 mb-2">法律条文形式化</h4>
                      <p className="text-gray-700">将自然语言法律条文转换为计算机可理解的形式化描述。</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md border border-purple-100">
                      <div className="text-purple-600 text-3xl mb-3">⚖️</div>
                      <h4 className="text-md font-semibold text-purple-700 mb-2">智能合约生成</h4>
                      <p className="text-gray-700">基于形式化描述自动生成智能合约代码。</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md border border-purple-100">
                      <div className="text-purple-600 text-3xl mb-3">🔍</div>
                      <h4 className="text-md font-semibold text-purple-700 mb-2">合同合规性审查</h4>
                      <p className="text-gray-700">自动审查智能合约的合规性和合法性。</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md border border-purple-100">
                      <div className="text-purple-600 text-3xl mb-3">🤝</div>
                      <h4 className="text-md font-semibold text-purple-700 mb-2">多方合约协商</h4>
                      <p className="text-gray-700">支持多方参与的合约协商和修订。</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md border border-purple-100">
                      <div className="text-purple-600 text-3xl mb-3">📊</div>
                      <h4 className="text-md font-semibold text-purple-700 mb-2">合约执行监控</h4>
                      <p className="text-gray-700">实时监控智能合约的执行状态和结果。</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md border border-purple-100">
                      <div className="text-purple-600 text-3xl mb-3">📚</div>
                      <h4 className="text-md font-semibold text-purple-700 mb-2">法律知识库构建</h4>
                      <p className="text-gray-700">构建结构化的法律知识库，支持智能检索和推理。</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* 设计原则标签页 */}
            {activeTab === 'principles' && (
              <div className="space-y-6">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">设计原则</h3>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-purple-100">
                      <h4 className="text-md font-semibold text-purple-700 mb-2">法律准确性优先</h4>
                      <p className="text-gray-700">确保形式化描述与自然语言法律条文的语义一致性，优先保证法律准确性。</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-purple-100">
                      <h4 className="text-md font-semibold text-purple-700 mb-2">计算机可理解性</h4>
                      <p className="text-gray-700">设计清晰的语法结构，便于计算机解析和处理，支持自动验证和推理。</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-purple-100">
                      <h4 className="text-md font-semibold text-purple-700 mb-2">人类可读性</h4>
                      <p className="text-gray-700">保持良好的人类可读性，便于开发人员理解和维护。</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-purple-100">
                      <h4 className="text-md font-semibold text-purple-700 mb-2">扩展性</h4>
                      <p className="text-gray-700">支持扩展，能够适应不同领域和场景的法律条文形式化需求。</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-purple-100">
                      <h4 className="text-md font-semibold text-purple-700 mb-2">安全性</h4>
                      <p className="text-gray-700">考虑智能合约的安全性，支持安全属性的形式化描述和验证。</p>
                    </div>
                  </div>
                </div>
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
              generatedCode: `pragma solidity ^0.8.0;\n\ncontract LaborContract {\n    // 合同双方\n    address public employer;\n    address public employee;\n    \n    // 合同期限\n    uint public startTime;\n    uint public endTime;\n    \n    // 薪资待遇\n    uint public salary;\n    \n    // 工作地点\n    string public workplace;\n    \n    constructor(address _employer, address _employee, uint _salary, string memory _workplace, uint _duration) {
        employer = _employer;
        employee = _employee;
        salary = _salary;
        workplace = _workplace;
        startTime = block.timestamp;
        endTime = block.timestamp + _duration;
    }\n}`
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

  // 代码转换模块
  const ConvertModule = () => {
    const [sourceCode, setSourceCode] = React.useState('');
    const [targetCode, setTargetCode] = React.useState('');
    const [sourceLanguage, setSourceLanguage] = React.useState('sparrow');
    const [targetLanguage, setTargetLanguage] = React.useState('solidity');
    const [localLoading, setLocalLoading] = React.useState(false);

    // 源语言选项
    const sourceLanguages = [
      { value: 'sparrow', label: 'Sparrow' },
      { value: 'epc', label: 'EPC' },
      { value: 'bpmn', label: 'BPMN' },
      { value: 'fsm', label: 'FSM' }
    ];

    // 目标语言选项
    const targetLanguages = [
      { value: 'solidity', label: 'Solidity' }
    ];

    const handleConvert = async () => {
      if (!sourceCode) {
        return;
      }

      setLocalLoading(true);
      try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 模拟转换结果
        const mockConversions = {
          'sparrow': {
            'solidity': `// Sparrow 转换为 Solidity
contract SparrowContract {
    // Sparrow 智能合约实现
    function execute() public returns (bool) {
        // 执行逻辑
        return true;
    }
}`
          },
          'epc': {
            'solidity': `// EPC 转换为 Solidity
contract EPCContract {
    // 事件驱动流程链实现
    event ProcessStarted(address indexed sender, uint256 timestamp);
    
    function startProcess() public {
        emit ProcessStarted(msg.sender, block.timestamp);
    }
}`
          },
          'bpmn': {
            'solidity': `// BPMN 转换为 Solidity
contract BPMNContract {
    // 业务流程模型实现
    enum ProcessState { Created, Running, Completed, Failed }
    ProcessState public currentState;
    
    constructor() {
        currentState = ProcessState.Created;
    }
    
    function startProcess() public {
        currentState = ProcessState.Running;
    }
}`
          },
          'fsm': {
            'solidity': `// FSM 转换为 Solidity
contract FSMContract {
    // 有限状态机实现
    enum State { A, B, C }
    State public currentState = State.A;
    
    function transitionToB() public {
        require(currentState == State.A, "Invalid state transition");
        currentState = State.B;
    }
    
    function transitionToC() public {
        require(currentState == State.B, "Invalid state transition");
        currentState = State.C;
    }
}`
          }
        };
        
        const convertedCode = mockConversions[sourceLanguage]?.[targetLanguage] || 
                          `// 暂不支持从 ${sourceLanguage} 到 ${targetLanguage} 的转换\n${sourceCode}`;
        
        setTargetCode(convertedCode);
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
          <h3 className="text-lg font-semibold text-purple-800 mb-3">代码转换</h3>
          <p className="text-gray-700 mb-4">将形式化描述的法律条文转换为可执行的智能合约代码，支持多种目标编程语言。</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">源语言</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
              >
                {sourceLanguages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">目标语言</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                disabled
              >
                {targetLanguages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleConvert}
                disabled={localLoading}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {localLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    转换中...
                  </span>
                ) : (
                  '开始转换'
                )}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">输入内容</label>
                <label className="cursor-pointer px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-300 flex items-center gap-1">
                  📁 上传文件
                  <input
                    type="file"
                    accept=".txt"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setSourceCode(event.target.result || '');
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
              </div>
              <textarea 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-72 font-mono"
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                placeholder={`请输入${sourceLanguages.find(l => l.value === sourceLanguage)?.label}代码...`}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">输出结果</label>
              <div className="border border-gray-300 rounded-lg h-72 overflow-y-auto bg-gray-50 p-3 text-sm font-mono">
                {targetCode ? (
                  <pre className="whitespace-pre-wrap">{targetCode}</pre>
                ) : (
                  <div className="text-gray-400 flex items-center justify-center h-full">
                    转换结果将显示在这里
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {targetCode && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
            <h4 className="text-lg font-semibold text-green-800 mb-4">转换结果摘要</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">源语言</p>
                  <p className="text-lg font-medium">{sourceLanguages.find(l => l.value === sourceLanguage)?.label}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">目标语言</p>
                  <p className="text-lg font-medium">Solidity</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">转换时间</p>
                  <p className="text-lg font-medium">1.5s</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">代码质量</p>
                  <p className="text-lg font-medium">95.50</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-3">操作选项</p>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2">
                    💾 下载代码
                  </button>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2">
                    ✅ 验证代码
                  </button>
                  <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2">
                    ⚡ 优化代码
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 代码优化模块
  const OptimizeModule = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">代码优化</h3>
        <p className="text-gray-700 mb-4">优化生成的智能合约代码，减小代码体积，降低gas消耗，提高执行效率。</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">选择优化策略</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="sizeOpt" className="w-4 h-4 text-yellow-600 rounded" defaultChecked />
                <label htmlFor="sizeOpt" className="text-sm text-gray-700">减小代码体积</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="gasOpt" className="w-4 h-4 text-yellow-600 rounded" defaultChecked />
                <label htmlFor="gasOpt" className="text-sm text-gray-700">降低Gas消耗</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="speedOpt" className="w-4 h-4 text-yellow-600 rounded" />
                <label htmlFor="speedOpt" className="text-sm text-gray-700">提高执行速度</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="readOpt" className="w-4 h-4 text-yellow-600 rounded" />
                <label htmlFor="readOpt" className="text-sm text-gray-700">优化可读性</label>
              </div>
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => simulateApiRequest('optimize')}
              disabled={loading}
              className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  优化中...
                </span>
              ) : (
                '开始优化'
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* 优化结果 */}
      {result && result.success && result.data.optimizationRate && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
          <h4 className="text-lg font-semibold text-green-800 mb-4">优化结果</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">原始大小</p>
                <p className="text-lg font-medium">{result.data.originalSize}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">优化后大小</p>
                <p className="text-lg font-medium">{result.data.optimizedSize}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">优化率</p>
                <p className="text-lg font-medium">{result.data.optimizationRate}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Gas节省</p>
                <p className="text-lg font-medium">{result.data.gasSaved}</p>
              </div>
            </div>
            <div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-3">优化前后对比</p>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-yellow-200 text-yellow-700">
                        原始大小
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-200 text-green-700">
                        优化后大小
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div style={{ width: '100%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
                    <div style={{ width: `${parseFloat(result.data.optimizationRate)}` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 -ml-full"></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2">
                  💾 保存优化结果
                </button>
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

  // 代码验证模块
  const ValidateModule = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">代码验证</h3>
        <p className="text-gray-700 mb-4">验证生成的智能合约代码的正确性、安全性和合规性，确保代码符合最佳实践。</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择验证规则</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>默认规则集</option>
              <option>严格规则集</option>
              <option>安全优先</option>
              <option>效率优先</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => simulateApiRequest('validate')}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  验证中...
                </span>
              ) : (
                '开始验证'
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* 验证结果 */}
      {result && result.success && result.data.validationResult && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
          <h4 className="text-lg font-semibold text-green-800 mb-4">验证结果</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">验证结果</p>
                <p className={`text-lg font-medium ${result.data.validationResult === '通过' ? 'text-green-700' : 'text-red-700'}`}>
                  {result.data.validationResult}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">问题数量</p>
                <p className="text-lg font-medium">{result.data.issues}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">警告数量</p>
                <p className="text-lg font-medium">{result.data.warnings}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">验证时间</p>
                <p className="text-lg font-medium">{result.data.validationTime}</p>
              </div>
            </div>
            <div>
              {result.data.warnings > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <h5 className="text-sm font-semibold text-yellow-800 mb-2">警告详情</h5>
                  <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-2">
                    {result.data.warningsDetails.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2">
                  📄 生成验证报告
                </button>
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

  // 平台适配模块
  const PlatformModule = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-3">平台适配</h3>
        <p className="text-gray-700 mb-4">将生成的智能合约代码适配到不同的区块链平台和网络环境。</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择区块链平台</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>以太坊</option>
              <option>Polygon</option>
              <option>BSC</option>
              <option>Solana</option>
              <option>Avalanche</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择网络</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>主网</option>
              <option>Goerli测试网</option>
              <option>Sepolia测试网</option>
              <option>Rinkeby测试网</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => simulateApiRequest('platform')}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  适配中...
                </span>
              ) : (
                '开始适配'
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* 适配结果 */}
      {result && result.success && result.data.compatibility && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
          <h4 className="text-lg font-semibold text-green-800 mb-4">适配结果</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">区块链平台</p>
                <p className="text-lg font-medium">{result.data.platform}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">网络</p>
                <p className="text-lg font-medium">{result.data.network}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">兼容性</p>
                <p className="text-lg font-medium">{result.data.compatibility}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">部署成本</p>
                <p className="text-lg font-medium">{result.data.deploymentCost}</p>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">适配建议</h5>
                <p className="text-sm text-gray-600">
                  智能合约代码已成功适配到{result.data.platform}平台的{result.data.network}网络，
                  兼容性达到{result.data.compatibility}。建议在部署前进行充分的测试和审计。
                </p>
              </div>
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2">
                  🚀 准备部署
                </button>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8 px-4">
      {/* 页面标题 */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="text-orange-600 text-5xl">⚙️</div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">可编程语言转换引擎</h2>
            <p className="text-xl text-gray-600 font-light italic">Programmable Language Conversion Engine</p>
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
                { id: 'convert', label: '代码转换', icon: '🔄' },
                { id: 'optimize', label: '代码优化', icon: '⚡' },
                { id: 'validate', label: '代码验证', icon: '✅' },
                { id: 'platform', label: '平台适配', icon: '🌐' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-6 py-4 whitespace-nowrap font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 标签页内容 */}
          <div className="p-6">
            {activeTab === 'convert' && <ConvertModule />}
            {activeTab === 'optimize' && <OptimizeModule />}
            {activeTab === 'validate' && <ValidateModule />}
            {activeTab === 'platform' && <PlatformModule />}
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



// 目录项配置 - 分成两组
const menuItemsGroup1 = [
  { id: 'law-parsing', title: 'CAM-CEE', component: <LawParsing /> },
  { id: 'intelligent-matching', title: 'ProvBench', component: <IntelligentMatching /> },
  { id: 'auto-contract-tag', title: 'AutoContractTag', component: <AutoContractTag /> },
  { id: 'doc-trans-pro', title: 'DocTransPro', component: <DocTransPro /> }
];

const menuItemsGroup2 = [
  { id: 'auto-generation', title: 'Sparrow语言', component: <AutoGeneration /> },
  { id: 'compliance-check', title: '可编程语言转换引擎', component: <ComplianceCheck /> }
];

// 合并所有菜单项用于查找
const allMenuItems = [...menuItemsGroup1, ...menuItemsGroup2];

const LawToolchain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState('law-parsing');

  // 获取当前激活的组件
  const ActiveComponent = () => {
    const item = allMenuItems.find(item => item.id === activeMenuItem);
    return item ? item.component : <LawParsing />;
  };

  // 处理菜单点击
  const handleMenuItemClick = (itemId) => {
    setActiveMenuItem(itemId);
    // 使用replace而不是push，避免浏览器历史记录堆积
    navigate(`/law-toolchain#${itemId}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate('/')}>智能合约法律条文诠释原型系统与应用平台 V1.0</h1>
            </div>
            <div className="flex items-center space-x-8">
              {['系统总览', '建模语言', '开发平台', '测试平台', '知识产权'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    switch (item) {
                      case '系统总览':
                        navigate('/');
                        break;
                      case '建模语言':
                        navigate('/modeling-language');
                        break;
                      case '开发平台':
                        navigate('/development-platform');
                        break;
                      case '测试平台':
                        navigate('/testing-platform');
                        break;
                      case '知识产权':
                        navigate('/intellectual-property');
                        break;
                      default:
                        break;
                    }
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors 
                    ${(item === '系统总览' && location.pathname === '/') || 
                    (item === '建模语言' && location.pathname === '/modeling-language')
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'}
                  `}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <div className="flex">
        {/* 左侧目录 */}
        <div className="w-64 bg-white shadow-md sticky top-0 h-screen overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">法条智能处理工具链</h2>
            
            {/* 第一组：前面四个子目录 */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">核心处理模块</h3>
              <nav className="space-y-1">
                {menuItemsGroup1.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors 
                      ${item.id === activeMenuItem
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'}
                    `}
                  >
                    {item.title}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* 第二组：后面两个子目录 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">语言与转换模块</h3>
              <nav className="space-y-1">
                {menuItemsGroup2.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors 
                      ${item.id === activeMenuItem
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'}
                    `}
                  >
                    {item.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* 右侧内容区域 */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawToolchain;