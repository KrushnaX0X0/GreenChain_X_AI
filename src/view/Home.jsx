import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Categoery from "../components/Categoery";
import Thired from "../components/Thired";
import AgriChatbot from "../components/AI/AgriChatbot";

const Home = () => {
  // 🔐 Check login
  const isLoggedIn = !!localStorage.getItem("token");

  useGSAP(() => {
    gsap.from("#navbar", {
      opacity: 0,
      duration: 1,
      delay: 1,
      y: -100,
    });
  }, []);

  return (
    <>
      {/* Navbar */}
      <div id="navbar" className="z-[9999] fixed top-0 w-full">
        <Navbar />
      </div>

      {/* Page Sections */}
      <Hero />
      <Categoery />
      <Thired />

      {/* 🤖 Show chatbot ONLY if logged in */}
      {isLoggedIn && <AgriChatbot />}

      <Footer />
    </>
  );
};

export default Home;
