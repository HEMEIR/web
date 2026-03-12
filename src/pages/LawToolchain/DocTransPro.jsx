import React from 'react';

/*转化与标注：DocTransPro*/
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
      setConvertedDocxUrl(`../src/resource/${docxFileName}`);
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
      setConvertedTxtUrl(`../src/resource/${txtFileName}`);
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

            {/* 软件设计流程图 */}
            <div className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">软件设计流程</h3>
              <div className="overflow-x-auto">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 950 475" className="w-full">
                  <rect width="950" height="475" fill="white" />

                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
                    </marker>
                  </defs>

                  <rect x="20" y="80" width="120" height="60" rx="30" fill="#fbc4c4" stroke="#333" strokeWidth="2"/>
                  <text x="80" y="115" fontFamily="sans-serif" fontSize="14" textAnchor="middle">输入pdf 目录</text>

                  <polygon points="240,50 300,110 240,170 180,110" fill="#c4e1fb" stroke="#333" strokeWidth="2"/>
                  <text x="240" y="115" fontFamily="sans-serif" fontSize="14" textAnchor="middle">是否包含文本</text>

                  <text x="240" y="28" fontFamily="sans-serif" fontSize="12" textAnchor="middle">是（文字PDF）</text>
                  <text x="240" y="182" fontFamily="sans-serif" fontSize="12" textAnchor="middle">否（图片PDF）</text>

                  <rect x="460" y="10" width="110" height="50" fill="#fff9c4" stroke="#333" strokeWidth="1.5"/>
                  <text x="515" y="40" fontFamily="sans-serif" fontSize="14" textAnchor="middle">直接转换</text>

                  <rect x="250" y="210" width="85" height="50" fill="#fff9c4" stroke="#333" strokeWidth="1.5"/>
                  <text x="292" y="240" fontFamily="sans-serif" fontSize="14" textAnchor="middle">提取图片</text>

                  <rect x="365" y="210" width="85" height="50" fill="#fff9c4" stroke="#333" strokeWidth="1.5"/>
                  <text x="407" y="240" fontFamily="sans-serif" fontSize="14" textAnchor="middle">图片处理</text>

                  <rect x="480" y="210" width="100" height="50" fill="#fff9c4" stroke="#333" strokeWidth="1.5"/>
                  <text x="530" y="233" fontFamily="sans-serif" fontSize="13" textAnchor="middle">识别文字</text>
                  <text x="530" y="250" fontFamily="sans-serif" fontSize="13" textAnchor="middle">拼接段落</text>

                  <rect x="610" y="210" width="100" height="50" fill="#fff9c4" stroke="#333" strokeWidth="1.5"/>
                  <text x="660" y="233" fontFamily="sans-serif" fontSize="13" textAnchor="middle">版面分析</text>
                  <text x="660" y="250" fontFamily="sans-serif" fontSize="13" textAnchor="middle">提取表格</text>

                  <rect x="740" y="210" width="100" height="50" fill="#fff9c4" stroke="#333" strokeWidth="1.5"/>
                  <text x="790" y="233" fontFamily="sans-serif" fontSize="13" textAnchor="middle">添加表格</text>
                  <text x="790" y="250" fontFamily="sans-serif" fontSize="13" textAnchor="middle">至文字后</text>

                  <rect x="760" y="75" width="120" height="70" rx="35" fill="#fbc4c4" stroke="#333" strokeWidth="2"/>
                  <text x="820" y="105" fontFamily="sans-serif" fontSize="13" textAnchor="middle">PDF转</text>
                  <text x="820" y="123" fontFamily="sans-serif" fontSize="13" textAnchor="middle">WORD完成</text>

                  <line x1="140" y1="110" x2="180" y2="110" stroke="#333" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                  <path d="M 240,50 L 240,35 L 460,35" fill="none" stroke="#333" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                  <path d="M 240,170 L 240,235 L 250,235" fill="none" stroke="#333" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                  <line x1="335" y1="235" x2="365" y2="235" stroke="#333" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                  <line x1="450" y1="235" x2="480" y2="235" stroke="#333" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                  <line x1="580" y1="235" x2="610" y2="235" stroke="#333" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                  <line x1="710" y1="235" x2="740" y2="235" stroke="#333" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                  <path d="M 570,35 L 820,35 L 820,75" fill="none" stroke="#333" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                  <path d="M 840,235 L 860,235 L 860,145" fill="none" stroke="#333" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

                  <rect x="20" y="350" width="130" height="60" rx="30" fill="#fbc4c4" stroke="#333" strokeWidth="2"/>
                  <text x="85" y="385" fontFamily="sans-serif" fontSize="14" textAnchor="middle">输入WORD目录</text>

                  <rect x="260" y="355" width="130" height="60" fill="#fff9c4" stroke="#333" strokeWidth="1.5"/>
                  <text x="325" y="380" fontFamily="sans-serif" fontSize="14" textAnchor="middle">调用WORD</text>
                  <text x="325" y="400" fontFamily="sans-serif" fontSize="14" textAnchor="middle">程序打开</text>

                  <rect x="530" y="355" width="130" height="60" fill="#fff9c4" stroke="#333" strokeWidth="1.5"/>
                  <text x="595" y="380" fontFamily="sans-serif" fontSize="14" textAnchor="middle">另存为</text>
                  <text x="595" y="400" fontFamily="sans-serif" fontSize="14" textAnchor="middle">TXT格式</text>

                  <rect x="750" y="350" width="130" height="60" rx="30" fill="#fbc4c4" stroke="#333" strokeWidth="2"/>
                  <text x="815" y="375" fontFamily="sans-serif" fontSize="14" textAnchor="middle">WORD转TXT</text>
                  <text x="815" y="395" fontFamily="sans-serif" fontSize="14" textAnchor="middle">完成</text>

                  <line x1="150" y1="385" x2="260" y2="385" stroke="#333" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                  <line x1="390" y1="385" x2="530" y2="385" stroke="#333" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                  <line x1="660" y1="385" x2="750" y2="385" stroke="#333" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                </svg>
              </div>
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

export default DocTransPro;