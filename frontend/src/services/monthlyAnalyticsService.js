import API from "./api";

/**
 * Fetches the monthly analytics data for the authenticated user
 * @returns {Promise<Object>} The monthly analytics data
 */
export const getMonthlyAnalytics = async () => {
  const response = await API.get("/analytics/monthly");
  return response.data;
};
