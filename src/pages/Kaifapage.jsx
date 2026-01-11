import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Kaifapage = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
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
        {/* 模块一：目标平台与语言 */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">目标平台与语言</h2>
          
          {/* 第一行图标 */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mb-2">
                <span className="text-white font-bold text-xs text-center">HYPERLEDGER FABRIC</span>
              </div>
              <span className="text-white text-sm">左上</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mb-2">
                <span className="text-white font-bold text-lg">Go</span>
              </div>
              <span className="text-white text-sm">GO</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mb-2">
                <span className="text-white font-bold text-lg">JS</span>
              </div>
              <span className="text-white text-sm">node.js</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mb-2">
                <span className="text-white font-bold text-lg">PY</span>
              </div>
              <span className="text-white text-sm">python</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mb-2">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="text-white text-sm">Java</span>
            </div>
          </div>
          
          {/* 第二行图标 */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mb-2">
                <span className="text-white font-bold text-lg">ETH</span>
              </div>
              <span className="text-white text-sm">ethereum</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mb-2">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-white text-sm">SOLIDITY</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mb-2">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-white text-sm">vyper</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mb-2">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-white text-sm">RUST</span>
            </div>
          </div>
          
          <div className="text-center">
                <button
                  onClick={() => navigate('/Mubiaopage')}
                  className="text-blue-300 hover:text-blue-200 underline"
                >
                  查看更多>>>
                </button>
          </div>
        </div>

        {/* 模块二和模块三 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 模块二：开发工具 */}
          <div className="bg-gradient-to-br from-blue-800/50 to-purple-800/50 rounded-xl p-8">
            <div className="flex items-start">
              <div className="bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mr-6 flex-shrink-0">
                <div className="bg-gradient-to-r from-orange-400 to-orange-200 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-blue-900 font-bold text-lg">E</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-4">开发工具</h3>
                <p className="text-white mb-2">复制</p>
                <p className="text-white mb-4">编辑</p>
                <p className="text-white text-sm">
                  通过antlr，eclipse，remix等多种开发工具完善并实现映射规则
                </p>
                <button
                  onClick={() => navigate('/Kaifatoolpage')}
                  className="text-blue-300 hover:text-blue-200 underline"
                >
                  查看更多>>>
                </button>
              </div>
            </div>
          </div>

          {/* 模块三：映射规则 */}
          <div className="bg-gradient-to-br from-blue-800/50 to-purple-800/50 rounded-xl p-8">
            <div className="flex items-start">
              <div className="mr-6 flex-shrink-0">
                <div className="flex items-center">
                  <div className="bg-white rounded p-2 mr-2">
                    <span className="font-bold">A</span>
                    <div className="w-4 h-0.5 bg-black mt-1"></div>
                    <div className="w-4 h-0.5 bg-black mt-1"></div>
                    <div className="w-4 h-0.5 bg-black mt-1"></div>
                  </div>
                  <ChevronRight className="text-white mx-1" size={20} />
                  <div className="bg-white rounded p-2 ml-1">
                    <div className="flex">
                      <div className="w-3 h-3 bg-red-500 rounded-sm mr-1"></div>
                      <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-4">映射规则</h3>
                <p className="text-white mb-2">css</p>
                <p className="text-white mb-2">复制</p>
                <p className="text-white mb-4">编辑</p>
                <p className="text-white text-sm">
                  通过映射规则将Specification转换成Code
                </p>
                <button
                  onClick={() => navigate('/Yingshepage')}
                  className="text-blue-300 hover:text-blue-200 underline"
                >
                  查看更多>>>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kaifapage;
