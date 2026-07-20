const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getDashboard,
  getNetCalories,
} = require("../controllers/dashboardController");

router.get("/", protect, getDashboard);
router.get("/net-calories", protect, getNetCalories);

module.exports = router;