require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const foodRoutes = require("./routes/foodRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const mealRoutes = require("./routes/mealRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const waterRoutes = require("./routes/waterRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const monthlyAnalyticsRoutes = require("./routes/monthlyAnalyticsRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/analytics", monthlyAnalyticsRoutes);
app.use("/api/reports", reportRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});