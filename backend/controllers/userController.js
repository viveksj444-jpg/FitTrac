const User = require("../models/User");

// BMI Logic
const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;

  const bmi =
    weight /
    (heightInMeters * heightInMeters);

  let category = "";

  if (bmi < 18.5) {
    category = "Underweight";
  } else if (bmi < 25) {
    category = "Normal";
  } else if (bmi < 30) {
    category = "Overweight";
  } else {
    category = "Obese";
  }

  return {
    bmi: bmi.toFixed(1),
    category,
  };
};

// Calorie Logic
const calculateCalories = (
  weight,
  height,
  age,
  gender,
  goal
) => {
  let bmr;

  if (gender === "male") {
    bmr =
      10 * weight +
      6.25 * height -
      5 * age +
      5;
  } else {
    bmr =
      10 * weight +
      6.25 * height -
      5 * age -
      161;
  }

  let calories = bmr;

  if (goal === "lose") {
    calories = bmr - 500;
  }

  if (goal === "gain") {
    calories = bmr + 500;
  }

  return {
    bmr: Math.round(bmr),
    dailyCalories:
      Math.round(calories),
  };
};

// Get Profile
const getProfile = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user.id
      ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Profile
const updateProfile = async (
  req,
  res
) => {
  try {
    const {
      height,
      weight,
      age,
      gender,
    } = req.body;

    const user =
      await User.findById(
        req.user.id
      );

    user.height = height;
    user.weight = weight;
    user.age = age;
    user.gender = gender;

    await user.save();

    res.json({
      message:
        "Profile Updated",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// BMI
const getBMI = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user.id
      );

    const result =
      calculateBMI(
        user.weight,
        user.height
      );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Calories
const getCalories = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user.id
      );

    const result =
      calculateCalories(
        user.weight,
        user.height,
        user.age,
        user.gender,
        user.goal
      );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getBMI,
  getCalories,
};