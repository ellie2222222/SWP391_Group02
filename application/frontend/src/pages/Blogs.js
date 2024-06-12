import React from 'react'
import Navbar from "../components/Navbar/Navbar"
import BlogList from '../components/BlogList'
import Footer from '../components/Footer/Footer'
export default function Blogs() {
  return (
    <div>
        <Navbar/>
        <h2>Blogs</h2>
        <BlogList/>
        <Footer/>
    </div>
  )
}
