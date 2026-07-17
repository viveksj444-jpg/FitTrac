const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Cardio", "Strength", "Flexibility", "Other"],
      default: "Other",
    },
    duration: {
      type: Number,
      required: true, // in minutes
    },
    caloriesBurned: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Exercise", exerciseSchema);
