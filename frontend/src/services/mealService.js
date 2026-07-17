import api from "./api";

export const getTodayMeals = async () => {
  const response = await api.get("/meals/today/meals");
  return response.data.meals;
};

export const addMeal = async (mealData) => {
  const response = await api.post("/meals", mealData);
  return response.data;
};