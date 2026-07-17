const Exercise = require("../models/Exercise");
const User = require("../models/User");

const exerciseTypes = [
  { name: "Running (Moderate)", category: "Cardio", met: 8.3 },
  { name: "Running (Vigorous)", category: "Cardio", met: 11.5 },
  { name: "Walking (Moderate)", category: "Cardio", met: 3.5 },
  { name: "Walking (Brisk)", category: "Cardio", met: 4.5 },
  { name: "Cycling (Moderate)", category: "Cardio", met: 7.5 },
  { name: "Cycling (Vigorous)", category: "Cardio", met: 10.0 },
  { name: "Swimming (Light/Moderate)", category: "Cardio", met: 5.8 },
  { name: "Swimming (Vigorous)", category: "Cardio", met: 9.8 },
  { name: "Weightlifting (Light/Moderate)", category: "Strength", met: 3.5 },
  { name: "Weightlifting (Vigorous)", category: "Strength", met: 6.0 },
  { name: "Yoga", category: "Flexibility", met: 2.5 },
  { name: "Pilates", category: "Flexibility", met: 3.0 },
  { name: "HIIT", category: "Cardio", met: 8.0 },
  { name: "Jump Rope", category: "Cardio", met: 11.0 }
];

// =========================
// Get Predefined Exercise Types
// =========================
const getExerciseTypes = async (req, res) => {
  res.status(200).json({
    success: true,
    exerciseTypes
  });
};

// =========================
// Add Logged Exercise
// =========================
const addExercise = async (req, res) => {
  try {
    const { name, category, duration, met, caloriesBurned: customCalories } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let caloriesBurned = 0;
    if (met) {
      // MET formula: Burned = Duration * MET * 3.5 * weight (kg) / 200
      caloriesBurned = Math.round((Number(duration) * Number(met) * 3.5 * user.weight) / 200);
    } else if (customCalories !== undefined) {
      caloriesBurned = Math.round(Number(customCalories));
    } else {
      return res.status(400).json({
        success: false,
        message: "Either MET or manual caloriesBurned is required"
      });
    }

    const exercise = await Exercise.create({
      user: req.user._id,
      name,
      category: category || "Other",
      duration: Number(duration),
      caloriesBurned
    });

    res.status(201).json({
      success: true,
      exercise
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =========================
// Get Today's Logged Exercises
// =========================
const getTodayExercises = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const exercises = await Exercise.find({
      user: req.user._id,
      createdAt: { $gte: start, $lte: end }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: exercises.length,
      exercises
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =========================
// Delete Logged Exercise
// =========================
const deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found"
      });
    }

    await exercise.deleteOne();

    res.status(200).json({
      success: true,
      message: "Exercise deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getExerciseTypes,
  addExercise,
  getTodayExercises,
  deleteExercise
};
