const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMonthlyAnalytics } = require("../controllers/monthlyAnalyticsController");

router.get("/monthly", protect, getMonthlyAnalytics);

module.exports = router;
