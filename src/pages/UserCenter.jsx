import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Trash2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const UserCenter = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 设置页面标题
  useEffect(() => {
    document.title = 'EyeLaw-用户中心';
  }, []);
  
  // 个人资料状态
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // 修改密码状态
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordCode, setPasswordCode] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStep, setPasswordStep] = useState(1); // 1: 输入新密码, 2: 验证邮箱
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordCodeSent, setPasswordCodeSent] = useState(false);
  const [passwordCountdown, setPasswordCountdown] = useState(0);
  const [passwordCodeError, setPasswordCodeError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // 更换邮箱状态
  const [currentEmailCode, setCurrentEmailCode] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newEmailPrefix, setNewEmailPrefix] = useState('');
  const [newEmailSuffix, setNewEmailSuffix] = useState('@qq.com');
  const [newEmailCode, setNewEmailCode] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailStep, setEmailStep] = useState(1); // 1: 验证当前邮箱, 2: 输入新邮箱, 3: 验证新邮箱
  const [currentEmailCodeSent, setCurrentEmailCodeSent] = useState(false);
  const [currentEmailCountdown, setCurrentEmailCountdown] = useState(0);
  const [newEmailCodeSent, setNewEmailCodeSent] = useState(false);
  const [newEmailCountdown, setNewEmailCountdown] = useState(0);
  const [currentEmailCodeError, setCurrentEmailCodeError] = useState('');
  const [newEmailCodeError, setNewEmailCodeError] = useState('');
  const [newEmailError, setNewEmailError] = useState('');
  
  // 邮箱后缀选项
  const emailSuffixes = ['@gmail.com', '@qq.com', '@163.com', '@126.com'];
  
  // 注销账号状态
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteProcessing, setShowDeleteProcessing] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [ellipsisCount, setEllipsisCount] = useState(1);
  
  // 修改密码状态
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
  const [showNoPassword, setShowNoPassword] = useState(false);
  
  // 通知弹窗状态
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  const navigate = useNavigate();
  
  // 检查用户登录状态
  useEffect(() => {
    const checkLoginStatus = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUsername(parsedUser.username || '');
      } else {
        setError('请先登录');
        setTimeout(() => {
          window.close();
        }, 2000);
      }
      setLoading(false);
    };
    
    checkLoginStatus();
  }, []);
  
  // 动态省略号效果
  useEffect(() => {
    let interval;
    if (showDeleteProcessing) {
      interval = setInterval(() => {
        setEllipsisCount(prev => (prev % 3) + 1);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [showDeleteProcessing]);
  
  // 发送验证码
  const sendVerificationCode = async (email, purpose) => {
    try {
      console.log('=== 开始发送验证码 ===');
      console.log('发送参数:', { email });
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ email })
      });
      
      console.log('响应状态:', response.status);
      console.log('响应状态文本:', response.statusText);
      console.log('响应URL:', response.url);
      
      // 获取响应文本，以便检查是否为HTML
      const responseText = await response.text();
      console.log('响应文本长度:', responseText.length);
      console.log('响应文本前100个字符:', responseText.substring(0, 100));
      
      // 检查响应是否为HTML
      if (responseText.startsWith('<!DOCTYPE')) {
        console.error('响应是HTML而非JSON:', responseText.substring(0, 200));
        throw new Error('服务器返回了HTML页面，请检查后端服务是否正常运行');
      }
      
      // 尝试解析响应为JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('解析后的响应数据:', data);
      } catch (jsonError) {
        console.error('JSON解析错误:', jsonError);
        throw new Error('服务器响应格式错误，请稍后重试');
      }
      
      // 检查响应是否成功
      if (!response.ok) {
        throw new Error(data.error || '发送验证码失败');
      }
      
      console.log('=== 验证码发送成功 ===');
      return data.message;
    } catch (error) {
      console.error('发送验证码失败:', error);
      setError(error.message);
      return null;
    }
  };
  
  // 验证验证码
  const verifyCode = async (email, code) => {
    try {
      console.log('=== 开始验证验证码 ===');
      console.log('验证参数:', { email, code });
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ email, code })
      });
      
      console.log('响应状态:', response.status);
      console.log('响应状态文本:', response.statusText);
      console.log('响应URL:', response.url);
      
      // 获取响应文本，以便检查是否为HTML
      const responseText = await response.text();
      console.log('响应文本长度:', responseText.length);
      console.log('响应文本前100个字符:', responseText.substring(0, 100));
      
      // 检查响应是否为HTML
      if (responseText.startsWith('<!DOCTYPE')) {
        console.error('响应是HTML而非JSON:', responseText.substring(0, 200));
        throw new Error('服务器返回了HTML页面，请检查后端服务是否正常运行');
      }
      
      // 尝试解析响应为JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('解析后的响应数据:', data);
      } catch (jsonError) {
        console.error('JSON解析错误:', jsonError);
        throw new Error('服务器响应格式错误，请稍后重试');
      }
      
      // 检查响应是否成功
      if (!response.ok) {
        throw new Error(data.error || '验证失败');
      }
      
      console.log('=== 验证码验证成功 ===');
      return data.message;
    } catch (error) {
      console.error('验证验证码失败:', error);
      // 使用弹窗提示验证码错误
      setNotificationMessage(error.message);
      setShowNotification(true);
      return null;
    }
  };
  
  // 补充个人资料
  const handleUpdateProfile = async () => {
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }
    
    // 验证用户名和密码格式
    if (username.length < 3 || username.length > 20) {
      setError('用户名长度必须在3-20个字符之间');
      return;
    }
    
    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]{3,20}$/.test(username)) {
      setError('用户名只能包含字母、数字、下划线和中文');
      return;
    }
    
    if (password.length < 6 || password.length > 20) {
      setError('密码长度必须在6-20个字符之间');
      return;
    }
    
    if (!/^[a-zA-Z0-9_]{6,20}$/.test(password)) {
      setError('密码只能包含字母、数字和下划线，不允许中文');
      return;
    }
    
    setProfileLoading(true);
    try {
      console.log('=== 开始更新用户资料 ===');
      console.log('更新参数:', { userId: user.userId, username });
      
      const token = localStorage.getItem('token');
      // 调用API更新用户资料
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ 
          userId: String(user.userId), 
          username, 
          password 
        })
      });
      
      console.log('响应状态:', response.status);
      console.log('响应状态文本:', response.statusText);
      console.log('响应URL:', response.url);
      
      // 获取响应文本，以便检查是否为HTML
      const responseText = await response.text();
      console.log('响应文本长度:', responseText.length);
      console.log('响应文本前100个字符:', responseText.substring(0, 100));
      
      // 检查响应是否为HTML
      if (responseText.startsWith('<!DOCTYPE')) {
        console.error('响应是HTML而非JSON:', responseText.substring(0, 200));
        throw new Error('服务器返回了HTML页面，请检查后端服务是否正常运行');
      }
      
      // 尝试解析响应为JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('解析后的响应数据:', data);
      } catch (jsonError) {
        console.error('JSON解析错误:', jsonError);
        throw new Error('服务器响应格式错误，请稍后重试');
      }
      
      if (!response.ok) {
        throw new Error(data.error || '更新资料失败');
      }
      
      // 更新本地存储的用户信息
      const updatedUser = { ...user, username };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setNotificationMessage('资料更新成功');
      setShowNotification(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setProfileLoading(false);
    }
  };
  
  // 修改密码
  const handleChangePassword = async () => {
    // 首先检查用户信息
    let currentUser = user;
    if (!currentUser || !currentUser.userId) {
      // 尝试从本地存储重新获取用户信息
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          currentUser = parsedUser;
          if (!currentUser.userId) {
            setError('用户信息不完整，请重新登录');
            return;
          }
        } catch (e) {
          setError('用户信息损坏，请重新登录');
          return;
        }
      } else {
        setError('用户信息不完整，请重新登录');
        return;
      }
    }
    
    if (passwordStep === 1) {
      // 清除之前的错误
      setNewPasswordError('');
      setConfirmPasswordError('');
      
      // 验证密码格式
      if (newPassword.length < 6 || newPassword.length > 20) {
        setNewPasswordError('密码长度必须在6-20个字符之间');
        return;
      }
      
      if (!/^[a-zA-Z0-9_]{6,20}$/.test(newPassword)) {
        setNewPasswordError('密码只能包含字母、数字和下划线');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setConfirmPasswordError('两次输入的密码不一致');
        return;
      }
      
      // 检查用户是否有密码
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/check-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({ 
            userId: String(currentUser.userId) 
          })
        });
        
        console.log('检查密码API响应状态:', response.status);
        
        const responseText = await response.text();
        console.log('检查密码API响应文本:', responseText);
        
        let data;
        try {
          data = JSON.parse(responseText);
          console.log('检查密码API解析后的数据:', data);
        } catch (jsonError) {
          console.error('JSON解析错误:', jsonError);
          throw new Error('服务器响应格式错误，请稍后重试');
        }
        
        if (!response.ok) {
          throw new Error(data.error || '检查密码失败');
        }
        
        // 如果用户没有密码，显示提示弹窗
        if (!data.hasPassword) {
          setShowNoPassword(true);
          return;
        }
      } catch (error) {
        console.error('检查密码失败:', error);
        setError(error.message);
        return;
      }
      
      // 发送验证码到当前邮箱
      const message = await sendVerificationCode(currentUser.email, 'password');
      if (message) {
        setPasswordStep(2);
        setNotificationMessage('验证码已发送到您的邮箱');
        setShowNotification(true);
        
        // 启动冷却时间
        setPasswordCodeSent(true);
        setPasswordCountdown(60);
        
        // 倒计时逻辑
        const timer = setInterval(() => {
          setPasswordCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setPasswordCodeSent(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else if (passwordStep === 2) {
      // 验证邮箱验证码
      const message = await verifyCode(currentUser.email, passwordCode);
      if (message) {
        setPasswordLoading(true);
        try {
          console.log('=== 开始修改密码 ===');
          console.log('修改参数:', { userId: currentUser.userId });
          
          const token = localStorage.getItem('token');
          // 调用API修改密码
          const response = await fetch('/api/change-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify({ 
              userId: String(currentUser.userId), 
              newPassword 
            })
          });
          
          console.log('响应状态:', response.status);
          console.log('响应状态文本:', response.statusText);
          console.log('响应URL:', response.url);
          
          // 获取响应文本，以便检查是否为HTML
          const responseText = await response.text();
          console.log('响应文本长度:', responseText.length);
          console.log('响应文本前100个字符:', responseText.substring(0, 100));
          
          // 检查响应是否为HTML
          if (responseText.startsWith('<!DOCTYPE')) {
            console.error('响应是HTML而非JSON:', responseText.substring(0, 200));
            throw new Error('服务器返回了HTML页面，请检查后端服务是否正常运行');
          }
          
          // 尝试解析响应为JSON
          let data;
          try {
            data = JSON.parse(responseText);
            console.log('解析后的响应数据:', data);
          } catch (jsonError) {
            console.error('JSON解析错误:', jsonError);
            throw new Error('服务器响应格式错误，请稍后重试');
          }
          
          if (!response.ok) {
            throw new Error(data.error || '修改密码失败');
          }
          
          // 密码修改成功，显示等待弹窗
          setShowPasswordSuccess(true);
          
          // 清除本地存储中的用户信息
          localStorage.removeItem('user');
          
          // 延迟跳转到登录页面
          setTimeout(() => {
            // 跳转到登录页面
            window.location.href = '/login';
          }, 3000);
        } catch (error) {
          setError(error.message);
        } finally {
          setPasswordLoading(false);
        }
      }
    }
  };
  
  // 更换邮箱
  const handleChangeEmail = async () => {
    if (!user.userId) {
      setError('用户信息不完整，请重新登录');
      return;
    }
    
    if (emailStep === 1) {
      // 验证当前邮箱
      const message = await verifyCode(user.email, currentEmailCode);
      if (message) {
        setEmailStep(2);
        setNotificationMessage('当前邮箱验证成功');
        setShowNotification(true);
      }
    } else if (emailStep === 2) {
      // 构建完整的新邮箱地址
      const fullEmail = newEmailPrefix + newEmailSuffix;
      setNewEmail(fullEmail);
      
      // 验证新邮箱格式
      const allowedDomains = /@(gmail\.com|qq\.com|163\.com|126\.com)$/;
      if (!/^[a-z0-9]+([._-]?[a-z0-9]+)*@(gmail\.com|qq\.com|163\.com|126\.com)$/.test(fullEmail)) {
        setError('邮箱格式不正确，只允许@gmail.com、@qq.com、@163.com、@126.com');
        return;
      }
      
      // 发送验证码到新邮箱
      const message = await sendVerificationCode(fullEmail, 'new-email');
      if (message) {
        setEmailStep(3);
        setNotificationMessage('验证码已发送到新邮箱');
        setShowNotification(true);
        
        // 启动冷却时间
        setNewEmailCodeSent(true);
        setNewEmailCountdown(60);
        
        // 倒计时逻辑
        const timer = setInterval(() => {
          setNewEmailCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setNewEmailCodeSent(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else if (emailStep === 3) {
      // 验证新邮箱验证码
      const message = await verifyCode(newEmail, newEmailCode);
      if (message) {
        setEmailLoading(true);
        try {
          console.log('=== 开始更换邮箱 ===');
          console.log('更换参数:', { userId: user.userId, newEmail });
          
          const token = localStorage.getItem('token');
          // 调用API修改邮箱
          const response = await fetch('/api/change-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify({ 
              userId: String(user.userId), 
              newEmail 
            })
          });
          
          console.log('响应状态:', response.status);
          console.log('响应状态文本:', response.statusText);
          console.log('响应URL:', response.url);
          
          // 获取响应文本，以便检查是否为HTML
          const responseText = await response.text();
          console.log('响应文本长度:', responseText.length);
          console.log('响应文本前100个字符:', responseText.substring(0, 100));
          
          // 检查响应是否为HTML
          if (responseText.startsWith('<!DOCTYPE')) {
            console.error('响应是HTML而非JSON:', responseText.substring(0, 200));
            throw new Error('服务器返回了HTML页面，请检查后端服务是否正常运行');
          }
          
          // 尝试解析响应为JSON
          let data;
          try {
            data = JSON.parse(responseText);
            console.log('解析后的响应数据:', data);
          } catch (jsonError) {
            console.error('JSON解析错误:', jsonError);
            throw new Error('服务器响应格式错误，请稍后重试');
          }
          
          if (!response.ok) {
            throw new Error(data.error || '更换邮箱失败');
          }
          
          // 更新本地存储的用户信息
          const updatedUser = { ...user, email: newEmail };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
          setNotificationMessage('邮箱更换成功');
          setShowNotification(true);
          setEmailStep(1);
          setCurrentEmailCode('');
          setNewEmail('');
          setNewEmailPrefix('');
          setNewEmailSuffix('@qq.com');
          setNewEmailCode('');
          setNewEmailError('');
        } catch (error) {
          setError(error.message);
        } finally {
          setEmailLoading(false);
        }
      }
    }
  };
  
  // 注销账号
  const handleDeleteAccount = async () => {
    if (!user.userId) {
      setError('用户信息不完整，请重新登录');
      setShowDeleteConfirm(false);
      return;
    }
    
    setDeleteLoading(true);
    setShowDeleteConfirm(false);
    setShowDeleteProcessing(true);
    
    try {
      console.log('=== 开始注销账号 ===');
      console.log('注销参数:', { userId: user.userId });
      
      const token = localStorage.getItem('token');
      // 调用API注销账号
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ 
          userId: String(user.userId) 
        })
      });
      
      console.log('响应状态:', response.status);
      console.log('响应状态文本:', response.statusText);
      console.log('响应URL:', response.url);
      
      // 获取响应文本，以便检查是否为HTML
      const responseText = await response.text();
      console.log('响应文本长度:', responseText.length);
      console.log('响应文本前100个字符:', responseText.substring(0, 100));
      
      // 检查响应是否为HTML
      if (responseText.startsWith('<!DOCTYPE')) {
        console.error('响应是HTML而非JSON:', responseText.substring(0, 200));
        throw new Error('服务器返回了HTML页面，请检查后端服务是否正常运行');
      }
      
      // 尝试解析响应为JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('解析后的响应数据:', data);
      } catch (jsonError) {
        console.error('JSON解析错误:', jsonError);
        throw new Error('服务器响应格式错误，请稍后重试');
      }
      
      if (!response.ok) {
        throw new Error(data.error || '注销账号失败');
      }
      
      // 清除本地存储的用户信息
      localStorage.removeItem('user');
      
      // 延迟跳转到首页
      setTimeout(() => {
        // 跳转到首页
        window.location.href = '/';
      }, 3000);
    } catch (error) {
      setError(error.message);
      setShowDeleteProcessing(false);
    } finally {
      setDeleteLoading(false);
    }
  };
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 左侧目录 */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
                <h2 className="text-xl font-bold text-white mb-2">用户中心</h2>
                <p className="text-blue-100 text-sm">管理您的账号信息</p>
              </div>
              <nav className="p-4 space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <User className="h-5 w-5" />
                  <span>个人资料</span>
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${activeTab === 'password' ? 'bg-blue-50 text-blue-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Lock className="h-5 w-5" />
                  <span>修改密码</span>
                </button>
                <button
                  onClick={() => setActiveTab('email')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${activeTab === 'email' ? 'bg-blue-50 text-blue-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Mail className="h-5 w-5" />
                  <span>更换绑定邮箱</span>
                </button>
                <button
                  onClick={() => setActiveTab('delete')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${activeTab === 'delete' ? 'bg-red-50 text-red-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Trash2 className="h-5 w-5" />
                  <span>注销账号</span>
                </button>
              </nav>
            </div>
          </div>
          
          {/* 右侧内容 */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              {/* 个人资料 */}
              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="h-6 w-6 text-blue-600" />
                    个人资料
                  </h3>
                  
                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
                        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                          {user.username || '未设置'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">绑定邮箱</label>
                        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {!user.username && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">补充个人资料</h4>
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            maxLength={20}
                            className={`w-full border ${error.includes('用户名') ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="请输入用户名"
                          />
                          {error.includes('用户名') && <p className="text-red-500 text-xs mt-1">{error}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              maxLength={20}
                              className={`w-full border ${error.includes('密码') ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                              placeholder="请输入密码"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                          {error.includes('密码') && <p className="text-red-500 text-xs mt-1">{error}</p>}
                        </div>
                        <button
                          onClick={handleUpdateProfile}
                          disabled={profileLoading}
                          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                        >
                          {profileLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              更新中...
                            </>
                          ) : (
                            '补充资料'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* 修改密码 */}
              {activeTab === 'password' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Lock className="h-6 w-6 text-blue-600" />
                    修改密码
                  </h3>
                  
                  {passwordStep === 1 && (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => {
                              // 只允许输入字母、数字和下划线
                              const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                              setNewPassword(value);
                              // 如果用户输入了非法字符，显示提示
                              if (e.target.value !== value) {
                                setNewPasswordError('密码只能包含字母、数字和下划线');
                              } else {
                                // 清除错误提示
                                setNewPasswordError('');
                              }
                            }}
                            maxLength={20}
                            className={`w-full border ${newPasswordError ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="请输入新密码"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {newPasswordError && <p className="text-red-500 text-xs mt-1">{newPasswordError}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                              // 只允许输入字母、数字和下划线
                              const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                              setConfirmPassword(value);
                              // 如果用户输入了非法字符，显示提示
                              if (e.target.value !== value) {
                                setConfirmPasswordError('密码只能包含字母、数字和下划线');
                              } else {
                                // 清除错误提示
                                setConfirmPasswordError('');
                              }
                            }}
                            maxLength={20}
                            className={`w-full border ${confirmPasswordError ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="请再次输入新密码"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {confirmPasswordError && <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>}
                      </div>
                      <button
                        onClick={handleChangePassword}
                        disabled={passwordLoading}
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                      >
                        {passwordLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            处理中...
                          </>
                        ) : (
                          '下一步'
                        )}
                      </button>
                    </div>
                  )}
                  
                  {passwordStep === 2 && (
                    <div className="space-y-5">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-700 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          验证码已发送到您的邮箱: {user.email}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">验证码</label>
                        <div className="flex space-x-3">
                          <input
                            type="text"
                            value={passwordCode}
                            onChange={(e) => {
                              // 只允许输入数字
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              setPasswordCode(value);
                              // 如果用户输入了非法字符，显示提示
                              if (e.target.value !== value) {
                                setPasswordCodeError('验证码只能包含数字');
                              } else {
                                setPasswordCodeError('');
                              }
                            }}
                            maxLength={6}
                            className={`flex-1 px-4 py-3 border ${passwordCodeError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="请输入验证码"
                          />
                          <button
                            onClick={async () => {
                              const message = await sendVerificationCode(user.email, 'password');
                              if (message) {
                                setNotificationMessage('验证码已重新发送到您的邮箱');
                                setShowNotification(true);
                                
                                // 重置冷却时间
                                setPasswordCodeSent(true);
                                setPasswordCountdown(60);
                                
                                // 倒计时逻辑
                                const timer = setInterval(() => {
                                  setPasswordCountdown(prev => {
                                    if (prev <= 1) {
                                      clearInterval(timer);
                                      setPasswordCodeSent(false);
                                      return 0;
                                    }
                                    return prev - 1;
                                  });
                                }, 1000);
                              }
                            }}
                            disabled={passwordCodeSent}
                            className={`px-4 py-3 rounded-lg font-medium transition-colors ${passwordCodeSent ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            {passwordCodeSent ? `${passwordCountdown}秒后重新获取` : '重新发送'}
                          </button>
                        </div>
                        {passwordCodeError && <p className="text-red-500 text-xs mt-1">{passwordCodeError}</p>}
                      </div>
                      <button
                        onClick={handleChangePassword}
                        disabled={passwordLoading}
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                      >
                        {passwordLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            处理中...
                          </>
                        ) : (
                          '确认修改'
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setPasswordStep(1);
                          setPasswordCodeSent(false);
                          setPasswordCountdown(0);
                        }}
                        className="w-full text-blue-600 hover:text-blue-800 py-2 font-medium"
                      >
                        重新输入密码
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* 更换绑定邮箱 */}
              {activeTab === 'email' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Mail className="h-6 w-6 text-blue-600" />
                    更换绑定邮箱
                  </h3>
                  
                  {emailStep === 1 && (
                    <div className="space-y-5">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-700 font-medium">当前绑定邮箱: {user.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">验证码</label>
                        <div className="flex space-x-3">
                          <input
                            type="text"
                            value={currentEmailCode}
                            onChange={(e) => {
                              // 只允许输入数字
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              setCurrentEmailCode(value);
                              // 如果用户输入了非法字符，显示提示
                              if (e.target.value !== value) {
                                setCurrentEmailCodeError('验证码只能包含数字');
                              } else {
                                setCurrentEmailCodeError('');
                              }
                            }}
                            maxLength={6}
                            className={`flex-1 px-4 py-3 border ${currentEmailCodeError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="请输入验证码"
                          />
                          <button
                            onClick={async () => {
                              const message = await sendVerificationCode(user.email, 'current-email');
                              if (message) {
                                setNotificationMessage('验证码已发送到您的邮箱');
                                setShowNotification(true);
                                
                                // 启动冷却时间
                                setCurrentEmailCodeSent(true);
                                setCurrentEmailCountdown(60);
                                
                                // 倒计时逻辑
                                const timer = setInterval(() => {
                                  setCurrentEmailCountdown(prev => {
                                    if (prev <= 1) {
                                      clearInterval(timer);
                                      setCurrentEmailCodeSent(false);
                                      return 0;
                                    }
                                    return prev - 1;
                                  });
                                }, 1000);
                              }
                            }}
                            disabled={currentEmailCodeSent}
                            className={`px-4 py-3 rounded-lg font-medium transition-colors ${currentEmailCodeSent ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            {currentEmailCodeSent ? `${currentEmailCountdown}秒后重新获取` : '发送验证码'}
                          </button>
                        </div>
                        {currentEmailCodeError && <p className="text-red-500 text-xs mt-1">{currentEmailCodeError}</p>}
                      </div>
                      <button
                        onClick={handleChangeEmail}
                        disabled={emailLoading}
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                      >
                        {emailLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            处理中...
                          </>
                        ) : (
                          '验证当前邮箱'
                        )}
                      </button>
                    </div>
                  )}
                  
                  {emailStep === 2 && (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">新邮箱</label>
                        <div className="relative">
                          <div className="flex">
                            <input 
                              type="text" 
                              name="newEmailPrefix"
                              className={`flex-1 border ${newEmailError ? 'border-red-500' : 'border-gray-300'} rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`} 
                              placeholder="请输入邮箱"
                              value={newEmailPrefix}
                              onChange={(e) => {
                                // 只允许输入小写字母、数字、点号、连字符和下划线
                                const value = e.target.value;
                                const allowedCharsRegex = /[^a-z0-9._-]/g;
                                const cleanedValue = value.replace(allowedCharsRegex, '');
                                // 限制长度为30个字符
                                const maxLength = 30;
                                const limitedValue = cleanedValue.slice(0, maxLength);
                                setNewEmailPrefix(limitedValue);
                                // 实时验证邮箱格式
                                const fullEmail = limitedValue + newEmailSuffix;
                                const allowedDomains = /@(gmail\.com|qq\.com|163\.com|126\.com)$/;
                                let error = '';
                                if (limitedValue.length > 0) {
                                  if (!/^[a-z0-9]+([._-]?[a-z0-9]+)*$/.test(limitedValue)) {
                                    error = '邮箱只能包含小写字母、数字、点号、连字符和下划线，且不能以特殊字符开头或结尾，不能连续出现特殊字符';
                                  } else if (limitedValue.length < 3 || limitedValue.length > 30) {
                                    error = '邮箱长度必须在3-30个字符之间';
                                  } else if (!allowedDomains.test(fullEmail)) {
                                    error = '只允许@gmail.com、@qq.com、@163.com、@126.com邮箱';
                                  }
                                }
                                setNewEmailError(error);
                              }}
                            />
                            {/* 下拉菜单触发器 */}
                            <div className="relative">
                              <select 
                                name="newEmailSuffix"
                                className="border border-l-0 border-gray-300 rounded-r-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                value={newEmailSuffix}
                                onChange={(e) => {
                                  setNewEmailSuffix(e.target.value);
                                  // 实时验证邮箱格式
                                  const fullEmail = newEmailPrefix + e.target.value;
                                  const allowedDomains = /@(gmail\.com|qq\.com|163\.com|126\.com)$/;
                                  let error = '';
                                  if (newEmailPrefix.length > 0) {
                                    if (!/^[a-z0-9]+([._-]?[a-z0-9]+)*$/.test(newEmailPrefix)) {
                                      error = '邮箱只能包含小写字母、数字、点号、连字符和下划线，且不能以特殊字符开头或结尾，不能连续出现特殊字符';
                                    } else if (newEmailPrefix.length < 3 || newEmailPrefix.length > 30) {
                                      error = '邮箱长度必须在3-30个字符之间';
                                    } else if (!allowedDomains.test(fullEmail)) {
                                      error = '只允许@gmail.com、@qq.com、@163.com、@126.com邮箱';
                                    }
                                  }
                                  setNewEmailError(error);
                                }}
                              >
                                {emailSuffixes.map(suffix => (
                                  <option key={suffix} value={suffix}>{suffix}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        {newEmailError && <p className="text-red-500 text-xs mt-1">{newEmailError}</p>}
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleChangeEmail}
                          disabled={emailLoading}
                          className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                        >
                          {emailLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              处理中...
                            </>
                          ) : (
                            '发送验证码'
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEmailStep(1);
                            setNewEmailPrefix('');
                            setNewEmailSuffix('@qq.com');
                            setNewEmailError('');
                          }}
                          className="px-4 py-3 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          重新验证
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {emailStep === 3 && (
                    <div className="space-y-5">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-700 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          验证码已发送到新邮箱: {newEmail}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">验证码</label>
                        <div className="flex space-x-3">
                          <input
                            type="text"
                            value={newEmailCode}
                            onChange={(e) => {
                              // 只允许输入数字
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              setNewEmailCode(value);
                              // 如果用户输入了非法字符，显示提示
                              if (e.target.value !== value) {
                                setNewEmailCodeError('验证码只能包含数字');
                              } else {
                                setNewEmailCodeError('');
                              }
                            }}
                            maxLength={6}
                            className={`flex-1 px-4 py-3 border ${newEmailCodeError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            placeholder="请输入验证码"
                          />
                          <button
                            onClick={async () => {
                              const message = await sendVerificationCode(newEmail, 'new-email');
                              if (message) {
                                setNotificationMessage('验证码已重新发送到新邮箱');
                                setShowNotification(true);
                                
                                // 重置冷却时间
                                setNewEmailCodeSent(true);
                                setNewEmailCountdown(60);
                                
                                // 倒计时逻辑
                                const timer = setInterval(() => {
                                  setNewEmailCountdown(prev => {
                                    if (prev <= 1) {
                                      clearInterval(timer);
                                      setNewEmailCodeSent(false);
                                      return 0;
                                    }
                                    return prev - 1;
                                  });
                                }, 1000);
                              }
                            }}
                            disabled={newEmailCodeSent}
                            className={`px-4 py-3 rounded-lg font-medium transition-colors ${newEmailCodeSent ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            {newEmailCodeSent ? `${newEmailCountdown}秒后重新获取` : '重新发送'}
                          </button>
                        </div>
                        {newEmailCodeError && <p className="text-red-500 text-xs mt-1">{newEmailCodeError}</p>}
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleChangeEmail}
                          disabled={emailLoading}
                          className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                        >
                          {emailLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              处理中...
                            </>
                          ) : (
                            '确认更换'
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEmailStep(2);
                            setNewEmailCodeSent(false);
                            setNewEmailCountdown(0);
                          }}
                          className="px-4 py-3 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          重新输入
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* 注销账号 */}
              {activeTab === 'delete' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Trash2 className="h-6 w-6 text-red-600" />
                    注销账号
                  </h3>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                    <h4 className="text-red-700 font-semibold mb-4 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      危险操作提示
                    </h4>
                    <ul className="space-y-3 text-red-700">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span>注销账号是不可撤销的操作，一旦执行将无法恢复</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span>注销后，您的所有个人信息将被永久删除</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span>您的账号数据、历史记录和相关信息将被清空</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span>您将无法再使用此账号登录系统</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span>请确保您已经备份了所有重要数据</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      我已知晓，确认注销
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 注销确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">确认注销账号</h3>
            <p className="text-gray-700 mb-8">您确定要注销账号吗？此操作不可撤销，所有数据将被永久删除。</p>
            <div className="flex space-x-4 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                确认注销
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 通知弹窗 */}
      {showNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">通知</h3>
            <p className="text-gray-700 mb-8">{notificationMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowNotification(false)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 注销处理中弹窗 */}
      {showDeleteProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">账号注销中</h3>
            <p className="text-gray-700 mb-8">账号注销中，成功后会跳转到首页{'.'.repeat(ellipsisCount)}</p>
          </div>
        </div>
      )}
      
      {/* 修改密码成功弹窗 */}
      {showPasswordSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">密码修改成功</h3>
            <p className="text-gray-700 mb-8">密码修改成功，正在跳转到登录页面{'.'.repeat(ellipsisCount)}</p>
          </div>
        </div>
      )}
      
      {/* 用户没有密码提示弹窗 */}
      {showNoPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">提示</h3>
            <p className="text-gray-700 mb-8">您还没有设置密码，请先在个人资料页面设置密码。</p>
            <div className="flex space-x-4 justify-end">
              <button
                onClick={() => setShowNoPassword(false)}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowNoPassword(false);
                  setActiveTab('profile');
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                现在去设置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCenter;