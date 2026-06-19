const User = require("../models/User");

const getCurrentUser = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = { getCurrentUser };