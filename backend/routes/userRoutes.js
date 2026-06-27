const express = require("express");

const {
  getProfile,
  updateProfile,
  getBMI,
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

module.exports = router;