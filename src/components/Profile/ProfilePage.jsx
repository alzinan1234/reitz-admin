"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import ChangePasswordForm from "./ChangePasswordForm";
import { userApiClient } from "../lib/userProfileApiClient";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("editProfile");
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [profileImage, setProfileImage] = useState("/image/userImage.png");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadProfile() {
      const res = await userApiClient.getProfile();
      if (res.success) {
        setUserData({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || ""
        });
        if (res.data.profile_picture) setProfileImage(res.data.profile_picture);
      }
    }
    loadProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      if (fileInputRef.current.files[0]) {
        formData.append("profile_picture", fileInputRef.current.files[0]);
      }

      const res = await userApiClient.updateProfile(formData);
      if (res.success) {
        toast.success("Profile Updated!");
        // টপবার আপডেট করার জন্য ইভেন্ট ফায়ার করা
        window.dispatchEvent(new Event('profileUpdated'));
      }
    } catch (err) {
      toast.error("Update failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white p-8 rounded-lg">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="bg-gray-100 p-2 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-700">Profile Settings</h1>
      </div>

      <div className="flex flex-col items-center mb-10">
        <div className="relative w-24 h-24 mb-4 cursor-pointer" onClick={() => fileInputRef.current.click()}>
          <Image src={profileImage} alt="Profile" fill className="rounded-full object-cover border-4 border-gray-100" />
          <div className="absolute bottom-0 right-0 bg-blue-600 p-1.5 rounded-full border-2 border-white text-white">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-7.793 7.793a.5.5 0 01-.128.093l-3 1a.5.5 0 01-.611-.611l1-3a.5.5 0 01.093-.128l7.793-7.793z"/></svg>
          </div>
        </div>
        <input type="file" hidden ref={fileInputRef} onChange={(e) => setProfileImage(URL.createObjectURL(e.target.files[0]))} />
        <h2 className="text-xl font-bold text-gray-700">{userData.name || 'Admin'}</h2>
      </div>

      <div className="flex justify-center border-b mb-8">
        {['editProfile', 'changePassword'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 font-semibold ${activeTab === tab ? 'border-b-2 border-[#4B697F] text-[#4B697F]' : 'text-gray-700'}`}
          >
            {tab === 'editProfile' ? 'Edit Profile' : 'Change Password'}
          </button>
        ))}
      </div>

      {activeTab === 'editProfile' ? (
        <form onSubmit={handleUpdate} className="max-w-2xl mx-auto space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input 
              className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700" 
              value={userData.name}
              onChange={(e) => setUserData({...userData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
            <input 
              className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700" 
              value={userData.phone}
              onChange={(e) => setUserData({...userData, phone: e.target.value})}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full py-3 bg-[#557F9E] text-white rounded-lg font-bold hover:opacity-90 transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      ) : <ChangePasswordForm />}
    </div>
  );
}