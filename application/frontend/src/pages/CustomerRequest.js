import React from 'react'
import Navbar from "../components/Navbar/Navbar"
import Footer from '../components/Footer/Footer'    
import CustomerRequestDetails from '../components/CustomerRequestDetails'
export default function CustomerRequest() {
  return (
    <div>
        <Navbar/>
        <CustomerRequestDetails />
        <Footer/>
    </div>
  )
}