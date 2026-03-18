const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const itemRoute = require("./routes").itemAuth;
const cartRoute = require("./routes").cart;
const orderRoute = require("./routes").order;
const cors = require("cors");

//連結到mongoDB
mongoose
  .connect("mongodb://localhost:27017/ecomDB")
  .then(() => {
    console.log("連結到mongoDB...");
  })
  .catch((e) => {
    console.log(e);
  });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//當發送images的路由時,會導向uploads資料夾
app.use("/images", express.static("uploads"));
app.use("/api/user", authRoute);
app.use("/api/item", itemRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);

//連結到後端伺服器
app.listen(8080, () => {
  console.log("伺服器後端聆聽在port 8080...");
});
