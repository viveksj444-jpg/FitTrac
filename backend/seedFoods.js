require("dotenv").config();

const mongoose = require("mongoose");

const Food = require("./models/Food");
const foods = require("./data/foods");

const importData = async () => {
  try {
    console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    // Delete old foods
    await Food.deleteMany();

    // Insert foods
    await Food.insertMany(foods);

    console.log("Foods Imported Successfully");

    process.exit();

  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

importData();