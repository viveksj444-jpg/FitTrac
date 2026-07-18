import API from "./api";

export const getTodayWater = async () => {
  const response = await API.get("/water/today");
  return response.data;
};

export const addWater = async (amount) => {
  const response = await API.post("/water/add", { amount });
  return response.data;
};

export const deleteWaterLog = async (id) => {
  const response = await API.delete(`/water/log/${id}`);
  return response.data;
};

export const updateGoal = async (goal) => {
  const response = await API.put("/water/goal", { goal });
  return response.data;
};
