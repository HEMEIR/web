import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // 直接在render中检查localStorage，避免异步问题
  const user = localStorage.getItem('user');
  const isAuthenticated = !!user;

  console.log('PrivateRoute - localStorage user:', user);
  console.log('PrivateRoute - isAuthenticated:', isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;