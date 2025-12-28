// ============================================
// FILE: lib/userApiClient.js
// Purpose: User Management API Call Functions
// ============================================

import { API_ENDPOINTS } from "./api";
import apiCall from "./apiClient";


/**
 * Get All Users with optional filters
 * @param {Object} filters - Optional filters {role, is_active, search}
 * @returns {Promise} - Users list with count
 */
export const getAllUsers = async (filters = {}) => {
  try {
    // Build query params
    const params = new URLSearchParams();
    if (filters.role) params.append("role", filters.role);
    if (filters.is_active !== undefined) params.append("is_active", filters.is_active);
    if (filters.search) params.append("search", filters.search);

    const queryString = params.toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.USER_MANAGEMENT.GET_ALL_USERS}?${queryString}`
      : API_ENDPOINTS.USER_MANAGEMENT.GET_ALL_USERS;

    const response = await apiCall(endpoint, "GET", null);
    return response;
  } catch (error) {
    console.error("Get users error:", error);
    throw error;
  }
};

/**
 * Get Single User Details by ID
 * @param {number|string} userId - User ID
 * @returns {Promise} - User details object
 */
export const getUserDetails = async (userId) => {
  try {
    const endpoint = `${API_ENDPOINTS.USER_MANAGEMENT.GET_USER_DETAILS}`.replace(
      "{{USER_ID}}",
      userId
    );
    const response = await apiCall(endpoint, "GET", null);
    return response;
  } catch (error) {
    console.error("Get user details error:", error);
    throw error;
  }
};

/**
 * Block User
 * @param {string} email - User email
 * @returns {Promise} - Block response
 */
export const blockUser = async (email) => {
  try {
    const response = await apiCall(
      API_ENDPOINTS.USER_MANAGEMENT.BLOCK_USER,
      "POST",
      { email }
    );
    return response;
  } catch (error) {
    console.error("Block user error:", error);
    throw error;
  }
};

/**
 * Unblock User
 * @param {string} email - User email
 * @returns {Promise} - Unblock response
 */
export const unblockUser = async (email) => {
  try {
    const response = await apiCall(
      API_ENDPOINTS.USER_MANAGEMENT.UNBLOCK_USER,
      "POST",
      { email }
    );
    return response;
  } catch (error) {
    console.error("Unblock user error:", error);
    throw error;
  }
};

/**
 * Transform user data for table display
 * @param {Array} users - Raw users from API
 * @returns {Array} - Formatted users for UI
 */
export const transformUsersForTable = (users) => {
  if (!users || !Array.isArray(users)) return [];

  return users.map((user) => ({
    id: user.id,
    name: user.username || user.first_name || user.email.split("@")[0],
    email: user.email,
    userType: getRoleDisplay(user.role),
    registrationDate: formatDate(user.created_at),
    avatar: getAvatarUrl(user.email),
    status: user.is_active ? "active" : "inactive",
    isBlocked: user.is_blocked,
    isDeleted: user.is_deleted,
    rawRole: user.role,
    lastLogin: user.last_login ? formatDate(user.last_login) : "Never",
  }));
};

/**
 * Transform single user for details page
 * @param {Object} user - Raw user from API
 * @returns {Object} - Formatted user for details
 */
export const transformUserDetails = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    displayId: `USR-${String(user.id).padStart(4, "0")}`,
    name: user.username || user.first_name || user.email.split("@")[0],
    email: user.email,
    userType: getRoleDisplay(user.role),
    phone: user.phone || "N/A",
    joinedDate: formatDate(user.created_at),
    lastLogin: user.last_login ? formatDate(user.last_login) : "Never",
    avatar: getAvatarUrl(user.email),
    isBlocked: user.is_blocked,
    isActive: user.is_active,
    isDeleted: user.is_deleted,
    rawRole: user.role,
    // Only for event admins
    ongoingEvents: user.role === "event_admin" ? user.ongoing_events || "0" : null,
  };
};

/**
 * Helper: Get role display name
 */
const getRoleDisplay = (role) => {
  const roleMap = {
    superadmin: "Super Admin",
    event_admin: "Event Admin",
    shop_admin: "Shop Admin",
    shopper: "Shopper",
    user: "User",
  };
  return roleMap[role] || role;
};

/**
 * Helper: Format date to readable format
 */
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Helper: Generate avatar URL from email
 */
const getAvatarUrl = (email) => {
  const firstChar = email.charAt(0).toUpperCase();
  return `https://placehold.co/100x100/4A6072/fff?text=${firstChar}`;
};

/**
 * Get filtered users count by role
 * @param {Array} users - All users
 * @returns {Object} - Count by role
 */
export const getUserCountByRole = (users) => {
  if (!users || !Array.isArray(users)) return {};

  return users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});
};

export default getAllUsers;