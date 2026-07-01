const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema(
  {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  { _id: false }
);

const servingSchema = new mongoose.Schema(
  {
    name: String,
    capacity: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  { _id: false }
);

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },

    category: {
      type: String
    },

    unitType: {
      type: String
    },

    nutritionPer100: nutritionSchema,

    sizes: {
      small: nutritionSchema,
      medium: nutritionSchema,
      large: nutritionSchema
    },

    servings: [servingSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Food", foodSchema);