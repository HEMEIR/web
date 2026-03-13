import React, { useState, useEffect } from 'react';

const ApplicationScenarios = () => {
  // 文本区域内容状态
  const [termsContent, setTermsContent] = React.useState('');
  const [contractTabContent, setContractTabContent] = React.useState('');
  const [solidityContent, setSolidityContent] = React.useState('');
  const [goContent, setGoContent] = React.useState('');
  const [vyperContent, setVyperContent] = React.useState('');
  const [contentTab, setContentTab] = React.useState('code'); // terms 表示条文，contract 表示合约，solidity, go, vyper, code
  const [selectedDirectory, setSelectedDirectory] = React.useState('model'); // model, conversion
  const [selectedOption, setSelectedOption] = React.useState(''); // 空字符串表示默认选项



  // 加载文件内容
  const loadFileContent = async (filePath) => {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.text();
    } catch (error) {
      console.error('Error loading file:', error);
      return '加载文件失败，请重试...';
    }
  };

  // 更新内容
  const updateContent = async (option, directory, tab) => {
    if (!option) return;
    
    let filePath = '';
    
    if (directory === 'model') {
      // Sparrow目录
      filePath = `/codeSource/applicationScenarios/sparrow/${option}.sparrow`;
      const content = await loadFileContent(filePath);
      setContractTabContent(content);
    } else if (directory === 'conversion') {
      // conversion目录
      if (tab === 'solidity') {
        filePath = `/codeSource/applicationScenarios/solidity/${option}.sol`;
        const content = await loadFileContent(filePath);
        setSolidityContent(content);
      } else if (tab === 'go') {
        filePath = `/codeSource/applicationScenarios/go/${option}.go`;
        const content = await loadFileContent(filePath);
        setGoContent(content);
      } else if (tab === 'vyper') {
        filePath = `/codeSource/applicationScenarios/vyper/${option}.vy`;
        const content = await loadFileContent(filePath);
        setVyperContent(content);
      }
    }
  };

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

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      {/* 主要内容区域 */}
      <div className="max-w-6xl mx-auto">
        {/* 功能模块选择 */}
        <div className="bg-purple-100 rounded-xl shadow-lg overflow-hidden">
          {/* 标签页内容 */}
          <div className="p-6">
            {/* 页面标题 */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="text-purple-600 text-5xl">📝</div>
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">应用场景</h2>
                  <p className="text-lg text-gray-600 font-light italic">Application Scenarios</p>
                </div>
              </div>
              <div className="max-w-3xl mx-auto mt-4">
                <p className="text-gray-700 text-lg text-justify">应用场景页面允许您选择不同的合约场景类型，查看对应的Sparrow设计语言代码及其转换为Solidity、Go、Vyper等语言的代码实现。您可以通过左侧目录切换不同的视图，并使用导出按钮保存代码内容。</p>
              </div>
            </div>

            {/* 中间控件区域 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              {/* 下拉列表 */}
              <div className="bg-gray-50 p-4 border-b border-gray-200 mb-6">
                <select 
                  className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={selectedOption}
                  onChange={handleOptionChange}
                  style={{
                    color: selectedOption ? 'inherit' : '#9CA3AF'
                  }}
                >
                  <option value="" disabled hidden>请选择场景类型</option>
                  <option value="AirConditionerPurchase">AirConditionerPurchase</option>
                  <option value="CarRent">CarRent</option>
                  <option value="ComputerPurchase">ComputerPurchase</option>
                  <option value="DaliyPurchase">DaliyPurchase</option>
                  <option value="ElectricVehiclePurchase">ElectricVehiclePurchase</option>
                  <option value="FertilizerPurchase">FertilizerPurchase</option>
                  <option value="HouseRent">HouseRent</option>
                  <option value="LightRent">LightRent</option>
                  <option value="PaperPurchase">PaperPurchase</option>
                  <option value="PrinterPurchase">PrinterPurchase</option>
                </select>
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
                      <li>
                        <a 
                          href="#" 
                          className={`transition-colors flex items-center gap-2 p-2 rounded text-lg ${selectedDirectory === 'conversion' ? 'text-purple-600 font-medium bg-purple-100' : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleDirectoryClick('conversion');
                          }}
                        >
                          <span>🔄</span>
                          <span>conversion</span>
                        </a>
                      </li>

                      
                      {/* 导出按钮 */}
                      <li className="pt-4">
                        <button 
                          className="w-1/2 px-3 py-2 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium justify-center mx-auto"
                          onClick={() => {
                            let content;
                            if (selectedDirectory === 'conversion') {
                              if (contentTab === 'solidity') {
                                content = solidityContent;
                              } else if (contentTab === 'go') {
                                content = goContent;
                              } else if (contentTab === 'vyper') {
                                content = vyperContent;
                              }
                            } else {
                              content = contentTab === 'terms' ? termsContent : contractTabContent;
                            }
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
                      {selectedDirectory === 'conversion' ? (
                        <>
                          <button 
                            className={`px-4 py-2 text-base font-medium transition-colors ${contentTab === 'solidity' ? 'text-purple-600 bg-white border-b-2 border-purple-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => handleContentTabChange('solidity')}
                          >
                            Solidity
                          </button>
                          <button 
                            className={`px-4 py-2 text-base font-medium transition-colors ${contentTab === 'go' ? 'text-purple-600 bg-white border-b-2 border-purple-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => handleContentTabChange('go')}
                          >
                            Go
                          </button>
                          <button 
                            className={`px-4 py-2 text-base font-medium transition-colors ${contentTab === 'vyper' ? 'text-purple-600 bg-white border-b-2 border-purple-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => handleContentTabChange('vyper')}
                          >
                            Vyper
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className={`px-4 py-2 text-base font-medium transition-colors ${contentTab === 'code' ? 'text-purple-600 bg-white border-b-2 border-purple-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => handleContentTabChange('code')}
                          >
                            code
                          </button>
                        </>
                      )}
                    </div>
                    <textarea 
                      className="w-full border-none px-4 py-3 text-base h-[480px] resize-none bg-white font-mono"
                      value={selectedDirectory === 'conversion' ? (
                        contentTab === 'solidity' ? solidityContent : 
                        contentTab === 'go' ? goContent : 
                        vyperContent
                      ) : (
                        contractTabContent
                      )}
                      onChange={(e) => {
                        if (selectedDirectory === 'conversion') {
                          if (contentTab === 'solidity') {
                            setSolidityContent(e.target.value);
                          } else if (contentTab === 'go') {
                            setGoContent(e.target.value);
                          } else if (contentTab === 'vyper') {
                            setVyperContent(e.target.value);
                          }
                        } else {
                          setContractTabContent(e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationScenarios;