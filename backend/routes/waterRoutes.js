const express = require("express");
const router = express.Router();

const {
  getTodayWater,
  addWater,
  deleteWaterLog,
  updateGoal,
} = require("../controllers/waterController");

const { protect } = require("../middleware/authMiddleware");

// All routes are protected by JWT authentication
router.get("/today", protect, getTodayWater);
router.post("/add", protect, addWater);
router.delete("/log/:id", protect, deleteWaterLog);
router.put("/goal", protect, updateGoal);

module.exports = router;
