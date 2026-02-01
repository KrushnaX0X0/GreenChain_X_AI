import React from "react";
import axios from "axios";

const Payment = ({ amount }) => {

  const handlePayment = async () => {
    try {
      // 1️⃣ Create Razorpay order from backend
      const { data } = await axios.post(
        "http://localhost:8080/api/payments/create",
        {
          amount: amount // ₹ amount (backend converts to paise)
        }
      );

      // 2️⃣ Razorpay checkout options
      const options = {
        key: "rzp_test_xxxxxxxx", // 🔑 ONLY Razorpay KEY_ID
        amount: data.amount,     // in paise
        currency: data.currency,
        order_id: data.razorpayOrderId,
        name: "AgriAI Platform",
        description: "Farmer Product Purchase",

        handler: async function (response) {
          // 3️⃣ Verify payment with backend
          const verifyRes = await axios.post(
            "http://localhost:8080/api/payments/verify",
            {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            }
          );

          alert(verifyRes.data); // PAYMENT SUCCESS / FAILED
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

      // 4️⃣ Open Razorpay popup
      const razorpay = new window.Razorpay(options);
      razorpay.open();

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
