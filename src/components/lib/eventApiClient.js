// lib/eventApiClient.js

import { API_ENDPOINTS } from "./api";
import apiCall from "./apiClient";


export const getEventProposals = async () => {
  const response = await apiCall(API_ENDPOINTS.EVENTS.GET_PROPOSALS, "GET");
  // Mapping real-time data to UI format
  return response.map(event => ({
    id: event.id,
    eventName: event.name,
    location: event.location,
    contactNumber: event.admin_phone || "N/A",
    status: event.status.charAt(0).toUpperCase() + event.status.slice(1),
    email: event.admin_email
  }));
};

export const getEventDetails = async (id) => {
  return await apiCall(API_ENDPOINTS.EVENTS.GET_DETAILS(id), "GET");
};

export const processEventAction = async (id, action) => {
  // action can be 'approve' or 'reject'
  return await apiCall(API_ENDPOINTS.EVENTS.APPROVE_REJECT(id), "POST", { action });
};