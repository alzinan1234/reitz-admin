import { API_ENDPOINTS } from "./api";
import apiCall from "./apiClient";

export const settingApiClient = {
  // সব সেটিংস একসাথে ফেচ করার জন্য
  getAllSettings: async () => {
    return await apiCall(API_ENDPOINTS.LEGAL.GET_SETTINGS, "GET");
  },

  // ডাইনামিকভাবে নির্দিষ্ট সেটিং আপডেট করার জন্য
  updateSetting: async (slug, content) => {
    return await apiCall(API_ENDPOINTS.LEGAL.UPDATE_SETTING(slug), "PUT", {
      content: content,
    });
  },
};