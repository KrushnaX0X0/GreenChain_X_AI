import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Trash2, Plus, Minus, ShoppingBag, 
  ArrowLeft, Truck, ShieldCheck, Leaf, Ticket 
} from "lucide-react";
import emptyCartImg from "../assets/shop.png";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQty = (id) => {
    updateCart(cart.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item));
  };

  const decreaseQty = (id) => {
    updateCart(
      cart.map(item => item.id === id ? { ...item, qty: item.qty - 1 } : item)
          .filter(item => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    updateCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/shop");
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const ecoTax = (subtotal * 0.02).toFixed(2); // 2% for reforestation
  const total = (parseFloat(subtotal) + parseFloat(shipping) + parseFloat(ecoTax)).toFixed(2);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => navigate("/shop")}
            className="flex items-center gap-2 text-gray-500 hover:text-green-600 font-bold text-xs uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={16} /> Back to Shop
          </button>
          <div className="text-right">
             <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Your Basket</h1>
             <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Supporting Local Farmers</p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200 shadow-sm">
            <img src={emptyCartImg} alt="Empty" className="w-64 h-64 mb-8 opacity-40 grayscale" />
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">The basket is empty</h2>
            <button 
              onClick={() => navigate("/shop")}
              className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all"
            >
              Discover Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* LEFT: ITEM LIST */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm flex items-center gap-6 group">
                  <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center p-4">
                     <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{item.name}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">₹{item.price} / kg</p>
                  </div>

                  <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl">
                    <button onClick={() => decreaseQty(item.id)} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm">
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-black text-gray-900">{item.qty}</span>
                    <button onClick={() => increaseQty(item.id)} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center hover:bg-green-50 hover:text-green-600 transition-colors shadow-sm">
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <p className="text-lg font-black text-gray-900 tracking-tighter">₹{item.price * item.qty}</p>
                    <button onClick={() => removeItem(item.id)} className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button 
                onClick={clearCart}
                className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest px-6"
              >
                Discard All Items
              </button>
            </div>

            {/* RIGHT: ORDER SUMMARY */}
            <div className="space-y-6">
              <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-green-900/5">
                <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8">Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-gray-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-widest">
                    <span>Eco-Tax (2%)</span>
                    <span className="text-green-600">+₹{ecoTax}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600" : "text-gray-900"}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  
                  {/* FREE SHIPPING PROGRESS */}
                  {subtotal < 500 && (
                    <div className="pt-2">
                      <div className="flex justify-between text-[9px] font-black mb-2 uppercase">
                        <span>Free Shipping Goal</span>
                        <span className="text-green-600">₹{500 - subtotal} to go</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-1000" 
                          style={{ width: `${(subtotal / 500) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-[1px] bg-gray-100 w-full mb-8" />

                <div className="flex justify-between items-end mb-10">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Total Pay</span>
                  <span className="text-4xl font-black text-gray-900 tracking-tighter">₹{total}</span>
                </div>

                {/* PROMO CODE */}
                <div className="relative mb-6">
                  <input 
                    type="text" 
                    placeholder="PROMO CODE" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-green-500 text-xs font-black uppercase outline-none transition-all"
                  />
                  <Ticket className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                </div>

                <button 
                  onClick={() => navigate("/checkout")}
                  className="w-full py-5 bg-green-600 text-white rounded-[20px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-900 transition-all shadow-lg shadow-green-100 hover:shadow-gray-200"
                >
                  Confirm Order
                </button>
              </div>

              {/* SECURITY / FEATURES CARDS */}
              <div className="bg-gray-900 rounded-[32px] p-6 text-white flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-green-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Safe Settlement</p>
                  <p className="text-[9px] text-gray-400">Blockchain Verified Transactions</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;