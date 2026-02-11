import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ChevronRight } from 'lucide-react';

const Kaifapage = () => {
  // 设置页面标题
  useEffect(() => {
    document.title = 'EyeLaw-开发';
  }, []);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (item) => {
    switch (item) {
      case '系统总览':
        navigate('/');
        break;
      case '建模语言':
        navigate('/');
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
      <Navbar />

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
                  onClick={() => navigate('/Jiamodel')}
                  className="text-blue-300 hover:text-blue-200 underline"
                >
                  查看更多&gt;&gt;&gt;
                </button>
          </div>
        </div>

        {/* 模块二、模块三和模块四 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
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
                  查看更多&gt;&gt;&gt;
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
                  onClick={() => navigate('/Yemodel')}
                  className="text-blue-300 hover:text-blue-200 underline"
                >
                  查看更多&gt;&gt;&gt;
                </button>
              </div>
            </div>
          </div>

          {/* 模块四：大屏展示 */}
          <div className="bg-gradient-to-br from-blue-800/50 to-purple-800/50 rounded-xl p-8">
            <div className="flex items-start">
              <div className="mr-6 flex-shrink-0">
                <div className="bg-white rounded-lg p-3">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <span className="text-2xl font-bold">📊</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-4">大屏展示</h3>
                <p className="text-white mb-2">查看</p>
                <p className="text-white mb-2">分析</p>
                <p className="text-white mb-4">监控</p>
                <p className="text-white text-sm">
                  实时监控系统运行状态，展示关键指标和数据可视化
                </p>
                <a
                  href="/src/pages/large-screen.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-200 underline"
                >
                  查看更多&gt;&gt;&gt;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kaifapage;
