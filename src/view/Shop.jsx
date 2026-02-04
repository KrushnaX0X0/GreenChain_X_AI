import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import gsap from "gsap";
import {
  Search, Leaf, Heart, ShieldCheck,
  Sparkles, Zap, Globe, PackageX, MoveRight, 
  Star, ShoppingBag, Plus
} from "lucide-react";

import Navbar from "../components/Navbar";
import AgriChatbot from "../components/AI/AgriChatbot";

const Shop = () => {
  const navigate = useNavigate();
  const gridRef = useRef();

  // State Management
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartItems, setCartItems] = useState([]);

  const categories = ["All", "Vegetables", "Fruits", "Organic", "Dairy"];

  // 1. Sync Cart with LocalStorage
  useEffect(() => {
    const syncCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(cart);
    };
    syncCart();
    window.addEventListener("cartUpdated", syncCart);
    return () => window.removeEventListener("cartUpdated", syncCart);
  }, []);

  // 2. API FETCH
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:8080/api/products", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          }
        });
        if (Array.isArray(res.data)) setProducts(res.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          toast.error("Session expired.");
        } else {
          toast.error("Database connection failed.");
        }
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [navigate]);

  // 3. GSAP Animations
  useEffect(() => {
    if (loadingProducts || products.length === 0) return;
    const cards = gridRef.current?.querySelectorAll(".product-card");
    if (cards) {
      gsap.fromTo(cards,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "back.out(1.2)" }
      );
    }
  }, [category, loadingProducts, products]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    if (product.stock === 0) return;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.some((item) => item.id === product.id)) {
      toast.error("Already in basket");
      return;
    }
    cart.push({ ...product, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Added to Harvest");
  };

  return (
    <div className="min-h-screen bg-[#FDFEFD] text-emerald-950 font-sans selection:bg-emerald-100">
      <Navbar />

      {/* --- PREMIUM BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[1000px] h-[600px] bg-emerald-50/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-50/30 rounded-full blur-[100px]" />
      </div>

      <div className="pt-32 px-6 max-w-7xl mx-auto">
        {/* --- HERO SECTION --- */}
        <div className="mb-20">
          <div className="bg-emerald-950 rounded-[4rem] p-12 lg:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="relative z-10 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-emerald-900/40 backdrop-blur-xl rounded-full border border-emerald-800/50">
                <Sparkles size={14} className="text-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-300">Verified Direct Sourcing</span>
              </div>
              <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8">
                The Pure <br /> <span className="text-emerald-500 italic font-serif">Harvest.</span>
              </h1>
              <p className="text-emerald-200/60 text-lg max-w-md mb-10 leading-relaxed">
                Experience agriculture redefined through real-time data and organic integrity.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                 <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-2xl transition-all flex items-center gap-2">
                   Browse Market <MoveRight size={18} />
                 </button>
              </div>
            </div>
            <div className="relative w-full max-w-sm aspect-square bg-emerald-900/20 rounded-[3rem] backdrop-blur-3xl border border-emerald-800/30 flex items-center justify-center">
                <Leaf size={180} className="text-emerald-500/20 rotate-12" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 border border-emerald-500/20 rounded-full animate-pulse" />
                </div>
            </div>
          </div>
        </div>

        {/* --- FILTER & SEARCH --- */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-16 px-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-8 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                  category === cat 
                  ? "bg-emerald-950 text-white shadow-xl shadow-emerald-900/20" 
                  : "bg-white text-emerald-900/40 hover:bg-emerald-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-300" size={18} />
            <input
              type="text"
              placeholder="Search the harvest..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-emerald-50 focus:border-emerald-200 outline-none font-medium shadow-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        {loadingProducts ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-800">Syncing Nodes</p>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-32">
            {filteredProducts.map((product) => {
              const isInCart = cartItems.some(item => item.id === product.id);
              return (
                <div key={product.id} className="product-card group relative">
                  {/* Card Body */}
                  <div className="bg-white rounded-[40px] p-4 border border-emerald-50 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(6,78,59,0.1)] transition-all duration-500 ease-out flex flex-col h-full">
                    
                    {/* Image Area */}
                    <div className="relative aspect-[4/5] rounded-[32px] bg-[#F8FAF8] overflow-hidden flex items-center justify-center p-6 group-hover:bg-emerald-50/50 transition-colors duration-500">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Farm+Item"; }}
                      />
                      
                      {/* Floating Stock Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/70 backdrop-blur-md rounded-full border border-white/50 flex items-center gap-1.5 shadow-sm">
                        <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className="text-[9px] font-black uppercase tracking-tighter text-emerald-950">
                          {product.stock > 0 ? 'Verified Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      {/* Favorite Button */}
                      <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md border border-white/50 flex items-center justify-center text-emerald-950 hover:text-red-500 hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                        <Heart size={16} />
                      </button>
                    </div>

                    {/* Content Area */}
                    <div className="mt-6 px-2 pb-2 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{product.category}</span>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-[10px] font-black text-emerald-900">{product.rating || "4.9"}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-black text-emerald-950 tracking-tighter mb-4 leading-none">{product.name}</h3>
                      
                      <div className="mt-auto flex items-end justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-emerald-300 uppercase leading-none mb-1">Price per {product.unit}</p>
                          <p className="text-3xl font-black text-emerald-600 tracking-tighter leading-none">₹{product.price}</p>
                        </div>
                        
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0 || isInCart}
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                            isInCart 
                            ? "bg-emerald-100 text-emerald-500" 
                            : product.stock > 0 
                              ? "bg-emerald-950 text-white hover:bg-emerald-500 hover:shadow-lg shadow-emerald-200" 
                              : "bg-gray-100 text-gray-300 cursor-not-allowed"
                          }`}
                        >
                          {isInCart ? <ShoppingBag size={20} /> : <Plus size={24} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AgriChatbot />
    </div>
  );
};

export default Shop;