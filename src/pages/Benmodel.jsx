import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const Benmodel = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
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
                    (item === '建模语言' && location.pathname === '/benmodel')
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
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/modeling-language')}
            className="flex items-center border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            返回
          </Button>
        </div>

        {/* 模块一：本体建模 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">本体建模</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            本体是一个形式化的、共享的概念模型，其中包含了领域中的实体、概念、属性以及它们之间的关系。通过本体建模，可以实现对知识的一致性管理和共享，使不同系统和应用能够更好地理解和交流。还有助于解释本息和概念的语义内涵，促进事务推理，实现业务协同和自动化。
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            相关工作：CML、Symboleo、SPESC...
          </p>
        </div>

        {/* 模块二：多种本体建模语言 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">多种本体建模语言</h2>
          <p className="text-gray-700 mb-8 leading-relaxed">
            支持多种领域特定语言建模，提取合同法律要素和要素间关系，提供合同结构的一致性表达
          </p>

          {/* 子模块：Sparrow */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Sparrow</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Sparrow具备细叶丰富的角色、更多的逻辑结构，支持复印申报款的表达
            </p>
            
            {/* 轮播图片位置 1 */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-full md:w-3/5 h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500">Sparrow 示例图片</span>
              </div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* 子模块：CML */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">CML</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              CML把复杂拆解成Trigger、Condition、Actor、Modality、Action、Object六部分，可表达大部分简单逻辑
            </p>
            
            {/* 轮播图片位置 2 */}
            <div className="flex flex-col items-center">
              <div className="w-full md:w-3/5 h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500">CML 示例图片</span>
              </div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benmodel;
