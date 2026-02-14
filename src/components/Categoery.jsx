import React from "react";
import dalimb from "../assets/dalimb.png";
import apple from "../assets/apple.png";
import banana from "../assets/banana.png";
import tomato from "../assets/tomato.png";
import carrot from "../assets/carrot.png";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Categoery = () => {

  const navigate = useNavigate();

  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {

    gsap.from(".heading-text", {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".heading-text",
        start: "top 80%",
      },
    });


    gsap.from(".heading-text span", {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: ".heading-text",
        start: "top 85%",
      },
    });


    gsap.from(".card", {
      y: 80,
      opacity: 0,
      duration: 1.2,
      stagger: 0.3,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".card-container",
        start: "top 80%",
        end: "bottom 10%",
        scrub: true,
      },
    });


    gsap.from(".view-btn", {
      scale: 0.5,
      opacity: 0,
      duration: 1,
      ease: "elastic.out(1, 0.5)",
      scrollTrigger: {
        trigger: ".view-btn",
        start: "top 90%",
      },
    });
  }, []);

  const products = [
    { id: 1, name: "Pomegranate", price: 100, image: dalimb },
    { id: 2, name: "Apple", price: 120, image: apple },
    { id: 3, name: "Banana", price: 60, image: banana },
    { id: 4, name: "Tomato", price: 40, image: tomato },
    { id: 5, name: "Carrot", price: 50, image: carrot },
  ];


  const headingText = "Enjoy Our Healthy And Fresh Grocery Items".split(" ");

  return (
    <div className="h-[100vh] w-screen overflow-x-hidden">

      <div className="w-full flex justify-center">
        <div className="w-[40vw] text-center flex mt-8 justify-center items-center">
          <h1 className="heading-text text-4xl font-medium leading-relaxed flex flex-wrap justify-center gap-1 card-container">
            {headingText.map((word, index) => (
              <span key={index} className="inline-block">
                {word}
              </span>
            ))}
            <img
              src={dalimb}
              className="h-[50px] inline-block ml-2"
              style={{
                animation: "upDown 2s ease-in-out infinite",
              }}
              alt="dalimb"
            />
            <style>
              {`
                @keyframes upDown {
                  0%, 100% { transform: translateY(-5px); }
                  50% { transform: translateY(5px); }
                }
              `}
            </style>
          </h1>
        </div>
      </div>


      <div className="card-container h-[50vh] w-full flex gap-5 p-4 justify-evenly mt-8">
        {products.map((item) => (
          <div
            key={item.id}
            className="card h-[45vh] w-[16vw] bg-amber-50 shadow-black/25 rounded-lg shadow-2xl flex justify-center items-center"
          >
            <div className="h-[150px] w-[150px] flex flex-col justify-center items-center gap-5">
              <div className="h-32">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-fill h-50px drop-shadow-lg drop-shadow-black/70"
                />
              </div>
              <h1 className="font-medium text-xl">{item.name}</h1>
              <p className="font-medium">$ {item.price} / KG</p>
              <div
                onClick={() => {
                  const token = localStorage.getItem("token");
                  if (!token) {
                    toast.error("Please Login first!");
                    navigate("/login");
                  } else {
                    navigate("/shop");
                  }
                }}
                className="border px-4 py-1 cursor-pointer hover:bg-green-600 hover:text-white rounded-sm transition-all duration-300"
              >
                <button className="cursor-pointer border-none">
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>


      <div className="h-40 w-full flex items-center justify-center">
        <div className="view-btn h-10 w-40 border flex justify-center items-center cursor-pointer hover:bg-green-600 hover:text-white rounded-sm transition-all duration-300">
          <button className="border-none cursor-pointer" onClick={() => {
            navigate("/shop")
          }}>
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categoery;
