const Food = require("../models/Food");
const Meal = require("../models/Meal");

const addMeal = async (req, res) => {
  try {
    const {
      foodId,
      size,
      grams,
      serving,
      quantity,
      mealType
    } = req.body;

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        message: "Food not found"
      });
    }

    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    // Piece Foods
    if (food.unitType === "piece") {
      calories = food.sizes[size].calories * quantity;
      protein = food.sizes[size].protein * quantity;
      carbs = food.sizes[size].carbs * quantity;
      fat = food.sizes[size].fat * quantity;
    }

    // Gram Foods
    if (food.unitType === "gram") {
      calories = (food.caloriesPer100g * grams) / 100;
      protein = (food.proteinPer100g * grams) / 100;
      carbs = (food.carbsPer100g * grams) / 100;
      fat = (food.fatPer100g * grams) / 100;
    }

    const meal = await Meal.create({
      user: req.user._id,
      food: food._id,
      mealType,
      quantity,
      calories,
      protein,
      carbs,
      fat
    });

    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getMeals = async (req, res) => {
  try {
    const meals = await Meal.find({
      user: req.user._id
    }).populate("food");

    res.json(meals);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  addMeal,
  getMeals
};