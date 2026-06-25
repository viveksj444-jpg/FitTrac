const express = require("express");

const router = express.Router();

const { addMeal } = require("../controllers/mealController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addMeal);

module.exports = router;