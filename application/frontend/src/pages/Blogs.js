import React from 'react'
import Navbar from "../components/Navbar/Navbar"
import BlogList from '../components/BlogList'
import Footer from '../components/Footer/Footer'
export default function Blogs() {
  return (
    <div>
        <Navbar/>
        <BlogList/>
        <Footer/>
    </div>
  )
}
