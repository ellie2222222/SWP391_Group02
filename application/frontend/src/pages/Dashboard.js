import React from 'react'
import Navbar from "../components/Navbar/Navbar"
import Footer from '../components/Footer/Footer'
import DashboardContent from '../components/DashboardContent'

export default function Dashboard() {
  return (
    <div>
        <Navbar/>
        <DashboardContent/>
        <Footer/>
    </div>
  )
}
