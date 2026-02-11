import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Register = () => {
  // 设置页面标题
  useEffect(() => {
    document.title = 'EyeLaw-注册';
  }, []);
  
  const [activeTab, setActiveTab] = useState('email'); // 'email' or 'password'
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    code: '',
    agreement: ''
  });
  
  // 表单数据状态
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    emailPrefix: '',
    emailSuffix: '@qq.com',
    code: ''
  });
  
  // 邮箱后缀选项
  const emailSuffixes = ['@gmail.com', '@qq.com', '@163.com', '@126.com'];
  
  // 验证码状态
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
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
        
      case 'confirmPassword':
        if (value !== formData.password) {
          error = '两次输入的密码不一致';
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
    } else if (name === 'password' || name === 'confirmPassword' || name === 'username') {
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
      confirmPassword: '',
      email: '',
      code: '',
      agreement: ''
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

  // 处理协议勾选变化
  const handleAgreementChange = (e) => {
    setAgreementChecked(e.target.checked);
    if (!e.target.checked) {
      setErrors(prev => ({ ...prev, agreement: '请阅读并同意用户协议和隐私政策' }));
    } else {
      setErrors(prev => ({ ...prev, agreement: '' }));
    }
  };

  // 生成6位随机验证码
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // 检测邮箱是否已存在
  const checkEmailExists = async () => {
    try {
      // 构建完整邮箱
      const fullEmail = formData.emailPrefix + formData.emailSuffix;
      // 实现邮箱重复检测API调用
      const response = await fetch('/api/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: fullEmail })
      });
      const data = await response.json();
      return response.ok && data.exists;
    } catch (error) {
      console.error('检测邮箱失败:', error);
      return false;
    }
  };

  // 发送验证码
  const handleSendCode = async () => {
    console.log('=== Register页面handleSendCode函数被调用 ===');
    // 先清除所有错误提示
    clearAllErrors();
    
    // 检查邮箱是否填写
    if (!formData.emailPrefix.trim()) {
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

    // 检查邮箱是否已存在
    const emailExists = await checkEmailExists();
    if (emailExists) {
      setErrors(prev => ({ ...prev, email: '该邮箱已被注册' }));
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
      
      console.log('发送验证码API响应状态:', response.status);
      console.log('发送验证码API响应ok:', response.ok);
      const data = await response.json();
      console.log('发送验证码API响应数据:', data);
      
      if (response.ok) {
        // 发送成功
        console.log('验证码发送成功，执行成功逻辑');
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
        console.log('验证码发送失败，执行失败逻辑，错误信息:', data.error);
        const errorMsg = data.error || '验证码发送失败，请查看邮箱是否输入正确';
        setErrors(prev => ({ ...prev, email: errorMsg }));
        alert(errorMsg);
      }
    } catch (error) {
      console.error('发送验证码失败:', error.message);
      console.error('完整错误:', error);
      setErrors(prev => ({ ...prev, email: '验证码发送失败，请稍后重试' }));
    }
  };

  // 完整表单验证
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (activeTab === 'password') {
      // 账号密码注册验证
      if (!formData.username.trim()) {
        newErrors.username = '请输入用户名';
        isValid = false;
      }
      if (!formData.password.trim()) {
        newErrors.password = '请输入密码';
        isValid = false;
      }
      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = '请确认密码';
        isValid = false;
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '两次输入的密码不一致';
        isValid = false;
      }
    } else {
      // 邮箱注册验证
      if (!formData.emailPrefix.trim()) {
        newErrors.emailPrefix = '请输入邮箱';
        isValid = false;
      }
      if (!formData.code.trim()) {
        newErrors.code = '请输入验证码';
        isValid = false;
      }
    }

    // 协议勾选验证
    if (!agreementChecked) {
      newErrors.agreement = '请阅读并同意用户协议和隐私政策';
      isValid = false;
    } else {
      newErrors.agreement = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  // 检测用户名是否已存在
  const checkUsernameExists = async () => {
    try {
      // 实现用户名重复检测API调用
      const response = await fetch('/api/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: formData.username })
      });
      const data = await response.json();
      return response.ok && data.exists;
    } catch (error) {
      console.error('检测用户名失败:', error);
      return false;
    }
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (activeTab === 'password') {
        // 先清除所有错误提示
        clearAllErrors();
        
        // 对用户名进行检测
        const username = formData.username.trim();
        if (!username) {
          setErrors(prev => ({ ...prev, username: '请输入用户名' }));
          return;
        }
        
        if (username.length < 3) {
          setErrors(prev => ({ ...prev, username: '用户名长度必须至少3个字符' }));
          return;
        }
        
        if (username.length >= 20) {
          setErrors(prev => ({ ...prev, username: '用户名长度不能超过20个字符' }));
          return;
        }
        
        if (!/^[a-zA-Z0-9_]*$/.test(username)) {
          setErrors(prev => ({ ...prev, username: '用户名只能使用字母、数字和下划线' }));
          return;
        }
        
        // 对密码进行检测
        const password = formData.password.trim();
        if (!password) {
          setErrors(prev => ({ ...prev, password: '请输入密码' }));
          return;
        }
        
        if (password.length < 6) {
          setErrors(prev => ({ ...prev, password: '密码长度必须至少6个字符' }));
          return;
        }
        
        if (password.length >= 20) {
          setErrors(prev => ({ ...prev, password: '密码长度不能超过20个字符' }));
          return;
        }
        
        if (!/^[a-zA-Z0-9_]*$/.test(password)) {
          setErrors(prev => ({ ...prev, password: '密码只能使用字母、数字和下划线' }));
          return;
        }
        
        // 对确认密码进行检测
        const confirmPassword = formData.confirmPassword.trim();
        if (!confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: '请确认密码' }));
          return;
        }
        
        if (password !== confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: '两次输入的密码不一致' }));
          return;
        }
        
        // 账号密码注册：检查用户名是否已存在
        const usernameExists = await checkUsernameExists();
        if (usernameExists) {
          setErrors(prev => ({ ...prev, username: '该用户名已被使用' }));
          return;
        }
        
        // 保存表单数据，切换到邮箱注册
        alert('账号密码信息已保存，请完成邮箱验证');
        setActiveTab('email');
      } else {
        // 邮箱注册：验证验证码
        try {
          // 构建完整邮箱
          const fullEmail = formData.emailPrefix + formData.emailSuffix;
          
          // 调用后端API验证验证码
          const verifyResponse = await fetch('/api/verify-code', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: fullEmail,
              code: formData.code
            })
          });

          const verifyData = await verifyResponse.json();
          
          if (verifyResponse.ok) {
            // 验证码正确，保存用户数据到数据库
            // 只有当用户名和密码都不为空时，才发送它们到服务器
            const registerData = {
              email: fullEmail
            };
            
            // 如果用户之前在账号密码注册页面输入了账号密码，则添加到注册数据中
            if (formData.username.trim()) {
              registerData.username = formData.username;
            }
            if (formData.password.trim()) {
              registerData.password = formData.password;
            }
            
            const registerResponse = await fetch('/api/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(registerData)
            });

            const responseData = await registerResponse.json();

            if (registerResponse.ok) {
              alert('注册成功，请登录');
              window.location.href = '/login';
            } else {
              alert('注册失败: ' + (responseData.error || '注册失败'));
            }
          } else {
            // 验证码错误
            setErrors(prev => ({ ...prev, code: verifyData.error || '验证码错误' }));
          }
        } catch (error) {
          console.error('注册失败:', error);
          alert('网络错误，注册失败');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 导航栏 */}
      <Navbar />

      {/* 注册主体 */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 左侧表单 */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">注册智能合约法律条文诠释原型系统与应用平台账号</h1>
              <p className="text-gray-600 mt-2">已有账号？<Link to="/login" className="text-blue-600 hover:text-blue-800">立即登录</Link></p>
            </div>

            {/* 注册方式切换 */}
            <div className="flex mb-6">
              <button 
                className={`flex-1 py-2 px-4 font-medium rounded-l-lg transition-colors ${activeTab === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setActiveTab('email')}
              >
                邮箱注册
              </button>
              <button 
                className={`flex-1 py-2 px-4 font-medium rounded-r-lg transition-colors ${activeTab === 'password' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setActiveTab('password')}
              >
                账号密码注册
              </button>
            </div>

            {/* 注册表单 */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* 邮箱注册字段 */}
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
                            console.log('=== 注册页面按钮被点击，准备调用handleSendCode ===');
                            handleSendCode();
                          }}
                          disabled={codeSent}
                        >
                          {codeSent ? `${countdown}秒后重新获取` : '获取验证码'}
                        </button>
                      </div>
                      {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                    </div>
                  </>
                )}

                {/* 账号密码注册字段 */}
                {activeTab === 'password' && (
                  <>
                    {/* 用户名 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                      <input 
                        type="text" 
                        name="username"
                        maxLength={20}
                        className={`w-full border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                        placeholder="请设置用户名"
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
                          id="register-password" 
                          name="password"
                          type={passwordVisible ? "text" : "password"} 
                          maxLength={20}
                          className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                          placeholder="请设置登录密码"
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
                              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    {/* 确认密码 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
                      <div className="relative">
                        <input 
                          id="register-confirm-password" 
                          name="confirmPassword"
                          type={confirmPasswordVisible ? "text" : "password"} 
                          maxLength={20}
                          className={`w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                          placeholder="请确认登录密码"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                        >
                          {confirmPasswordVisible ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </>
                )}

                <div className="flex items-start">
                  <input 
                    type="checkbox" 
                    id="agreement" 
                    className="mt-1"
                    checked={agreementChecked}
                    onChange={handleAgreementChange}
                  />
                  <label htmlFor="agreement" className="ml-2 text-sm text-gray-600">
                    我已阅读并同意 <a href="#" className="text-blue-600 hover:text-blue-800">《用户服务协议》</a> 和 <a href="#" className="text-blue-600 hover:text-blue-800">《隐私政策》</a>
                  </label>
                </div>
                {errors.agreement && <p className="text-red-500 text-xs mt-1">{errors.agreement}</p>}

                <button type="submit" className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  {activeTab === 'email' ? '邮箱注册' : '账号密码注册'}
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

export default Register;