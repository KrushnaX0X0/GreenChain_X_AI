import React from 'react'
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Categoery from '../components/Categoery';
import Thired from '../components/Thired';
import AgriChatbot from '../components/AI/AgriChatbot';

const Home = () => {

 useGSAP(() => {
    gsap.from("#navbar", {       
      opacity: 0, 
      duration: 1, 
      delay:1,
      y:-100
    });
  }, []);

  return (
  <>

   <div id='navbar' className='z-[9999]  fixed top-0'>
    <Navbar/>
   </div>

  <Hero/>
  <Categoery/>
  <Thired/>
  <AgriChatbot/>

  
  </>
  )
}

export default Home