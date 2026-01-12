import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Kaifatoolpage = () => {
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
                    (item === '建模语言' && location.pathname === '/modeling-language') ||
                    (item === '开发平台' && location.pathname === '/development-platform')
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
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">开发工具</h2>
          
          {/* 模块一：Xtext */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                <div className="bg-purple-600 rounded-full w-32 h-32 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">E</span>
                </div>
              </div>
              <div className="md:w-2/3 md:pl-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Xtext</h3>
                <div className="flex space-x-4 mb-4">
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">复制</button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">编辑</button>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Eclipse中的Xtext是领域特定语言（DSL）开发框架。
                  它通过简单的DSL定义，使开发者能够轻松创建具有特定领域关注点的编程语言，
                  并通过代码生成工具实现从定义到实际编程框架的无缝转换。
                  Xtext的集成开发环境为DSL提供了专用编辑器、语法高亮和验证工具，
                  提升了DSL的开发效率和易用性。
                  同时，Xtext支持DSL之间的转换和验证，增加了DSL的灵活性和可操作性，
                  使得开发者能够更专注于领域概念的抽象而不必担心底层实现细节。
                </p>
              </div>
            </div>
          </div>

          {/* 模块二：ANTLR */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                <div className="bg-black rounded-full w-32 h-32 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">A</span>
                </div>
              </div>
              <div className="md:w-2/3 md:pl-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">ANTLR</h3>
                <div className="flex space-x-4 mb-4">
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">复制</button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">编辑</button>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  ANTLR是一款强大的语法分析器生成器，
                  其主要作用在于帮助开发者定义和生成用于解析文本的语法分析器。
                  通过提供灵活的语法规则，ANTLR可用于处理各种编程语言、领域特定语言或自定义语言，
                  生成对应的语法树。
                  这使得ANTLR在编程语言解析、领域特定语言开发以及编译器和解释器的构建等方面发挥着重要作用。
                </p>
              </div>
            </div>
          </div>

          {/* 模块三：Remix */}
          <div>
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                <div className="bg-gray-800 rounded-full w-32 h-32 flex items-center justify-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white rounded-full mr-1"></div>
                    <div className="w-8 h-8 bg-black rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 md:pl-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Remix</h3>
                <div className="flex space-x-4 mb-4">
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">复制</button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">编辑</button>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Remix在以太坊智能合约开发中充当了强大的IDE工具，
                  通过其实时编辑、语法高亮、静态分析、调试工具和交互式控制台等功能，
                  为开发者提供了便捷且高效的开发环境。
                  开发者可以在浏览器中轻松编写、测试和部署Solidity智能合约，
                  同时通过集成的调试器和模拟器对合约进行实时调试和交互，
                  使得以太坊智能合约的开发过程更加流畅和可控。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kaifatoolpage;
