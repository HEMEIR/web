import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Mubiaopage = () => {
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 模块一：目标平台独立性 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-left">目标平台独立性</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <p className="text-gray-700 mb-4 leading-relaxed text-left">
                本开发引擎实现了多平台映射，主要针对Hyperledger Fabric和Ethereum两种平台，
                编写一种形式化中间语言即可自动生成多平台区块链代码。
                Hyperledger Fabric和Ethereum各有其特点优势，用户可自主选择。
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed text-left">
                Hyperledger Fabric专注于支持企业级应用的开发和部署，提供了灵活的模块化架构，
                允许用户根据业务需求定制区块链网络。
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed text-left">
                Ethereum则引入了智能合约的概念，允许开发者构建和部署去中心化应用程序（DApps），
                为去中心化和可编程的区块链生态系统提供了基础。
              </p>
            </div>
            <div className="md:w-1/3 flex flex-col items-center">
              <div className="mb-8">
                <img 
                  src="https://nocode.meituan.com/photo/search?keyword=ethereum,logo&width=200&height=200" 
                  alt="Ethereum" 
                  className="mx-auto object-cover w-32 h-32 rounded-lg mb-2"
                />
                <p className="text-center text-gray-600">Ethereum</p>
              </div>
              <div>
                <img 
                  src="https://nocode.meituan.com/photo/search?keyword=hyperledger,fabric,logo&width=200&height=200" 
                  alt="Hyperledger Fabric" 
                  className="mx-auto object-cover w-32 h-32 rounded-lg mb-2"
                />
                <p className="text-center text-gray-600">Hyperledger Fabric</p>
              </div>
            </div>
          </div>
        </div>

        {/* 模块二：目标语言多样性 */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-left">目标语言多样性</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 子模块 1：Solidity */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start mb-4">
                <img 
                  src="https://nocode.meituan.com/photo/search?keyword=solidity,logo&width=60&height=60" 
                  alt="Solidity" 
                  className="mx-auto object-cover w-12 h-12 rounded-lg mr-4"
                />
                <h3 className="text-xl font-bold text-gray-900">Solidity</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Solidity是一种为以太坊平台设计的智能合约编程语言。
                它支持面向对象的编程特性，并提供了丰富的语法和功能，
                方便开发者处理更大以及更复杂的区块链交互和数据操作。
                Solidity的合约可以被编译成Ethereum Virtual Machine（EVM）可执行的字节码，
                从而在以太坊网络上运行。
              </p>
            </div>

            {/* 子模块 2：Go */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start mb-4">
                <img 
                  src="https://nocode.meituan.com/photo/search?keyword=go,logo&width=60&height=60" 
                  alt="Go" 
                  className="mx-auto object-cover w-12 h-12 rounded-lg mr-4"
                />
                <h3 className="text-xl font-bold text-gray-900">Go</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                在Hyperledger Fabric中，Go（Golang）是首选的智能合约链码（Chaincode）开发语言。
                Go语言高效、简洁，具备强大的并发处理能力，
                非常适合开发交易的处理和状态转换。
                通过强大的Go语言编译器，能够充分利用其系统级特性支持，
                同时借助Go语言高效的断言、检查、高可读代码可读性和维护性，
                为Fabric区块链平台上的扩展、高性能应用提供了强有力的支持。
              </p>
            </div>

            {/* 子模块 3：Vyper */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start mb-4">
                <img 
                  src="https://nocode.meituan.com/photo/search?keyword=vyper,logo&width=60&height=60" 
                  alt="Vyper" 
                  className="mx-auto object-cover w-12 h-12 rounded-lg mr-4"
                />
                <h3 className="text-xl font-bold text-gray-900">Vyper</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Vyper是一种针对以太坊区块链平台的智能合约编程语言。
                与Solidity不同，Vyper的设计目标是提供更简洁、可读性更强、更易审核的代码。
                Vyper采用了Python风格的语法，剔除Solidity的一些复杂特性，
                以降低智能合约漏洞和提高安全性。
                Vyper注重语言的简洁性和安全性，减少了潜在的安全隐患，
                适用于开发简单、安全的智能合约。
                虽然Vyper相对Solidity来说功能较为有限，
                但在某些对安全性有更高要求的场景下，
                Vyper成为了一种受欢迎的选择。
              </p>
            </div>

            {/* 子模块 4：Node.js */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start mb-4">
                <img 
                  src="https://nocode.meituan.com/photo/search?keyword=nodejs,logo&width=60&height=60" 
                  alt="Node.js" 
                  className="mx-auto object-cover w-12 h-12 rounded-lg mr-4"
                />
                <h3 className="text-xl font-bold text-gray-900">Node.js</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                在Hyperledger Fabric中，Node.js作为一种链码（智能合约）的开发语言，提供了灵活性和便利性。
                通过使用JavaScript或TypeScript语言编程，开发者可以利用Node.js生态系统的丰富库和工具，
                简化链码开发，并享受更高效的编程模式。
                从而提高智能合约的开发效率。
                Node.js链码开发环境是开发者使用一种方便、易理解的选择，
                使得Hyperledger Fabric与现有Node.js生态系统更加紧密集成。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mubiaopage;
