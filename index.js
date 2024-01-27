// index.js
const express = require("express");
const connectDB = require("./db/connect");
const categoriesRoutes = require("./routes/categoriesController");
const emailMessagesRouter = require("./routes/emailMessage")
const Categories = require("./models/categories");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(cors());

// Не забывай при деплоя на сервер тут поменять сыллку и убрать с коменнта.
// const allowedOrigins = ["https://my-js.org"];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

// app.use(cors(corsOptions));

// const addProductsToDatabase = async () => {
//   try {
//     const productsToAdd = [
//       {
//         id: 1,
//         name: "Socks1",
//         description:
//           "Suspendisse ut risus accumsan, maximus lacus vitae, efficitur eros. Vivamus convallis vulputate turpis, eget rhoncus dui. ",
//         img: "img",
//         alt: "imgs",
//       },
//       {
//         id: 2,
//         name: "Socks2",
//         description:
//           "Suspendisse ut risus accumsan, maximus lacus vitae, efficitur eros. Vivamus convallis vulputate turpis, eget rhoncus dui. ",
//         img: "img",
//         alt: "imgs",
//       },
//       {
//         id: 3,
//         name: "Socks3",
//         description:
//           "Suspendisse ut risus accumsan, maximus lacus vitae, efficitur eros. Vivamus convallis vulputate turpis, eget rhoncus dui. ",
//         img: "img",
//         alt: "imgs",
//       },
//       {
//         id: 4,
//         name: "Socks4",
//         description:
//           "Suspendisse ut risus accumsan, maximus lacus vitae, efficitur eros. Vivamus convallis vulputate turpis, eget rhoncus dui. ",
//         img: "img",
//         alt: "imgs",
//       },
//     ];

//     await Product.create(productsToAdd);

//     console.log("Продукты успешно добавлены в базу данных");
//   } catch (error) {
//     console.error("Ошибка при добавлении продуктов в базу данных:", error);
//   }
// };

// addProductsToDatabase();

app.use("/", categoriesRoutes);
app.use("/", emailMessagesRouter);

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});



// Обработка ошибок сервера
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
