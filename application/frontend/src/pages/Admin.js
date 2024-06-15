import React from 'react';
import { Typography, Container,Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import AdminContent from '../components/AdminContent';
const Admin = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar/>
            <AdminContent/>
            
        </Box>
 
    );
};

export default Admin;
