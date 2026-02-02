import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, CreditCard, MapPin, 
  Phone, User, CheckCircle2 
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

  // --- RAZORPAY INTEGRATION ---
  const handlePayment = () => {
    setLoading(true);
    const options = {
      key: "rzp_test_SBBvRWrkKYMijH", // Replace with your Test Key from Razorpay Dashboard
      amount: Math.round(total * 100),
      currency: "INR",
      name: "GreenChain AgriMart",
      description: "Organic Farm Purchase",
      handler: function (response) {
        const orderDetails = {
          orderId: `GCH-${Math.floor(Math.random() * 900000) + 100000}`,
          paymentId: response.razorpay_payment_id,
          customer: formData,
          items: cart,
          total: total,
          date: new Date().toLocaleString(),
        };
        // Save to storage for the Bill page
        localStorage.setItem("lastOrder", JSON.stringify(orderDetails));
        // localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));

        toast.success("Payment Successful!");
        // Navigating to Bill Page
                 navigate("/bill");
      },
      prefill: { name: formData.name, contact: formData.phone },
      theme: { color: "#16a34a" },
      modal: { ondismiss: () => setLoading(false) }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else handlePayment();
  };

  // 3D Tilt Logic
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * -10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 py-12 font-sans">
      <div className="max-w-6xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden grid md:grid-cols-5">
        
        {/* LEFT: ORDER SUMMARY */}
        <div className="md:col-span-2 bg-gray-900 p-12 text-white relative">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-400 mb-8">Order Summary</h2>
          <div className="space-y-6 mb-12 max-h-[40vh] overflow-y-auto pr-4 no-scrollbar">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center p-2">
                    <img src={item.image} alt="" className="object-contain" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold">Qty: {item.qty}</p>
                  </div>
                </div>
                <p className="font-bold text-sm">₹{item.price * item.qty}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 space-y-4">
            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
              <span>Eco-Tax (2%)</span>
              <span>₹{(subtotal * 0.02).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-black text-white pt-4">
              <span>Total Amount</span>
              <span className="text-green-400">₹{total}</span>
            </div>
          </div>

          <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
            className="mt-12 p-6 bg-white/5 border border-white/10 rounded-3xl transition-transform duration-300">
            <div className="flex items-center gap-4 mb-4">
              <ShieldCheck className="text-green-400" size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">Verified Payment</span>
            </div>
            <p className="text-[11px] text-gray-400">Encrypted via Razorpay Secure Gateway.</p>
          </div>
        </div>

        {/* RIGHT: FORM */}
        <div className="md:col-span-3 p-12 md:p-16">
          <div className="flex items-center gap-4 mb-12">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-green-600' : 'text-gray-300'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>1</span>
              <span className="text-[10px] font-black uppercase">Shipping</span>
            </div>
            <div className="h-[1px] w-12 bg-gray-100" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-green-600' : 'text-gray-300'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>2</span>
              <span className="text-[10px] font-black uppercase">Payment</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full pl-12 p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-green-500 font-medium" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input type="tel" name="phone" placeholder="Mobile Number" value={formData.phone} onChange={handleChange} required className="w-full pl-12 p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-green-500 font-medium" />
                </div>
                <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} required rows="3" className="w-full p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-green-500 font-medium" />
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required className="w-full p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-green-500 font-medium" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {['card', 'upi'].map((m) => (
                    <div key={m} onClick={() => setFormData({...formData, payment: m})} className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col items-center gap-3 ${formData.payment === m ? 'border-green-600 bg-green-50' : 'border-gray-100'}`}>
                      <CreditCard size={24} />
                      <span className="text-[10px] font-black uppercase">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6">
              {step === 2 && (
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 rounded-2xl font-black text-[10px] border border-gray-200 uppercase tracking-widest">Back</button>
              )}
              <button type="submit" disabled={loading} className="flex-[2] bg-green-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-900 transition-all shadow-xl shadow-green-100">
                {loading ? "Processing..." : step === 1 ? 'Continue to Payment' : `Pay ₹${total}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;