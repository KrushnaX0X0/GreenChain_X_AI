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
            <div className="flex items-center gap-6">
              <li>
                <Link to={user?.role === 'ROLE_ADMIN' ? "/dashbord" : "/userdashbord"}>Dashbord</Link>
              </li>

             




            </div>
          )}

          {/* 🛒 Cart */}
          {isLoggedIn && (

            <div className="flex items-center gap-6">
            <li className="h-10 relative">
              <Link to="/cart">
                <i className="ri-shopping-cart-2-line text-xl"></i>
              </Link>
              <div className="bg-green-500 h-4 w-4 rounded-full flex justify-center items-center absolute top-[-6px] right-[-5px] text-[0.7em] text-white">
                {cartCount}
              </div>
            </li>

             <li className="relative group">
                {/* Avatar Button */}
                {/* Avatar with 3D Depth */}
                <div
                  className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center 
             text-emerald-900 font-black uppercase text-xs tracking-tighter
             cursor-pointer shadow-[0_10px_20px_rgba(0,0,0,0.05)] border border-emerald-50
             hover:shadow-[0_15px_30px_rgba(16,185,129,0.15)] hover:-translate-y-1 
             transition-all duration-300 relative z-50 group"
                >
                  {user?.name?.charAt(0) || "U"}
                  {/* Active Pulse Status */}
                  <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>

                {/* Spatial Dropdown */}
                <div
                  className="absolute right-0 mt-4 w-64 opacity-0 scale-90 pointer-events-none
             group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
             transition-all duration-500 origin-top-right
             bg-white/80 backdrop-blur-2xl shadow-[0_30px_60px_rgba(6,78,59,0.12)]
             rounded-[32px] border border-white overflow-hidden z-[99999]"
                >
                  {/* Header: Glassmorphic Minimalist */}
                  <div className="px-7 py-6 bg-emerald-50/30">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Verified Identity</span>
                    </div>
                    <p className="text-lg font-black text-emerald-950 tracking-tighter leading-none">
                      {user?.name}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-1 w-1 bg-emerald-400 rounded-full"></div>
                      <p className="text-[9px] font-bold text-emerald-900/40 uppercase tracking-widest">
                        {user?.role || "Member"}
                      </p>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="p-3">
                    {/* Optional: Profile Link */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white transition-colors text-emerald-950/60 hover:text-emerald-950 group/item">
                      <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center group-hover/item:bg-emerald-100 transition-colors">
                        <i className="ri-user-3-line text-emerald-600"></i>
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest">Account Details</span>
                    </button>

                    <div className="h-[1px] bg-emerald-50 my-2 mx-4"></div>

                    {/* Elegant Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between px-5 py-4
                 bg-emerald-950 text-white rounded-[22px]
                 hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-200
                 transition-all duration-300 group/logout"
                    >
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Terminate Session</span>
                      <i className="ri-logout-circle-r-line text-lg group-hover/logout:translate-x-1 transition-transform"></i>
                    </button>
                  </div>

                  {/* Bottom Subtle Tag */}
                  <div className="py-3 text-center bg-emerald-50/20">
                    <p className="text-[8px] font-bold text-emerald-900/20 uppercase tracking-[0.5em]">GreenChain Secure Node</p>
                  </div>
                </div>
              </li>

              
     
     </div>

          )}


        </ul>
      </div>
    </div>
  );
};

export default Navbar;
