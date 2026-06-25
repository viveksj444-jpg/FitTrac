const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const getCurrentUser = async (req, res) => {
  res.status(200).json(req.user);
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id)
  });
};

const loginUser = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id)
  });
};

module.exports = {
  getCurrentUser,
  registerUser,
  loginUser
};