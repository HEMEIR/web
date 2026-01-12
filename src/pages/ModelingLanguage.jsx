import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Code, TestTube } from 'lucide-react';

const ModelingLanguage = () => {
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
              <h1 className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate('/')}>智能法律合约开发引擎</h1>
            </div>
            <div className="flex items-center space-x-8">
              {['系统总览', '建模语言', '开发平台', '测试平台', '知识产权'].map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    (item === '系统总览' && location.pathname === '/') || 
                    (item === '建模语言' && location.pathname === '/modeling-language')
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 本体建模 */}
          <div className="bg-blue-50 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <img 
                src="https://nocode.meituan.com/photo/search?keyword=ontology&width=400&height=200" 
                alt="本体建模" 
                className="mx-auto object-cover w-full h-48 rounded-md mb-4"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">本体建模</h3>
              <p className="text-gray-700 mb-4">
                本体是一个形式化的、共享的概念模型，其中包含了领域内的实体、概念、属性以及它们之间的关系。通过本体建模，可以实现对知识的一致性管理和共享，使不同系统和应用程序能够更好地理解和交互。这有助于解决信息集成和语义理解的问题，促进跨系统、跨组织的数据共享和协同工作。
              </p>
              <p className="text-gray-700 mb-4">
                <strong>相关工作：</strong>CML、Symboleo、SPESC...
              </p>
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  className="border-blue-600 text-blue-600 hover:bg-blue-100"
                  onClick={() => navigate('/benmodel')}
                >
                  了解详情
                </Button>
              </div>
            </div>
          </div>

          {/* 业务建模 */}
          <div className="bg-green-50 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <img 
                src="https://nocode.meituan.com/photo/search?keyword=business+model&width=400&height=200" 
                alt="业务建模" 
                className="mx-auto object-cover w-full h-48 rounded-md mb-4"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">业务建模</h3>
              <p className="text-gray-700 mb-4">
                业务建模是通过对组织业务活动、流程、信息和角色等进行系统描述和分析，以图形化的方式呈现出各个层面的业务元素及其相互关系。这有助于团队成员更好地理解业务运作方式，识别问题和改进机会。通过业务建模，组织能够实现业务过程的透明度，促进内部沟通，提高工作效率，并为信息系统开发和业务优化提供重要支持。
              </p>
              <p className="text-gray-700 mb-4">
                <strong>相关工作：</strong>Caterpillar、Pupa、EPC...
              </p>
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  className="border-green-600 text-green-600 hover:bg-green-100"
                  onClick={() => navigate('/yemodel')}
                >
                  了解详情
                </Button>
              </div>
            </div>
          </div>

          {/* 价值建模 */}
          <div className="bg-purple-50 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <img 
                src="https://nocode.meituan.com/photo/search?keyword=value+model&width=400&height=200" 
                alt="价值建模" 
                className="mx-auto object-cover w-full h-48 rounded-md mb-4"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">价值建模</h3>
              <p className="text-gray-700 mb-4">
                价值建模是一种系统化的方法，旨在描述和分析系统或商业模型中的核心价值流。通过图形化的方式呈现参与者、活动和价值对象之间的关系，价值建模有助于深入理解组织或系统内部的价值创造和交换过程。这种方法通过捕捉关键的业务元素，如参与者角色、价值活动等，为决策者提供了对组织运作方式的清晰洞察，支持业务规划、分析和优化，从而促进系统或商业模型的可持续发展。
              </p>
              <p className="text-gray-700 mb-4">
                <strong>相关工作：</strong>e3value、Canvas...
              </p>
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  className="border-purple-600 text-purple-600 hover:bg-purple-100"
                  onClick={() => navigate('/jiamodel')}
                >
                  了解详情
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelingLanguage;
