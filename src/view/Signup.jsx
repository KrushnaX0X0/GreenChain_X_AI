import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


const Signup = () => {
  const formRef = useRef();
  const headingRef = useRef();
  const navigate = useNavigate();

  // 🔹 Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useGSAP(() => {
    gsap.from(headingRef.current, {
      y: -40,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    });

    gsap.from(formRef.current, {
      y: 100,
      opacity: 0,
      duration: 1.3,
      delay: 0.4,
      ease: "back.out(1.5)",
    });
  }, []);

  // 🔐 Register Handler
 const handleSignup = async () => {
  if (!name || !email || !password || !confirmPassword) {
    toast.error(" All fields are required");
    return;
  }

  if (password !== confirmPassword) {
    toast.error(" Passwords do not match");
    return;
  }

  setLoading(true);

  try {
    await axios.post("http://localhost:8080/api/auth/register", {
      name,
      email,
      password,
    });

    toast.success(" Registration successful! Please login");

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  } catch (err) {
    toast.error(
      err.response?.data?.message || "❌ Registration failed"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="h-screen w-screen relative flex items-center justify-center overflow-hidden">
      <Navbar />

      <div
        ref={formRef}
        className="relative z-10 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-[380px] flex flex-col items-center"
      >
        <h1
          ref={headingRef}
          className="text-3xl font-bold text-green-800 mb-6 text-center"
        >
          Create Your Account
        </h1>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm mb-3">{error}</p>
        )}

        {/* Success */}
        {success && (
          <p className="text-green-700 text-sm mb-3">{success}</p>
        )}

        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 rounded-md border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-md border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded-md border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded-md border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {/* Login Link */}
        <p className="mt-4 text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/login">
            <span className="text-green-700 font-medium cursor-pointer hover:underline">
              Login
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
