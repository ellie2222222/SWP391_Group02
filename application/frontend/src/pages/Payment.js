import React from 'react'
import Navbar from "../components/Navbar/Navbar"
import Footer from '../components/Footer/Footer'
import PaymentStatus from '../components/PaymentStatus'

export default function Payment() {
  return (
    <div>
        <Navbar/>
        <PaymentStatus/>
        <Footer/>
    </div>
  )
}
