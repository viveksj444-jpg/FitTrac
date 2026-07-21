const User = require("../models/User");
const Meal = require("../models/Meal");
const Water = require("../models/Water");

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

// ==========================================
// GET Smart Nutrition Recommendations
// ==========================================
const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Today's Date Range
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // Get Today's Meals
    const meals = await Meal.find({
      user: req.user._id,
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    // Calculate Macro Totals
    const summaryTotals = meals.reduce(
      (acc, meal) => {
        acc.calories += meal.calories || 0;
        acc.protein += meal.protein || 0;
        acc.carbs += meal.carbs || 0;
        acc.fat += meal.fat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // Get Today's Water Intake
    const waterDoc = await Water.findOne({
      user: req.user._id,
      date: {
        $gte: start,
        $lte: end,
      },
    });

    const waterConsumed = waterDoc ? waterDoc.consumed : 0;
    const waterGoal = waterDoc ? waterDoc.goal : 3000;

    const goalCalories = calculateGoal(user);
    const proteinGoal = user.weight ? Math.round(user.weight * 1.8) : 70;
    const fatGoal = user.weight ? Math.round(user.weight * 0.8) : 65;

    const summary = {
      goal: user.goal || "maintain",
      calories: Math.round(summaryTotals.calories),
      protein: Math.round(summaryTotals.protein),
      carbs: Math.round(summaryTotals.carbs),
      fat: Math.round(summaryTotals.fat),
      water: waterConsumed,
    };

    const recommendations = [];

    // 1. Protein Recommendation
    // Rule: If protein < 60g
    if (summaryTotals.protein < 60) {
      const remainingProtein = Math.max(0, Math.round(60 - summaryTotals.protein));
      recommendations.push({
        type: "protein",
        badge: "🔴 Attention",
        title: "Increase Protein Intake",
        description: `You need approximately ${remainingProtein}g more protein today.`,
        foods: [
          "Chicken Breast",
          "Eggs",
          "Paneer",
          "Greek Yogurt",
          "Soya Chunks",
          "Fish",
          "Tofu",
          "Whey Protein",
        ],
      });
    } else if (summaryTotals.protein < proteinGoal) {
      recommendations.push({
        type: "protein",
        badge: "🟡 Improve",
        title: "Optimal Protein Target",
        description: `Good protein intake! You are at ${Math.round(summaryTotals.protein)}g out of your recommended target of ${proteinGoal}g.`,
        foods: [
          "Greek Yogurt",
          "Eggs",
          "Paneer",
          "Whey Protein",
        ],
      });
    } else {
      recommendations.push({
        type: "protein",
        badge: "🟢 Excellent",
        title: "Protein Target Achieved",
        description: `Fantastic work! You have hit your protein baseline with ${Math.round(summaryTotals.protein)}g consumed.`,
      });
    }

    // 2. Calories Low Recommendation
    // Rule: If calories consumed < 70% of goal
    if (goalCalories > 0 && summaryTotals.calories < goalCalories * 0.7) {
      recommendations.push({
        type: "calories_low",
        badge: "🟡 Improve",
        title: "Increase Calorie Intake",
        description: `You have consumed ${Math.round(summaryTotals.calories)} kcal, which is below 70% of your daily goal (${goalCalories} kcal).`,
        tips: [
          "Add another healthy meal.",
          "Eat complex carbohydrates.",
          "Increase protein intake.",
        ],
      });
    }

    // 3. Calories High Recommendation
    // Rule: If calories exceed daily goal
    if (goalCalories > 0 && summaryTotals.calories > goalCalories) {
      recommendations.push({
        type: "calories_high",
        badge: "🔴 Attention",
        title: "Reduce Calorie Intake",
        description: `You have exceeded your daily goal of ${goalCalories} kcal by ${Math.round(summaryTotals.calories - goalCalories)} kcal.`,
        tips: [
          "Reduce calorie intake.",
          "Avoid sugary drinks.",
          "Choose vegetables.",
          "Increase activity.",
        ],
      });
    }

    // 4. Fat Recommendation
    // Rule: If fat > recommended (fatGoal)
    if (summaryTotals.fat > fatGoal) {
      recommendations.push({
        type: "fat",
        badge: "🟡 Improve",
        title: "Reduce Fat Intake",
        description: `Your fat intake of ${Math.round(summaryTotals.fat)}g exceeds your recommended limit of ${fatGoal}g.`,
        tips: [
          "Avoid fried food.",
          "Choose grilled food.",
          "Reduce oils.",
        ],
      });
    }

    // 5. Carbs Recommendation
    // Rule: If carbs are low
    if (summaryTotals.carbs < 150) {
      recommendations.push({
        type: "carbs",
        badge: "🟡 Improve",
        title: "Increase Healthy Carbohydrates",
        description: `Your carbohydrate intake (${Math.round(summaryTotals.carbs)}g) is currently low today.`,
        foods: [
          "Brown Rice",
          "Oats",
          "Sweet Potato",
          "Whole Wheat Bread",
        ],
      });
    }

    // 6. Water Recommendation
    // Rule: If water < daily goal
    if (waterConsumed < waterGoal) {
      recommendations.push({
        type: "water",
        badge: "🔴 Attention",
        title: "Drink More Water",
        description: `You are below your hydration goal of ${waterGoal} ml. You have logged ${waterConsumed} ml so far.`,
        tips: [
          "Keep a water bottle near your desk.",
          "Drink 250ml water before meals.",
          "Hydrate well after physical exercise.",
        ],
      });
    } else {
      recommendations.push({
        type: "water",
        badge: "🟢 Excellent",
        title: "Hydration Goal Completed",
        description: `Great job staying hydrated! You completed your ${waterGoal} ml hydration goal today.`,
      });
    }

    // 7. Goal-Based Suggestions
    let goalSuggestion = "";
    if (user.goal === "lose") {
      goalSuggestion = "Focus on high-volume, low-calorie foods and lean protein to stay full while maintaining your calorie deficit.";
    } else if (user.goal === "gain") {
      goalSuggestion = "Focus on nutrient-dense meals and quality protein sources to reach your surplus target smoothly.";
    } else {
      goalSuggestion = "Maintain balanced macro proportions across all meals to keep energy levels stable.";
    }

    recommendations.push({
      type: "goal_strategy",
      badge: "🟢 Goal Focus",
      title: `Personalized ${user.goal ? user.goal.toUpperCase() : "FITNESS"} Strategy`,
      description: goalSuggestion,
    });

    return res.status(200).json({
      success: true,
      summary,
      recommendations,
    });
  } catch (error) {
    console.error("Error in getRecommendations:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getRecommendations,
};
