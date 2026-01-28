import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderDetails = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const orders = JSON.parse(localStorage.getItem("cart")) || [];

    // if (!userData || orders.length === 0) {
    //   navigate("/");
    //   return;
    // }

    setUser(userData);
    setOrder(orders); // latest order
  }, [navigate]);

//   if (!user || !order) return null;

console.log(order)

 const total = order.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 px-4 py-16">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10">

        {/* 🌿 HEADING */}
        <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-12">
          Confirm Your Order
        </h1>

        <div className="grid md:grid-cols-2 gap-12">

          {/* 👤 USER DETAILS */}
          <div className="bg-green-50 rounded-2xl p-6 shadow">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
               Customer Details
            </h2>

            <div className="space-y-2 text-lg text-gray-700">
              <p><b>Name:</b> {user?.name}</p>
              <p><b>Phone:</b> {user?.phone}</p>
              <p><b>City:</b> {user?.city}</p>
              <p><b>Address:</b> {user?.address}</p>
              <p>
                <b>Payment Method:</b>{" "}
                {order?.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "Online Payment"}
              </p>
            </div>
          </div>

          {/* 📦 PRODUCT DETAILS */}
          <div className="bg-emerald-50 rounded-2xl p-6 shadow">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
               Product Details
            </h2>

            {order.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border-b py-3 text-lg"
              >
                <span>
                  {item?.name} × {item?.qty}
                </span>
                <span className="font-semibold">
                  ₹ {item?.price * item?.qty}
                </span>
              </div>
            ))}

            <div className="flex justify-between mt-6 text-2xl font-extrabold">
              <span>Total Amount</span>
              <span>₹ {total}</span>
            </div>
          </div>
        </div>


        <div className="flex flex-col md:flex-row justify-center gap-6 mt-14">
          <button
            onClick={() => navigate("/cart")}
            className="bg-gray-200 text-gray-800 px-8 py-4 cursor-pointer rounded-xl text-lg font-semibold hover:scale-105 transition"
          >
            Edit Cart
          </button>

          <button
            
            className="bg-gradient-to-r from-green-600 to-emerald-500 cursor-pointer text-white px-10 py-4 rounded-xl text-xl font-bold hover:scale-110 transition shadow-lg"
          >
            💳 Confirm & Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
