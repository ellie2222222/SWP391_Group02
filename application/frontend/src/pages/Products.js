import React from 'react'
import Navbar from "../components/Navbar/Navbar"
import Footer from '../components/Footer/Footer'
import JewelryList from '../components/JewelryList.js'
export default function Products() {
  return (
    <div>
        <Navbar/>
        <JewelryList/>
        <Footer/>
    </div>
  )
}
