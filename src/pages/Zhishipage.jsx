import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Zhishipage = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
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
                    (item === '知识产权' && location.pathname === '/intellectual-property')
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
        {/* 顶部介绍 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">知识产权</h1>
          <div className="prose max-w-none text-gray-700">
            <p className="mb-4 leading-relaxed">
              尊敬的用户，欢迎访问我们产品的知识产权界面。
              该界面详细呈现了我们在论文、专利和软件著作等方面的丰富知识产权成果。
              我们的研发团队通过发表高水平的学术论文支持产品技术的深度和广度。
              已获得和正在申请的专利确保产品核心技术的合法保护，软件作品通过专利的精心保障确保软件开发领域的独特创新得到法律认可。
              与合作伙伴签署的明确合同和许可协议保护知识产权的合法使用和充分分配。
            </p>
            <p className="leading-relaxed">
              感谢您对我们产品的信任与支持，我们将持续致力于为您提供高质量、创新性的解决方案。
            </p>
          </div>
        </div>

        {/* 模块一：论文 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-left">论文</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4 leading-relaxed">
                我是内容区域一，您可以在这里展示相关的论文资料。通过查看相关文献，
                用户可以了解我们的技术发展历程、产品背后的科学研究基础以及对领域的贡献。
              </p>
            </div>
            <div className="prose max-w-none text-gray-700">
              <p className="mb-6 leading-relaxed">
                我是内容区域二，您可以进一步为用户提供访问相关论文的链接或进一步的资料下载。
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                查看更多
              </a>
            </div>
          </div>
        </div>

        {/* 模块二：专利及软件 */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-left">专利及软件</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4 leading-relaxed">
                我是内容区域一，展示我们已申请和获批的专利信息，以及与软件相关的知识产权，详细列出每项技术创新和保护的专利。
              </p>
            </div>
            <div className="prose max-w-none text-gray-700">
              <p className="mb-6 leading-relaxed">
                我是内容区域二，用户可以了解更多的专利申请情况或查看相关的技术实现。
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                查看更多
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Zhishipage;
