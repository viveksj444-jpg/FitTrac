const User = require("../models/User");
const Meal = require("../models/Meal");
const Exercise = require("../models/Exercise");
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

// Helper: Timezone-safe local date string format (YYYY-MM-DD)
const getLocalDateString = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// @desc    Get weekly analytics summary and daily data for the last 7 days
// @route   GET /api/analytics/weekly
// @access  Private
const getWeeklyAnalytics = async (req, res) => {
  try {
    // 1. Get authenticated user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const calorieGoal = calculateGoal(user);

    // 2. Set date ranges: from 6 days ago (start of day) to today (end of day)
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    // 3. Query all data sources for the last 7 days
    const meals = await Meal.find({
      user: req.user._id,
      createdAt: { $gte: start, $lte: end },
    });

    const exercises = await Exercise.find({
      user: req.user._id,
      createdAt: { $gte: start, $lte: end },
    });

    const waters = await Water.find({
      user: req.user._id,
      date: { $gte: start, $lte: end },
    });

    // 4. Initialize the 7-day daily data structure chronologically (oldest to today)
    const dayNamesFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const dailyDataMap = {};
    const dailyKeysOrder = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateString(d);
      
      dailyDataMap[dateStr] = {
        day: dayNamesShort[d.getDay()],
        dayFull: dayNamesFull[d.getDay()],
        date: dateStr,
        consumed: 0,
        burned: 0,
        net: 0,
        water: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        mealsCount: 0,
        exercisesCount: 0,
        waterGoal: 3000 // default water goal
      };
      dailyKeysOrder.push(dateStr);
    }

    // 5. Aggregate meal logs into day buckets
    meals.forEach((meal) => {
      const dateStr = getLocalDateString(meal.createdAt);
      if (dailyDataMap[dateStr]) {
        dailyDataMap[dateStr].consumed += meal.calories || 0;
        dailyDataMap[dateStr].protein += meal.protein || 0;
        dailyDataMap[dateStr].carbs += meal.carbs || 0;
        dailyDataMap[dateStr].fat += meal.fat || 0;
        dailyDataMap[dateStr].mealsCount += 1;
      }
    });

    // 6. Aggregate exercise logs into day buckets
    exercises.forEach((ex) => {
      const dateStr = getLocalDateString(ex.createdAt);
      if (dailyDataMap[dateStr]) {
        dailyDataMap[dateStr].burned += ex.caloriesBurned || 0;
        dailyDataMap[dateStr].exercisesCount += 1;
      }
    });

    // 7. Aggregate water logs into day buckets
    waters.forEach((w) => {
      const dateStr = getLocalDateString(w.date);
      if (dailyDataMap[dateStr]) {
        dailyDataMap[dateStr].water += w.consumed || 0;
        if (w.goal) {
          dailyDataMap[dateStr].waterGoal = w.goal;
        }
      }
    });

    // 8. Calculate net values and round metrics for each day
    let totalMeals = 0;
    let totalExercises = 0;
    let daysMetCalorieGoal = 0;
    let calorieDeficitDaysCount = 0;
    let waterBelowTargetDaysCount = 0;

    const dailyData = dailyKeysOrder.map((dateStr) => {
      const dayData = dailyDataMap[dateStr];
      dayData.net = dayData.consumed - dayData.burned;

      // Rounded for final response
      dayData.consumed = Math.round(dayData.consumed);
      dayData.burned = Math.round(dayData.burned);
      dayData.net = Math.round(dayData.net);
      dayData.water = Math.round(dayData.water);
      dayData.protein = Math.round(dayData.protein);
      dayData.carbs = Math.round(dayData.carbs);
      dayData.fat = Math.round(dayData.fat);

      totalMeals += dayData.mealsCount;
      totalExercises += dayData.exercisesCount;

      // Calorie goal check: Met if consumed > 0 (logged food) and net <= goal
      if (dayData.consumed > 0 && dayData.net <= calorieGoal) {
        daysMetCalorieGoal += 1;
      }

      // Calorie deficit check: deficit if net < calorieGoal and consumed > 0
      if (dayData.consumed > 0 && dayData.net < calorieGoal) {
        calorieDeficitDaysCount += 1;
      }

      // Water target check: below if water < waterGoal
      if (dayData.water < dayData.waterGoal) {
        waterBelowTargetDaysCount += 1;
      }

      // Remove helper fields not needed in final response
      const { dayFull, waterGoal, date, ...rest } = dayData;
      return {
        ...rest,
        // day property remains as the short name, e.g., 'Mon'
      };
    });

    // 9. Compute weekly averages
    let sumConsumed = 0;
    let sumBurned = 0;
    let sumNet = 0;
    let sumWater = 0;
    let sumProtein = 0;
    let sumCarbs = 0;
    let sumFat = 0;

    let highestCalorieVal = -1;
    let highestCalorieDay = "None";
    let lowestCalorieVal = Infinity;
    let lowestCalorieDay = "None";

    let highestBurnedVal = -1;
    let mostActiveDay = "None";
    let lowestBurnedVal = Infinity;
    let leastActiveDay = "None";

    dailyKeysOrder.forEach((dateStr) => {
      const dayData = dailyDataMap[dateStr];
      sumConsumed += dayData.consumed;
      sumBurned += dayData.burned;
      sumNet += dayData.net;
      sumWater += dayData.water;
      sumProtein += dayData.protein;
      sumCarbs += dayData.carbs;
      sumFat += dayData.fat;

      // Highest Calorie Day
      if (dayData.consumed > highestCalorieVal) {
        highestCalorieVal = dayData.consumed;
        highestCalorieDay = dayData.dayFull;
      }

      // Lowest Calorie Day (only check among days they actually logged, or fallback if none)
      if (dayData.consumed < lowestCalorieVal) {
        lowestCalorieVal = dayData.consumed;
        lowestCalorieDay = dayData.dayFull;
      }

      // Most Active Day
      if (dayData.burned > highestBurnedVal) {
        highestBurnedVal = dayData.burned;
        mostActiveDay = dayData.dayFull;
      }

      // Least Active Day
      if (dayData.burned < lowestBurnedVal) {
        lowestBurnedVal = dayData.burned;
        leastActiveDay = dayData.dayFull;
      }
    });

    // Averages (over 7 days)
    const averageCalories = Math.round(sumConsumed / 7);
    const averageBurned = Math.round(sumBurned / 7);
    const averageNetCalories = Math.round(sumNet / 7);
    const averageWater = Math.round(sumWater / 7);
    const averageProtein = Math.round(sumProtein / 7);
    const averageCarbs = Math.round(sumCarbs / 7);
    const averageFat = Math.round(sumFat / 7);

    // Goal Completion %
    const goalCompletion = Math.round((daysMetCalorieGoal / 7) * 100);

    // 10. Compute Weekly Trends (First 3 days vs Last 3 days)
    const first3Keys = dailyKeysOrder.slice(0, 3);
    const last3Keys = dailyKeysOrder.slice(4, 7);

    const getAverageForKeys = (keys, field) => {
      const sum = keys.reduce((acc, key) => acc + dailyDataMap[key][field], 0);
      return sum / keys.length;
    };

    // Calories Trend
    const firstHalfCalAvg = getAverageForKeys(first3Keys, "consumed");
    const lastHalfCalAvg = getAverageForKeys(last3Keys, "consumed");
    let caloriesTrend = "Stable Calories";
    if (firstHalfCalAvg > 0) {
      const pct = ((lastHalfCalAvg - firstHalfCalAvg) / firstHalfCalAvg) * 100;
      if (pct > 5) caloriesTrend = "Increasing Calories";
      else if (pct < -5) caloriesTrend = "Decreasing Calories";
    } else if (lastHalfCalAvg > 0) {
      caloriesTrend = "Increasing Calories";
    }

    // Water Trend
    const firstHalfWaterAvg = getAverageForKeys(first3Keys, "water");
    const lastHalfWaterAvg = getAverageForKeys(last3Keys, "water");
    let waterTrend = "Stable Water Intake";
    if (firstHalfWaterAvg > 0) {
      const pct = ((lastHalfWaterAvg - firstHalfWaterAvg) / firstHalfWaterAvg) * 100;
      if (pct > 5) waterTrend = "Increasing Water Intake";
      else if (pct < -5) waterTrend = "Decreasing Water Intake";
    } else if (lastHalfWaterAvg > 0) {
      waterTrend = "Increasing Water Intake";
    }

    // Exercise Trend
    const firstHalfExerciseAvg = getAverageForKeys(first3Keys, "burned");
    const lastHalfExerciseAvg = getAverageForKeys(last3Keys, "burned");
    let exerciseTrend = "Stable Exercise";
    if (firstHalfExerciseAvg > 0) {
      const pct = ((lastHalfExerciseAvg - firstHalfExerciseAvg) / firstHalfExerciseAvg) * 100;
      if (pct > 5) exerciseTrend = "Increasing Exercise";
      else if (pct < -5) exerciseTrend = "Decreasing Exercise";
    } else if (lastHalfExerciseAvg > 0) {
      exerciseTrend = "Increasing Exercise";
    }

    // Average Protein Trend %
    const firstHalfProtAvg = getAverageForKeys(first3Keys, "protein");
    const lastHalfProtAvg = getAverageForKeys(last3Keys, "protein");
    let proteinTrendPct = 0;
    if (firstHalfProtAvg > 0) {
      proteinTrendPct = Math.round(((lastHalfProtAvg - firstHalfProtAvg) / firstHalfProtAvg) * 100);
    } else if (lastHalfProtAvg > 0) {
      proteinTrendPct = 100;
    }

    // Handle Empty Datasets fallback names
    const hasCalData = sumConsumed > 0;
    const hasActiveData = sumBurned > 0;

    const finalHighestCalorieDay = hasCalData ? highestCalorieDay : "N/A";
    const finalLowestCalorieDay = hasCalData ? lowestCalorieDay : "N/A";
    const finalMostActiveDay = hasActiveData ? mostActiveDay : "N/A";
    const finalLeastActiveDay = hasActiveData ? leastActiveDay : "N/A";

    // 11. Generate Insights
    const insights = [];

    // Calorie Goal Insight
    insights.push(`You reached your calorie goal on ${daysMetCalorieGoal} of the last 7 days.`);

    // Active Day Insight
    if (hasActiveData) {
      insights.push(`${finalMostActiveDay} was your most active day.`);
    } else {
      insights.push("Start logging exercises to track your most active days.");
    }

    // Protein Trend Insight
    if (proteinTrendPct > 0) {
      insights.push(`Average protein intake increased by ${proteinTrendPct}%.`);
    } else if (proteinTrendPct < 0) {
      insights.push(`Average protein intake decreased by ${Math.abs(proteinTrendPct)}%.`);
    } else {
      insights.push(`Average protein intake remained stable.`);
    }

    // Water Target Insight
    if (waterBelowTargetDaysCount > 0) {
      insights.push(`Water intake was below target on ${waterBelowTargetDaysCount} days.`);
    } else {
      insights.push("Excellent work! You hit your water goal every single day.");
    }

    // Calorie Deficit Insight
    insights.push(`You maintained a calorie deficit on ${calorieDeficitDaysCount} days.`);

    // 12. Send Response
    res.status(200).json({
      success: true,
      summary: {
        averageCalories,
        averageBurned,
        averageNetCalories,
        averageWater,
        averageProtein,
        averageCarbs,
        averageFat,
        goalCompletion,
        highestCalorieDay: finalHighestCalorieDay,
        lowestCalorieDay: finalLowestCalorieDay,
        mostActiveDay: finalMostActiveDay,
        leastActiveDay: finalLeastActiveDay,
        totalMeals,
        totalExercises,
      },
      dailyData,
      trends: {
        calories: caloriesTrend,
        water: waterTrend,
        exercise: exerciseTrend,
        proteinTrend: proteinTrendPct,
      },
      insights,
    });
  } catch (error) {
    console.error("Error in getWeeklyAnalytics:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getWeeklyAnalytics,
};
