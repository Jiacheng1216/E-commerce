const { boolean } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const subOrderSchema = new Schema({
  seller: { type: Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      itemId: {
        type: Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "數量不能小於 1"],
        default: 1,
      },
      totalPrice: { type: Number },
    },
  ],
});

const subOrder = mongoose.model("SubOrder", subOrderSchema);

const orderSchema = new Schema(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User" },
    subOrders: [{ type: Schema.Types.ObjectId, ref: "SubOrder" }],
    totalPrice: { type: Number, required: true },
    completed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const order = mongoose.model("Order", orderSchema);
module.exports = { order, subOrder };
