const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Food = require("../models/Food");
const foods = require("../data/foods");

const seedFoods = async () => {
  try {
    await connectDB();

    await Food.deleteMany();

    const formattedFoods = foods.map(food => {
      let nutrition = {};

      if (food.nutritionPer100) {
        nutrition = food.nutritionPer100;
      }

      if (food.sizes) {
        nutrition = food.sizes.medium;
      }

      if (food.servings) {
        nutrition = {
          calories: food.servings[0].calories,
          protein: food.servings[0].protein,
          carbs: food.servings[0].carbs,
          fat: food.servings[0].fat
        };
      }

      return {
        foodName: food.name,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat
      };
    });

    await Food.insertMany(formattedFoods);

    console.log(
      `${formattedFoods.length} foods inserted successfully`
    );

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedFoods();