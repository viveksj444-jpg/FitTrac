import { useEffect, useState } from "react";
import { getWeeklyAnalytics } from "../services/analyticsService";

const useWeeklyAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getWeeklyAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error("Error fetching weekly analytics:", err);
      setError(err.response?.data?.message || "Failed to load weekly analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};

export default useWeeklyAnalytics;
