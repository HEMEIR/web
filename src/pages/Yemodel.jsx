import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Yemodel = () => {
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

  // 轮播图状态和处理函数
  const [currentSlide1, setCurrentSlide1] = useState(0);
  const [currentSlide2, setCurrentSlide2] = useState(0);

  const nextSlide1 = () => {
    setCurrentSlide1((prev) => (prev === 1 ? 0 : prev + 1));
  };

  const prevSlide1 = () => {
    setCurrentSlide1((prev) => (prev === 0 ? 1 : prev - 1));
  };

  const nextSlide2 = () => {
    setCurrentSlide2((prev) => (prev === 1 ? 0 : prev + 1));
  };

  const prevSlide2 = () => {
    setCurrentSlide2((prev) => (prev === 0 ? 1 : prev - 1));
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
                    (item === '建模语言' && location.pathname === '/yemodel')
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

        {/* 模块一：业务建模 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">业务建模</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            业务建模是通过对组织内业务活动、流程、信息和角色等进行系统描述和分析，以图形化的方式呈现出各个层面的业务元素及其相互关系。这有助于团队成员更好地理解业务运行方式，识别问题和改进机会。通过业务建模，组织能够实现业务过程的透明度，促进内部沟通，提高工作效率，并为信息系统开发和业务优化提供重要支持。
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            相关工作：BPMN（Caterpillar、Pupa、Lorikeet...）、EPC...
          </p>
        </div>

        {/* 模块二：多种业务建模语言 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">多种业务建模语言</h2>
          <p className="text-gray-700 mb-8 leading-relaxed">
            支持BPMN、EPC等模型，符号化表达合同实体及业务流程，提供合同建模的一致性表达
          </p>

          {/* 子模块：BPMN业务流程建模 */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">BPMN业务流程建模</h3>
            
            {/* 轮播图片位置 1 */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-full md:w-3/5 h-64 rounded-lg overflow-hidden">
                {/* 轮播图片容器 */}
                <div className="relative w-full h-full">
                  {/* 第一张图片 */}
                  <div className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${currentSlide1 === 0 ? 'opacity-100' : 'opacity-0'}`}>
                    <img 
                      src="https://nocode.meituan.com/photo/search?keyword=BPMN+diagram&width=600&height=400" 
                      alt="BPMN 流程框图" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* 第二张图片 */}
                  <div className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${currentSlide1 === 1 ? 'opacity-100' : 'opacity-0'}`}>
                    <img 
                      src="https://nocode.meituan.com/photo/search?keyword=BPMN+example&width=600&height=400" 
                      alt="BPMN 示例图" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* 左右切换按钮 */}
                <button 
                  onClick={prevSlide1}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-800" />
                </button>
                <button 
                  onClick={nextSlide1}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-800 rotate-180" />
                </button>
              </div>
              
              {/* 分页圆点 */}
              <div className="flex space-x-2 mt-4">
                {[0, 1].map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide1(index)}
                    className={`w-3 h-3 rounded-full ${
                      currentSlide1 === index ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 子模块：Caterpillar */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Caterpillar</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Caterpillar涵盖了BPMN的大部分基础元素，可以表达参数条款
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {/* 保留原图中的换行显示 */}
              可
              <br />
              以
            </p>
          </div>

          {/* 子模块：Pupa */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Pupa</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Pupa在Caterpillar的基础上，增加了支持定时设计和排他网关
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {/* 保留原图中的换行显示 */}
              定时
              <br />
              设计
            </p>
            
            {/* 轮播图片位置 2 */}
            <div className="flex flex-col items-center">
              <div className="relative w-full md:w-3/5 h-64 rounded-lg overflow-hidden">
                {/* 轮播图片容器 */}
                <div className="relative w-full h-full">
                  {/* 第一张图片 */}
                  <div className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${currentSlide2 === 0 ? 'opacity-100' : 'opacity-0'}`}>
                    <img 
                      src="https://nocode.meituan.com/photo/search?keyword=Pupa+diagram&width=600&height=400" 
                      alt="Pupa 流程图" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* 第二张图片 */}
                  <div className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${currentSlide2 === 1 ? 'opacity-100' : 'opacity-0'}`}>
                    <img 
                      src="https://nocode.meituan.com/photo/search?keyword=Pupa+example&width=600&height=400" 
                      alt="Pupa 示例图" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* 左右切换按钮 */}
                <button 
                  onClick={prevSlide2}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-800" />
                </button>
                <button 
                  onClick={nextSlide2}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-800 rotate-180" />
                </button>
              </div>
              
              {/* 分页圆点 */}
              <div className="flex space-x-2 mt-4">
                {[0, 1].map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide2(index)}
                    className={`w-3 h-3 rounded-full ${
                      currentSlide2 === index ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Yemodel;
