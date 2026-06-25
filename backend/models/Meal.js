const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true
    },

    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true
    },

    quantity: {
      type: Number,
      required: true
    },

    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Meal", mealSchema);