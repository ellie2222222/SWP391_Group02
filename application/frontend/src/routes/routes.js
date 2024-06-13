import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuthContext';

const AdminRoute = () => {
  const { user } = useAuth();
  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

const ManagerRoute = () => {
  const { user } = useAuth();
  return user && user.role === 'manager' ? <Outlet /> : <Navigate to="/" />;
};

const DesignStaffRoute = () => {
  const { user } = useAuth();
  return user && user.role === 'design_staff' ? <Outlet /> : <Navigate to="/" />;
};

const SaleStaffRoute = () => {
  const { user } = useAuth();
  return user && user.role === 'sale_staff' ? <Outlet /> : <Navigate to="/" />;
};

const ProductionStaffRoute = () => {
  const { user } = useAuth();
  return user && user.role === 'production_staff' ? <Outlet /> : <Navigate to="/" />;
};

const UserRoute = () => {
    const { user } = useAuth();
    return user && user.role === 'user' ? <Outlet /> : <Navigate to="/" />;
  };

export { AdminRoute, ManagerRoute, DesignStaffRoute, SaleStaffRoute, ProductionStaffRoute, UserRoute };