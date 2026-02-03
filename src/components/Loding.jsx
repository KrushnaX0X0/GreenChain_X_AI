import React, { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Loding = () => {
  const containerRef = React.useRef(null);

  useGSAP(() => {

    gsap.fromTo(
      ".logo-font",
      { scale: 0.8, opacity: 0, y: 30 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "back.out(1.7)",
      }
    );


    gsap.to(".loader", {
      x: "150%",
      duration: 1.2,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = "none";
          }
        },
      });
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="loader-container h-screen w-screen fixed top-0 left-0 bg-white flex items-center justify-center flex-col z-[99999999]">
      <h1 className="logo-font text-5xl font-bold text-green-500 tracking-wide font">
        GreenChain
      </h1>

      <div className="h-[5px] w-[180px] bg-green-200 mt-5 rounded-3xl overflow-hidden relative">
        <div className="loader w-[60px] bg-green-700 h-full left-0 absolute rounded-3xl shadow-md shadow-green-500/50"></div>
      </div>

      <p className="mt-4 text-sm text-gray-500 tracking-wider animate-pulse font-medium">
        Supply chain & fresh farm products 🌾
      </p>
    </div>
  );
};

export default Loding;
