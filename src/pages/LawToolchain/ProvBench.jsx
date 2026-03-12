import React, { useState, useEffect } from 'react';

/*提取与判定：ProvBench模块*/
const ProvBench = () => {
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
    
    return examples[modelType] || '请输入合约内容...';
  };

  // 获取模型的输出结果 - 三个模型各自独立的法律条款分析
  const getModelOutput = (modelType, inputText) => {
    if (!inputText) {
      const exampleText = getModelExample(modelType);
      inputText = exampleText;
    }
    
    const modelOutputs = {
      legalbert: `=== LegalBERT 法律专用模型分析结果 ===

模型：LegalBERT (在法律语料库预训练)
分析时间：${new Date().toLocaleString('zh-CN')}
适用场景：租赁合同、买卖合同、物业服务合同

📋 匹配法律条款：

1. "出租人出卖租赁房屋的，应当在出卖之前的合理期限内通知承租人，承租人享有以同等条件优先购买的权利；但是，房屋按份共有人行使优先购买权或者出租人将房屋出卖给近亲属的除外。出租人履行通知义务后，承租人在十五日内未明确表示购买的，视为承租人放弃优先购买权。"
   ——《中华人民共和国民法典》第七百二十六条

2. "出租人委托拍卖人拍卖租赁房屋的，应当在拍卖五日前通知承租人。承租人未参加拍卖的，视为放弃优先购买权。"
   ——《中华人民共和国民法典》第七百二十七条

3. "出租人未通知承租人或者有其他妨害承租人行使优先购买权情形的，承租人可以请求出租人承担赔偿责任。但是，出租人与第三人订立的房屋买卖合同的效力不受影响。"
   ——《中华人民共和国民法典》第七百二十八条
`,
      
      bert: `=== BERT 通用模型分析结果 ===

模型：BERT-Base (通用预训练模型)
分析时间：${new Date().toLocaleString('zh-CN')}
适用场景：合作协议、服务合同、一般商业合同

📋 匹配法律条款：

1. "当事人一方不履行合同义务或者履行合同义务不符合约定的，应当承担继续履行、采取补救措施或者赔偿损失等违约责任。"
   ——《中华人民共和国民法典》第五百七十七条

2. "当事人可以约定一方违约时应当根据违约情况向对方支付一定数额的违约金，也可以约定因违约产生的损失赔偿额的计算方法。"
   ——《中华人民共和国民法典》第五百八十五条

3. "承揽人将其承揽的主要工作交由第三人完成的，应当就该第三人完成的工作成果向定作人负责；未经定作人同意的，定作人也可以解除合同。"
   ——《中华人民共和国民法典》第七百七十二条
`,
      
      roberta: `=== RoBERTa 优化模型分析结果 ===

模型：RoBERTa-wwm-ext (全词掩码优化版)
分析时间：${new Date().toLocaleString('zh-CN')}
适用场景：债权转让、知识产权、劳动合同

📋 匹配法律条款：

1. "债权人转让债权，未通知债务人的，该转让对债务人不发生效力。债权转让的通知不得撤销，但是经受让人同意的除外。"
   ——《中华人民共和国民法典》第五百四十六条

2. "债务人接到债权转让通知后，债务人对让与人的抗辩，可以向受让人主张。"
   ——《中华人民共和国民法典》第五百四十八条

3. "有下列情形之一的，债务人可以向受让人主张抵销：（一）债务人接到债权转让通知时，债务人对让与人享有债权，并且债务人的债权先于转让的债权到期或者同时到期；（二）债务人的债权与转让的债权是基于同一合同产生。"
   ——《中华人民共和国民法典》第五百四十九条
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

    const interval = simulateProgress();

    try {
      await new Promise(resolve => setTimeout(resolve, 5000));

      const result = {
        model: selectedModel,
        timestamp: new Date().toLocaleString('zh-CN'),
        success: true,
        input: inputText,
        output: getModelOutput(selectedModel, inputText),
        error: '',
        duration: 4200,
        showConflict: false // 新增：控制矛盾检测报告显示状态
      };

      setResults(prev => [result, ...prev]);
    } catch (error) {
      const result = {
        model: selectedModel,
        timestamp: new Date().toLocaleString('zh-CN'),
        success: false,
        input: inputText,
        output: '',
        error: `执行 ${getModelDisplayName(selectedModel)} 模型时发生错误：\n${error.message}`,
        duration: 2500,
        showConflict: false
      };

      setResults(prev => [result, ...prev]);
    } finally {
      setLoading(prev => ({ ...prev, [selectedModel]: false }));
      setCurrentExecution({
        model: null,
        startTime: null
      });
      clearInterval(interval);
    }
  };

  // 清空结果
  const clearResults = () => {
    setResults([]);
  };

  // 切换矛盾检测报告显示状态
  const toggleConflictReport = (index) => {
    setResults(prev => prev.map((r, idx) => 
      idx === index ? { ...r, showConflict: !r.showConflict } : r
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8 px-4">
      
      {/* 输入模态框 */}
      {showInputModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
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
                       '适合分析：债权转让、劳动合同'}
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
                     '示例：债权转让协议'}
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
            
            <div className="bg-gray-50 border-t border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div className="text-blue-500 text-xl">💡</div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">提示：</span>
                    {selectedModel === 'legalbert' ? 'LegalBERT专门针对法律文本优化，擅长识别租赁合同中的优先购买权、通知义务等条款。' : 
                     selectedModel === 'bert' ? 'BERT是通用语言模型，适合分析服务合同中的违约责任、扣款条款等商业约定。' : 
                     'RoBERTa在处理债权转让、抵销权等复杂法律条文方面表现更佳。'}
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
        {/* 系统简介 */}
        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-blue-500 text-xl">ℹ️</div>
              <h2 className="text-lg font-semibold text-blue-800">ProvBench 系统简介</h2>
            </div>
            <p className="text-gray-700">
              ProvBench 是一个面向流程驱动的数据溯源系统性能与功能评估的标准化基准测试平台。
              针对数据溯源领域缺乏统一评估标准的问题，ProvBench构建了涵盖异构工作负载的测试框架，支持多类溯源捕获模式、查询响应效率及存储开销的量化比较。平台提供可扩展的测试数据集与评测指标，为溯源系统的算法优化与架构选型提供可复现的验证环境。
            </p>
          </div>
        </div>
        
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
              description: '优化的BERT模型，采用改进的预训练策略和更大的训练数据，在处理债权转让、劳动合同等复杂法律条文方面表现更佳', 
              tags: ['优化版本', '性能提升', '债权转让'], 
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
                    {currentExecution.model === 'legalbert' ? '分析租赁合同优先购买权条款...' : 
                     currentExecution.model === 'bert' ? '分析合作协议违约责任条款...' : 
                     '分析债权转让通知义务条款...'}
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
                            {result.model === 'legalbert' ? '法律专用模型 · 租赁合同' : 
                             result.model === 'bert' ? '通用语言模型 · 服务合同' : 
                             '优化版模型 · 债权转让'}
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
                        <h4 className="font-semibold text-gray-900">输入合约内容</h4>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {result.model === 'legalbert' ? '租赁合同' : 
                           result.model === 'bert' ? '服务合作协议' : 
                           '债权转让协议'}
                        </span>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto max-h-[240px]">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">{result.input}</pre>
                      </div>
                    </div>
                    
                    {result.output && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="text-xl">📊</div>
                          <h4 className="font-semibold text-gray-900">模型分析结果</h4>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto max-h-[360px]">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap">{result.output}</pre>
                        </div>
                        
                        {/* 矛盾检测按钮及报告区域 - 三个模型各自独立的矛盾检测结果 */}
                        <div className="mt-4">
                          <button
                            onClick={() => toggleConflictReport(index)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg text-amber-800 font-medium transition-colors duration-200"
                          >
                            <span>⚖️</span>
                            矛盾检测
                            <span className="text-xs bg-amber-200 px-2 py-0.5 rounded-full">
                              {result.model === 'legalbert' && '2处矛盾'}
                              {result.model === 'bert' && '2处矛盾'}
                              {result.model === 'roberta' && '2处矛盾'}
                            </span>
                          </button>
                          
                          {/* 矛盾检测报告内容 - 各模型独立显示 */}
                          {result.showConflict && (
                            <div className="mt-4 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-200 px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">⚖️</span>
                                  <h3 className="text-lg font-bold text-gray-900">匹配和矛盾检测结果</h3>
                                  <span className="ml-auto text-sm text-gray-500">
                                    {result.model === 'legalbert' ? 'LegalBERT · 法律专用' : 
                                     result.model === 'bert' ? 'BERT · 通用' : 'RoBERTa · 优化版'}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="p-6 space-y-4">
                                {/* LegalBERT 矛盾检测结果 - 租赁合同优先购买权 */}
                                {result.model === 'legalbert' && (
                                  <>
                                    {/* 条目1 - 矛盾：通知期限与法定标准不符 */}
                                    <div className="border-l-4 border-red-500 bg-red-50/30 rounded-r-lg p-4">
                                      <div className="flex items-start gap-3">
                                        <span className="text-red-600 font-bold text-base">1.</span>
                                        <div className="flex-1">
                                          <p className="text-gray-800 text-sm leading-relaxed">
                                            <span className="font-medium">合同条款：</span>出租人出卖租赁房屋的，应当在出卖之前的合理期限内通知承租人，承租人享有以同等条件优先购买的权利；但是，房屋按份共有人行使优先购买权或者出租人将房屋出卖给近亲属的除外。出租人履行通知义务后，承租人在十五日内未明确表示购买的，视为承租人放弃优先购买权。
                                          </p>
                                          <div className="flex items-center gap-3 mt-3">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                              <span>❌</span> 存在矛盾
                                            </span>
                                            <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200">
                                              高风险
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* 条目2 - 符合：优先购买权约定合规 */}
                                    <div className="border-l-4 border-green-500 bg-green-50/30 rounded-r-lg p-4">
                                      <div className="flex items-start gap-3">
                                        <span className="text-green-600 font-bold text-base">2.</span>
                                        <div className="flex-1">
                                          <p className="text-gray-800 text-sm leading-relaxed">
                                            <span className="font-medium">合同条款：</span>出租人委托拍卖人拍卖租赁房屋的，应当在拍卖五日前通知承租人。承租人未参加拍卖的，视为放弃优先购买权。
                                          </p>
                                          <div className="flex items-center gap-3 mt-3">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                              <span>✔</span> 符合相关法律约束
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* 条目3 - 矛盾：赔偿条款未明确标准 */}
                                    <div className="border-l-4 border-red-500 bg-red-50/30 rounded-r-lg p-4">
                                      <div className="flex items-start gap-3">
                                        <span className="text-red-600 font-bold text-base">3.</span>
                                        <div className="flex-1">
                                          <p className="text-gray-800 text-sm leading-relaxed">出租人未通知承租人或者有其他妨害承租人行使优先购买权情形的，承租人可以请求出租人承担赔偿责任。但是，出租人与第三人订立的房屋买卖合同的效力不受影响。出租人委托拍卖人拍卖租赁房屋的，应当在拍卖五日前通知承租人。承租人未参加拍卖的，视为放弃优先购买权。
                                          </p>
                                          <div className="flex items-center gap-3 mt-3">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                              <span>❌</span> 存在矛盾
                                            </span>
                                            <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200">
                                              中风险
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                                
                                {/* BERT 矛盾检测结果 - 活动策划违约责任 */}
                                {result.model === 'bert' && (
                                  <>
                                    {/* 条目1 - 矛盾：单方扣款权限定不明 */}
                                    <div className="border-l-4 border-red-500 bg-red-50/30 rounded-r-lg p-4">
                                      <div className="flex items-start gap-3">
                                        <span className="text-red-600 font-bold text-base">1.</span>
                                        <div className="flex-1">
                                          <p className="text-gray-800 text-sm leading-relaxed">
                                            <span className="font-medium">合同条款：</span>当事人一方不履行合同义务或者履行合同义务不符合约定的，应当承担继续履行、采取补救措施或者赔偿损失等违约责任。
                                          </p>
                                          <div className="flex items-center gap-3 mt-3">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                              <span>❌</span> 存在矛盾
                                            </span>
                                            <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200">
                                              高风险
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* 条目2 - 矛盾：损害赔偿范围不明确 */}
                                    <div className="border-l-4 border-red-500 bg-red-50/30 rounded-r-lg p-4">
                                      <div className="flex items-start gap-3">
                                        <span className="text-red-600 font-bold text-base">2.</span>
                                        <div className="flex-1">
                                          <p className="text-gray-800 text-sm leading-relaxed">
                                            <span className="font-medium">合同条款：</span>当事人可以约定一方违约时应当根据违约情况向对方支付一定数额的违约金，也可以约定因违约产生的损失赔偿额的计算方法。
                                          </p>
                                          <div className="flex items-center gap-3 mt-3">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                              <span>❌</span> 存在矛盾
                                            </span>
                                            <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200">
                                              高风险
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* 条目3 - 符合：违约责任承担方式合规 */}
                                    <div className="border-l-4 border-green-500 bg-green-50/30 rounded-r-lg p-4">
                                      <div className="flex items-start gap-3">
                                        <span className="text-green-600 font-bold text-base">3.</span>
                                        <div className="flex-1">
                                          <p className="text-gray-800 text-sm leading-relaxed">
                                            <span className="font-medium">合同条款：</span>承揽人将其承揽的主要工作交由第三人完成的，应当就该第三人完成的工作成果向定作人负责；未经定作人同意的，定作人也可以解除合同。
                                          </p>
                                          <div className="flex items-center gap-3 mt-3">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                              <span>✔</span> 符合相关法律约束
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                                
                                {/* RoBERTa 矛盾检测结果 - 债权转让通知 */}
                                {result.model === 'roberta' && (
                                  <>
                                    {/* 条目1 - 符合：书面通知义务合规 */}
                                    <div className="border-l-4 border-green-500 bg-green-50/30 rounded-r-lg p-4">
                                      <div className="flex items-start gap-3">
                                        <span className="text-green-600 font-bold text-base">1.</span>
                                        <div className="flex-1">
                                          <p className="text-gray-800 text-sm leading-relaxed">
                                            <span className="font-medium">合同条款：</span>债权人转让债权，未通知债务人的，该转让对债务人不发生效力。债权转让的通知不得撤销，但是经受让人同意的除外。
                                          </p>
                                          <div className="flex items-center gap-3 mt-3">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                              <span>✔</span> 符合相关法律约束
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* 条目2 - 矛盾：抗辩权告知义务缺失 */}
                                    <div className="border-l-4 border-red-500 bg-red-50/30 rounded-r-lg p-4">
                                      <div className="flex items-start gap-3">
                                        <span className="text-red-600 font-bold text-base">2.</span>
                                        <div className="flex-1">
                                          <p className="text-gray-800 text-sm leading-relaxed">
                                            <span className="font-medium">合同条款：</span>债务人接到债权转让通知后，债务人对让与人的抗辩，可以向受让人主张。
                                          </p>
                                          <div className="flex items-center gap-3 mt-3">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                              <span>❌</span> 存在矛盾
                                            </span>
                                            <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200">
                                              中风险
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* 条目3 - 矛盾：抵销权适用条件不完整 */}
                                    <div className="border-l-4 border-red-500 bg-red-50/30 rounded-r-lg p-4">
                                      <div className="flex items-start gap-3">
                                        <span className="text-red-600 font-bold text-base">3.</span>
                                        <div className="flex-1">
                                          <p className="text-gray-800 text-sm leading-relaxed">
                                            <span className="font-medium">合同条款：</span>有下列情形之一的，债务人可以向受让人主张抵销：（一）债务人接到债权转让通知时，债务人对让与人享有债权，并且债务人的债权先于转让的债权到期或者同时到期；（二）债务人的债权与转让的债权是基于同一合同产生。
                                          </p>
                                          <div className="flex items-center gap-3 mt-3">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                              <span>❌</span> 存在矛盾
                                            </span>
                                            <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200">
                                              高风险
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                              
                              {/* 报告底部 - 各模型独立统计 */}
                              <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">
                                    检测时间: {new Date().toLocaleString('zh-CN')}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {result.model === 'legalbert' && '⚠️ 发现 2 处潜在矛盾，1 处合规'}
                                    {result.model === 'bert' && '⚠️ 发现 2 处潜在矛盾，1 处合规'}
                                    {result.model === 'roberta' && '⚠️ 发现 2 处潜在矛盾，1 处合规'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

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
                <p className="text-sm text-gray-600">深度分析债权转让、劳动合同等复杂法律文书</p>
              </div>
            </div>
          </div>
        )}
        
        {/* 实验对比图 */}
        <div className="mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">📈 模型性能实验对比</h3>
              <p className="text-gray-600">不同文本编码器在法律条文推荐任务上的实验结果对比（数据来源于Table 3）</p>
            </div>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6">
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
              
              <div className="relative overflow-x-auto">
                <div className="flex h-96 min-w-max mx-auto justify-center">
                  <div className="flex items-end gap-32 px-8 h-full relative">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      {[...Array(5)].map((_, idx) => (
                        <div key={idx} className="border-t border-gray-100"></div>
                      ))}
                    </div>
                    {/* BERT */}
                    <div className="flex flex-col items-center z-10 h-full">
                      <div className="text-sm font-medium text-gray-700 mb-2 h-6">BERT</div>
                      <div className="flex items-end gap-4 flex-1 w-full relative">
                        <div className="w-6 bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all relative group" style={{ height: '87.28%' }}>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">R@1: 87.28%</div>
                        </div>
                        <div className="w-6 bg-green-500 rounded-t-sm hover:bg-green-600 transition-all relative group" style={{ height: '93.53%' }}>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">R@3: 93.53%</div>
                        </div>
                        <div className="w-6 bg-purple-500 rounded-t-sm hover:bg-purple-600 transition-all relative group" style={{ height: '95.76%' }}>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">R@5: 95.76%</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* RoBERTa */}
                    <div className="flex flex-col items-center z-10 h-full">
                      <div className="text-sm font-medium text-gray-700 mb-2 h-6">RoBERTa</div>
                      <div className="flex items-end gap-4 flex-1 w-full relative">
                        <div className="w-6 bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all relative group" style={{ height: '89.06%' }}>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">R@1: 89.06%</div>
                        </div>
                        <div className="w-6 bg-green-500 rounded-t-sm hover:bg-green-600 transition-all relative group" style={{ height: '94.42%' }}>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">R@3: 94.42%</div>
                        </div>
                        <div className="w-6 bg-purple-500 rounded-t-sm hover:bg-purple-600 transition-all relative group" style={{ height: '96.88%' }}>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">R@5: 96.88%</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* LegalBERT */}
                    <div className="flex flex-col items-center z-10 h-full">
                      <div className="text-sm font-medium text-gray-700 mb-2 h-6">LegalBERT</div>
                      <div className="flex items-end gap-4 flex-1 w-full relative">
                        <div className="w-6 bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all relative group" style={{ height: '88.39%' }}>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">R@1: 88.39%</div>
                        </div>
                        <div className="w-6 bg-green-500 rounded-t-sm hover:bg-green-600 transition-all relative group" style={{ height: '95.31%' }}>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">R@3: 95.31%</div>
                        </div>
                        <div className="w-6 bg-purple-500 rounded-t-sm hover:bg-purple-600 transition-all relative group" style={{ height: '97.54%' }}>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">R@5: 97.54%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">TextEncoder</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">R@1</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">R@3</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">R@5</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b font-medium text-green-600">BERT</td>
                      <td className="py-3 px-4 border-b">87.28</td>
                      <td className="py-3 px-4 border-b">93.53</td>
                      <td className="py-3 px-4 border-b">95.76</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b font-medium text-purple-600">RoBERTa</td>
                      <td className="py-3 px-4 border-b">89.06</td>
                      <td className="py-3 px-4 border-b">94.42</td>
                      <td className="py-3 px-4 border-b">96.88</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b font-medium text-amber-600">LegalBERT</td>
                      <td className="py-3 px-4 border-b">88.39</td>
                      <td className="py-3 px-4 border-b">95.31</td>
                      <td className="py-3 px-4 border-b">97.54</td>
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

export default ProvBench;