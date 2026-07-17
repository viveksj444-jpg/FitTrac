import { useEffect, useState } from "react";
import { getTodayExercises } from "../services/exerciseService";

const useExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExercises = async () => {
    try {
      const data = await getTodayExercises();
      setExercises(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load today's exercises."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return {
    exercises,
    loading,
    error,
    refetch: fetchExercises,
    setExercises,
  };
};

export default useExercises;
