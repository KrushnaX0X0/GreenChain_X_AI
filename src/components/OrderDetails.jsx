import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ChevronLeft, CreditCard, User, PackageCheck } from "lucide-react";

const OrderDetails = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const orders = JSON.parse(localStorage.getItem("cart")) || [];

    if (!userData || orders.length === 0) {
      navigate("/");
      return;
    }

    setUser(userData);
    setOrder(orders);
  }, [navigate]);

  if (!user || order.length === 0) return null;

  const total = order.reduce((sum, item) => sum + item.price * item.qty, 0);

  // 🔐 HELPER: Get Token & Build Header
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ✅ SAVE ORDER TO BACKEND
  const saveOrder = async (paymentId) => {
    try {
      const orderData = {
        userId: user.id,
        userName: user.name,
        userPhone: user.phone,
        userCity: user.city,
        userAddress: user.address,
        items: order.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.qty,
          price: item.price,
        })),
        totalAmount: total,
        paymentId: paymentId,
        status: "COMPLETED",
      };

      const response = await axios.post(
        "http://localhost:8080/api/orders",
        orderData,
        { headers: getAuthHeader() } // ⬅️ Token sent here
      );

      return response.data;
    } catch (error) {
      console.error("Error saving order:", error);
      throw error;
    }
  };

  // 🔥 RAZORPAY PAYMENT FUNCTION
  const handlePayment = async () => {
    try {
      // 1. Create Order on Backend
      const { data } = await axios.post(
        "http://localhost:8080/api/payments/create",
        { amount: total },
        { headers: getAuthHeader() } // ⬅️ Token sent here
      );

      const options = {
        key: "rzp_test_xxxxxxxx", // Use your real key
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpayOrderId,
        name: "GreenChain Platform",
        description: "Secure Harvest Payment",
        handler: async function (response) {
          toast.info("Verifying secure transaction...");

          try {
            // 2. Verify Payment
            await axios.post(
              "http://localhost:8080/api/payments/verify",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
              { headers: getAuthHeader() } // ⬅️ Token sent here
            );

            // 3. Save Order
            await saveOrder(response.razorpay_payment_id);

            toast.success("🎉 Harvest Confirmed!");
            localStorage.removeItem("cart");
            navigate("/success");
          } catch (error) {
            toast.error("Verification failed!");
          }
        },
        theme: { color: "#064E3B" }, // Deep Emerald
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("Payment initialization failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FDF9] pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <button 
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-4 hover:gap-4 transition-all"
            >
              <ChevronLeft size={16} /> Back to Basket
            </button>
            <h1 className="text-6xl font-black text-emerald-950 tracking-tighter leading-none">
              Final <br /><span className="text-emerald-500 italic font-serif font-light">Verification.</span>
            </h1>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-emerald-50 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
              <PackageCheck size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest">Order Total</p>
              <p className="text-2xl font-black text-emerald-950">₹{total}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left: Customer Bento Box */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-emerald-50 shadow-sm relative overflow-hidden">
              <User className="absolute -right-4 -top-4 w-24 h-24 text-emerald-50 opacity-50" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-6">Delivery Node</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-bold text-emerald-900/30 uppercase">Recipient</label>
                  <p className="font-bold text-emerald-950">{user.name}</p>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-emerald-900/30 uppercase">Contact</label>
                  <p className="font-bold text-emerald-950">{user.phone}</p>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-emerald-900/30 uppercase">Destination</label>
                  <p className="font-bold text-emerald-950 leading-tight">{user.address}, {user.city}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Item List Bento Box */}
          <div className="lg:col-span-2 bg-emerald-950 text-white p-10 rounded-[50px] shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
            
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-8">Manifest Details</h2>
            
            <div className="space-y-6 relative z-10">
              {order.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div>
                    <p className="text-lg font-bold tracking-tight">{item.name}</p>
                    <p className="text-[10px] font-medium text-emerald-400 uppercase tracking-widest">Qty: {item.qty}</p>
                  </div>
                  <p className="text-xl font-black italic">₹{item.price * item.qty}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-emerald-800 flex justify-between items-end">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Net Payable</p>
              <p className="text-5xl font-black tracking-tighter">₹{total}</p>
            </div>

            <button
              onClick={handlePayment}
              className="w-full mt-10 bg-emerald-500 hover:bg-white hover:text-emerald-950 text-white py-6 rounded-[30px] font-black text-xs uppercase tracking-[0.4em] transition-all duration-500 flex items-center justify-center gap-4 shadow-xl shadow-emerald-500/20"
            >
              <CreditCard size={18} /> Initiate Secure Payment
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;