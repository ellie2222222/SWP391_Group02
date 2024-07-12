import React from 'react';
import {Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import WarrantyDashboardContent from '../components/WarrantyDashboardContent';
const WarrantyDashboard = () => {
    return (
        
        <Box sx={{ display: 'flex', padding:'20px' }}>
            <Sidebar/>
            <WarrantyDashboardContent/>
        </Box>
 
    );
};

export default WarrantyDashboard;