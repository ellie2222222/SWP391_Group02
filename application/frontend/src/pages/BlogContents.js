import React from 'react'
import Navbar from "../components/Navbar/Navbar"
import Footer from '../components/Footer/Footer'
import BlogDetails from '../components/BlogDetails'
export default function BlogContents() {
  return (
    <div>
        <Navbar/>
        <BlogDetails/>
        <Footer/>
    </div>
  )
}