// routes/products.js
const express = require("express");
const Product = require("../models/product");

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.send(products);
  } catch (error) {
    console.error("Ошибка получения данных о продуктах:", error);
    res.status(500).send("Внутренняя ошибка сервера");
  }
});

router.post("/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).send("Продукт успешно добавлен");
  } catch (error) {
    console.error("Ошибка добавления продукта:", error);
    res.status(500).send("Внутренняя ошибка сервера");
  }
});

module.exports = router;