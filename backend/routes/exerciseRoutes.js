const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getExerciseTypes,
  addExercise,
  getTodayExercises,
  deleteExercise
} = require("../controllers/exerciseController");

// Get predefined types
router.get("/types", protect, getExerciseTypes);

// Get today's logs / Add log
router.route("/").post(protect, addExercise);
router.route("/today").get(protect, getTodayExercises);

// Delete exercise log
router.route("/:id").delete(protect, deleteExercise);

module.exports = router;
