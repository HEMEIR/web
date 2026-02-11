import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Login = () => {
  const [activeTab, setActiveTab] = useState('password'); // 'email' or 'password'
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  // 设置页面标题
  useEffect(() => {
    document.title = 'EyeLaw-登录';
  }, []);
  
  // 账号密码登录表单数据
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    emailPrefix: '',
    emailSuffix: '@qq.com',
    code: ''
  });
  
  // 验证错误信息
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    email: '',
    code: ''
  });
  
  // 验证码状态
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  // 邮箱后缀选项
  const emailSuffixes = ['@gmail.com', '@qq.com', '@163.com', '@126.com'];
  
  // 输入状态
  const [isTyping, setIsTyping] = useState(false);
  
  // 实时验证输入
  const validateInput = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'username':
        if (value.length < 3) {
          error = '用户名长度必须至少3个字符';
        } else if (value.length >= 20) {
          error = '用户名长度不能超过20个字符';
        } else if (!/^[a-zA-Z0-9_]*$/.test(value)) {
          error = '用户名只能使用字母、数字和下划线';
        }
        break;
        
      case 'password':
        if (value.length < 6) {
          error = '密码长度必须至少6个字符';
        } else if (value.length >= 20) {
          error = '密码长度不能超过20个字符';
        } else if (!/^[a-zA-Z0-9_]*$/.test(value)) {
          error = '密码只能使用字母、数字和下划线';
        }
        break;
        
      case 'emailPrefix':
        if (value.length > 0) {
          // 核心通用规则：小写英文字母、数字、点号、连字符、下划线
          // 不能以特殊字符开头或结尾，不能连续出现特殊字符
          if (!/^[a-z0-9]+([._-]?[a-z0-9]+)*$/.test(value)) {
            error = '请输入有效邮箱';
          } else if (value.length < 3 || value.length > 30) {
            error = '请输入有效邮箱';
          }
        } else {
          error = '请输入邮箱';
        }
        break;
        
      case 'code':
        if (value.length > 0 && value.length !== 6) {
          error = '验证码必须为6位数字';
        } else if (value.length > 0 && !/^[0-9]{6}$/.test(value)) {
          error = '验证码只能包含数字';
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };
  
  // 处理表单输入变化，添加SQL注入防御
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // 定义允许的字符正则表达式
    let allowedCharsRegex;
    let maxLength;
    
    // 根据字段类型设置不同的正则和最大长度
    if (name === 'code') {
      allowedCharsRegex = /[^0-9]/g;
      maxLength = 6;
    } else if (name === 'emailPrefix') {
      // 允许小写英文字母、数字、点号、连字符、下划线
      allowedCharsRegex = /[^a-z0-9._-]/g;
      maxLength = 30;
    } else if (name === 'password' || name === 'username') {
      allowedCharsRegex = /[^a-zA-Z0-9_]/g;
      maxLength = 20;
    } else {
      allowedCharsRegex = /[^a-zA-Z0-9_]/g;
      maxLength = 20;
    }
    
    // 清理输入值：移除不允许的字符
    let cleanedValue = value.replace(allowedCharsRegex, '');
    
    // 确保清理后的值不超过最大长度，截取前maxLength个字符
    if (cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.slice(0, maxLength);
    }
    
    // 更新表单数据
    setFormData(prev => {
      // 避免不必要的状态更新
      if (prev[name] === cleanedValue) return prev;
      return { ...prev, [name]: cleanedValue };
    });
  };
  
  // 清除所有错误提示
  const clearAllErrors = () => {
    setErrors({
      username: '',
      password: '',
      email: '',
      code: ''
    });
  };
  
  // 添加全局点击事件监听器
  useEffect(() => {
    const handleGlobalClick = () => {
      clearAllErrors();
    };
    
    // 添加点击事件监听器
    document.addEventListener('click', handleGlobalClick);
    
    // 清理函数
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);
  
  // 处理邮箱后缀选择
  const handleSuffixSelect = (e) => {
    const suffix = e.target.value;
    setFormData(prev => ({ ...prev, emailSuffix: suffix }));
  };
  
  // 发送验证码
  const handleSendCode = async () => {
    console.log('=== handleSendCode函数被调用 ===');
    console.log('当前formData:', formData);
    console.log('当前codeSent状态:', codeSent);
    
    // 先清除所有错误提示
    clearAllErrors();
    
    // 检查邮箱是否填写
    if (!formData.emailPrefix.trim()) {
      console.log('邮箱为空');
      setErrors(prev => ({ ...prev, emailPrefix: '请输入邮箱' }));
      return;
    }

    // 验证邮箱格式
    const emailPrefix = formData.emailPrefix.trim();
    if (!/^[a-z0-9]+([._-]?[a-z0-9]+)*$/.test(emailPrefix)) {
      setErrors(prev => ({ ...prev, emailPrefix: '请输入有效邮箱' }));
      return;
    }

    if (emailPrefix.length < 3 || emailPrefix.length > 30) {
      setErrors(prev => ({ ...prev, emailPrefix: '请输入有效邮箱' }));
      return;
    }

    // 构建完整邮箱
    const fullEmail = formData.emailPrefix + formData.emailSuffix;
    console.log('完整邮箱:', fullEmail);
    
    // 验证完整邮箱格式
    const allowedDomains = /@(gmail\.com|qq\.com|163\.com|126\.com)$/;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fullEmail)) {
      setErrors(prev => ({ ...prev, email: '请输入有效的邮箱地址' }));
      return;
    } else if (!allowedDomains.test(fullEmail)) {
      setErrors(prev => ({ ...prev, email: '只允许使用@gmail.com、@qq.com、@163.com、@126.com邮箱' }));
      return;
    }

    try {
      console.log('开始发送验证码，邮箱:', fullEmail);
      
      // 调用发送验证码API
      const response = await fetch('/api/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: fullEmail })
      });
      
      console.log('发送验证码API响应:', response);
      const data = await response.json();
      console.log('发送验证码API响应数据:', data);
      
      if (response.ok) {
        // 发送成功
        console.log('验证码发送成功');
        setCodeSent(true);
        setCountdown(60);
        alert('验证码发送成功，请注意查收');
        
        // 倒计时逻辑
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setCodeSent(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // 发送失败
        console.log('验证码发送失败:', data.error);
        const errorMsg = data.error || '验证码发送失败，请查看邮箱是否输入正确';
        setErrors(prev => ({ ...prev, email: errorMsg }));
        alert(errorMsg);
      }
    } catch (error) {
      console.error('发送验证码失败:', error.message);
      console.error('完整错误:', error);
      setErrors(prev => ({ ...prev, email: '验证码发送失败，请稍后重试' }));
    }
    console.log('=== handleSendCode函数结束 ===');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 导航栏 */}
      <Navbar />

      {/* 登录主体 */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">登录智能合约法律条文诠释原型系统与应用平台账号</h1>
              <p className="text-gray-600 mt-2">没有账号？<Link to="/register" className="text-blue-600 hover:text-blue-800">立即注册</Link></p>
            </div>

            {/* 登录方式切换 */}
            <div className="flex mb-6">
              <button 
                className={`flex-1 py-2 px-4 font-medium rounded-l-lg transition-colors ${activeTab === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setActiveTab('email')}
              >
                邮箱登录
              </button>
              <button 
                className={`flex-1 py-2 px-4 font-medium rounded-r-lg transition-colors ${activeTab === 'password' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setActiveTab('password')}
              >
                账号密码登录
              </button>
            </div>

            {/* 登录表单 */}
            <form onSubmit={(e) => {
              e.preventDefault();
              
              // 获取同意协议复选框
              const agreementCheckbox = document.getElementById('agreement');
              
              // 表单验证
              if (activeTab === 'password') {
                if (!formData.username.trim()) {
                  alert('请输入用户名');
                  return;
                }
                if (!formData.password.trim()) {
                  alert('请输入密码');
                  return;
                }
              } else {
                  if (!formData.emailPrefix.trim()) {
                    alert('请输入邮箱');
                    return;
                  }
                if (!formData.code.trim()) {
                  alert('请输入验证码');
                  return;
                }
              }
              
              if (!agreementCheckbox.checked) {
                alert('请阅读并同意《用户服务协议》和《隐私政策》');
                return;
              }
              
              // 构建请求数据
              const loginData = activeTab === 'password' ? {
                username: formData.username.trim(),
                password: formData.password.trim()
              } : {
                email: (formData.emailPrefix + formData.emailSuffix).trim(),
                code: formData.code.trim()
              };
              
              // 发送登录请求
      fetch('/api/login' + (activeTab === 'email' ? '/sms' : ''), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData),
        credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert('登录失败: ' + data.error);
        } else {
          // 登录成功，将用户信息和token存储到localStorage
          localStorage.setItem('user', JSON.stringify({ userId: data.userId, username: data.username, email: data.email }));
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
          // 跳转到首页
          window.location.href = '/';
        }
      })
      .catch(error => {
        console.error('登录失败:', error);
        alert('登录失败: ' + error.message);
      });
            }}>
              <div className="space-y-4">
                {/* 邮箱登录字段 */}
                {activeTab === 'email' && (
                  <>
                    {/* 邮箱 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                      <div className="relative">
                        <div className="flex">
                          <input 
                            type="text" 
                            name="emailPrefix"
                            className={`flex-1 border ${errors.emailPrefix || errors.email ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                            placeholder="请输入邮箱"
                            value={formData.emailPrefix}
                            onChange={handleInputChange}
                          />
                          {/* 下拉菜单触发器 */}
                          <div className="relative">
                            <select 
                              name="emailSuffix"
                              className="border border-l-0 border-gray-300 rounded-r-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={formData.emailSuffix}
                              onChange={handleSuffixSelect}
                            >
                              {emailSuffixes.map(suffix => (
                                <option key={suffix} value={suffix}>{suffix}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      {(errors.emailPrefix || errors.email) && <p className="text-red-500 text-xs mt-1">{errors.emailPrefix || errors.email}</p>}
                    </div>

                    {/* 验证码 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">验证码</label>
                      <div className="flex">
                        <input 
                          type="text" 
                          name="code"
                          maxLength={6}
                          className={`flex-1 border ${errors.code ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                          placeholder="请输入验证码"
                          value={formData.code}
                          onChange={handleInputChange}
                        />
                        <button 
                  type="button" 
                  className={`border ${codeSent ? 'border-gray-300' : 'border-blue-600'} ${codeSent ? 'bg-gray-100 text-gray-500' : 'bg-white text-blue-600'} rounded-r-lg px-4 py-2 hover:bg-blue-50 font-medium transition-colors`}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('=== 按钮onClick事件触发 ===');
                    console.log('事件对象:', e);
                    console.log('按钮DOM元素:', e.currentTarget);
                    console.log('准备调用handleSendCode...');
                    handleSendCode();
                  }}
                  onMouseDown={() => console.log('=== 按钮onMouseDown事件触发 ===')}
                  onMouseUp={() => console.log('=== 按钮onMouseUp事件触发 ===')}
                  disabled={codeSent}
                >
                  {codeSent ? `${countdown}秒后重新获取` : '获取验证码'}
                </button>
                      </div>
                      {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                    </div>
                  </>
                )}

                {/* 账号密码登录字段 */}
                {activeTab === 'password' && (
                  <>
                    {/* 用户名 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                      <input 
                          id="username-input" 
                          name="username"
                          type="text" 
                          maxLength={20}
                          className={`w-full border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                          placeholder="请输入用户名"
                          value={formData.username}
                          onChange={handleInputChange}
                        />
                      {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                    </div>

                    {/* 密码 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                      <div className="relative">
                        <input 
                          id="password-input" 
                          name="password"
                          type={passwordVisible ? "text" : "password"} 
                          maxLength={20}
                          className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                          placeholder="请输入密码"
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                          {passwordVisible ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                  </>
                )}

                <div className="flex items-start">
                  <input type="checkbox" id="agreement" className="mt-1" />
                  <label htmlFor="agreement" className="ml-2 text-sm text-gray-600">
                    我已阅读并同意 <a href="#" className="text-blue-600 hover:text-blue-800">《用户服务协议》</a> 和 <a href="#" className="text-blue-600 hover:text-blue-800">《隐私政策》</a>
                  </label>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  {activeTab === 'email' ? '邮箱登录' : '账号密码登录'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-100 py-4">
        <div className="container text-center text-gray-600 text-sm">
          <p>© 2026 智能合约法律条文诠释原型系统与应用平台 保留所有权利.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;