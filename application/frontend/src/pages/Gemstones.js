import React from 'react'
import Sidebar from '../components/Sidebar';
import { Box } from '@mui/system';
import GemstonesDashboard from '../components/GemstonesDashboard';
export default function Gemstones() {
  return (
    <Box sx={{ display: 'flex' , padding:'20px' }}>
    <Sidebar />
    <GemstonesDashboard/>
    </Box>
  )
}
