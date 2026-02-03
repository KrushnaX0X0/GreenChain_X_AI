import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import gsap from "gsap";
import {
  Search, ShoppingCart, Leaf, Heart,
  CheckCircle, AlertCircle, TrendingUp, ShieldCheck,
  Sparkles, Zap, Globe, PackageX
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

  // 2. API FETCH: With Bearer Token Authentication
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);

      // --- GET TOKEN FROM LOCAL STORAGE ---
      const token = localStorage.getItem("token"); // Ensure your key name matches (e.g., 'jwt', 'token', 'access_token')

      try {
        const res = await axios.get("http://localhost:8080/api/products", {
          headers: {
            // Send the token in the standard Bearer format
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          }
        });

        if (Array.isArray(res.data)) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error("Database connection failed:", err);

        // Handle Unauthorized error specifically
        if (err.response?.status === 401 || err.response?.status === 403) {
          toast.error("Session expired. Please login again.");
          // navigate("/login"); // Optional: redirect to login
        } else {
          toast.error("Could not sync with the harvest database.");
        }

        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [navigate]);


  console.log(products)
  // 3. GSAP Animations (UI remains the same)
  useEffect(() => {
    if (loadingProducts || products.length === 0) return;
    const cards = gridRef.current?.querySelectorAll(".product-card");
    if (cards && cards.length > 0) {
      gsap.fromTo(cards,
        { opacity: 0, y: 50, rotateX: -15 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.1, ease: "expo.out" }
      );
    }
  }, [category, loadingProducts, products]);

  // Filtering Logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    if (product.stock === 0) return;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.some((item) => item.id === product.id)) {
      toast.error("Item already in secure basket");
      return;
    }
    cart.push({ ...product, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Added to Harvest Basket");
  };

  return (
    <div className="min-h-screen bg-[#F8FDF9] text-emerald-950 font-sans overflow-x-hidden">
      <Navbar />

      {/* --- BACKGROUND AMBIANCE --- */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-40 overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-100 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-green-50 rounded-full blur-[100px]"></div>
      </div>

      <div className="pt-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
          <div className="lg:col-span-2 bg-white p-12 rounded-[50px] shadow-[0_30px_100px_rgba(0,0,0,0.02)] border border-emerald-50 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                <Globe size={12} className="text-emerald-600 animate-spin-slow" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-700">Authenticated Access</span>
              </div>
              <h1 className="text-7xl font-black tracking-tighter leading-tight mb-4">
                The Future of <br /> <span className="text-emerald-500 italic font-serif font-light">Organic.</span>
              </h1>
              <p className="text-emerald-900/40 font-medium max-w-md text-sm leading-relaxed">
                Securely connected to our verified farming network.
              </p>
            </div>
            <Leaf className="absolute right-[-20px] bottom-[-20px] text-emerald-50/50 w-64 h-64 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
          </div>

          <div className="flex flex-col gap-6">
            <div className="h-1/2 bg-emerald-600 p-8 rounded-[40px] shadow-xl shadow-emerald-200 flex flex-col justify-between text-white">
              <Zap size={32} />
              <div>
                <p className="text-4xl font-black tracking-tighter">Live</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Verified Session</p>
              </div>
            </div>
            <div className="h-1/2 bg-emerald-50 p-8 rounded-[40px] border border-emerald-100 flex flex-col justify-between">
              <ShieldCheck size={32} className="text-emerald-600" />
              <p className="text-xl font-black text-emerald-900 tracking-tight leading-tight">100% Secure <br /><span className="text-emerald-400 font-medium text-xs">Auth Token Active</span></p>
            </div>
          </div>
        </div>

        {/* --- FILTER BAR --- */}
        <div className="sticky top-24 z-40 flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white/60 backdrop-blur-2xl rounded-[30px] border border-white/50 shadow-xl shadow-emerald-900/5 mb-16">
          <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto px-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${category === cat ? "bg-emerald-900 text-white shadow-xl" : "text-emerald-900/40 hover:text-emerald-900"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-200" size={16} />
            <input
              type="text"
              placeholder="Search Database..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-3 rounded-2xl bg-white/40 border-none outline-none font-bold text-sm text-emerald-950 placeholder:text-emerald-200"
            />
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        {loadingProducts ? (
          <div className="w-full flex flex-col items-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-emerald-700 font-black uppercase tracking-widest text-xs">Verifying Token & Fetching...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="w-full text-center py-32">
            <PackageX size={48} className="mx-auto text-emerald-100 mb-4" />
            <p className="text-emerald-900/40 font-black uppercase tracking-widest text-sm">No products found in the vault</p>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-32">
            {filteredProducts.map((product) => {
              const isInCart = cartItems.some(item => item.id === product.id);
              const isLowStock = product.stock > 0 && product.stock < 5;

              return (
                <div key={product.id} className="product-card group cursor-pointer">
                  <div className="relative bg-white rounded-[50px] p-4 border border-emerald-50 shadow-sm transition-all duration-700 hover:shadow-[0_40px_80px_rgba(6,78,59,0.08)] group-hover:-translate-y-2">

                    <div className="relative h-72 w-full bg-[#FBFDFB] rounded-[42px] overflow-hidden flex items-center justify-center p-12 transition-colors duration-500 group-hover:bg-emerald-50/50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full object-contain group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Harvest+Item"; }}
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="max-w-[70%]">
                          <h3 className="text-xl font-black text-emerald-950 tracking-tighter leading-none mb-1">{product.name}</h3>
                          <p className="text-[9px] font-black text-emerald-300 uppercase tracking-[0.2em]">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-emerald-600 tracking-tighter">₹{product.price}</p>
                          <p className="text-[8px] font-bold text-emerald-200">per {product.unit}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-8">
                        <div className={`text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${product.stock === 0 ? "bg-red-50 text-red-400" : isLowStock ? "bg-orange-50 text-orange-400" : "bg-emerald-50 text-emerald-400"
                          }`}>
                          {product.stock === 0 ? "Depleted" : isLowStock ? "Limited" : "In Stock"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart size={12} className="text-emerald-100 hover:text-red-400 transition-colors" />
                          <span className="text-[10px] font-black text-emerald-900/20">{product.rating || "5.0"}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0 || isInCart}
                        className={`w-full py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 ${isInCart
                          ? "bg-emerald-50 text-emerald-300 border border-emerald-100"
                          : product.stock > 0
                            ? "bg-emerald-950 text-white hover:bg-emerald-500 hover:shadow-2xl hover:shadow-emerald-200 active:scale-95"
                            : "bg-gray-50 text-gray-300"
                          }`}
                      >
                        {isInCart ? "In Basket" : product.stock > 0 ? "Claim Harvest" : "Sold Out"}
                      </button>
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