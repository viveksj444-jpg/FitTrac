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

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(
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
const updateProfile = async (req, res) => {
  try {
    const {
      height,
      weight,
      age,
      gender,
    } = req.body;

    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.height = height;
    user.weight = weight;
    user.age = age;
    user.gender = gender;

    await user.save();

    res.json({
      message: "Profile Updated",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// BMI Endpoint
const getBMI = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const result = calculateBMI(
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

module.exports = {
  getProfile,
  updateProfile,
  getBMI,
};