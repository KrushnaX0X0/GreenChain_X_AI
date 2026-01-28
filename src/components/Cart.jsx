import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import emptyCart from "../assets/empty-cart-3d.png";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Load cart
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Update cart + localStorage
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
    <div className="pt-8 px-4 md:px-16 min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100">

      {/* HEADING */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
          Your Shopping Cart
        </h1>
        <p className="text-gray-600 mt-3 text-lg font-semibold">
          Fresh products, directly from farmers 🌱
        </p>
      </div>

      {/* EMPTY CART */}
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <img
            src={emptyCart}
            alt="Empty Cart"
            className="w-72 h-72 mb-6 drop-shadow-2xl animate-float"
          />

          <h2 className="text-4xl font-extrabold text-gray-800 mb-3">
            Your Cart is Empty
          </h2>

          <p className="text-lg text-gray-500 mb-8 max-w-md">
            Looks like you haven’t added anything yet.  
            Start shopping fresh farm products 🥕🍎
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-10 py-4 rounded-2xl text-xl font-semibold hover:scale-110 transition-transform shadow-xl"
          >
            🛍 Start Shopping
          </button>
        </div>
      ) : (
        /* CART ITEMS */
        <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center justify-between gap-6 border-b py-6"
            >
              {/* Product */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  {item.name}
                </h3>
                <p className="text-gray-500">
                  ₹ {item.price} / kg
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="w-10 h-10 rounded-full bg-red-100 text-red-600 text-xl font-bold hover:bg-red-200 transition"
                >
                  −
                </button>

                <span className="text-xl font-bold">
                  {item.qty}
                </span>

                <button
                  onClick={() => increaseQty(item.id)}
                  className="w-10 h-10 rounded-full bg-green-100 text-green-600 text-xl font-bold hover:bg-green-200 transition"
                >
                  +
                </button>
              </div>

              {/* Price */}
              <div className="text-xl font-bold text-gray-800">
                ₹ {item.price * item.qty}
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          {/* TOTAL */}
          <div className="flex justify-between items-center mt-8 text-3xl font-extrabold text-gray-800">
            <span>Total Amount</span>
            <span>₹ {total}</span>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col md:flex-row gap-6 mt-10">
            <button
              onClick={() => navigate("/checkout")}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-2xl text-xl font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              Place Order
            </button>

            <button
              onClick={clearCart}
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-2xl text-xl font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
