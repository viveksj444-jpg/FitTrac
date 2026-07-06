import { useEffect, useState } from "react";
import { getTodayMeals } from "../services/mealService";

const useMeals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const data = await getTodayMeals();

        // Backend returns { success, meals }
        setMeals(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load today's meals."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  return {
    meals,
    loading,
    error,
  };
};

export default useMeals;