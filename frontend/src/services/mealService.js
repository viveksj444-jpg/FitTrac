import api from "./api";

export const getTodayMeals = async () => {
  const response = await api.get("/meals/today/meals");
  return response.data.meals;
};