import React from 'react'
import DashboardContent from '../components/DashboardContent'
import { Box } from '@mui/material'
import Sidebar from '../components/Sidebar'

export default function Dashboard() {
  return (
    <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <DashboardContent />
    </Box>
  )
}
