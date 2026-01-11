import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Anquanpage = () => {
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
              <h1 className="text-xl font-bold text-gray-900">智能法律合约开发引擎</h1>
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
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="relative z-10">
          {/* 页面标题 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-12 text-center">安全性测试工具详解</h1>

          {/* Slither 模块 */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center">
                <div className="bg-blue-100 rounded-lg p-4">
                  <span className="text-blue-800 font-bold text-2xl">slither</span>
                </div>
              </div>
              <div className="md:w-3/4 md:pl-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Slither</h2>
                <div className="prose max-w-none">
                  <div className="bg-gray-800 text-green-400 p-4 rounded-lg mb-4">
                    <pre className="whitespace-pre-wrap">
nginx
复制
编辑
                    </pre>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Slither 主要用于检测和识别以太坊智能合约中的安全漏洞和潜在问题。
                    它能够分析 Solidity 语言编写的合约代码，提供有关可能存在的漏洞和安全风险的详细报告。
                    功能包括检测常见的漏洞类型，如重入攻击、未授权的操作、代码注入等。
                    Slither 为以太坊开发社区广泛使用的静态分析工具之一。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MythX 模块 */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center">
                <div className="bg-black rounded-lg p-4">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-white"></div>
                  </div>
                </div>
              </div>
              <div className="md:w-3/4 md:pl-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">MythX</h2>
                <div className="prose max-w-none">
                  <div className="bg-gray-800 text-green-400 p-4 rounded-lg mb-4">
                    <pre className="whitespace-pre-wrap">
nginx
复制
编辑
                    </pre>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    MythX 是一款专注于以太坊智能合约安全性的分析平台，
                    结合静态分析和动态分析工具，帮助开发者发现和修复各种潜在漏洞。
                    通过对新代码的检测和在实际以太坊网络上的动态模拟执行，
                    MythX 提供实时反馈，帮助开发者提高合约的安全性，减少潜在的安全风险。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mythril 模块 */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center">
                <div className="bg-blue-500 rounded-lg p-4">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">M</span>
                  </div>
                </div>
              </div>
              <div className="md:w-3/4 md:pl-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Mythril</h2>
                <div className="prose max-w-none">
                  <div className="bg-gray-800 text-green-400 p-4 rounded-lg mb-4">
                    <pre className="whitespace-pre-wrap">
nginx
复制
编辑
                    </pre>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Mythril 是一个针对以太坊智能合约的安全性分析工具，
                    主要用于检测合约中可能存在的漏洞和潜在的安全问题。
                    它采用静态分析技术，通过检查合约的源代码来发现可能的漏洞，
                    如重入攻击、溢出、权限问题等。
                    Mythril 提供了一个易于使用的界面，使开发者能够方便地对其智能合约进行安全审计和分析。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SmartCheck 模块 */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center">
                <div className="bg-green-500 rounded-lg p-4">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="md:w-3/4 md:pl-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">SmartCheck</h2>
                <div className="prose max-w-none">
                  <div className="bg-gray-800 text-green-400 p-4 rounded-lg mb-4">
                    <pre className="whitespace-pre-wrap">
nginx
复制
编辑
                    </pre>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    SmartCheck 是一种扩展的静态分析工具，
                    用于发现用 Solidity 编程语言编写的以太坊智能合约中的漏洞和其他代码问题。
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

export default Anquanpage;
