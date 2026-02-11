import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  
  // 检查当前是否为登录或注册页面
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // 检查用户登录状态
  useEffect(() => {
    const checkLoginStatus = () => {
      // 从localStorage中获取用户信息
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    checkLoginStatus();
    
    // 监听localStorage变化，以便在其他页面登录后更新用户状态
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  // 退出登录
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include' // 包含cookie，用于session管理
      });
      // 清除localStorage中的用户信息
      localStorage.removeItem('user');
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="logo cursor-pointer" onClick={() => window.location.href='/'}>智能合约法律条文诠释原型系统与应用平台</div>
        </div>
        {/* 非登录注册页面显示右边的导航操作 */}
        {!isAuthPage && (
          <div className="navbar-right">
            <div className="nav-actions">
              {location.pathname !== '/law-toolchain' && (
                <Link to="/law-toolchain" className="nav-link">控制台</Link>
              )}
              {user ? (
                <>
                  <span className="nav-link cursor-pointer" onClick={() => window.open('/user-center', '_blank')}>{user.username || user.email}</span>
                  <button className="btn btn-primary" onClick={handleLogout}>退出登录</button>
                </>
              ) : (
                <>
                  <Link to="/register" className="nav-link">注册</Link>
                  <Link to="/login" className="btn btn-primary">登录</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;