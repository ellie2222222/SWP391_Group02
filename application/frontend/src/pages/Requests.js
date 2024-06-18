import React from 'react'
import Navbar from "../components/Navbar/Navbar"
import Footer from '../components/Footer/Footer'
import RequestList from '../components/RequestList'
export default function Requests() {
  return (
    <div>
        <Navbar/>
        <RequestList/>
        <Footer/>
    </div>
  )
}
