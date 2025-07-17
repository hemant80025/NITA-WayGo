const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.VITE_MONGOURL;
const connectToMongo = async () => {
  try {
    await mongoose.connect(url);
    console.log("mongoDb connected successfully!");
  } catch (error) {
    console.log(`Error while connecting to mongoDb! ${error}`);
  }
};

module.exports = connectToMongo;
