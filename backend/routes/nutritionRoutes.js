// const express = require("express");

// const router = express.Router();

// const {
//   calculateFoodNutrition
// } = require("../controllers/nutritionController");

// router.post("/calculate", calculateFoodNutrition);

// module.exports = router;

const express = require("express");
const router = express.Router();

const {
  calculateFoodNutrition
} = require("../controllers/nutritionController");

router.post("/calculate", calculateFoodNutrition);

router.get("/test", (req, res) => {
  res.send("Nutrition Route Working");
});

module.exports = router;