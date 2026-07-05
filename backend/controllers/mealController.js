const Food = require("../models/Food");
const Meal = require("../models/Meal");

// =========================
// Add Meal
// =========================
const addMeal = async (req, res) => {
  try {
    const {
      foodId,
      size,
      grams,
      serving,
      quantity = 1,
      mealType,
    } = req.body;

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    // Piece foods
    if (food.unitType === "piece") {
      const selectedSize = food.sizes[size];

      if (!selectedSize) {
        return res.status(400).json({
          success: false,
          message: "Invalid size",
        });
      }

      calories = selectedSize.calories * quantity;
      protein = selectedSize.protein * quantity;
      carbs = selectedSize.carbs * quantity;
      fat = selectedSize.fat * quantity;
    }

    // Gram / Volume foods
    else if (
      food.unitType === "gram" ||
      food.unitType === "volume"
    ) {
      if (!grams) {
        return res.status(400).json({
          success: false,
          message: "Grams required",
        });
      }

      calories = (food.nutritionPer100.calories * grams) / 100;
      protein = (food.nutritionPer100.protein * grams) / 100;
      carbs = (food.nutritionPer100.carbs * grams) / 100;
      fat = (food.nutritionPer100.fat * grams) / 100;
    }

    // Serving foods
    else if (food.unitType === "serving") {
      const selectedServing = food.servings.find(
        (s) =>
          s.name.toLowerCase() === serving.toLowerCase()
      );

      if (!selectedServing) {
        return res.status(400).json({
          success: false,
          message: "Invalid serving",
        });
      }

      calories = selectedServing.calories * quantity;
      protein = selectedServing.protein * quantity;
      carbs = selectedServing.carbs * quantity;
      fat = selectedServing.fat * quantity;
    }

    const meal = await Meal.create({
      user: req.user._id,
      food: food._id,
      mealType,
      quantity,
      size,
      grams,
      serving,
      calories,
      protein,
      carbs,
      fat,
    });

    res.status(201).json({
      success: true,
      meal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get All Meals
// =========================
const getMeals = async (req, res) => {
  try {
    const meals = await Meal.find({
      user: req.user._id,
    })
      .populate("food")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: meals.length,
      meals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Today's Summary
// =========================
const getTodaySummary = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      user: req.user._id,
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    const summary = meals.reduce(
      (acc, meal) => {
        acc.totalCalories += meal.calories;
        acc.totalProtein += meal.protein;
        acc.totalCarbs += meal.carbs;
        acc.totalFat += meal.fat;
        return acc;
      },
      {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
      }
    );

    res.json({
      success: true,
      mealsCount: meals.length,
      summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Today's Meals
// =========================
const getTodayMeals = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      user: req.user._id,
      createdAt: {
        $gte: start,
        $lte: end,
      },
    }).populate("food");

    const groupedMeals = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };

    meals.forEach((meal) => {
      groupedMeals[meal.mealType].push(meal);
    });

    res.json({
      success: true,
      meals: groupedMeals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Update Meal
// =========================
const updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      });
    }

    meal.quantity =
      req.body.quantity ?? meal.quantity;

    meal.mealType =
      req.body.mealType ?? meal.mealType;

    await meal.save();

    res.json({
      success: true,
      meal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Delete Meal
// =========================
const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      });
    }

    await meal.deleteOne();

    res.json({
      success: true,
      message: "Meal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addMeal,
  getMeals,
  getTodaySummary,
  getTodayMeals,
  updateMeal,
  deleteMeal,
};