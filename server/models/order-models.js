const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User" },
    seller: { type: Schema.Types.ObjectId, ref: "User" },
    cart: { type: Schema.Types.ObjectId, ref: "Cart" },
  },
  {
    timestamps: true,
  }
);
