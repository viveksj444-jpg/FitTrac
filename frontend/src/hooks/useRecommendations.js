import { useState, useEffect, useCallback } from "react";
import { getRecommendations } from "../services/recommendationService";

const useRecommendations = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getRecommendations();
      setData(result);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(err.response?.data?.message || "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    summary: data?.summary || null,
    recommendations: data?.recommendations || [],
    loading,
    error,
    refetch: fetchRecommendations,
  };
};

export default useRecommendations;
