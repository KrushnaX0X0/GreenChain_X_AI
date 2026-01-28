import React from "react";
import axios from "axios";

const Payment = ({ amount }) => {

  const handlePayment = async () => {
    try {
    
      const order = await axios.post("http://localhost:5000/create-order", {
        amount: amount * 100 
      });

      const options = {
        key: "RAZORPAY_KEY_ID", // 🔑 replace
        amount: order.data.amount,
        currency: "INR",
        name: "AgriAI Platform",
        description: "Farmer Product Purchase",
        order_id: order.data.id,
        handler: function (response) {
          alert("Payment Successful!");
          console.log(response);
        },
        prefill: {
          name: "Customer Name",
          email: "customer@email.com",
          contact: "9999999999"
        },
        theme: {
          color: "#16a34a"
        }
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment Failed");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
    >
      Pay ₹{amount}
    </button>
  );
};

export default Payment;
