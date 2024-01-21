// models/product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
		unique: true,
  },
  name: String,
  description: String,
  img: String,
  alt: String,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
