import React, { useState } from 'react';
import { Home, Code, TestTube, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 计算器相关状态
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [op, setOp] = useState("+");
  const [result, setResult] = useState(null);

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

  // 调用后端 API
  const handleCalc = async () => {
    try {
      const res = await fetch("/api/calc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ a: Number(a), b: Number(b), op })
      });
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error(err);
      setResult("计算出错");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">智能合约法律条文诠释原型系统与应用平台 V1.0</h1>
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

      {/* 系统介绍 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">系统介绍</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            这是一个多建模方法集成的系统，具备将法律合同使用不同建模方式建模，映射为多种智能合约语言的能力。
            该系统支持灵活的建模，包括业务建模、本体建模以及其他价值建模方法，使用户能够根据需求选择最适合的建模方式。
            通过该系统，用户可以将其建模结果映射为各种智能合约语言，如Solidity、Vyper等，从而实现对不同区块链平台的无缝集成，
            为智能合约开发提供了高度的可定制性和适应性。
          </p>
        </div>

        {/* 四大平台 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* 形式化建设平台 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <FileText className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">形式化建设平台</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {['本体论建模', '业务建模', '价值建模'].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-gray-600">
                支持自然语言法律合同到多种形式化建模语言
              </p>
            </div>
          </div>

          {/* 开发平台 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Code className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">开发平台</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {['解析器', '生成器'].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="text-gray-600">
                <p className="mb-2">解析器：支持形式化语言到抽象语法树</p>
                <p>生成器：支持抽象语法树到智能法律合约</p>
              </div>
            </div>
          </div>

          {/* 测试平台 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <TestTube className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">测试平台</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {['一致性测试', '功能性测试', '安全性测试'].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-gray-600">
                支持智能法律合约一致性测试、性能测试、安全性测试
              </p>
            </div>
          </div>

          {/* 法条智能处理工具链 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/law-toolchain')}>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <FileText className="h-8 w-8 text-orange-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">法条智能处理工具链</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {['法条解析', '智能匹配', '自动生成', '合规检查'].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-gray-600">
                提供完整的法条智能处理工具链，支持从法条解析到智能合约生成的全流程
              </p>
            </div>
          </div>
        </div>

        {/* ⚡ 计算器 UI */}
        <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">简易计算器</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              value={a}
              onChange={(e) => setA(e.target.value)}
              placeholder="数字 A"
              className="w-1/3 px-3 py-2 border rounded-lg"
            />
            <select
              value={op}
              onChange={(e) => setOp(e.target.value)}
              className="w-1/3 px-3 py-2 border rounded-lg"
            >
              <option value="+">＋</option>
              <option value="-">－</option>
              <option value="*">×</option>
              <option value="/">÷</option>
            </select>
            <input
              type="number"
              value={b}
              onChange={(e) => setB(e.target.value)}
              placeholder="数字 B"
              className="w-1/3 px-3 py-2 border rounded-lg"
            />
          </div>
          <button
            onClick={handleCalc}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            计算
          </button>
          {result !== null && (
            <p className="mt-4 text-lg font-semibold text-center">结果: {result}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
