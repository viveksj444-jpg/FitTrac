const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  unitType: {
    type: String,
    enum: ["piece", "gram", "serving","volume"],
    required: true
  },

  caloriesPer100g: Number,
  proteinPer100g: Number,
  carbsPer100g: Number,
  fatPer100g: Number,

  sizes: {
    small: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number
    },

    medium: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number
    },

    large: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number
    }
  },

  servings: [
    {
      name: String,
      capacity: String,

      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number
    }
  ]
});

module.exports = mongoose.model("Food", foodSchema);