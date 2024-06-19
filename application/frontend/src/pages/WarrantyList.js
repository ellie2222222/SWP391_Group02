import React from 'react';
import WarrantyLists from '../components/WarrantyLists';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer'
import { Container, Box } from '@mui/material';

export default function WarrantyList() {
  return (
    <div>
      <Navbar />
      <WarrantyLists/>
      <Footer/>
    </div>
  )
}