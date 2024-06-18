import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuthContext';

const AdminRoute = () => {
  const { user } = useAuth();
  const allowedRoles = ['admin', 'manager', 'design_staff', 'sale_staff','production_staff'];

  return user && allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

const ManagerRoute = () => {
  const { user } = useAuth();
  return user && user.role === 'manager' ? <Outlet /> : <Navigate to="/" />;
};

const ManagerOrSaleRoute = () => {
  const { user } = useAuth();
  return user && (user.role === 'manager' || user.role === 'sale_staff') ? <Outlet /> : <Navigate to="/" />;
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

const AuthRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export { AdminRoute, ManagerRoute, DesignStaffRoute, SaleStaffRoute, ProductionStaffRoute, UserRoute, AuthRoute, ManagerOrSaleRoute };