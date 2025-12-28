import { API_ENDPOINTS } from "./api";
import apiCall from "./apiClient";


export const userApiClient = {
  getProfile: async () => {
    return await apiCall(API_ENDPOINTS.USER_PROFILE.GET, "GET");
  },
  
  updateProfile: async (formData) => {
    // প্রোফাইল পিকচার থাকলে 'multipart/form-data' পাঠাতে হবে
    // আমাদের apiCall ফাংশন JSON পাঠায়, তাই এখানে fetch ব্যবহার করা ভালো
    const token = typeof document !== "undefined" ? document.cookie.split('token=')[1]?.split(';')[0] : null;
    
    const response = await fetch(API_ENDPOINTS.USER_PROFILE.UPDATE, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData // সরাসরি FormData পাঠাচ্ছি
    });
    return await response.json();
  }
};