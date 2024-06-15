import React from 'react'
import Navbar from "../components/Navbar/Navbar"
import Footer from '../components/Footer/Footer'
import CustomerRequestList from '../components/CustomerRequestList'
export default function CustomerRequests() {
  return (
    <div>
        <Navbar/>
        <CustomerRequestList />
        <Footer/>
    </div>
  )
}