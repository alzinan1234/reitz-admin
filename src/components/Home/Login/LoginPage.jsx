// ============================================
// FILE: app/pages/login/page.js
// Purpose: Login Page with Complete API Integration
// ============================================

"use client";

import { loginUser } from "@/components/lib/apiClient";
import Link from "next/link";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // --- Client-side validation ---
    if (!email || !password) {
      setError("Please enter both email and password.");
      toast.error("Please enter both email and password.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      // Call login API
      const response = await loginUser(email, password);

      if (response.success) {
        toast.success("Login Successful!");

        // Token is automatically stored in cookie by loginUser function
        
        // Redirect based on user role
        const redirectPath = response.data?.user?.role === "admin" ? "/admin" : "/admin";
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 1000);
      } else {
        setError(response.message || "Login failed. Please try again.");
        toast.error(response.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.message || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Left Beige Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#E7DCD3] items-center justify-center p-8">
        <div className="text-center">
          <img
            src="/login-image.png"
            alt="TikaFood Logo"
            className="mx-auto mb-4 max-w-full h-auto"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/600x400/BA2721/FFFFFF?text=Image+Not+Found";
            }}
          />
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-8">
        <div className="md:w-[564px] bg-white p-10 rounded-[15px] flex flex-col justify-center items-center gap-10">
          <div className="self-stretch flex flex-col justify-start items-center gap-[30px]">
            <div className="self-stretch flex flex-col justify-center items-center gap-[30px]">
              <div className="w-full flex flex-col justify-start items-center gap-[18px]">
                <h2 className="self-stretch text-center text-[#486583] text-2xl font-bold font-[Open_Sans]">
                  Login to Account
                </h2>
                <p className="self-stretch text-center text-[#5C5C5C] text-sm font-normal font-[Open_Sans]">
                  Please enter your email and password to continue
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col items-end gap-[18px]"
              >
                <div className="self-stretch flex flex-col justify-start items-start gap-[18px]">
                  {/* Email Input */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <label
                      htmlFor="email"
                      className="self-stretch text-[#5C5C5C] text-sm font-normal font-[Open_Sans]"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="self-stretch h-10 w-full px-3 py-2.5 bg-white rounded-md border border-[#DCDCDC] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#BB2821] font-[Open_Sans]"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {/* Password Input */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <label
                      htmlFor="password"
                      className="self-stretch text-[#5C5C5C] text-sm font-normal font-[Open_Sans]"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="self-stretch h-10 px-3 py-2.5 bg-white rounded-md border border-[#DCDCDC] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#BB2821] font-[Open_Sans]"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="self-stretch flex justify-between items-center mt-2">
                  <label
                    htmlFor="rememberMe"
                    className="flex items-center gap-3 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      id="rememberMe"
                      className="hidden peer"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <div className="w-[18px] h-[18px] bg-white peer-checked:bg-[#486583] rounded-[2px] border border-[#DCDCDC] peer-checked:border-[#486583] flex items-center justify-center relative">
                      {rememberMe && (
                        <svg
                          className="w-3 h-3 text-white absolute"
                          fill="none"
                          viewBox="0 0 14 11"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 5.5L4.95263 9.5L13 1.5" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[#5C5C5C] text-xs font-normal font-[Open_Sans]">
                      Remember Password
                    </span>
                  </label>
                  <Link
                    href="/Forgot-Password"
                    className="text-[#BB2821] text-xs font-normal font-[Open_Sans] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center mt-2 font-[Open_Sans] w-full">
                    {error}
                  </p>
                )}

                {/* Sign In Button */}
                <button
                  type="submit"
                  className={`w-28 h-10 mx-auto mt-4 bg-gradient-to-r from-[#86ACC8] via-[#557F9E] to-[#4B697F] text-white rounded-md text-sm font-normal font-[Open_Sans] shadow-[0px_4px_4px_rgba(189,189,189,0.25)] flex justify-center items-center transition duration-300 ease-in-out hover:opacity-90 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}