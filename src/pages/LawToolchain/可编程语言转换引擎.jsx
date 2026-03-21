import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

// 全局样式
const globalStyles = {
  body: {
    margin: 0,
    padding: 0,
    width: '100%',
    minHeight: '100vh'
  }
};

// 应用全局样式
if (typeof document !== 'undefined') {
  Object.assign(document.body.style, globalStyles.body);
}

// 单语言转换模块
const ConvertModule = ({ sourceLanguage, setSourceLanguage, targetCode, setTargetCode }) => {
  const [sourceCode, setSourceCode] = React.useState('');
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
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h3 className="text-lg font-semibold text-orange-800 mb-3">单语言转换</h3>
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
              <option value="" disabled hidden>请选择语言类型</option>
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
                    className={`transition-colors flex items-center gap-2 p-2 rounded text-lg ${selectedDirectory === 'source' ? 'text-orange-600 font-medium bg-orange-100' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'}`}
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
                    className={`transition-colors flex items-center gap-2 p-2 rounded text-lg ${selectedDirectory === 'logic' ? 'text-orange-600 font-medium bg-orange-100' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDirectoryClick('logic');
                    }}
                  >
                    <span>🔄</span>
                    <span>转换逻辑</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className={`transition-colors flex items-center gap-2 p-2 rounded text-lg ${selectedDirectory === 'solidity' ? 'text-orange-600 font-medium bg-orange-100' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDirectoryClick('solidity');
                    }}
                  >
                    <span>🔗</span>
                    <span>Solidity</span>
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
      </div>
      
      {/* 转换分析区域 */}
      {(sourceLanguage === 'bpmn' || sourceLanguage === 'fsm') && targetCode && (
        <div className="space-y-6">
          {/* 第一行：转换准确率比较和转换一致性比较 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 转换准确率比较 */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
              <h4 className="text-lg font-semibold text-green-800 mb-4">转换准确率比较</h4>
              <div className="h-64">
                <ReactECharts
                  option={{
                    tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                        type: 'shadow'
                      },
                      formatter: '{b}: {c}%'
                    },
                    grid: {
                      left: '3%',
                      right: '4%',
                      bottom: '3%',
                      containLabel: true
                    },
                    xAxis: {
                      type: 'category',
                      data: sourceLanguage === 'fsm' ? ['指标要求', 'GPT-4o', 'Gemini', 'LLaMA3'] : ['指标要求', 'GPT-3.5', 'GPT-4.0', 'Gemini']
                    },
                    yAxis: {
                      type: 'value',
                      min: 80,
                      max: 100,
                      axisLabel: {
                        formatter: '{value}%'
                      }
                    },
                    series: [
                      {
                        name: '准确率',
                        type: 'bar',
                        data: sourceLanguage === 'fsm' ? [85, 94.39, 92.82, 88.35] : [85, 98.5, 98.5, 97.1],
                        itemStyle: {
                          color: function(params) {
                            const colors = ['#1890ff', '#52c41a', '#faad14', '#722ed1'];
                            return colors[params.dataIndex];
                          }
                        },
                        label: {
                          show: true,
                          position: 'top',
                          formatter: '{c}%'
                        }
                      }
                    ]
                  }}
                  style={{ height: '100%', width: '100%' }}
                />
              </div>
            </div>
            
            {/* 转换一致性比较 */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
              <h4 className="text-lg font-semibold text-green-800 mb-4">转换一致性比较</h4>
              <div className="h-64">
                <ReactECharts
                  option={{
                    tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                        type: 'shadow'
                      },
                      formatter: '{b}: {c}%'
                    },
                    grid: {
                      left: '3%',
                      right: '4%',
                      bottom: '3%',
                      containLabel: true
                    },
                    xAxis: {
                      type: 'category',
                      data: sourceLanguage === 'fsm' ? ['指标要求', 'GPT-4o', 'Gemini', 'LLaMA3'] : ['指标要求', 'GPT-3.5', 'GPT-4.0', 'Gemini']
                    },
                    yAxis: {
                      type: 'value',
                      min: 80,
                      max: 100,
                      axisLabel: {
                        formatter: '{value}%'
                      }
                    },
                    series: [
                      {
                        name: '一致性',
                        type: 'bar',
                        data: sourceLanguage === 'bpmn' ? [90, 97.9, 99.2, 98.2] : (sourceLanguage === 'fsm' ? [90, 92.53, 94.57, 92.16] : [85, 98.5, 98.5, 97.1]),
                        itemStyle: {
                          color: function(params) {
                            const colors = ['#1890ff', '#52c41a', '#faad14', '#722ed1'];
                            return colors[params.dataIndex];
                          }
                        },
                        label: {
                          show: true,
                          position: 'top',
                          formatter: '{c}%'
                        }
                      }
                    ]
                  }}
                  style={{ height: '100%', width: '100%' }}
                />
              </div>
            </div>
          </div>
          
          {/* 第二行：转换准确率 */}
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
          
          {/* 第三行：转换一致性 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
            <h4 className="text-lg font-semibold text-green-800 mb-4">转换一致性</h4>
            <div className="flex justify-center items-center py-4">
              {sourceLanguage === 'bpmn' ? (
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
              ) : (
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 编译器模块
const CompilerModule = ({ 
  result: compilerResult, 
  setResult: setCompilerResult, 
  error: compilerError, 
  setError: setCompilerError, 
  loading: compilerLoading, 
  setLoading: setCompilerLoading,
  showCorrectCode,
  setShowCorrectCode
}) => {
  const [language, setLanguage] = React.useState('');
  const [code, setCode] = React.useState('');
  const [correctCode, setCorrectCode] = React.useState('');
  
  // 正确代码位置状态
  const [correctCodePosition, setCorrectCodePosition] = React.useState({
    x: (window.innerWidth - 800) / 2, // 初始位置，水平居中
    y: (window.innerHeight - 600) / 2 // 初始位置，垂直居中
  });
  
  // 拖拽相关状态
  const [isDraggingCorrectCode, setIsDraggingCorrectCode] = React.useState(false);
  const [correctCodeDragStart, setCorrectCodeDragStart] = React.useState({ x: 0, y: 0 });
  
  // 处理关闭正确代码
  const handleCloseCorrectCode = () => {
    setShowCorrectCode(false);
  };
  
  // 处理正确代码鼠标按下事件
  const handleCorrectCodeMouseDown = (e) => {
    // 只有鼠标左键或右键按下时才开始拖拽
    if (e.button === 0 || e.button === 2) {
      setIsDraggingCorrectCode(true);
      setCorrectCodeDragStart({
        x: e.clientX - correctCodePosition.x,
        y: e.clientY - correctCodePosition.y
      });
    }
  };
  
  // 处理正确代码鼠标移动事件
  const handleCorrectCodeMouseMove = (e) => {
    if (isDraggingCorrectCode) {
      setCorrectCodePosition({
        x: e.clientX - correctCodeDragStart.x,
        y: e.clientY - correctCodeDragStart.y
      });
    }
  };
  
  // 处理正确代码鼠标释放事件
  const handleCorrectCodeMouseUp = () => {
    setIsDraggingCorrectCode(false);
  };
  
  // 处理正确代码鼠标离开事件
  const handleCorrectCodeMouseLeave = () => {
    setIsDraggingCorrectCode(false);
  };
  
  // 添加全局鼠标事件监听
  React.useEffect(() => {
    if (isDraggingCorrectCode) {
      document.addEventListener('mousemove', handleCorrectCodeMouseMove);
      document.addEventListener('mouseup', handleCorrectCodeMouseUp);
      document.addEventListener('mouseleave', handleCorrectCodeMouseLeave);
      
      return () => {
        document.removeEventListener('mousemove', handleCorrectCodeMouseMove);
        document.removeEventListener('mouseup', handleCorrectCodeMouseUp);
        document.removeEventListener('mouseleave', handleCorrectCodeMouseLeave);
      };
    }
  }, [isDraggingCorrectCode, correctCodeDragStart, correctCodePosition]);
  
  // 为了保持代码兼容性，创建本地引用
  const result = compilerResult;
  const setResult = setCompilerResult;
  const error = compilerError;
  const setError = setCompilerError;
  const loading = compilerLoading;
  const setLoading = setCompilerLoading;
  


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

  // 纠错语法处理
  const handleCorrectSyntax = async () => {
    if (!code) {
      setError('请输入或上传代码');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 调用后端语法纠错API
      const response = await fetch('/api/correct-syntax', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ language, code })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '纠错失败');
      }

      const data = await response.json();
      const { correctedCode } = data;

      setCorrectCode(correctedCode);
      setShowCorrectCode(true);
    } catch (err) {
      setError(`纠错失败：${err.message}`);
    } finally {
      setLoading(false);
    }
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
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h3 className="text-lg font-semibold text-orange-800 mb-3">编译器</h3>
        <p className="text-gray-700 mb-4">上传或输入Go语言和Vyper语言的代码，进行编译运行，查看编译结果。</p>
        
        <div className="flex flex-wrap items-end gap-4 mb-6">
          <div className="w-1/2 max-w-[200px]">
            <label className="block text-base font-medium text-gray-700 mb-2">语言选择</label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ color: language ? '' : '#9ca3af' }}
            >
              <option value="" disabled hidden>请选择语言类型</option>
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
          {/* 原始代码输入 */}
          <div>
            {/* 代码输入 */}
            <div style={{ width: '66.67%' }}>
              <label className="block text-base font-medium text-gray-700 mb-2">代码输入</label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="relative">
                  <textarea
                    className="w-full border-none px-4 py-3 text-base h-96 resize-none bg-white z-10 relative font-mono"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder=""
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <button 
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
            onClick={handleCorrectSyntax}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                纠错中...
              </>
            ) : (
              <>
                ✏️
                纠错语法
              </>
            )}
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
      </div>
      
      {/* 正确代码输出 - 只在点击纠错语法后出现，位于白色背景区域内 */}
      {showCorrectCode && (
        <div 
          className="fixed z-50" 
          style={{
            left: correctCodePosition.x,
            top: correctCodePosition.y,
            width: '800px', // 宽度与编译运行结果一致
            cursor: isDraggingCorrectCode ? 'grabbing' : 'grab'
          }}
        >
          <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200 relative">
            <div 
              className="flex justify-between items-center mb-4" 
              onMouseDown={handleCorrectCodeMouseDown}
            >
              <h4 className="text-lg font-semibold text-blue-800">正确代码</h4>
              <button 
                className="text-gray-400 hover:text-red-600 transition-colors"
                onClick={handleCloseCorrectCode}
              >
                ✕
              </button>
            </div>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="relative">
                <textarea
                  className="w-full border-none px-4 py-3 text-base h-96 resize-none bg-gray-50 z-10 relative font-mono"
                  value={correctCode}
                  readOnly
                  placeholder=""
                  spellCheck={false}
                />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

// 多语言转换模块
const MultiConvertModule = () => {
  const [sourceCode, setSourceCode] = React.useState('');
  const [goCode, setGoCode] = React.useState('');
  const [vyperCode, setVyperCode] = React.useState('');
  const [solidityCode, setSolidityCode] = React.useState('');
  const [sourceLanguage, setSourceLanguage] = React.useState('');
  const [localLoading, setLocalLoading] = React.useState(false);
  const [selectedDirectory, setSelectedDirectory] = React.useState('source');
  const [logicCode, setLogicCode] = React.useState('');
  const [selectedTargetLanguage, setSelectedTargetLanguage] = React.useState('solidity');

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
    'sparrow-purchase-solidity': {
      input: '/codeSource/codeToCode/sparrowToSolidity/03complexPurchase.mydsl',
      output: '/codeSource/codeToCode/sparrowToSolidity/03complexPurchase.sol'
    },
    'sparrow-auction-go': {
      input: '/codeSource/codeToCode/sparrowToGo/06complexAuction.sparrow',
      output: '/codeSource/codeToCode/sparrowToGo/complexAuction.go'
    },
    'sparrow-auction-vyper': {
      input: '/codeSource/codeToCode/sparrowToVyper/06complexAuction.sparrow',
      output: '/codeSource/codeToCode/sparrowToVyper/complexAuction.vy'
    },
    'sparrow-auction-solidity': {
      input: '/codeSource/codeToCode/sparrowToSolidity/06complexAuction.mydsl',
      output: '/codeSource/codeToCode/sparrowToSolidity/06complexAuction.sol'
    },
    'sparrow-rent-go': {
      input: '/codeSource/codeToCode/sparrowToGo/09complexRent.sparrow',
      output: '/codeSource/codeToCode/sparrowToGo/complexRent.go'
    },
    'sparrow-rent-vyper': {
      input: '/codeSource/codeToCode/sparrowToVyper/09complexRent.sparrow',
      output: '/codeSource/codeToCode/sparrowToVyper/complexRent.vy'
    },
    'sparrow-rent-solidity': {
      input: '/codeSource/codeToCode/sparrowToSolidity/09complexRent.mydsl',
      output: '/codeSource/codeToCode/sparrowToSolidity/09complexRent.sol'
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
        const solidityKey = `${sourceLanguage}-solidity`;
        
        const goPaths = filePaths[goKey];
        const vyperPaths = filePaths[vyperKey];
        const solidityPaths = filePaths[solidityKey];
        
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
        
        if (solidityPaths) {
          // 加载Solidity输出文件内容
          const solidityOutputContent = await loadFileContent(solidityPaths.output);
          setSolidityCode(solidityOutputContent);
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
      const solidityKey = `${sourceLanguage}-solidity`;
      
      const goPaths = filePaths[goKey];
      const vyperPaths = filePaths[vyperKey];
      const solidityPaths = filePaths[solidityKey];
      
      if (goPaths) {
        const goOutputContent = await loadFileContent(goPaths.output);
        setGoCode(goOutputContent);
      }
      
      if (vyperPaths) {
        const vyperOutputContent = await loadFileContent(vyperPaths.output);
        setVyperCode(vyperOutputContent);
      }
      
      if (solidityPaths) {
        const solidityOutputContent = await loadFileContent(solidityPaths.output);
        setSolidityCode(solidityOutputContent);
      }
    } catch (error) {
      console.error('多语言转换失败:', error);
      setGoCode('多语言转换失败，请稍后重试');
      setVyperCode('多语言转换失败，请稍后重试');
      setSolidityCode('多语言转换失败，请稍后重试');
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
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h3 className="text-lg font-semibold text-orange-800 mb-3">多语言转换</h3>
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
              <option value="" disabled hidden>请选择语言类型</option>
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
                    className={`transition-colors flex items-center gap-2 p-2 rounded text-lg ${selectedDirectory === 'source' ? 'text-orange-600 font-medium bg-orange-100' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'}`}
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
                    className={`transition-colors flex items-center gap-2 p-2 rounded text-lg ${selectedDirectory === 'logic' ? 'text-orange-600 font-medium bg-orange-100' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDirectoryClick('logic');
                    }}
                  >
                    <span>🧠</span>
                    <span>转换逻辑</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className={`transition-colors flex items-center gap-2 p-2 rounded text-lg ${selectedDirectory === 'convert' ? 'text-orange-600 font-medium bg-orange-100' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDirectoryClick('convert');
                    }}
                  >
                    <span>🔄</span>
                    <span>转换</span>
                  </a>
                </li>
                
                <li className="pt-4">
                  <button 
                    className="w-1/2 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium justify-center mx-auto"
                    onClick={() => {
                      let content = '';
                      let filename = '';
                      
                      if (selectedDirectory === 'source') {
                        content = sourceCode;
                        filename = `source_${Date.now()}.txt`;
                      } else if (selectedDirectory === 'logic') {
                        content = logicCode;
                        filename = `logic_${Date.now()}.txt`;
                      } else if (selectedDirectory === 'convert') {
                        if (selectedTargetLanguage === 'go') {
                          content = goCode;
                        } else if (selectedTargetLanguage === 'vyper') {
                          content = vyperCode;
                        } else if (selectedTargetLanguage === 'solidity') {
                          content = solidityCode;
                        }
                        filename = `${selectedTargetLanguage}_output_${Date.now()}.txt`;
                      }
                      
                      if (!content) return;
                      
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = filename;
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
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 flex items-center px-4 py-2">
                  <div className="flex gap-4">
                    <button
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${selectedTargetLanguage === 'solidity' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                      onClick={() => setSelectedTargetLanguage('solidity')}
                    >
                      Solidity
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${selectedTargetLanguage === 'go' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                      onClick={() => setSelectedTargetLanguage('go')}
                    >
                      Go
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${selectedTargetLanguage === 'vyper' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                      onClick={() => setSelectedTargetLanguage('vyper')}
                    >
                      Vyper
                    </button>
                  </div>
                </div>
                <textarea
                  className="w-full border-none px-4 py-3 text-base h-[480px] resize-none bg-white font-mono"
                  value={selectedTargetLanguage === 'go' ? goCode : selectedTargetLanguage === 'vyper' ? vyperCode : solidityCode}
                  onChange={(e) => {
                    if (selectedTargetLanguage === 'go') {
                      setGoCode(e.target.value);
                    } else if (selectedTargetLanguage === 'vyper') {
                      setVyperCode(e.target.value);
                    } else if (selectedTargetLanguage === 'solidity') {
                      setSolidityCode(e.target.value);
                    }
                  }}
                  placeholder=""
                  spellCheck={false}
                />
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

const ProgrammableLanguageConversionEngine = () => {
  // 响应式数据
  const [activeTab, setActiveTab] = React.useState('convert');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState('');
  
  // 单语言转换相关状态
  const [sourceLanguage, setSourceLanguage] = React.useState('');
  const [targetCode, setTargetCode] = React.useState('');
  
  // 编译器相关状态
  const [compilerResult, setCompilerResult] = React.useState('');
  const [compilerError, setCompilerError] = React.useState('');
  const [compilerLoading, setCompilerLoading] = React.useState(false);
  const [showCorrectCode, setShowCorrectCode] = React.useState(false);
  
  // 处理关闭编译结果
  const handleCloseCompilerResult = () => {
    setCompilerResult('');
    setCompilerError('');
  };
  
  // 编译结果位置状态
  const [resultPosition, setResultPosition] = React.useState({
    x: (window.innerWidth - 600) / 2, // 初始位置，水平居中
    y: (window.innerHeight - 400) / 2 // 初始位置，垂直居中
  });
  
  // 拖拽相关状态
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  
  // 处理鼠标按下事件
  const handleMouseDown = (e) => {
    // 只有鼠标左键或右键按下时才开始拖拽
    if (e.button === 0 || e.button === 2) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - resultPosition.x,
        y: e.clientY - resultPosition.y
      });
    }
  };
  
  // 处理鼠标移动事件
  const handleMouseMove = (e) => {
    if (isDragging) {
      setResultPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  // 处理鼠标释放事件
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // 处理鼠标离开事件
  const handleMouseLeave = () => {
    setIsDragging(false);
  };
  
  // 添加全局鼠标事件监听
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [isDragging, dragStart, resultPosition]);

  // 处理标签页切换
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setResult(null);
    setError('');
    // 切换页面时清除编译结果和错误信息
    setCompilerResult('');
    setCompilerError('');
    // 切换页面时清除正确代码显示
    setShowCorrectCode(false);
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
    <div className="min-h-screen bg-white py-8 px-4">
      {/* 主要内容区域 */}
      <div className="max-w-6xl mx-auto">
        {/* 功能模块选择 */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg overflow-hidden">
          {/* 标签页内容 */}
          <div className="p-6">
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
                <p className="text-gray-700 text-lg text-justify">
                  可编程语言转换引擎是一种强大的工具，专门用于不同编程语言之间的智能转换，特别是在法律条文到形式化语言、形式化语言到智能合约代码的转换过程中发挥关键作用。
                  该引擎支持多种语言格式的转换，包括自然语言、Sparrow、BPMN、FSM等，能够自动分析输入内容并生成符合语法规范的目标语言代码，大大提高了开发效率和代码质量。
                </p>
              </div>
            </div>

            {/* 中间控件区域 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              {/* 标签页导航 */}
              <div className="bg-gray-50 border-b border-gray-200 rounded-t-xl mb-6">
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
              <div>
            {activeTab === 'convert' && (
              <ConvertModule 
                sourceLanguage={sourceLanguage}
                setSourceLanguage={setSourceLanguage}
                targetCode={targetCode}
                setTargetCode={setTargetCode}
              />
            )}
            {activeTab === 'multi-convert' && <MultiConvertModule />}
            {activeTab === 'compiler' && (
              <CompilerModule 
                result={compilerResult}
                setResult={setCompilerResult}
                error={compilerError}
                setError={setCompilerError}
                loading={compilerLoading}
                setLoading={setCompilerLoading}
                showCorrectCode={showCorrectCode}
                setShowCorrectCode={setShowCorrectCode}
              />
            )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 编译运行结果显示 - 位于编译器页面边界与整个页面边界之间的留白区域 */}
      {activeTab === 'compiler' && (
        <div 
          className="fixed z-50" 
          style={{
            left: resultPosition.x,
            top: resultPosition.y,
            width: '800px', // 宽度变为原来的2倍
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          {compilerResult && (
            <div className="bg-white rounded-lg shadow-md p-6 border border-green-200 relative">
              <div 
                className="flex justify-between items-center mb-4" 
                onMouseDown={handleMouseDown}
              >
                <h4 className="text-lg font-semibold text-green-800">编译运行结果</h4>
                <button 
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  onClick={handleCloseCompilerResult}
                >
                  ✕
                </button>
              </div>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="relative">
                  <textarea
                    className="w-full border-none px-4 py-3 text-base h-96 resize-none bg-gray-50 z-10 relative font-mono"
                    value={compilerResult}
                    readOnly
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      

    </div>
  );
};

export default ProgrammableLanguageConversionEngine;