import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Jiamodel = () => {
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
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      image: "https://nocode.meituan.com/photo/search?keyword=e3value+diagram&width=600&height=400",
      alt: "e3value 流程示例"
    },
    {
      id: 2,
      image: "https://nocode.meituan.com/photo/search?keyword=e3value+example&width=600&height=400",
      alt: "e3value 其他示例"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
                    (item === '建模语言' && location.pathname === '/jiamodel')
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

        {/* 模块一：价值建模 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">价值建模</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            价值建模是一种系统化的方法，旨在描述和分析系统或商业模型中的核心价值流。通过图形化的方式呈现参与者、活动和价值对象之间的关系，价值建模有助于深入理解组织和系统内部的价值创造和交换过程。这种方法通过抽取关键的业务元素，如参与者角色、价值活动等，为决策者提供了对组织运作方式的清晰洞察，支持业务规划、分析和优化，从而促进系统或商业模型的可持续发展。
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            相关工作：e3value、Canvas...
          </p>
        </div>

        {/* 模块二：e3value */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">e3value</h2>
          <p className="text-gray-700 mb-8 leading-relaxed">
            e3value以业务角色之间的价值交换来表示合同，适用于电子商务与价值网络分析。
          </p>
          
          {/* 轮播图片位置 */}
          <div className="flex flex-col items-center">
            <div className="relative w-full md:w-3/5 h-80 rounded-lg overflow-hidden">
              {/* 轮播图片容器 */}
              <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                  <div 
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <img 
                      src={slide.image} 
                      alt={slide.alt} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              
              {/* 左右切换按钮 */}
              <button 
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md"
              >
                <ChevronLeft className="h-5 w-5 text-gray-800" />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md"
              >
                <ChevronRight className="h-5 w-5 text-gray-800" />
              </button>
            </div>
            
            {/* 分页圆点 */}
            <div className="flex space-x-2 mt-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentSlide === index ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jiamodel;
