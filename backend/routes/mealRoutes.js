const express = require("express");

const router = express.Router();

const {
  addMeal,
  getMeals
} = require("../controllers/mealController");

const { protect } = require("../middleware/authMiddleware");

router.route("/")
  .post(protect, addMeal)
  .get(protect, getMeals);

module.exports = router;