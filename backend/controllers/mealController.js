const Food = require("../models/Food");
const Meal = require("../models/Meal");

const addMeal = async (req, res) => {
  try {
    const {
      foodId,
      size,
      grams,
      serving,
      quantity = 1,
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

    // Piece foods (Banana)
    if (food.unitType === "piece") {
      const selectedSize = food.sizes[size];

      if (!selectedSize) {
        return res.status(400).json({
          message: "Invalid size"
        });
      }

      calories = selectedSize.calories * quantity;
      protein = selectedSize.protein * quantity;
      carbs = selectedSize.carbs * quantity;
      fat = selectedSize.fat * quantity;
    }

    // Gram foods (Rice, Milk, Soya)
    else if (
      food.unitType === "gram" ||
      food.unitType === "volume"
    ) {
      if (!grams) {
        return res.status(400).json({
          message: "Grams required"
        });
      }

      calories =
        (food.nutritionPer100.calories * grams) / 100;

      protein =
        (food.nutritionPer100.protein * grams) / 100;

      carbs =
        (food.nutritionPer100.carbs * grams) / 100;

      fat =
        (food.nutritionPer100.fat * grams) / 100;
    }

    // Serving foods (Dal Tadka)
    else if (food.unitType === "serving") {
      const selectedServing =
        food.servings.find(
          s =>
            s.name.toLowerCase() ===
            serving.toLowerCase()
        );

      if (!selectedServing) {
        return res.status(400).json({
          message: "Invalid serving"
        });
      }

      calories =
        selectedServing.calories * quantity;

      protein =
        selectedServing.protein * quantity;

      carbs =
        selectedServing.carbs * quantity;

      fat =
        selectedServing.fat * quantity;
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

    res.status(201).json({
      success: true,
      meal
    });

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

    res.status(200).json({
      success: true,
      count: meals.length,
      meals
    });

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