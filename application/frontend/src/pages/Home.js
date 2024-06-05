import React from 'react'
import Navbar from "../components/Navbar/Navbar"
import Footer from '../components/Footer/Footer'
import HomePageBody from '../components/homePageBody'
export default function Home() {
  return (
    <div>
      <Navbar/>
      <HomePageBody/>
      <Footer/>
    </div>
  )
}
