import React from 'react'
import Navbar from "../components/Navbar/Navbar"
import Footer from '../components/Footer/Footer'
import CustomRequestForm from '../components/CustomRequestForm'
export default function CustomRequest() {
  return (
    <div>
        <Navbar/>
        <CustomRequestForm/>
        <Footer/>
    </div>
  )
}
