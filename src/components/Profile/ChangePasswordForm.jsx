"use client";
import React, { useState } from "react";

import toast from "react-hot-toast";
import { changePassword } from "../lib/apiClient";

export default function ChangePasswordForm() {
  const [form, setForm] = useState({ old: "", new: "", confirm: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.new !== form.confirm) return toast.error("Passwords don't match");

    try {
      const res = await changePassword(form.old, form.new, form.confirm);
      if (res.success) {
        toast.success("Password updated!");
        setForm({ old: "", new: "", confirm: "" });
      }
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <input 
        type="password" placeholder="Current Password" 
        className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700"
        onChange={e => setForm({...form, old: e.target.value})} required
      />
      <input 
        type="password" placeholder="New Password" 
        className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700"
        onChange={e => setForm({...form, new: e.target.value})} required
      />
      <input 
        type="password" placeholder="Confirm Password" 
        className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700"
        onChange={e => setForm({...form, confirm: e.target.value})} required
      />
      <button className="w-full py-3 bg-[#557F9E] text-white rounded-lg font-bold">
        Update Password
      </button>
    </form>
  );
}