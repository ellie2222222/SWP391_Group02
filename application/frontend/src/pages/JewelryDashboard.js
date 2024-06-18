import React from 'react';
import {Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import AdminContent from '../components/AdminContent';
const JewelryDashboard = () => {
    return (
        
        <Box sx={{ display: 'flex' }}>
            <Sidebar/>
            <AdminContent/>
        </Box>
 
    );
};

export default JewelryDashboard;
