import React from 'react'
import Sidebar from '../components/Sidebar';
import { Box } from '@mui/system';
import MaterialDashboard from '../components/MaterialDashboard';
export default function Material() {
  return (
    <Box sx={{ display: 'flex' , padding:'20px' }}>
        <Sidebar />
        <MaterialDashboard/>
    </Box>
  )
}
