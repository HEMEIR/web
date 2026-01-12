import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Monitor, FileText } from 'lucide-react';

const Gongnengpage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (item) => {
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate('/')}>智能法律合约开发引擎</h1>
            </div>
            <div className="flex items-center space-x-8">
              {['系统总览', '建模语言', '开发平台', '测试平台', '知识产权'].map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    (item === '系统总览' && location.pathname === '/') || 
                    (item === '测试平台' && location.pathname === '/testing-platform')
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* 页面内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 背景插画 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="relative z-10">
          {/* 页面标题 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-12 text-center">测试平台详情</h1>

          {/* 功能性测试模块 */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-10">
            <div className="flex flex-col md:flex-row items-start">
              <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <Monitor className="text-gray-800" size={48} />
                </div>
              </div>
              <div className="md:w-3/4 md:pl-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">功能性测试</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    功能性测试步骤如下：挖掘法律合同的每一个功能点，
                    确保法律合同里面所对应的功能都能在智能法律合约中实现。
                  </p>
                  <div className="flex items-center text-gray-700 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>🔹 模块二：一致性测试</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 一致性测试模块 */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex flex-col md:flex-row items-start">
              <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <FileText className="text-gray-800" size={48} />
                </div>
              </div>
              <div className="md:w-3/4 md:pl-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">一致性测试</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    一致性测试步骤如下：基于法律合同编写一致性测试用例，
                    包括输入数据、预期输出和执行步骤，确保测试用例全面覆盖各种情况。
                    执行测试用例，模拟用户操作，输入测试数据，观察系统的实际行为，
                    比对实际输出与预期输出是否一致。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gongnengpage;
