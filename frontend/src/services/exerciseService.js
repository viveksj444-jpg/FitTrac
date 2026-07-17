import api from "./api";

export const getTodayExercises = async () => {
  const response = await api.get("/exercises/today");
  return response.data.exercises;
};

export const addExercise = async (exerciseData) => {
  const response = await api.post("/exercises", exerciseData);
  return response.data;
};

export const deleteExercise = async (id) => {
  const response = await api.delete(`/exercises/${id}`);
  return response.data;
};

export const getExerciseTypes = async () => {
  const response = await api.get("/exercises/types");
  return response.data.exerciseTypes;
};
