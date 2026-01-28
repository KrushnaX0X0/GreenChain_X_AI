import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Service = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Fresh & Organic Products",
      desc: "We provide fresh vegetables and fruits directly from farmers.",
      icon: "🥕",
    },
    {
      title: "Fast Home Delivery",
      desc: "Quick and safe delivery at your doorstep.",
      icon: "🚚",
    },
    {
      title: "Secure Online Payment",
      desc: "100% safe and secure payment methods.",
      icon: "💳",
    },
    {
      title: "Best Quality Assurance",
      desc: "Quality checked products with best pricing.",
      icon: "⭐",
    },
    {
      title: "Easy Return Policy",
      desc: "Hassle-free return if product quality is not satisfied.",
      icon: "🔁",
    },
    {
      title: "Customer Support",
      desc: "24/7 customer support for your help.",
      icon: "📞",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 px-6 py-16">
        <Navbar/>

      {/* HERO SECTION */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
          Our Services
        </h1>
        <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
          We provide high-quality services to deliver fresh farm products
          directly to your home 🌱
        </p>
      </div>

      {/* SERVICES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">

        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 text-center hover:scale-105 transition-transform duration-300"
          >
            <div className="text-5xl mb-4">
              {service.icon}
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {service.title}
            </h3>

            <p className="text-gray-600">
              {service.desc}
            </p>
          </div>
        ))}

      </div>

      {/* CTA SECTION */}
      <div className="text-center mt-20">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
          Ready to shop fresh products?
        </h2>

        <p className="text-gray-600 mb-8">
          Experience the best farm-fresh service with AgriMart 🌾
        </p>

        <button
          onClick={() => navigate("/shop")}
          className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-10 py-4 rounded-2xl text-xl font-semibold hover:scale-105 transition-transform shadow-xl"
        >
          🛒 Start Shopping
        </button>
      </div>

    </div>
  );
};

export default Service;
