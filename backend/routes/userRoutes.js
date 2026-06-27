const express = require("express");

const {
  getProfile,
  updateProfile,
  getBMI,
  getCalories,
} = require(
  "../controllers/userController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  updateProfile
);

router.get(
  "/bmi",
  protect,
  getBMI
);

router.get(
  "/calories",
  protect,
  getCalories
);

module.exports = router;