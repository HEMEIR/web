import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';

const Ceshipage = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 模块一：测试平台（总览介绍） */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 mb-16">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-2/3 mb-8 lg:mb-0 lg:pr-8">
              <h2 className="text-4xl font-bold text-white mb-6">测试平台</h2>
              <p className="text-blue-100 text-lg leading-relaxed mb-6">
                该智能法律合约测试平台是一个全面的工具，
                专注于确保智能法律合约在一致性、功能性和安全性方面的高质量。
                该平台不仅提供了功能性测试框架，验证合约的各项功能是否按预期运行，
                还整合多种安全性检测工具，包括静态分析、动态分析和模糊测试，
                以发现和修复潜在的安全漏洞。
              </p>
              <p className="text-blue-100 text-lg leading-relaxed">
                同时，平台支持模拟以太坊网络的环境，自动化测试流程，
                生成详细的测试报告和分析，
                帮助开发者全面了解合约的状态和安全性，
                从而提高合约的质量和稳定性。
              </p>
            </div>
            <div className="lg:w-1/3 flex justify-center">
              <div className="bg-white rounded-full w-48 h-48 flex items-center justify-center">
                <div className="bg-blue-600 rounded-full w-32 h-32 flex items-center justify-center">
                  <Check className="text-white" size={64} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 模块二和三：功能性测试和安全性测试 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 模块二：功能性测试和一致性测试 */}
          <div className="bg-blue-800/50 rounded-2xl p-8">
            <div className="flex flex-col h-full">
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-white mb-4">功能性测试和一致性测试</h3>
                <p className="text-blue-100 mb-6">
                  功能性测试：测试该智能法律合约的功能是否完整
                </p>
                <p className="text-blue-100">
                  一致性测试：测试该智能法律合约的运行逻辑是否符合法律合约要求
                </p>
              </div>
              <div className="flex justify-between items-end mt-8">
                <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center">
                  <Check className="text-white" size={24} />
                </div>
                <button 
                  onClick={() => navigate('/gongnengpage')}
                  className="text-blue-300 hover:text-blue-200 underline"
                >
                  了解详情>>>
                </button>
              </div>
            </div>
          </div>

          {/* 模块三：安全性测试 */}
          <div className="bg-blue-800/50 rounded-2xl p-8">
            <div className="flex flex-col h-full">
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-white mb-6">安全性测试</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 flex items-center justify-center">
                    <span className="text-white font-bold">SmartCheck</span>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 flex items-center justify-center">
                    <span className="text-white font-bold">MythX</span>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 flex items-center justify-center">
                    <span className="text-white font-bold">Mythril</span>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 flex items-center justify-center">
                    <span className="text-white font-bold">Slither</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button 
                  onClick={() => navigate('/anquanpage')}
                  className="text-blue-300 hover:text-blue-200 underline"
                >
                  了解详情>>>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ceshipage;
