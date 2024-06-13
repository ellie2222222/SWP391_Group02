import React from 'react';
import { Navigate ,Outlet } from 'react-router-dom';
import  useAuth  from '../hooks/useAuthContext';

const AdminRoute = () => {
    const { user } = useAuth();
    console.log('AdminRoute - user:', user);
    return user && user.role === 'admin' ? <Outlet/> : <Navigate to="/" />;
};

export default AdminRoute;