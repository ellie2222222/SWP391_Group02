import React from 'react'
import Navbar from "../components/Navbar/Navbar"
import Footer from '../components/Footer/Footer'
import HomePageBody from '../components/HomePageBody'
import  useAuth  from '../hooks/useAuthContext';

export default function Home() {
  const {user} = useAuth();
  console.log(user);
  return (
    <div>
      <Navbar/>
      <HomePageBody/>
      <Footer/>
    </div>
  )
}
