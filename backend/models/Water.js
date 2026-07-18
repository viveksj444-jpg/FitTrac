const mongoose = require("mongoose");

const waterLogSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  }
);

const waterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    goal: {
      type: Number,
      default: 3000,
      required: true,
    },
    consumed: {
      type: Number,
      default: 0,
      required: true,
    },
    logs: [waterLogSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Water", waterSchema);
