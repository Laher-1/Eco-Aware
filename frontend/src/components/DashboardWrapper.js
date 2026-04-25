import React from 'react';
import { useSelector } from 'react-redux';
import UserDashboard from '../pages/UserDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import Login from '../pages/Login';

const DashboardWrapper = () => {
  const { isLoggedIn, role } = useSelector(state => state.auth);

  if (!isLoggedIn) {
    return <Login />;
  }

  if (role === 'admin') {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
};

export default DashboardWrapper;