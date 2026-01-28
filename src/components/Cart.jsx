import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import emptyCart from "../assets/shop.png";

const Cart = () => {
  const [cart, setCart] = useState([]);
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
    updateCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    updateCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    updateCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/");
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-100 flex items-center justify-center px-6">

      {/* MAIN CARD */}
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8">

        {/* HEADING */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            Your Shopping Cart
          </h1>
          <p className="text-gray-600 mt-2 text-lg font-semibold">
            Fresh products directly from farmers 🌱
          </p>
        </div>

        {/* EMPTY CART */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <img
              src={emptyCart}
              alt="Empty Cart"
              className="w-56 h-56 mb-4 animate-float"
            />

            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
              Your Cart is Empty
            </h2>

            <p className="text-gray-500 mb-6">
              Start shopping fresh farm products 🥕🍎
            </p>

            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-8 py-3 rounded-2xl text-lg font-semibold hover:scale-105 transition-transform shadow-xl"
            >
              🛍 Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* CART ITEMS */}
         <div className="space-y-4 max-h-[45vh] overflow-y-scroll scrollbar-hide">

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-4 "
                >
                  <div>
                    <h3 className="text-xl font-semibold">
                      {item.name}
                    </h3>
                    <p className="text-gray-500">
                      ₹ {item?.price} / kg
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="w-9 h-9 rounded-full bg-red-100 text-red-600 font-bold"
                    >
                      −
                    </button>

                    <span className="text-lg font-bold">
                      {item.qty}
                    </span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="w-9 h-9 rounded-full bg-green-100 text-green-600 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="font-bold text-lg">
                    ₹ {item.price * item.qty}
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="flex justify-between items-center mt-6 text-2xl font-extrabold">
              <span>Total</span>
              <span>₹ {total}</span>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => navigate("/checkout")}
                className="flex-1 bg-gradient-to-r cursor-pointer from-green-600 to-emerald-500 text-white py-3 rounded-xl text-lg font-semibold hover:scale-105 transition"
              >
                Place Order
              </button>

              <button
                onClick={clearCart}
                className="flex-1 bg-gradient-to-r cursor-pointer from-red-500 to-pink-500 text-white py-3 rounded-xl text-lg font-semibold hover:scale-105 transition"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>

      {/* FLOAT ANIMATION */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Cart;
