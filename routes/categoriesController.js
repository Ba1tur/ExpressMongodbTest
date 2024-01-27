// routes/productController.js
const express = require("express");
const Categories = require("../models/categories");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  folder: "products",
  allowedFormats: ["jpg", "jpeg", "png"],
});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      overwrite: true,
    });

    const newCategories = new Categories({
      name: "Рубашки",
      description: "Рубашки больших размеров, стильные и молодежные рубашки для вашего бренда",
      img: {
        data: result.url, // Используем version
        contentType: req.file.mimetype,
      },
      alt: "Image",
    });

    await newCategories.save();

    res.json({ success: true, imageUrl: result.url });
  } catch (error) {
    console.error("Error uploading image and saving to database:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await Categories.find();

    if (categories.length === 0) {
      res.status(204).send("Категории пусты");
    }
    res.send(categories);
  } catch (error) {
    console.error("Ошибка получения данных о продуктах:", error);
    res.status(500).send("Внутренняя ошибка сервера");
  }
});

router.get("/categories/:id", async (req, res) => {
  try {
    const categoriesId = req.params.id;

    // Проверка, что productId существует и не пустой
    if (!categoriesId) {
      return res
        .status(400)
        .json({ success: false, error: "Categories ID is required" });
    }

    const categories = await Categories.findById(categoriesId);

    // Проверка, что product найден
    if (!categories) {
      return res
        .status(404)
        .json({ success: false, error: "Categories not found" });
    }

    res.json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const secretKey = req.body.secretKey;
    if (secretKey !== process.env.SECRET_KEY) {
      return res
        .status(403)
        .json({ success: false, error: "Invalid secretKey" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      overwrite: true,
    });

    const categoriesId = req.params.id;
    const existingCategories = await Categories.findById(categoriesId);

    if (!existingCategories) {
      return res
        .status(404)
        .json({ success: false, error: "Categories not found" });
    }

    const productId = req.body.productId;
    const existingProduct = existingCategories.products.id(productId);

    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    // Обновляем свойства продукта
    existingProduct.name = req.body.name || existingProduct.name;
    existingProduct.description =
      req.body.description || existingProduct.description;
    existingProduct.price = req.body.price || existingProduct.price;
    existingProduct.img = {
      data: result.url,
      contentType: req.file.mimetype,
    };

    // Сохраняем измененные категории
    await existingCategories.save();

    res.json({ success: true, imageUrl: result.url });
  } catch (error) {
    console.error("Error uploading image and updating Categories:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.delete("/delete/:categoryId/:productId", async (req, res) => {
  try {
    const secretKey = req.body.secretKey;
    if (secretKey !== process.env.SECRET_KEY) {
      return res
        .status(403)
        .json({ success: false, error: "Invalid secretKey" });
    }

    const categoryId = req.params.categoryId;
    const productId = req.params.productId;

    const existingCategories = await Categories.findById(categoryId);

    if (!existingCategories) {
      return res
        .status(404)
        .json({ success: false, error: "Categories not found" });
    }

    // Используем метод pull для удаления продукта из массива products по его _id
    existingCategories.products.pull(productId);

    // Сохраняем измененные категории
    await existingCategories.save();

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/upload/:categoryId", upload.single("image"), async (req, res) => {
  try {
    const secretKey = req.body.secretKey;
    if (secretKey !== process.env.SECRET_KEY) {
      return res
        .status(403)
        .json({ success: false, error: "Invalid secretKey" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      overwrite: true,
    });

    const categoryId = req.params.categoryId;
    const existingCategories = await Categories.findById(categoryId);

    if (!existingCategories) {
      return res
        .status(404)
        .json({ success: false, error: "Categories not found" });
    }

    const newProduct = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      delivery: "1 кг товара — 40-60 руб., срок доставки от 7 дней. 50% предоплата после решения о запуске модели.",
      img: {
        data: result.url,
        contentType: req.file.mimetype,
      },
    };

    // Добавляем новый продукт в массив products
    existingCategories.products.push(newProduct);

    // Сохраняем измененные категории
    await existingCategories.save();

    res.json({ success: true, imageUrl: result.url });
  } catch (error) {
    console.error("Error uploading image and saving to database:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


module.exports = router;
