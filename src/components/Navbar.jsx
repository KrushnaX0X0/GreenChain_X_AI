import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import bg from "../assets/bg.png";

const Navbar = () => {
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // 🔐 Decode JWT & set user
  const checkAuth = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setUser(null);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      setIsLoggedIn(true);
      setUser({
        name: decoded.name || decoded.username || "User",
        role: decoded.role || decoded.roles?.[0] || "USER",
        email: decoded.sub,
      });
    } catch (err) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  // 🛒 Load cart count
  const loadCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    setCartCount(count);
  };

  useEffect(() => {
    loadCartCount();
    checkAuth();

    window.addEventListener("cartUpdated", loadCartCount);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("cartUpdated", loadCartCount);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <div
      id="navbar"
      className="h-15 w-screen fixed top-0 z-[9999] backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mt-2 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 ml-14">
          <div className="h-10">
            <img src={bg} className="h-full object-fill" alt="logo" />
          </div>
          <h1 className="font-bold text-xl">GreenChain</h1>
        </div>

        {/* Menu */}
        <ul className="flex w-[40vw] justify-evenly font-medium items-center">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/shop">Shop</Link>
          </li>
          <li>
            <Link to="/services">Services</Link>
          </li>

          {/* 🛒 Cart */}
          {isLoggedIn && (
            <li className="h-10 relative">
              <Link to="/cart">
                <i className="ri-shopping-cart-2-line text-xl"></i>
              </Link>
              <div className="bg-green-500 h-4 w-4 rounded-full flex justify-center items-center absolute top-[-6px] right-[-5px] text-[0.7em] text-white">
                {cartCount}
              </div>
            </li>
          )}

          {/* 🔐 Auth Section */}
          {!isLoggedIn ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li className="bg-green-600 h-8 w-20 flex justify-center items-center rounded-sm text-white">
                <Link to="/signup">Sign Up</Link>
              </li>
            </>
          ) : (
                       
                 <li className="relative group">
  {/* Avatar Button */}
  <div
    className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-green-700
               flex items-center justify-center text-white font-bold uppercase
               cursor-pointer shadow-lg ring-2 ring-green-400/40
               hover:scale-105 transition-all duration-200"
  >
    {user?.name?.charAt(0) || "U"}
  </div>

  {/* Dropdown */}
  <div
    className="absolute right-0 mt-3 w-60 opacity-0 scale-95
               group-hover:opacity-100 group-hover:scale-100
               transition-all duration-200 origin-top-right
               bg-white/95 backdrop-blur-xl shadow-2xl
               rounded-2xl overflow-hidden z-[99999]"
  >
    {/* User Info */}
    <div className="px-6 py-4 border-b bg-gradient-to-r from-green-50 to-white">
      <p className="text-sm font-semibold text-gray-900 truncate">
        {user?.name}
      </p>
      <p className="text-xs text-green-600 font-medium mt-0.5">
        {user?.role}
      </p>
    </div>

    {/* Menu */}
    <div className="px-4 py-4">
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2
                   bg-gradient-to-r from-red-500 to-red-600
                   text-white py-2.5 rounded-xl
                   hover:from-red-600 hover:to-red-700
                   transition-all duration-200
                   font-semibold shadow-md"
      >
        <i className="ri-logout-box-r-line text-lg"></i>
        Logout
      </button>
    </div>
  </div>
</li>


              
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
