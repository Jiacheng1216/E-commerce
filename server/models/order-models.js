const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User" },
    seller: { type: Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Item" },
      },
    ],
    totalPrice: Number,
  },
  {
    timestamps: true,
  }
);
