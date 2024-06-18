import React from 'react'
import Navbar from "../components/Navbar/Navbar"
import Footer from '../components/Footer/Footer'
import RequestForm from '../components/RequestForm'
export default function Request() {
  return (
    <div>
        <Navbar/>
        <RequestForm/>
        <Footer/>
    </div>
  )
}
