import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


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

  const total = order.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // 🔥 RAZORPAY PAYMENT FUNCTION
const handlePayment = async () => {
  try {
    // toast.info("Creating payment order...");

    const { data } = await axios.post(
      "http://localhost:8080/api/payments/create",
      { amount: total }
    );

    const options = {
      key: "rzp_test_xxxxxxxx",
      amount: data.amount,
      currency: data.currency,
      order_id: data.razorpayOrderId,
      name: "AgriAI Platform",
      description: "Order Payment",

      handler: async function (response) {
        toast.info("Verifying payment...");

        const verifyRes = await axios.post(
          "http://localhost:8080/api/payments/verify",
          {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          }
        );

        toast.success("🎉 Payment Successful!");
        localStorage.removeItem("cart");
        navigate("/success");
      },

      theme: { color: "#16a34a" }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();

  } catch (error) {
    console.error(error);
    toast.error(" Payment Failed. Try again.");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 px-4">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10">

        <h1 className="text-5xl font-extrabold text-center text-green-600 mb-12">
          Confirm Your Order
        </h1>

        <div className="grid md:grid-cols-2 gap-12">

          {/* 👤 CUSTOMER DETAILS */}
          <div className="bg-green-50 rounded-2xl p-6 shadow">
            <h2 className="text-3xl font-bold mb-4">Customer Details</h2>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Phone:</b> {user.phone}</p>
            <p><b>City:</b> {user.city}</p>
            <p><b>Address:</b> {user.address}</p>
          </div>

          {/* 📦 PRODUCT DETAILS */}
          <div className="bg-emerald-50 rounded-2xl p-6 shadow">
            <h2 className="text-3xl font-bold mb-4">Product Details</h2>

            {order.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border-b py-3 text-lg"
              >
                <span>{item.name} × {item.qty}</span>
                <span>₹ {item.price * item.qty}</span>
              </div>
            ))}

            <div className="flex justify-between mt-6 text-2xl font-extrabold">
              <span>Total Amount</span>
              <span>₹ {total}</span>
            </div>
          </div>
        </div>

        {/* 🔘 ACTION BUTTONS */}
        <div className="flex justify-center gap-6 mt-14">
          <button
            onClick={() => navigate("/cart")}
            className="bg-gray-200 px-8 py-4 rounded-xl font-semibold"
          >
            Edit Cart
          </button>

          <button
            onClick={handlePayment}
            className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-10 py-4 rounded-xl text-xl font-bold shadow-lg hover:scale-110 transition"
          >
            💳 Confirm & Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
