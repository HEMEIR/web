import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Index() {
  useEffect(() => {
    document.title = 'EyeLaw-首页';
  }, []);

  return (
    <div className="app">
      {/* 导航栏 */}
      <Navbar />

      {/* 英雄区域 */}
      <section className="hero">
        <div className="container">
          <div className="hero-container">
            <div className="hero-content">
              <h1>智能合约法律条文诠释原型系统与应用平台</h1>
              <p>这是一个多建模方法集成的系统，具备将法律合同使用不同建模方式建模，映射为多种智能合约语言的能力。 该系统支持灵活的建模，包括业务建模、本体建模以及其他价值建模方法，使用户能够根据需求选择最适合的建模方式。 通过该系统，用户可以将其建模结果映射为各种智能合约语言，如Solidity、Vyper等，从而实现对不同区块链平台的无缝集成， 为智能合约开发提供了高度的可定制性和适应性。</p>
              <div className="hero-buttons">
                <Link to="/law-toolchain" className="btn btn-lg btn-primary">立即体验</Link>
                <a href="/src/pages/large-screen.html" target="_blank" className="btn btn-lg btn-secondary">了解更多</a>
              </div>
            </div>
            <div className="hero-image">
              <img src="https://img.alicdn.com/imgextra/i2/O1CN01n5Z6Xx1Z7X7X7X7X_!!6000000003475-2-tps-800-600.png" alt="智能合约法律条文诠释原型系统与应用平台" />
            </div>
          </div>
        </div>
      </section>

      {/* 产品特点 */}
      <section className="features">
        <div className="container">
          <h2>核心优势</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon flex items-center justify-center text-5xl mb-4">
                ⚡
              </div>
              <h3>性能效果更优</h3>
              <p>卓越的模型性能，满足企业多样化需求</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon flex items-center justify-center text-5xl mb-4">
                🎯
              </div>
              <h3>业务适配性更高</h3>
              <p>丰富多元的模型选择，适应多行业需求</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon flex items-center justify-center text-5xl mb-4">
                🔒
              </div>
              <h3>数据安全更可靠</h3>
              <p>严格的数据安全和隐私保护，符合合规要求</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon flex items-center justify-center text-5xl mb-4">
                💰
              </div>
              <h3>成本价格更可控</h3>
              <p>合理的价格策略，极大降低企业使用成本</p>
            </div>
          </div>
        </div>
      </section>

      {/* 系统建模 */}
      <section className="system-intro">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">系统建模</h2>
          </div>

          {/* 三大建模方式 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* 本体建模 */}
            <div className="bg-blue-50 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.location.href='/benmodel'}>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 text-blue-600 mr-3">📄</div>
                  <h3 className="text-xl font-bold text-gray-900">本体建模</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  本体是一个形式化的、共享的概念模型，其中包含了领域内的实体、概念、属性以及它们之间的关系。通过本体建模，可以实现对知识的一致性管理和共享，使不同系统和应用程序能够更好地理解和交互。这有助于解决信息集成和语义理解的问题，促进跨系统、跨组织的数据共享和协同工作。
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>相关工作：</strong>CML、Symboleo、SPESC...
                </p>

              </div>
            </div>

            {/* 业务建模 */}
            <div className="bg-green-50 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.location.href='/yemodel'}>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 text-green-600 mr-3">💼</div>
                  <h3 className="text-xl font-bold text-gray-900">业务建模</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  业务建模是通过对组织业务活动、流程、信息和角色等进行系统描述和分析，以图形化的方式呈现出各个层面的业务元素及其相互关系。这有助于团队成员更好地理解业务运作方式，识别问题和改进机会。通过业务建模，组织能够实现业务过程的透明度，促进内部沟通，提高工作效率，并为信息系统开发和业务优化提供重要支持。
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>相关工作：</strong>Caterpillar、Pupa、EPC...
                </p>

              </div>
            </div>

            {/* 价值建模 */}
            <div className="bg-purple-50 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.location.href='/jiamodel'}>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 text-purple-600 mr-3">💰</div>
                  <h3 className="text-xl font-bold text-gray-900">价值建模</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  价值建模是一种系统化的方法，旨在描述和分析系统或商业模型中的核心价值流。通过图形化的方式呈现参与者、活动和价值对象之间的关系，价值建模有助于深入理解组织或系统内部的价值创造和交换过程。这种方法通过捕捉关键的业务元素，如参与者角色、价值活动等，为决策者提供了对组织运作方式的清晰洞察，支持业务规划、分析和优化，从而促进系统或商业模型的可持续发展。
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>相关工作：</strong>e3value、Canvas...
                </p>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 底部 */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content flex justify-center">
            <div className="footer-section text-center">
              <h4>产品</h4>
              <ul>
                <li><span className="text-white/60 hover:text-white transition-colors cursor-pointer">合约要素提取模型</span></li>
                <li><span className="text-white/60 hover:text-white transition-colors cursor-pointer">合约一致性判定模型</span></li>
                <li><span className="text-white/60 hover:text-white transition-colors cursor-pointer">合同标注与识别系统</span></li>
                <li><span className="text-white/60 hover:text-white transition-colors cursor-pointer">语言转换引擎</span></li>
              </ul>
            </div>

            <div className="footer-section text-center">
              <h4>开发者</h4>
              <ul>
                <li><a href="/kaifatoolpage" className="text-white/60 hover:text-white transition-colors cursor-pointer" target="_blank">开发平台</a></li>
                <li><a href="/testing-platform" className="text-white/60 hover:text-white transition-colors cursor-pointer" target="_blank">测试平台</a></li>
                <li><a href="/intellectual-property" className="text-white/60 hover:text-white transition-colors cursor-pointer" target="_blank">知识产权</a></li>
              </ul>
            </div>
            <div className="footer-section text-center">
              <h4>关于我们</h4>
              <ul>
                <li><a href="https://www.cufe.edu.cn/" target="_blank">学校介绍</a></li>
                <li><a href="https://ie.cufe.edu.cn/" target="_blank">联系我们</a></li>
                <li><a href="https://ie.cufe.edu.cn/" target="_blank">加入我们</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom text-center">
            <p>中央财经大学信息学院所有</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index