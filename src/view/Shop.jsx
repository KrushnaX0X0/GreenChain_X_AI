import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  Search, ShoppingCart, Leaf, Heart, 
  CheckCircle, AlertCircle 
} from "lucide-react";

import Navbar from "../components/Navbar";
import AgriChatbot from "../components/AI/AgriChatbot";

// Assets
import carrot from "../assets/carrot.png";
import apple from "../assets/apple.png";
import tomato from "../assets/tomato.png";
import banana from "../assets/banana.png";

const Shop = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartItems, setCartItems] = useState([]);

  // Load cart state on mount to handle UI updates
  useEffect(() => {
    const syncCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(cart);
    };
    syncCart();
    window.addEventListener("cartUpdated", syncCart);
    return () => window.removeEventListener("cartUpdated", syncCart);
  }, []);

  const categories = ["All", "Vegetables", "Fruits", "Organic", "Dairy"];

  const productsData = [
    { id: 1, name: "Carrot", price: 40, image: carrot, category: "Vegetables", stock: 15, unit: "kg" },
    { id: 2, name: "Apple", price: 120, image: apple, category: "Fruits", stock: 8, unit: "kg" },
    { id: 3, name: "Tomato", price: 30, image: tomato, category: "Vegetables", stock: 20, unit: "kg" },
    { id: 4, name: "Banana", price: 60, image: banana, category: "Fruits", stock:8, unit: "dozen" },
  ];

  const filteredProducts = productsData.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    if (product.stock === 0) {
      toast.error("Out of stock!");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const isAlreadyInCart = cart.some((item) => item.id === product.id);

    if (isAlreadyInCart) {
      toast.error(`${product.name} is already in your cart!`);
      return;
    }

    // Add new item with qty 1
    cart.push({ ...product, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Dispatch event so Navbar/UI updates
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${product.name} added to cart! 🥕`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Navbar />

      {/* --- HEADER SECTION --- */}
      <div className="pt-32 pb-10 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-green-600 font-black text-[10px] uppercase tracking-[0.3em] block mb-2">
              Eco-Certified Marketplace
            </span>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
              Shop Fresh
            </h1>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all font-medium"
            />
          </div>
        </div>

        {/* --- CATEGORY TABS --- */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                category === cat 
                ? "bg-green-600 text-white shadow-lg shadow-green-200" 
                : "bg-white text-gray-500 border border-gray-100 hover:border-green-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="px-6 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => {
            const isInCart = cartItems.some(item => item.id === product.id);

            return (
              <div
                key={product.id}
                className="group bg-white rounded-[32px] border border-gray-100 p-2 transition-all duration-500 hover:shadow-2xl hover:shadow-green-900/5"
              >
                {/* Image Display */}
                <div className="relative h-60 bg-gray-50 rounded-[28px] overflow-hidden flex items-center justify-center p-8 transition-all group-hover:bg-green-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Status Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black text-green-700 uppercase tracking-tighter border border-green-100 flex items-center gap-1">
                      <Leaf size={10} /> Organic
                    </span>
                    {product.stock === 0 && (
                      <span className="bg-red-500 px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-tighter">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">{product.name}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-green-600">₹{product.price}</p>
                      <p className="text-[9px] font-bold text-gray-400">per {product.unit}</p>
                    </div>
                  </div>

                  {/* Add to Cart Button Logic */}
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0 || isInCart}
                    className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                      isInCart 
                        ? "bg-green-100 text-green-700 cursor-default" 
                        : product.stock > 0
                        ? "bg-gray-900 text-white hover:bg-black shadow-lg"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isInCart ? (
                      <><CheckCircle size={14} /> In Cart</>
                    ) : product.stock > 0 ? (
                      <><ShoppingCart size={14} /> Add to Cart</>
                    ) : (
                      <><AlertCircle size={14} /> Out of Stock</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No products available in this category</p>
          </div>
        )}
      </div>

      <AgriChatbot />
    </div>
  );
};

export default Shop;