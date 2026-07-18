const Water = require("../models/Water");

// Helper to format current time to "HH:MM AM/PM" (e.g. "10:15 AM")
const formatAMPM = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${minutes} ${ampm}`;
};

// Helper to find or create today's water tracker document for a user
const getOrCreateTodayWaterDoc = async (userId) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  let water = await Water.findOne({
    user: userId,
    date: {
      $gte: start,
      $lte: end,
    },
  });

  if (!water) {
    water = await Water.create({
      user: userId,
      date: start,
      goal: 3000,
      consumed: 0,
      logs: [],
    });
  }

  return water;
};

// Helper to send the standard water data response
const sendWaterResponse = (res, water, statusCode = 200) => {
  const goal = water.goal;
  const consumed = water.consumed;
  const remaining = Math.max(0, goal - consumed);
  const progress = goal > 0 ? Math.min(100, Math.round((consumed / goal) * 100)) : 0;

  return res.status(statusCode).json({
    success: true,
    _id: water._id,
    user: water.user,
    date: water.date,
    goal,
    consumed,
    remaining,
    progress,
    logs: water.logs,
    createdAt: water.createdAt,
    updatedAt: water.updatedAt,
  });
};

// =========================
// GET today's water data
// =========================
const getTodayWater = async (req, res) => {
  try {
    const water = await getOrCreateTodayWaterDoc(req.user._id);
    return sendWaterResponse(res, water);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// POST add a water log
// =========================
const addWater = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validation
    if (amount === undefined || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a number greater than 0",
      });
    }

    const water = await getOrCreateTodayWaterDoc(req.user._id);
    
    // Add log entry
    const time = formatAMPM(new Date());
    water.logs.push({ amount, time });

    // Update consumed
    water.consumed += amount;

    await water.save();

    return sendWaterResponse(res, water, 201);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// DELETE a water log entry
// =========================
const deleteWaterLog = async (req, res) => {
  try {
    const logId = req.params.id;
    const water = await getOrCreateTodayWaterDoc(req.user._id);

    // Find the index of the log entry
    const logIndex = water.logs.findIndex((log) => log._id.toString() === logId);

    if (logIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Water log entry not found",
      });
    }

    // Subtract amount
    const removedLog = water.logs[logIndex];
    water.consumed = Math.max(0, water.consumed - removedLog.amount);

    // Remove log entry
    water.logs.splice(logIndex, 1);

    await water.save();

    return sendWaterResponse(res, water);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// PUT update today's goal
// =========================
const updateGoal = async (req, res) => {
  try {
    const { goal } = req.body;

    // Validation
    if (goal === undefined || typeof goal !== "number") {
      return res.status(400).json({
        success: false,
        message: "Goal must be a number",
      });
    }

    if (goal <= 500) {
      return res.status(400).json({
        success: false,
        message: "Goal must be greater than 500 ml",
      });
    }

    if (goal > 10000) {
      return res.status(400).json({
        success: false,
        message: "Goal cannot exceed 10000 ml",
      });
    }

    const water = await getOrCreateTodayWaterDoc(req.user._id);
    water.goal = goal;

    await water.save();

    return sendWaterResponse(res, water);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTodayWater,
  addWater,
  deleteWaterLog,
  updateGoal,
};
