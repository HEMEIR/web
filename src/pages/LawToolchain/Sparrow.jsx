import React, { useState, useEffect } from 'react';
import operateToRoleImage from '@/resource/img/operateToRole.png';

const Sparrow = () => {
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
      return '加载文件失败，请检查文件路径是否正确...';
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
  }, []); // 空依赖数组，确保组件初始化时执行一次

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
    <div className="min-h-screen bg-white py-8 px-4">
      {/* 主要内容区域 */}
      <div className="max-w-6xl mx-auto">
        {/* 功能模块选择 */}
        <div className="bg-indigo-100 rounded-xl shadow-lg overflow-hidden">
          {/* 标签页内容 */}
          <div className="p-6">
            {/* 页面标题 */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="text-purple-600 text-5xl">📝</div>
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Sparrow</h2>
                  <p className="text-lg text-gray-600 font-light italic">Sparrow Design Language</p>
                </div>
              </div>
              <div className="max-w-3xl mx-auto mt-4">
                <p className="text-gray-700 text-lg text-justify">Sparrow基于法律的道义逻辑构建本体模型，秉承继承和封装的原则，受到现有基于抽象概念主义的DSLs的启发，提出将功能模块解耦，并将法律条款的合同元素分类为各类组件。Sparrow的实现过程结合了Xtext项目中的语法定义、Xtend文件中的映射规则以及自动代码生成功能。</p>
              </div>
            </div>
            {/* Sparrow优势区域 */}
            <div className="bg-indigo-50 rounded-xl shadow-md p-6 border border-indigo-100 mb-8">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4 text-center">Sparrow优势：模块解耦，明晰操作与功能角色关系。</h3>
              <div className="flex justify-center">
                <img src={operateToRoleImage} alt="Sparrow优势" className="max-w-full h-auto rounded-lg" />
              </div>
            </div>
            
            {/* 中间控件区域 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              {/* 下拉列表 */}
              <div className="bg-gray-50 p-4 border-b border-gray-200 mb-6">
                <select 
                  className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* 左侧目录 */}
                <div className="md:col-span-1 space-y-4">
                  {/* 目录 */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <ul className="space-y-3">
                      <li>
                        <a 
                          href="#" 
                          className={`transition-colors flex items-center gap-2 p-2 rounded text-lg ${selectedDirectory === 'text' ? 'text-indigo-600 font-medium bg-indigo-100' : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'}`}
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
                          className={`transition-colors flex items-center gap-2 p-2 rounded text-lg ${selectedDirectory === 'model' ? 'text-indigo-600 font-medium bg-indigo-100' : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'}`}
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
                          className="w-full px-3 py-2 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium justify-center mx-auto"
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
                  
                  {/* 独立的Sparrow条款表达区域 */}
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <ul className="space-y-3">
                      <li>
                        <a 
                          href="#" 
                          className="text-lg font-semibold text-indigo-600 transition-colors text-center block"
                          onClick={(e) => {
                            e.preventDefault();
                            // 这里可以添加点击事件处理
                          }}
                        >
                          Sparrow服务条款表达
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#" 
                          className="text-lg font-semibold text-indigo-600 transition-colors text-center block"
                          onClick={(e) => {
                            e.preventDefault();
                            // 这里可以添加点击事件处理
                          }}
                        >
                          Sparrow违约条款表达
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#" 
                          className="text-lg font-semibold text-indigo-600 transition-colors text-center block"
                          onClick={(e) => {
                            e.preventDefault();
                            // 这里可以添加点击事件处理
                          }}
                        >
                          Sparrow终止条款表达
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* 右侧文本区域 */}
                <div className="md:col-span-3">
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 flex">
                      <button 
                        className={`px-4 py-2 text-base font-medium transition-colors ${contentTab === 'terms' ? 'text-indigo-600 bg-white border-b-2 border-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => handleContentTabChange('terms')}
                      >
                        条款
                      </button>
                      <button 
                        className={`px-4 py-2 text-base font-medium transition-colors ${contentTab === 'contract' ? 'text-indigo-600 bg-white border-b-2 border-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => handleContentTabChange('contract')}
                      >
                        合约
                      </button>
                    </div>
                    <textarea 
                      className="w-full border-none px-4 py-3 text-base h-[600px] resize-none bg-white font-mono"
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
    </div>
  );
};

export default Sparrow;