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

// Helper: Calculate longest consecutive true streak
const getLongestStreak = (arr) => {
  let maxStreak = 0;
  let currentStreak = 0;
  for (const val of arr) {
    if (val) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  return maxStreak;
};

// Helper: Compute average of specific field across days
const getAverageForRange = (keys, dataMap, field) => {
  if (keys.length === 0) return 0;
  const sum = keys.reduce((acc, key) => acc + (dataMap[key]?.[field] || 0), 0);
  return sum / keys.length;
};

/**
 * Calculates the monthly analytics data for a specific user ID.
 * Returns summary, dailyData, trends, insights, and user objects.
 */
const calculateMonthlyAnalyticsData = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const calorieGoal = calculateGoal(user);

  // Set date ranges: from 29 days ago (start of day) to today (end of day)
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date();
  start.setDate(start.getDate() - 29);
  start.setHours(0, 0, 0, 0);

  // Query all data sources for the last 30 days
  const meals = await Meal.find({
    user: userId,
    createdAt: { $gte: start, $lte: end },
  });

  const exercises = await Exercise.find({
    user: userId,
    createdAt: { $gte: start, $lte: end },
  });

  const waters = await Water.find({
    user: userId,
    date: { $gte: start, $lte: end },
  });

  // Initialize the 30-day daily data structure chronologically
  const dayNamesFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const dailyDataMap = {};
  const dailyKeysOrder = [];

  for (let i = 29; i >= 0; i--) {
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

  // Aggregate meal logs
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

  // Aggregate exercise logs
  exercises.forEach((ex) => {
    const dateStr = getLocalDateString(ex.createdAt);
    if (dailyDataMap[dateStr]) {
      dailyDataMap[dateStr].burned += ex.caloriesBurned || 0;
      dailyDataMap[dateStr].exercisesCount += 1;
    }
  });

  // Aggregate water logs
  waters.forEach((w) => {
    const dateStr = getLocalDateString(w.date);
    if (dailyDataMap[dateStr]) {
      dailyDataMap[dateStr].water += w.consumed || 0;
      if (w.goal) {
        dailyDataMap[dateStr].waterGoal = w.goal;
      }
    }
  });

  // Calculate daily values
  let totalMeals = 0;
  let totalExercises = 0;
  let totalWaterConsumed = 0;
  let daysMetCalorieGoal = 0;
  let calorieDeficitDaysCount = 0;
  let waterGoalAchievedDaysCount = 0;
  let exerciseDaysCount = 0;

  dailyKeysOrder.forEach((dateStr) => {
    const dayData = dailyDataMap[dateStr];
    dayData.net = dayData.consumed - dayData.burned;

    // Round values
    dayData.consumed = Math.round(dayData.consumed);
    dayData.burned = Math.round(dayData.burned);
    dayData.net = Math.round(dayData.net);
    dayData.water = Math.round(dayData.water);
    dayData.protein = Math.round(dayData.protein);
    dayData.carbs = Math.round(dayData.carbs);
    dayData.fat = Math.round(dayData.fat);

    totalMeals += dayData.mealsCount;
    totalExercises += dayData.exercisesCount;
    totalWaterConsumed += dayData.water;

    if (dayData.consumed > 0 && dayData.net <= calorieGoal) {
      daysMetCalorieGoal += 1;
    }

    if (dayData.consumed > 0 && dayData.net < calorieGoal) {
      calorieDeficitDaysCount += 1;
    }

    if (dayData.water >= dayData.waterGoal) {
      waterGoalAchievedDaysCount += 1;
    }

    if (dayData.exercisesCount > 0) {
      exerciseDaysCount += 1;
    }
  });

  // Calculate Streaks
  const healthyStreakArr = dailyKeysOrder.map((key) => {
    const d = dailyDataMap[key];
    return d.consumed > 0 && d.net <= calorieGoal;
  });
  const longestHealthyStreak = getLongestStreak(healthyStreakArr);

  const exerciseStreakArr = dailyKeysOrder.map((key) => {
    const d = dailyDataMap[key];
    return d.exercisesCount > 0;
  });
  const longestExerciseStreak = getLongestStreak(exerciseStreakArr);

  const waterStreakArr = dailyKeysOrder.map((key) => {
    const d = dailyDataMap[key];
    return d.water >= d.waterGoal;
  });
  const longestWaterGoalStreak = getLongestStreak(waterStreakArr);

  // Compute monthly averages and totals
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

  let loggedCalorieDaysCount = 0;
  let loggedExerciseDaysCount = 0;

  const weekdayCalorieSum = {};
  const weekdayCalorieCount = {};
  dayNamesFull.forEach((dayName) => {
    weekdayCalorieSum[dayName] = 0;
    weekdayCalorieCount[dayName] = 0;
  });

  dailyKeysOrder.forEach((dateStr) => {
    const dayData = dailyDataMap[dateStr];
    sumConsumed += dayData.consumed;
    sumBurned += dayData.burned;
    sumNet += dayData.net;
    sumWater += dayData.water;
    sumProtein += dayData.protein;
    sumCarbs += dayData.carbs;
    sumFat += dayData.fat;

    if (dayData.consumed > 0) {
      loggedCalorieDaysCount += 1;
      weekdayCalorieSum[dayData.dayFull] += dayData.consumed;
      weekdayCalorieCount[dayData.dayFull] += 1;

      if (dayData.consumed > highestCalorieVal) {
        highestCalorieVal = dayData.consumed;
        highestCalorieDay = dateStr;
      }

      if (dayData.consumed < lowestCalorieVal) {
        lowestCalorieVal = dayData.consumed;
        lowestCalorieDay = dateStr;
      }
    }

    if (dayData.burned > 0) {
      loggedExerciseDaysCount += 1;
      if (dayData.burned > highestBurnedVal) {
        highestBurnedVal = dayData.burned;
        mostActiveDay = dateStr;
      }

      if (dayData.burned < lowestBurnedVal) {
        lowestBurnedVal = dayData.burned;
        leastActiveDay = dateStr;
      }
    }
  });

  const hasCalData = loggedCalorieDaysCount > 0;
  const hasActiveData = loggedExerciseDaysCount > 0;

  const averageCalories = Math.round(sumConsumed / 30);
  const averageBurned = Math.round(sumBurned / 30);
  const averageNetCalories = Math.round(sumNet / 30);
  const averageWater = Math.round(sumWater / 30);
  const averageProtein = Math.round(sumProtein / 30);
  const averageCarbs = Math.round(sumCarbs / 30);
  const averageFat = Math.round(sumFat / 30);

  const goalCompletion = Math.round((daysMetCalorieGoal / 30) * 100);

  let highestWeekdayAvg = 0;
  let highestWeekdayName = "N/A";
  dayNamesFull.forEach((dayName) => {
    const count = weekdayCalorieCount[dayName];
    if (count > 0) {
      const avg = weekdayCalorieSum[dayName] / count;
      if (avg > highestWeekdayAvg) {
        highestWeekdayAvg = avg;
        highestWeekdayName = dayName;
      }
    }
  });

  // Trends Split
  const first15Keys = dailyKeysOrder.slice(0, 15);
  const last15Keys = dailyKeysOrder.slice(15, 30);

  const firstHalfCalAvg = getAverageForRange(first15Keys, dailyDataMap, "consumed");
  const lastHalfCalAvg = getAverageForRange(last15Keys, dailyDataMap, "consumed");
  let calorieTrend = "Stable Calories";
  if (firstHalfCalAvg > 0) {
    const pct = ((lastHalfCalAvg - firstHalfCalAvg) / firstHalfCalAvg) * 100;
    if (pct > 5) calorieTrend = "Increasing Calories";
    else if (pct < -5) calorieTrend = "Decreasing Calories";
  } else if (lastHalfCalAvg > 0) {
    calorieTrend = "Increasing Calories";
  }

  const firstHalfProtAvg = getAverageForRange(first15Keys, dailyDataMap, "protein");
  const lastHalfProtAvg = getAverageForRange(last15Keys, dailyDataMap, "protein");
  let proteinTrend = "Stable Protein";
  if (firstHalfProtAvg > 0) {
    const pct = ((lastHalfProtAvg - firstHalfProtAvg) / firstHalfProtAvg) * 100;
    if (pct > 5) proteinTrend = "Increasing Protein";
    else if (pct < -5) proteinTrend = "Decreasing Protein";
  } else if (lastHalfProtAvg > 0) {
    proteinTrend = "Increasing Protein";
  }

  const firstHalfWaterAvg = getAverageForRange(first15Keys, dailyDataMap, "water");
  const lastHalfWaterAvg = getAverageForRange(last15Keys, dailyDataMap, "water");
  let waterTrend = "Stable Water Intake";
  if (firstHalfWaterAvg > 0) {
    const pct = ((lastHalfWaterAvg - firstHalfWaterAvg) / firstHalfWaterAvg) * 100;
    if (pct > 5) waterTrend = "Increasing Water Intake";
    else if (pct < -5) waterTrend = "Decreasing Water Intake";
  } else if (lastHalfWaterAvg > 0) {
    waterTrend = "Increasing Water Intake";
  }

  const firstHalfExAvg = getAverageForRange(first15Keys, dailyDataMap, "burned");
  const lastHalfExAvg = getAverageForRange(last15Keys, dailyDataMap, "burned");
  let exerciseTrend = "Stable Exercise";
  if (firstHalfExAvg > 0) {
    const pct = ((lastHalfExAvg - firstHalfExAvg) / firstHalfExAvg) * 100;
    if (pct > 5) exerciseTrend = "Increasing Exercise";
    else if (pct < -5) exerciseTrend = "Decreasing Exercise";
  } else if (lastHalfExAvg > 0) {
    exerciseTrend = "Increasing Exercise";
  }

  let nutritionImprovementPct = 0;
  if (firstHalfProtAvg > 0) {
    nutritionImprovementPct = Math.round(((lastHalfProtAvg - firstHalfProtAvg) / firstHalfProtAvg) * 100);
  } else if (lastHalfProtAvg > 0) {
    nutritionImprovementPct = 100;
  }

  // Weekly Comparison
  const recentWeekKeys = dailyKeysOrder.slice(23, 30);
  const previousWeekKeys = dailyKeysOrder.slice(16, 23);

  const recentCalAvg = getAverageForRange(recentWeekKeys, dailyDataMap, "consumed");
  const prevCalAvg = getAverageForRange(previousWeekKeys, dailyDataMap, "consumed");
  const calorieChangePct = prevCalAvg > 0 ? Math.round(((recentCalAvg - prevCalAvg) / prevCalAvg) * 100) : (recentCalAvg > 0 ? 100 : 0);

  const recentProtAvg = getAverageForRange(recentWeekKeys, dailyDataMap, "protein");
  const prevProtAvg = getAverageForRange(previousWeekKeys, dailyDataMap, "protein");
  const proteinChangePct = prevProtAvg > 0 ? Math.round(((recentProtAvg - prevProtAvg) / prevProtAvg) * 100) : (recentProtAvg > 0 ? 100 : 0);

  const recentWaterAvg = getAverageForRange(recentWeekKeys, dailyDataMap, "water");
  const prevWaterAvg = getAverageForRange(previousWeekKeys, dailyDataMap, "water");
  const waterChangePct = prevWaterAvg > 0 ? Math.round(((recentWaterAvg - prevWaterAvg) / prevWaterAvg) * 100) : (recentWaterAvg > 0 ? 100 : 0);

  // Insights
  const insights = [];
  if (hasCalData || hasActiveData || totalWaterConsumed > 0) {
    insights.push(`You achieved your calorie goal on ${daysMetCalorieGoal} of the last 30 days.`);
    
    if (proteinChangePct > 0) {
      insights.push(`Your average protein intake increased by ${proteinChangePct}% compared to the previous week.`);
    } else if (proteinChangePct < 0) {
      insights.push(`Your average protein intake decreased by ${Math.abs(proteinChangePct)}% compared to the previous week.`);
    } else {
      insights.push(`Your average protein intake remained stable compared to the previous week.`);
    }

    if (exerciseDaysCount > 0) {
      insights.push(`You completed workouts on ${exerciseDaysCount} days.`);
    } else {
      insights.push("Try adding workouts to your routine to build a habit.");
    }

    if (waterGoalAchievedDaysCount > 0) {
      insights.push(`Your hydration goal was achieved on ${waterGoalAchievedDaysCount} days.`);
    } else {
      insights.push("Make sure to drink enough water and log it to reach your hydration targets.");
    }

    insights.push(`You maintained a calorie deficit on ${calorieDeficitDaysCount} days.`);

    if (highestWeekdayName !== "N/A") {
      insights.push(`${highestWeekdayName} is your highest calorie day on average.`);
    }
  } else {
    insights.push("No activity recorded in the last 30 days. Start logging food, exercise, and water to generate insights!");
  }

  const dailyData = dailyKeysOrder.map((dateStr) => {
    const d = dailyDataMap[dateStr];
    return {
      date: d.date,
      consumed: d.consumed,
      burned: d.burned,
      net: d.net,
      water: d.water,
      protein: d.protein,
      carbs: d.carbs,
      fat: d.fat
    };
  });

  return {
    summary: {
      averageCalories,
      averageBurned,
      averageNetCalories,
      averageProtein,
      averageCarbs,
      averageFat,
      averageWater,
      goalCompletion,
      highestCalorieDay: hasCalData ? highestCalorieDay : "N/A",
      lowestCalorieDay: hasCalData ? lowestCalorieDay : "N/A",
      mostActiveDay: hasActiveData ? mostActiveDay : "N/A",
      leastActiveDay: hasActiveData ? leastActiveDay : "N/A",
      longestExerciseStreak,
      longestHealthyStreak,
      longestWaterGoalStreak,
      totalMeals,
      totalExercises,
      totalWater: totalWaterConsumed,
    },
    dailyData,
    trends: {
      calorieTrend,
      proteinTrend,
      waterTrend,
      exerciseTrend,
      nutritionImprovementPct,
      goalConsistency: goalCompletion,
      weeklyComparison: {
        recentWeekCalories: Math.round(recentCalAvg),
        previousWeekCalories: Math.round(prevCalAvg),
        calorieChangePct,
        recentWeekProtein: Math.round(recentProtAvg),
        previousWeekProtein: Math.round(prevProtAvg),
        proteinChangePct,
        recentWeekWater: Math.round(recentWaterAvg),
        previousWeekWater: Math.round(prevWaterAvg),
        waterChangePct
      }
    },
    insights,
    user
  };
};

// @desc    Get monthly analytics summary, trends, and daily data for the last 30 days
// @route   GET /api/analytics/monthly
// @access  Private
const getMonthlyAnalytics = async (req, res) => {
  try {
    const data = await calculateMonthlyAnalyticsData(req.user._id);
    res.status(200).json({
      success: true,
      summary: data.summary,
      dailyData: data.dailyData,
      trends: data.trends,
      insights: data.insights,
    });
  } catch (error) {
    console.error("Error in getMonthlyAnalytics:", error);
    res.status(error.message === "User not found" ? 404 : 500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

module.exports = {
  calculateMonthlyAnalyticsData,
  getMonthlyAnalytics,
};
