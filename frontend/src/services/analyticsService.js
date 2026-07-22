import API from "./api";

/**
 * Fetches the weekly analytics data for the authenticated user
 * @returns {Promise<Object>} The weekly analytics data
 */
export const getWeeklyAnalytics = async () => {
  const response = await API.get("/analytics/weekly");
  return response.data;
};
