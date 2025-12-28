// ============================================
// FILE: app/pages/forgot-password/page.js
// Purpose: Complete Forgot Password Flow with Real API
// ============================================

"use client";

import { resetPassword, sendOTP, verifyOTP } from "@/components/lib/apiClient";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";


export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- Step 1: Send OTP ---
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!email) {
      setError("Please enter your email address.");
      toast.error("Please enter your email address.");
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
      const response = await sendOTP(email);

      if (response.success) {
        setMessage("OTP has been sent to your email address.");
        toast.success("OTP sent successfully!");
        setStep(2);
      } else {
        setError(response.message || "Failed to send OTP. Please try again.");
        toast.error(response.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("Email submission error:", err);
      const errorMessage = err.message || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: Verify OTP ---
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!otp) {
      setError("Please enter the OTP.");
      toast.error("Please enter the OTP.");
      setLoading(false);
      return;
    }

    if (!/^\d{4}$/.test(otp)) {
      setError("Please enter a valid 4-digit OTP.");
      toast.error("Please enter a valid 4-digit OTP.");
      setLoading(false);
      return;
    }

    try {
      const response = await verifyOTP(email, otp);

      if (response.success) {
        setMessage("OTP verified successfully!");
        toast.success("OTP Verified!");
        setStep(3);
      } else {
        setError(response.message || "Invalid OTP. Please try again.");
        toast.error(response.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      const errorMessage = err.message || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- Resend OTP ---
  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await sendOTP(email);

      if (response.success) {
        setMessage("A new OTP has been sent to your email.");
        toast.success("New OTP sent!");
      } else {
        setError(response.message || "Failed to resend OTP. Please try again.");
        toast.error(response.message || "Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      const errorMessage = err.message || "Failed to resend OTP. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  // --- Step 3: Reset Password ---
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!newPassword || !confirmPassword) {
      setError("Please enter both new and confirm passwords.");
      toast.error("Please enter both new and confirm passwords.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      toast.error("New password and confirm password do not match.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      toast.error("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await resetPassword(email, otp, newPassword, confirmPassword);

      if (response.success) {
        setMessage("Your password has been reset successfully!");
        toast.success("Password Reset Successful!");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        setError(response.message || "Failed to reset password. Please try again.");
        toast.error(response.message || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      console.error("Set new password error:", err);
      const errorMessage = err.message || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "new") {
      setShowNewPassword(!showNewPassword);
    } else if (field === "confirm") {
      setShowConfirmPassword(!showConfirmPassword);
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

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-8">
        <div className="md:w-[564px] bg-white p-10 rounded-[15px] flex flex-col justify-center items-center gap-10">
          
          {/* STEP 1: Email Verification */}
          {step === 1 && (
            <div className="self-stretch flex flex-col justify-start items-center gap-[30px]">
              <div className="self-stretch flex flex-col justify-center items-center gap-[30px]">
                <div className="w-full flex flex-col justify-start items-center gap-[18px]">
                  <h2 className="self-stretch text-center text-[#486583] text-2xl font-bold font-[Open_Sans]">
                    Forgot Password
                  </h2>
                  <p className="self-stretch text-center text-[#5C5C5C] text-sm font-normal font-[Open_Sans]">
                    Enter your email address to receive an OTP code
                  </p>
                </div>
                <form
                  onSubmit={handleEmailSubmit}
                  className="w-full flex flex-col items-end gap-[18px]"
                >
                  <div className="self-stretch flex flex-col justify-start items-start gap-[18px]">
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
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm text-center mt-2 font-[Open_Sans] w-full">
                      {error}
                    </p>
                  )}
                  {message && (
                    <p className="text-green-600 text-sm text-center mt-2 font-[Open_Sans] w-full">
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    className={`w-28 h-10 mx-auto mt-4 bg-gradient-to-r from-[#86ACC8] via-[#557F9E] to-[#4B697F] text-white rounded-md text-sm font-normal font-[Open_Sans] shadow-[0px_4px_4px_rgba(189,189,189,0.25)] flex justify-center items-center transition duration-300 ease-in-out hover:opacity-90 ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 2 && (
            <div className="self-stretch flex flex-col justify-start items-center gap-[30px]">
              <div className="self-stretch flex flex-col justify-center items-center gap-[30px]">
                <div className="w-full flex flex-col justify-start items-center gap-[18px]">
                  <h2 className="self-stretch text-center text-[#486583] text-2xl font-bold font-[Open_Sans]">
                    OTP Verification
                  </h2>
                  <p className="self-stretch text-center text-[#5C5C5C] text-sm font-normal font-[Open_Sans]">
                    Please enter the 6-digit code sent to your email address.
                  </p>
                </div>
                <form
                  onSubmit={handleOtpSubmit}
                  className="w-full flex flex-col items-end gap-[18px]"
                >
                  <div className="self-stretch flex flex-col justify-start items-start gap-[18px]">
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                      <label
                        htmlFor="otp"
                        className="self-stretch text-[#5C5C5C] text-sm font-normal font-[Open_Sans]"
                      >
                        Verification Code (OTP)
                      </label>
                      <input
                        type="text"
                        id="otp"
                        className="self-stretch h-10 w-full px-3 py-2.5 bg-white rounded-md border border-[#DCDCDC] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#BB2821] font-[Open_Sans]"
                        placeholder="Enter 4-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength="4"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm text-center mt-2 font-[Open_Sans] w-full">
                      {error}
                    </p>
                  )}
                  {message && (
                    <p className="text-green-600 text-sm text-center mt-2 font-[Open_Sans] w-full">
                      {message}
                    </p>
                  )}

                  <div className="self-stretch flex justify-center mt-2">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className={`text-[#BB2821] text-xs font-normal font-[Open_Sans] hover:underline ${
                        resendLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      disabled={resendLoading}
                    >
                      {resendLoading ? "Resending..." : "Resend Code"}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className={`w-28 h-10 mx-auto mt-4 bg-gradient-to-r from-[#86ACC8] via-[#557F9E] to-[#4B697F] text-white rounded-md text-sm font-normal font-[Open_Sans] shadow-[0px_4px_4px_rgba(189,189,189,0.25)] flex justify-center items-center transition duration-300 ease-in-out hover:opacity-90 ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* STEP 3: Set New Password */}
          {step === 3 && (
            <div className="self-stretch flex flex-col justify-start items-center gap-[30px]">
              <div className="self-stretch flex flex-col justify-center items-center gap-[30px]">
                <div className="w-full flex flex-col justify-start items-center gap-[18px]">
                  <h2 className="self-stretch text-center text-[#486583] text-2xl font-bold font-[Open_Sans]">
                    Set a New Password
                  </h2>
                  <p className="self-stretch text-center text-[#5C5C5C] text-sm font-normal font-[Open_Sans]">
                    Create a new password. Ensure it differs from previous ones for security
                  </p>
                </div>
                <form
                  onSubmit={handlePasswordSubmit}
                  className="w-full flex flex-col items-end gap-[18px]"
                >
                  <div className="self-stretch flex flex-col justify-start items-start gap-[18px]">
                    {/* New Password Input */}
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                      <label
                        htmlFor="new-password"
                        className="self-stretch text-[#5C5C5C] text-sm font-normal font-[Open_Sans]"
                      >
                        New Password
                      </label>
                      <div className="relative self-stretch">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          id="new-password"
                          className="self-stretch h-10 w-full px-3 py-2.5 bg-white rounded-md border border-[#DCDCDC] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#BB2821] font-[Open_Sans] pr-10"
                          placeholder="Enter your new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <span
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                          onClick={() => togglePasswordVisibility("new")}
                        >
                          {showNewPassword ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-5 h-5 text-gray-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-5 h-5 text-gray-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                      <label
                        htmlFor="confirm-password"
                        className="self-stretch text-[#5C5C5C] text-sm font-normal font-[Open_Sans]"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative self-stretch">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirm-password"
                          className="self-stretch h-10 w-full px-3 py-2.5 bg-white rounded-md border border-[#DCDCDC] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#BB2821] font-[Open_Sans] pr-10"
                          placeholder="Confirm your new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <span
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                          onClick={() => togglePasswordVisibility("confirm")}
                        >
                          {showConfirmPassword ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-5 h-5 text-gray-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-5 h-5 text-gray-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm text-center mt-2 font-[Open_Sans] w-full">
                      {error}
                    </p>
                  )}
                  {message && (
                    <p className="text-green-600 text-sm text-center mt-2 font-[Open_Sans] w-full">
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    className={`w-36 h-10 mx-auto mt-4 bg-gradient-to-r from-[#86ACC8] via-[#557F9E] to-[#4B697F] text-white rounded-md text-sm font-normal font-[Open_Sans] shadow-[0px_4px_4px_rgba(189,189,189,0.25)] flex justify-center items-center transition duration-300 ease-in-out hover:opacity-90 ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}