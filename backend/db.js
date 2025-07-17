const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGOURL;
const connectToMongo = async () => {
  try {
    const conn = await mongoose.connect(url);
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(`Error while connecting to mongoDb! ${error}`);
  }
};

module.exports = connectToMongo;
