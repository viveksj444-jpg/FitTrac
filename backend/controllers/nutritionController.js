const mongoose = require("mongoose");
const Food = require("../models/Food");
const { calculateNutrition } = require("../services/nutritionService");

const calculateFoodNutrition = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    // Validate foodId
    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: "Food ID is required"
      });
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Food ID"
      });
    }

    // Validate quantity
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity"
      });
    }

    // Find food
    const food = await Food.findById(foodId);
    console.log("Food Found:", food);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found"
      });
    }

    // Calculate nutrition
    const nutrition = calculateNutrition(food, quantity);

    return res.status(200).json({
      success: true,
      food: food.name,
      quantity,
      nutrition
    });

  } catch (error) {
    console.error("Nutrition Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = {
  calculateFoodNutrition
};