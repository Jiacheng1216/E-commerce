const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { auth } = require("./routes");
const authRoute = require("./routes").auth;
dotenv.config();

const port = 8080;

mongoose
  .connect("mongodb://localhost:27017/myDB")
  .then(() => {
    console.log("成功連結到myDB");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", authRoute);

app.listen(port, () => {
  console.log("伺服器正在8080上運行...");
});
