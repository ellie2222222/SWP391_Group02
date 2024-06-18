import React from 'react';
import WarrantyForm from '../components/WarrantyForm';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer'
import { Container, Box } from '@mui/material';

export default function TransactionPage() {
  return (
    <div>
      <Navbar />

      <WarrantyForm/>
      <Footer/>
    </div>
  )
}

