import api from "./api";

export const getFoods = async (search = "") => {
  const response = await api.get(`/foods?search=${encodeURIComponent(search)}`);
  return response.data;
};

export const getFoodById = async (id) => {
  const response = await api.get(`/foods/${id}`);
  return response.data;
};
