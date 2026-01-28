import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    payment: "online",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userData", JSON.stringify(formData));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/order");
  };

  
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * -10;

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.05)
    `;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    card.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-100 flex items-center justify-center px-6">

      <div className="max-w-6xl w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl grid md:grid-cols-2">

        {/* 🌿 LEFT – 3D CARD */}
        <div className="hidden md:flex items-center justify-center  p-12">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="bg-green-400 backdrop-blur-xl rounded-3xl p-8  text-center transition-transform duration-200 ease-out shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e"
              alt="Fresh Vegetables"
              className="w-80 rounded-2xl shadow-xl mb-6 transform translateZ-12"
            />

            <h2 className="text-4xl font-extrabold mb-3">
              Fresh & Organic
            </h2>

            <p className="text-lg opacity-90 mb-5">
              Farm-fresh vegetables straight to your home
            </p>

            <div className="space-y-2 text-lg font-medium">
              <p>🥕 100% Fresh</p>
              <p>🚚 Fast Delivery</p>
              <p>💳 Secure Payment</p>
              <p>🌱 From Farmers</p>
            </div>
          </div>
        </div>

        {/* 🧾 RIGHT – FORM */}
        <div className="p-12">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Checkout
            </h1>
            <p className="text-gray-600 mt-3 text-lg font-semibold">
              Enter delivery details 
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border p-4 rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Mobile Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border p-4 rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
            />

            <textarea
              name="address"
              placeholder="Delivery Address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              className="w-full border p-4 rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full border p-4 rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-2xl text-xl font-semibold hover:scale-105 transition-transform shadow-xl cursor-pointer"
            >
              Continue 
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
