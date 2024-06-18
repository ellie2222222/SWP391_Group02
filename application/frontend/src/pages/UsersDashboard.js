import React from 'react'
import Sidebar from '../components/Sidebar';
import { Box } from '@mui/material';
import UserDashboardContent from '../components/UsersDashboardContent';
export default function UsersDashboard() {
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <UserDashboardContent/>
        </Box>
    )
}
