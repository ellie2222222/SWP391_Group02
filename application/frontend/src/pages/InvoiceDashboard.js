import React from 'react';
import {Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import InvoiceDashboardContent from '../components/InvoiceDashboardContent';

const InvoiceDashboard = () => {
    return (
        
        <Box sx={{ display: 'flex' }}>
            <Sidebar/>
            <InvoiceDashboardContent />
        </Box>
 
    );
};

export default InvoiceDashboard;
