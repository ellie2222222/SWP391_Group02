import React from 'react'
import Sidebar from '../components/Sidebar';
import { Box } from '@mui/material';
import PendingRequestDashboardContent from '../components/PendingRequestDashboardContent';

export default function PendingRequestDashboard() {
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <PendingRequestDashboardContent />
        </Box>
    )
}
