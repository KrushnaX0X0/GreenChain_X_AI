import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import gsap from "gsap";
import {
  Search, Leaf, Heart, Sparkles, MoveRight,
  Star, ShoppingBag, Plus, ArrowUpRight
} from "lucide-react";

import Navbar from "../components/Navbar";
import AgriChatbot from "../components/AI/AgriChatbot";

const Shop = () => {
  const navigate = useNavigate();
  const gridRef = useRef();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const syncCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(cart);
    };
    syncCart();
    window.addEventListener("cartUpdated", syncCart);
    return () => window.removeEventListener("cartUpdated", syncCart);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        if (Array.isArray(res.data)) setProducts(res.data);
      } catch (err) {
        toast.error("Connection failed.");
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [navigate]);

  useEffect(() => {
    if (loadingProducts || products.length === 0) return;
    const cards = gridRef.current?.querySelectorAll(".product-card");
    if (cards) {
      gsap.fromTo(cards,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power4.out" }
      );
    }
  }, [loadingProducts, products]);

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

      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[1000px] h-[600px] bg-emerald-50/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-50/30 rounded-full blur-[100px]" />
      </div>

      <div className="pt-32 px-6 max-w-7xl mx-auto">
        {/* --- HERO SECTION --- */}
        {/* <div className="mb-20">
          <div className="bg-emerald-950 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12">
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
            </div>
          </div>
        </div> */}

        {/* --- SEARCH --- */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-16 px-4">
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

        {/* --- UPDATED PRODUCT GRID --- */}
        {loadingProducts ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-800">Syncing Nodes</p>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-32">
            {filteredProducts.map((product) => {
              const isInCart = cartItems.some(item => item.id === product.id);
              return (
                <div key={product.id} className="product-card group relative">
                  {/* Premium Card Container */}
                  <div className="bg-white rounded-[2.5rem] p-3 border border-emerald-50/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_40px_80px_-15px_rgba(6,78,59,0.12)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col h-full overflow-hidden">

                    {/* Visual Asset Area */}
                    <div className="relative aspect-square rounded-[2rem] bg-gradient-to-br from-gray-50 to-emerald-50/30 overflow-hidden flex items-center justify-center group-hover:bg-emerald-50 transition-colors duration-700">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-4/5 h-4/5 object-contain group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Farm+Item"; }}
                      />

                      {/* Top Overlay Actions */}
                      <div className="absolute top-4 inset-x-4 flex justify-between items-start">
                        <div className={`px-3 py-1.5 rounded-full backdrop-blur-md border flex items-center gap-1.5 ${product.stock > 0 ? 'bg-white/80 border-white/50' : 'bg-red-50/80 border-red-100'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          <span className={`text-[9px] font-bold uppercase tracking-tight ${product.stock > 0 ? 'text-emerald-950' : 'text-red-600'}`}>
                            {product.stock > 0 ? 'In Stock' : 'Sold Out'}
                          </span>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-white/50 flex items-center justify-center text-emerald-950 hover:bg-emerald-500 hover:text-white transition-all transform hover:rotate-12">
                          <Heart size={16} />
                        </button>
                      </div>

                      {/* Detail Trigger - Bottom Right */}
                      <div className="absolute bottom-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="w-10 h-10 rounded-full bg-emerald-950 flex items-center justify-center text-white shadow-xl shadow-emerald-900/20">
                          <ArrowUpRight size={18} />
                        </div>
                      </div>
                    </div>

                    {/* Content Detail Area */}
                    <div className="mt-5 px-3 pb-4 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-wider rounded-md border border-emerald-100/50">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 ml-auto">
                          <Star size={10} className="fill-emerald-500 text-emerald-500" />
                          <span className="text-[10px] font-bold text-emerald-900">{product.rating || "4.9"}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-extrabold text-emerald-950 tracking-tight mb-4 group-hover:text-emerald-600 transition-colors">
                        {product.name}
                      </h3>

                      <div className="mt-auto flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-tighter">Market Rate / {product.unit}</span>
                          <span className="text-2xl font-black text-emerald-950 tracking-tighter">₹{product.price}</span>
                        </div>

                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0 || isInCart}
                          className={`flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 transition-all duration-500 ${isInCart
                            ? "bg-emerald-50 text-emerald-600 font-bold text-sm border border-emerald-100"
                            : product.stock > 0
                              ? "bg-emerald-950 text-white hover:bg-emerald-500 hover:-translate-y-1 font-bold shadow-lg shadow-emerald-900/10"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                          {isInCart ? (
                            <><ShoppingBag size={18} /> Cart</>
                          ) : (
                            <><Plus size={20} /> Add</>
                          )}
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