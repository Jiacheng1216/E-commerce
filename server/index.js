const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose
  .connect("mongodb://localhost:27017/myDB")
  .then(() => {
    console.log("成功連結到myDB");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(8080, () => {
  console.log("伺服器正在8080上運行...");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
