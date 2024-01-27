// db/connect.js
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Подключено к базе данных");
  } catch (error) {
    console.error("Ошибка подключения к базе данных:", error);
    mongoose.connection.close();
  }
};

module.exports = connectDB;
