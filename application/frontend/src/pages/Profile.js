import React from 'react'
import Navbar from "../components/Navbar/Navbar"
import Footer from '../components/Footer/Footer'
import RequestForm from '../components/RequestForm'
import ProfileDetail from '../components/ProfileDetail'
export default function Profile() {
  return (
    <div>
        <Navbar/>
        <ProfileDetail/>
        <Footer/>
    </div>
  )
}
