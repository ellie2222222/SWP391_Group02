import React from 'react'
import Navbar from "../components/Navbar/Navbar"
import Footer from '../components/Footer/Footer'
import RequestDetails from '../components/RequestDetails'
export default function RequestInfo() {
  return (
    <div>
        <Navbar/>
        <RequestDetails/>
        <Footer/>
    </div>
  )
}