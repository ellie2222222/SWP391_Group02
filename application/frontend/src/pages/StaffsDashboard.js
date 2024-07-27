import React from 'react'
import Sidebar from '../components/Sidebar';
import { Box } from '@mui/material';
import StaffsDashboardContent from '../components/StaffsDashboardContent';
export default function UsersDashboard() {
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <StaffsDashboardContent/>
        </Box>
    )
}
