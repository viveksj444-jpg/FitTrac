const Exercise = require("../models/Exercise");
const User = require("../models/User");

const exerciseTypes = [
  {
    name: "Running",
    category: "Cardio",
    intensities: { light: 6.0, moderate: 8.3, vigorous: 11.5 }
  },
  {
    name: "Walking",
    category: "Cardio",
    intensities: { light: 2.5, moderate: 3.5, vigorous: 4.5 }
  },
  {
    name: "Cycling",
    category: "Cardio",
    intensities: { light: 5.5, moderate: 7.5, vigorous: 10.0 }
  },
  {
    name: "Swimming",
    category: "Cardio",
    intensities: { light: 4.0, moderate: 5.8, vigorous: 9.8 }
  },
  {
    name: "Weightlifting",
    category: "Strength",
    intensities: { light: 3.0, moderate: 3.5, vigorous: 6.0 }
  },
  {
    name: "Gym Workout",
    category: "Strength",
    intensities: { light: 3.0, moderate: 5.5, vigorous: 8.0 }
  },
  {
    name: "Calisthenics",
    category: "Strength",
    intensities: { light: 3.5, moderate: 5.0, vigorous: 8.0 }
  },
  {
    name: "Yoga",
    category: "Flexibility",
    intensities: { light: 2.0, moderate: 2.5, vigorous: 4.0 }
  },
  {
    name: "Pilates",
    category: "Flexibility",
    intensities: { light: 2.5, moderate: 3.0, vigorous: 4.5 }
  },
  {
    name: "HIIT",
    category: "Cardio",
    intensities: { light: 5.0, moderate: 8.0, vigorous: 11.0 }
  },
  {
    name: "Jump Rope",
    category: "Cardio",
    intensities: { light: 8.0, moderate: 11.0, vigorous: 12.5 }
  }
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
