// ============================================
// FILE: lib/dashboardApiClient.js
// Purpose: Dashboard API Call Functions
// ============================================


import { API_ENDPOINTS } from "./api";
import apiCall from "./apiClient";

/**
 * Fetch Earnings Overview Data
 * @returns {Promise} - Earnings overview data with revenue, transactions, etc.
 */
export const getEarningsOverview = async () => {
  try {
    const response = await apiCall(
      API_ENDPOINTS.DASHBOARD.EARNINGS_OVERVIEW,
      "GET",
      null
    );
    return response;
  } catch (error) {
    console.error("Earnings overview error:", error);
    throw error;
  }
};

/**
 * Transform monthly earnings data for chart
 * @param {Array} monthlyEarnings - Raw monthly earnings data from API
 * @returns {Array} - Formatted data for recharts BarChart
 */
export const transformMonthlyEarningsData = (monthlyEarnings) => {
  if (!monthlyEarnings || !Array.isArray(monthlyEarnings)) {
    return [];
  }

  // Map month names to abbreviated names for display
  const monthAbbreviations = {
    January: "Jan",
    February: "Feb",
    March: "Mar",
    April: "Apr",
    May: "May",
    June: "Jun",
    July: "Jul", 
    August: "Aug",
    September: "Sep",
    October: "Oct",
    November: "Nov",
    December: "Dec",
  }; 


  return monthlyEarnings.map((item) => ({
    name: monthAbbreviations[item.month] || item.month.substring(0, 3),
    revenue: parseFloat(item.revenue) || 0,
    year: item.year,
  }));
};

/**
 * Calculate growth percentage from previous month 
 * @param {Array} monthlyEarnings - Monthly earnings data
 * @returns {Object} - { percentage, direction }
 */
export const calculateMonthlyGrowth = (monthlyEarnings) => {
  if (!monthlyEarnings || monthlyEarnings.length < 2) {
    return { percentage: 0, direction: "up" };
  }

  // Get last two months with revenue data
  const sortedByDate = [...monthlyEarnings].sort((a, b) => {
    const dateA = new Date(a.year, getMonthIndex(a.month));
    const dateB = new Date(b.year, getMonthIndex(b.month));
    return dateB - dateA;
  });

  const currentMonth = sortedByDate[0];
  const previousMonth = sortedByDate[1];

  if (!previousMonth.revenue || previousMonth.revenue === 0) {
    return {
      percentage: currentMonth.revenue > 0 ? 100 : 0,
      direction: currentMonth.revenue > 0 ? "up" : "down",
    };
  }

  const growth = (
    ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) *
    100
  ).toFixed(2);

  return {
    percentage: Math.abs(parseFloat(growth)),
    direction: growth >= 0 ? "up" : "down",
  };
};
/**
 * Helper function to get month index
 * @param {string} monthName - Month name
 * @returns {number} - Month index (0-11)
 */
const getMonthIndex = (monthName) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months.indexOf(monthName);
};

export default getEarningsOverview;