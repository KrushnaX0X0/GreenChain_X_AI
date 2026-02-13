import React, { useRef, useState, useEffect } from "react"; // Fixed useEffect import
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom"; // Cleaned up duplicate import
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

gsap.registerPlugin(ScrollTrigger);

const Login = () => {
  const navigate = useNavigate(); // Only declare this once
  const formRef = useRef();
  const textRef = useRef();

  // 🔹 Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useGSAP(() => {
    gsap.from(textRef.current, {
      y: -50,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out",
    });

    gsap.from(formRef.current, {
      y: 100,
      opacity: 0,
      duration: 1.5,
      delay: 0.3,
      ease: "back.out(1.7)",
    });
  }, []);

  // 🔐 Normal Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      toast.success("Login successful! Welcome back");

      const roles = res.data.roles || [];
      const isAdmin = roles.includes("ROLE_ADMIN");
      localStorage.setItem("role", isAdmin ? "ADMIN" : "USER");

      setTimeout(() => {
        if (isAdmin) {
          navigate("/dashbord");
        } else {
          navigate("/userdashbord");
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Google Login Handler (Added missing function)
  const handleGoogleLogin = () => {
    // Redirect to your backend Google Auth route
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`;
  };



  // ... (existing imports)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      try {
        const decoded = jwtDecode(token);
        const roles = decoded.roles || [];
        const isAdmin = roles.includes("ROLE_ADMIN");

        localStorage.setItem("role", isAdmin ? "ADMIN" : "USER");

        if (isAdmin) {
          navigate("/dashbord");
        } else {
          navigate("/userdashbord");
        }
      } catch (e) {
        console.error("Token decode failed", e);
        navigate("/userdashbord");
      }
    }
  }, [navigate]);

  return (
    <div className="h-screen w-screen relative flex items-center justify-center overflow-hidden">
      <Navbar />

      <div
        ref={formRef}
        className="relative z-10 bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-10 w-[350px] flex flex-col items-center"
      >
        <h1
          ref={textRef}
          className="text-3xl font-bold text-green-800 mb-6 text-center"
        >
          Welcome to <span className="text-green-600">GreenChain</span>
        </h1>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <form onSubmit={handleLogin} className="w-full flex flex-col items-center">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 rounded-md border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-3 rounded-md border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          Login with Google
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup">
            <span className="text-green-700 font-medium cursor-pointer hover:underline">
              Sign Up
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;