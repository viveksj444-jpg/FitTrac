import { useEffect, useState } from "react";
import { getMonthlyAnalytics } from "../services/monthlyAnalyticsService";

const useMonthlyAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMonthlyAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error("Error fetching monthly analytics:", err);
      setError(
        err.response?.data?.message || "Failed to load monthly analytics data."
      );
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

export default useMonthlyAnalytics;
