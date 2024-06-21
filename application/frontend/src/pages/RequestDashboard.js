import React from 'react'
import Sidebar from '../components/Sidebar';
import { Box } from '@mui/material';
import RequestDashboardContent from '../components/RequestDashboardContent';

export default function RequestDashboard() {
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <RequestDashboardContent />
        </Box>
    )
}
