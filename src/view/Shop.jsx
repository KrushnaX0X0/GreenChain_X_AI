import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import carrot from "../assets/carrot.png";
import apple from "../assets/apple.png";
import tomato from "../assets/tomato.png";
import banana from "../assets/banana.png";

const Shop = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const productsData = [
    { id: 1, name: "Carrot", price: 40, image: carrot },
    { id: 2, name: "Apple", price: 120, image: apple },
    { id: 3, name: "Tomato", price: 30, image: tomato },
    { id: 4, name: "Banana", price: 60, image: banana },
  ];

  const filteredProducts = productsData.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  
  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exist = cart.find((item) => item.id === product.id);

    if (exist) {
      cart = cart.map((item) =>
        item.id === product.id
          ? { ...item, qty: item.qty + 1 }
          : item
      );
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

      window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <>
      <Navbar />

      <div className="pt-24 px-10 min-h-screen bg-green-50">
        <h1 className="text-4xl font-bold text-center mb-6">
          Fresh Farm Products
        </h1>

        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/2 p-2 rounded-full shadow"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow p-6 flex flex-col items-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-24 mb-4"
              />

              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-600 mb-4">₹ {product.price} / kg</p>

              <button
                onClick={() => addToCart(product)}
                className="bg-green-600 text-white px-6 py-2 rounded-md"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Shop;
