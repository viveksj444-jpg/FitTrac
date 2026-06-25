const express = require("express");
const router = express.Router();

const {
  getCurrentUser,
  registerUser,
  loginUser
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getCurrentUser);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;