import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CAMCEE from './LawToolchain/CAM-CEE';
import ProvBench from './LawToolchain/ProvBench';
import AutoContractTag from './LawToolchain/AutoContractTag';
import DocTransPro from './LawToolchain/DocTransPro';
import Sparrow from './LawToolchain/Sparrow';
import ProgrammableLanguageConversionEngine from './LawToolchain/可编程语言转换引擎';
import ApplicationScenarios from './LawToolchain/ApplicationScenarios';

// 目录项配置 - 按要求重新组织成三个下拉菜单
const dropdownMenus = [
  {
    title: '转化与标注',
    items: [
      { id: 'doc-trans-pro', title: 'DocTransPro', component: <DocTransPro /> },
      { id: 'auto-contract-tag', title: 'AutoContractTag', component: <AutoContractTag /> }

    ]
  },
   {
    title: '提取与判定',
    items: [
      { id: 'law-parsing', title: 'CAM-CEE', component: <CAMCEE /> },
      { id: 'intelligent-matching', title: 'ProvBench', component: <ProvBench /> }
    ]
  },
  {
    title: '语言与转换',
    items: [
      { id: 'auto-generation', title: 'Sparrow', component: <Sparrow /> },
      { id: 'compliance-check', title: '可编程语言转换引擎', component: <ProgrammableLanguageConversionEngine /> }
    ]
  },
  {
    title: '应用场景',
    items: [
      { id: 'application-scenarios', title: '应用场景', component: <ApplicationScenarios /> }
    ]
  }
];

// 合并所有菜单项用于查找
const allMenuItems = dropdownMenus.flatMap(menu => menu.items);

const LawToolchain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState('doc-trans-pro');
  const [openDropdown, setOpenDropdown] = useState(null);

  // 处理菜单点击
  const handleMenuItemClick = (itemId) => {
    setActiveMenuItem(itemId);
    setOpenDropdown(null); // 关闭所有下拉菜单
    // 使用replace而不是push，避免浏览器历史记录堆积
    navigate(`/law-toolchain#${itemId}`, { replace: true });
  };

  // 缓存当前激活的组件实例，只有当activeMenuItem变化时才重新创建
  const cachedComponent = React.useMemo(() => {
    const item = allMenuItems.find(item => item.id === activeMenuItem);
    return item ? item.component : <DocTransPro />;
  }, [activeMenuItem]);

  // 切换下拉菜单
  const toggleDropdown = (dropdownIndex) => {
    setOpenDropdown(openDropdown === dropdownIndex ? null : dropdownIndex);
  };

  // 点击空白处关闭下拉菜单
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      // 检查点击目标是否在下拉菜单外部
      const dropdowns = document.querySelectorAll('.relative');
      let isClickInside = false;
      
      dropdowns.forEach(dropdown => {
        if (dropdown.contains(event.target)) {
          isClickInside = true;
        }
      });
      
      if (!isClickInside) {
        setOpenDropdown(null);
      }
    };

    // 添加事件监听器
    document.addEventListener('mousedown', handleClickOutside);
    
    // 清除事件监听器
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 下拉菜单关闭计时器
  const [closeTimer, setCloseTimer] = React.useState(null);

  // 延迟关闭下拉菜单
  const delayCloseDropdown = () => {
    if (closeTimer) {
      clearTimeout(closeTimer);
    }
    const timer = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
    setCloseTimer(timer);
  };

  // 取消关闭计时器
  const cancelCloseDropdown = () => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      setCloseTimer(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* 导航栏 */}
      <Navbar />

      {/* 法条智能处理工具链导航 - 移动到导航栏下方 */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <h2 className="text-xl font-bold text-gray-900 mr-8">{allMenuItems.find(item => item.id === activeMenuItem)?.title || '法条智能处理工具链'}</h2>
            
            {/* 下拉菜单导航 */}
            <div className="flex items-center space-x-4">
              {dropdownMenus.map((menu, index) => (
                <div 
                  key={index} 
                  className="relative"
                  onMouseEnter={() => {
                    cancelCloseDropdown();
                    setOpenDropdown(index);
                  }}
                  onMouseLeave={delayCloseDropdown}
                >
                  {/* 下拉菜单按钮 */}
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                  >
                    {menu.title}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* 下拉菜单内容 */}
                  {openDropdown === index && (
                    <div 
                      className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10"
                      onMouseEnter={cancelCloseDropdown}
                      onMouseLeave={delayCloseDropdown}
                    >
                      <div className="py-1">
                        {menu.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleMenuItemClick(item.id)}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors 
                              ${item.id === activeMenuItem
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'}
                            `}
                          >
                            {item.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      {activeMenuItem === 'compliance-check' || activeMenuItem === 'auto-generation' || activeMenuItem === 'application-scenarios' ? (
        /* 为可编程语言转换引擎、Sparrow和应用场景组件提供特殊处理，使其能够突破宽度限制 */
        <div className="w-full">
          {/* 渲染缓存的组件实例 */}
          {cachedComponent}
        </div>
      ) : (
        /* 其他组件保持原有样式 */
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* 渲染缓存的组件实例 */}
            {cachedComponent}
          </div>
        </div>
      )}
    </div>
  );
};

export default LawToolchain;