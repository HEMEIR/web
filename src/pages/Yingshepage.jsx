import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Yingshepage = () => {
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

      {/* 页面内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 大标题 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-12 text-center">映射规则详解</h1>

        {/* 模块一：Sparrow */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <img 
                src="https://nocode.meituan.com/photo/search?keyword=code,solidity,purple&width=600&height=400" 
                alt="Sparrow 代码示例" 
                className="mx-auto object-cover w-full h-64 rounded-lg"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sparrow</h2>
              <div className="flex space-x-4 mb-4">
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">nginx</button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">复制</button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">编辑</button>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Sparrow的映射规则具备解释盒、提高重用率的优势。
                其完备的映射机制确保Specification能够无缝映射为Solidity智能法律合约，
                生成的代码无需二次修改，进一步提高了开发效率和代码质量。
              </p>
            </div>
          </div>
        </div>

        {/* 模块二：CML */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">CML</h2>
              <div className="flex space-x-4 mb-4">
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">vbnet</button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">复制</button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">编辑</button>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                CML的映射规则把Party、Asset、Transaction映射成Struct，
                剩余的Event、Function等都映射成Function，
                同时预设了很多工具及文件，导致代码量上升。
              </p>
            </div>
            <div className="lg:w-1/2">
              <h3 className="text-xl font-bold text-gray-900 mb-4">CML Construct vs Solidity Construct</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CML Construct</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solidity Construct</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Party</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Struct</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Asset</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Struct</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Transaction</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Struct</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Enumeration</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Enumeration</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Event</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Function</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Function</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Function</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Top level function</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Function with pure/view declaration</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Clause constraints</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Function modifier with conditional checks</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* 模块三：TA-SPESC */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <img 
                src="https://nocode.meituan.com/photo/search?keyword=flowchart,red,arrow&width=600&height=400" 
                alt="TA-SPESC 映射示意图" 
                className="mx-auto object-cover w-full h-64 rounded-lg"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">TA-SPESC</h2>
              <div className="flex space-x-4 mb-4">
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">vbnet</button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">复制</button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">编辑</button>
              </div>
              <p className="text-gray-700 leading-relaxed">
                TA-SPESC 把每个Term映射成Function，
                when映射成require语句，
                while映射成某类链操作，
                where映射成函数语句。
              </p>
            </div>
          </div>
        </div>

        {/* 模块四：Symboleo */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Symboleo</h2>
              <div className="flex space-x-4 mb-4">
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">vbnet</button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">复制</button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">编辑</button>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Symboleo先把Domain里面的角色和资产映射成相应的model文件，
                再依次产生Transactions和Event Handlers。
              </p>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://nocode.meituan.com/photo/search?keyword=nodejs,code,require&width=600&height=400" 
                alt="Symboleo 代码示例" 
                className="mx-auto object-cover w-full h-64 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Yingshepage;
