import React from 'react'
import Sidebar from '../components/Sidebar';
import { Box } from '@mui/material';
import QuotedRequestDashBoard from '../components/QuotedRequestDashboard';
export default function QuotedRequest() {
  return (
    <Box sx={{ display: 'flex' }}>
    <Sidebar />
    <QuotedRequestDashBoard/>
    </Box>
  )
}
