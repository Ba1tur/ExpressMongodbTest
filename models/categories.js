// models/product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  delivery: String,
  img: {
    data: String,
    contentType: String,
  },
});

const categoriesSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    img: {
      data: String,
      contentType: String,
    },
    alt: String,
    products: [productSchema],
  },
  { versionKey: false }
);

const Categories = mongoose.model("Categories", categoriesSchema);

module.exports = Categories;