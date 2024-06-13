import React from 'react';
import { Typography, Container } from '@mui/material';
import  useAuth  from '../hooks/useAuthContext';

const Admin = () => {
    const {user} = useAuth();
    console.log(user);
    return (
        <Container>
            <Typography variant="h3" gutterBottom>
                Admin Page
            </Typography>
        </Container>
    );
};

export default Admin;
