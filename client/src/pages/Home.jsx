import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero.jsx'
import AiTools from '../components/AiTools.jsx'
import Testimonial from '../components/Testimonial.jsx'
import Plan from '../components/Plan.jsx'
import Footer from '../components/Footer.jsx'

const Home = () => {
  return (
    <div  className="
        min-h-screen
        bg-gradient-to-br
        from-gray-900
        via-gray-800
        to-black
        text-black
      ">
    <Navbar/>
    <Hero/>
    <AiTools/>
    <div className="relative">
  <div
    className="
      pointer-events-none
      absolute inset-x-0 -top-24
      h-24
      bg-gradient-to-b
      from-transparent
      via-white/3
      to-transparent
    "
  />
  <div
    className="
      pointer-events-none
      absolute inset-x-0 -bottom-24
      h-24
      bg-gradient-to-t
      from-transparent
      via-white/3
      to-transparent
    "
  />

  <Testimonial />
</div>
  <Plan/>
  
  <Footer/> 
    </div>
  )
}

export default Home