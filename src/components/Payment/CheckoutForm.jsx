import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {
  ShieldCheck, CreditCard, MapPin,
  Phone, User, ChevronLeft, Zap, Smartphone
} from "lucide-react";
import toast from "react-hot-toast";

const CheckoutForm = () => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    payment: "card",
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedCart.length === 0) navigate("/shop");
    setCart(storedCart);
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = (subtotal + (subtotal * 0.02) + (subtotal > 500 ? 0 : 50)).toFixed(2);

  // 🔐 HELPER: Get Token
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 💾 SAVE ORDER TO BACKEND
  const saveOrder = async (paymentId) => {
    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.qty
        })),
        mobile: formData.phone,
        address: formData.address,
        city: formData.city,
        paymentId: paymentId // Sent the payment ID for reference
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        orderData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Failed to secure order record.");
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create Order on Backend
      const orderRequest = {
        amount: parseFloat(total), // Ensure it's a number, not string
        currency: "INR",
        receipt: `receipt_${Date.now()}`
      };

      const { data: order } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payments/create`,
        orderRequest,
        { headers: getAuthHeader() }
      );

      // 2. Initialize Razorpay Checkout
      const options = {
        key: "rzp_test_SBBvRWrkKYMijH",
        amount: total * 100,
        currency: order.currency,
        name: "GreenChain",
        description: "Secure Harvest Checkout",
        order_id: order.id, // This is the ID from your backend
        handler: async function (response) {
          try {
            // 3. Save Final Order to Database Directly (Skipping Backend Verification)
            await saveOrder(response.razorpay_payment_id);

            const orderDetails = {
              orderId: `GCH-${Math.floor(Math.random() * 900000) + 100000}`,
              paymentId: response.razorpay_payment_id,
              customer: formData,
              items: cart,
              total: total,
              date: new Date().toLocaleString(),
            };

            localStorage.setItem("lastOrder", JSON.stringify(orderDetails));
            localStorage.removeItem("cart"); // 🗑️ Clear Cart on Success
            window.dispatchEvent(new Event("cartUpdated"));

            toast.success("Payment Successful & Order Placed!");
            navigate("/bill");
          } catch (err) {
            console.error("Order processing failed", err);
            toast.error("Order processing failed.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.phone,
        },
        theme: { color: "#064E3B" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Order creation failed", error);
      const errorMessage = error.response?.data?.error || error.message || "Could not initiate transaction.";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else handlePayment();
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] flex items-center justify-center px-6 py-20 font-sans">
      <div className="max-w-6xl w-full bg-white rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-hidden grid md:grid-cols-5 border border-white">

        {/* LEFT: SPATIAL ORDER SUMMARY */}
        <div className="md:col-span-2 bg-emerald-950 p-12 text-white relative flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"></div>

          <div className="relative z-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-10">Order Manifest</h2>
            <div className="space-y-6 max-h-[35vh] overflow-y-auto pr-4 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center p-2 border border-white/10 group-hover:bg-white/10 transition-all">
                      <img src={item.image} alt="" className="object-contain" />
                    </div>
                    <div>
                      <p className="text-sm font-black tracking-tight">{item.name}</p>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <p className="font-black text-sm italic">₹{item.price * item.qty}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 space-y-4">
            <div className="flex justify-between text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">
              <span>Security & Tax (2%)</span>
              <span>₹{(subtotal * 0.02).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-end text-white pt-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Net Payable</span>
              <span className="text-4xl font-black tracking-tighter italic text-emerald-400">₹{total}</span>
            </div>

            <div className="mt-8 p-6 bg-emerald-900/50 backdrop-blur-md border border-white/10 rounded-[32px] flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest">Secure Terminal</p>
                <p className="text-[10px] text-emerald-400/60">256-bit SSL Encrypted</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: BENTO FORM */}
        <div className="md:col-span-3 p-12 md:p-16 flex flex-col justify-center">
          {/* Stepper */}
          <div className="flex items-center gap-6 mb-16">
            <div className={`flex items-center gap-3 ${step >= 1 ? 'text-emerald-950' : 'text-gray-300'}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black transition-all ${step >= 1 ? 'bg-emerald-950 text-white shadow-lg' : 'bg-gray-100'}`}>1</div>
              <span className="text-[10px] font-black uppercase tracking-widest">Logistics</span>
            </div>
            <div className="h-[1px] w-8 bg-gray-100" />
            <div className={`flex items-center gap-3 ${step >= 2 ? 'text-emerald-950' : 'text-gray-300'}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black transition-all ${step >= 2 ? 'bg-emerald-950 text-white shadow-lg' : 'bg-gray-100'}`}>2</div>
              <span className="text-[10px] font-black uppercase tracking-widest">Transaction</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 ? (
              <div className="grid grid-cols-1 gap-5">
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-900/20 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full pl-14 p-5 rounded-[24px] bg-emerald-50/50 border border-transparent focus:border-emerald-200 focus:bg-white outline-none font-bold text-sm text-emerald-950 transition-all" />
                </div>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-900/20 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input type="tel" name="phone" placeholder="Contact Number" value={formData.phone} onChange={handleChange} required className="w-full pl-14 p-5 rounded-[24px] bg-emerald-50/50 border border-transparent focus:border-emerald-200 focus:bg-white outline-none font-bold text-sm text-emerald-950 transition-all" />
                </div>
                <textarea name="address" placeholder="Shipping Address" value={formData.address} onChange={handleChange} required rows="3" className="w-full p-5 rounded-[24px] bg-emerald-50/50 border border-transparent focus:border-emerald-200 focus:bg-white outline-none font-bold text-sm text-emerald-950 transition-all resize-none" />
                <input type="text" name="city" placeholder="City / State" value={formData.city} onChange={handleChange} required className="w-full p-5 rounded-[24px] bg-emerald-50/50 border border-transparent focus:border-emerald-200 focus:bg-white outline-none font-bold text-sm text-emerald-950 transition-all" />
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'card', label: 'Bank Card', icon: <CreditCard size={24} /> },
                    { id: 'upi', label: 'UPI / Digital', icon: <Smartphone size={24} /> }
                  ].map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setFormData({ ...formData, payment: m.id })}
                      className={`p-8 rounded-[32px] border-2 cursor-pointer transition-all flex flex-col items-center gap-4 ${formData.payment === m.id ? 'border-emerald-500 bg-emerald-50 shadow-xl shadow-emerald-100' : 'border-emerald-50 hover:border-emerald-200'}`}
                    >
                      <div className={`${formData.payment === m.id ? 'text-emerald-600' : 'text-emerald-950/20'}`}>
                        {m.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              {step === 2 && (
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 rounded-[24px] font-black text-[10px] border border-emerald-100 text-emerald-950 uppercase tracking-[0.3em] hover:bg-emerald-50 transition-all">
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-emerald-950 text-white py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-500 hover:shadow-2xl hover:shadow-emerald-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {loading ? <Zap className="animate-pulse" size={16} /> : step === 1 ? 'Next Sequence' : `Authorize ₹${total}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;