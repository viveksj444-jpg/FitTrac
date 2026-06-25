require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const nutritionRoutes = require("./routes/nutritionRoutes");
const mealRoutes = require("./routes/mealRoutes");

const app = express();

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running...");
});

// Auth Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/users", require("./routes/userRoutes"));

app.use("/api/foods", require("./routes/foodRoutes"));

app.use("/api/nutrition", nutritionRoutes);

app.use("/api/meals", require("./routes/mealRoutes"));

app.use("/api/meals", mealRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});