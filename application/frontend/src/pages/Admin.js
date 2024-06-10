import React from 'react';
import { Typography, Container } from '@mui/material';
import useAuth from '../hooks/useAuthContext';
import { Navigate } from 'react-router-dom';

const Admin = () => {
    const { user } = useAuth();

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return (
        <Container>
            <Typography variant="h3" gutterBottom>
                Admin Page
            </Typography>
        </Container>
    );
};

export default Admin;
