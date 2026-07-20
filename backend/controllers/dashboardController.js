const User = require("../models/User");
const Meal = require("../models/Meal");
const Exercise = require("../models/Exercise");

// Helper: Calculate daily calorie goal for a user
const calculateGoal = (user) => {
  if (user.dailyCalorieGoal) {
    return user.dailyCalorieGoal;
  }

  let bmr;
  if (user.gender === "female") {
    bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
  } else {
    bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
  }

  const maintenanceCalories = Math.round(bmr * 1.55);
  let goal = maintenanceCalories;

  switch (user.goal) {
    case "lose":
      goal -= 500;
      break;
    case "gain":
      goal += 300;
      break;
    default:
      break;
  }

  return goal;
};

const getDashboard = async (req, res) => {
  try {
    // =============================
    // Get Logged In User
    // =============================
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =============================
    // Today's Date Range
    // =============================
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // =============================
    // Get Today's Meals
    // =============================
    const meals = await Meal.find({
      user: req.user._id,
      createdAt: {
        $gte: start,
        $lte: end,
      },
    }).populate("food");

    // =============================
    // Get Today's Exercises
    // =============================
    const exercises = await Exercise.find({
      user: req.user._id,
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    const totalBurned = exercises.reduce(
      (sum, ex) => sum + (ex.caloriesBurned || 0),
      0
    );

    // =============================
    // Nutrition Summary
    // =============================
    const summary = meals.reduce(
      (acc, meal) => {
        acc.calories += meal.calories || 0;
        acc.protein += meal.protein || 0;
        acc.carbs += meal.carbs || 0;
        acc.fat += meal.fat || 0;

        return acc;
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      }
    );

    // =============================
    // Group Meals
    // =============================
    const groupedMeals = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };

    meals.forEach((meal) => {
      groupedMeals[meal.mealType].push(meal);
    });

    // =============================
    // Calculate BMR & Goal
    // =============================
    let bmr;

    if (user.gender === "male") {
      bmr =
        10 * user.weight +
        6.25 * user.height -
        5 * user.age +
        5;
    } else {
      bmr =
        10 * user.weight +
        6.25 * user.height -
        5 * user.age -
        161;
    }

    const maintenanceCalories = Math.round(bmr * 1.55);
    const goalCalories = calculateGoal(user);

    // =============================
    // Macro Goals
    // =============================
    const proteinGoal = Math.round(user.weight * 1.8);

    const carbsGoal = Math.round(user.weight * 4);

    const fatGoal = Math.round(user.weight * 0.8);

    // =============================
    // Progress Percentages
    // =============================
    const proteinProgress = Math.min(
      Math.round((summary.protein / proteinGoal) * 100),
      100
    );

    const carbsProgress = Math.min(
      Math.round((summary.carbs / carbsGoal) * 100),
      100
    );

    const fatProgress = Math.min(
      Math.round((summary.fat / fatGoal) * 100),
      100
    );

    const calorieProgress = Math.min(
      Math.max(
        0,
        Math.round(((summary.calories - totalBurned) / goalCalories) * 100)
      ),
      100
    );

    // =============================
    // Response
    // =============================
    res.status(200).json({
      success: true,

      dashboard: {
        date: new Date(),

        user: {
          name: user.name,
          age: user.age,
          gender: user.gender,
          weight: user.weight,
          height: user.height,
          goal: user.goal,
        },

        calories: {
          goal: goalCalories,
          maintenance: maintenanceCalories,
          consumed: summary.calories,
          burned: totalBurned,
          net: summary.calories - totalBurned,
          remaining: Math.max(
            goalCalories - summary.calories + totalBurned,
            0
          ),
          progress: calorieProgress,
        },

        macros: {
          protein: {
            consumed: summary.protein,
            goal: proteinGoal,
            progress: proteinProgress,
          },

          carbs: {
            consumed: summary.carbs,
            goal: carbsGoal,
            progress: carbsProgress,
          },

          fat: {
            consumed: summary.fat,
            goal: fatGoal,
            progress: fatProgress,
          },
        },

        mealsCount: meals.length,
        exercisesCount: exercises.length,

        todayMeals: groupedMeals,
        todayExercises: exercises,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get Net Calories Controller
// =============================
const getNetCalories = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      user: req.user._id,
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    const exercises = await Exercise.find({
      user: req.user._id,
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    const consumed = meals.reduce(
      (sum, meal) => sum + (meal.calories || 0),
      0
    );

    const burned = exercises.reduce(
      (sum, ex) => sum + (ex.caloriesBurned || 0),
      0
    );

    const goal = calculateGoal(user);
    const netCalories = consumed - burned;
    const remaining = goal - netCalories;

    const rawProgress = goal > 0 ? (netCalories / goal) * 100 : 0;
    const progress = Math.min(100, Math.max(0, Math.round(rawProgress)));

    let status = "On Track";
    if (netCalories > goal) {
      status = "Calorie Surplus";
    } else if (netCalories < goal - 200) {
      status = "Calorie Deficit";
    } else {
      status = "On Track";
    }

    return res.status(200).json({
      success: true,
      goal,
      consumed,
      burned,
      netCalories,
      remaining,
      status,
      progress,
    });
  } catch (error) {
    console.error("Error in getNetCalories:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
  getNetCalories,
};