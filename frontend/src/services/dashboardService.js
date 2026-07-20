import API from "./api";

export const getDashboard = async () => {
  const response = await API.get("/dashboard");
  return response.data;
};

export const getNetCalories = async () => {
  const response = await API.get("/dashboard/net-calories");
  return response.data;
};