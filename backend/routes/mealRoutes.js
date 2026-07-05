const express = require("express");
const router = express.Router();

const {
  addMeal,
  getMeals,
  getTodaySummary,
  getTodayMeals,
  updateMeal,
  deleteMeal,
} = require("../controllers/mealController");

const { protect } = require("../middleware/authMiddleware");

// Add Meal
// Get All Meals
router
  .route("/")
  .post(protect, addMeal)
  .get(protect, getMeals);

// Today's Nutrition Summary
router.get(
  "/today",
  protect,
  getTodaySummary
);

// Today's Meals
router.get(
  "/today/meals",
  protect,
  getTodayMeals
);

// Update Meal
router.put(
  "/:id",
  protect,
  updateMeal
);

// Delete Meal
router.delete(
  "/:id",
  protect,
  deleteMeal
);

module.exports = router;