const User = require("../models/User");
const Meal = require("../models/Meal");
const Exercise = require("../models/Exercise");

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
    // Calculate BMR
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

    // =============================
    // Maintenance Calories
    // =============================
    const maintenanceCalories = Math.round(bmr * 1.55);

    let goalCalories = maintenanceCalories;

    switch (user.goal) {
      case "lose":
        goalCalories -= 500;
        break;

      case "gain":
        goalCalories += 300;
        break;

      default:
        break;
    }

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

module.exports = {
  getDashboard,
};