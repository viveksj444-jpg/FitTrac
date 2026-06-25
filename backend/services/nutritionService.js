const calculateNutrition = (food, quantity) => {
  return {
    calories: Number((food.calories * quantity).toFixed(2)),
    protein: Number((food.protein * quantity).toFixed(2)),
    carbs: Number((food.carbs * quantity).toFixed(2)),
    fat: Number((food.fat * quantity).toFixed(2))
  };
};

module.exports = {
  calculateNutrition
};