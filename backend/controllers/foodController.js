const Food = require("../models/Food");

const getFoods = async (req, res) => {
  try {
    const search = req.query.search || "";

    const foods = await Food.find({
      name: {
        $regex: search,
        $options: "i"
      }
    })
      .sort({ name: 1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: foods.length,
      foods
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found"
      });
    }

    res.status(200).json({
      success: true,
      food
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getFoods,
  getFoodById
};