const Food = require("../models/Food");

const getFoods = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          name: {
            $regex: req.query.search,
            $options: "i"
          }
        }
      : {};
    console.log(req.query.search);
    const foods = await Food.find(keyword);

    res.json(foods);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getFoods
};