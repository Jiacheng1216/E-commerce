const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true, 
    },
    items: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          ref: 'Item',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, '數量不能小於 1'],
          default: 1,
        },
      },
    ],
  },
  { 
    timestamps: true // 自動產生 createdAt 和 updatedAt
  }
);


cartSchema.pre("save", function (next) {
  this.total = this.quantity * this.price;
  next();
});

module.exports = mongoose.model("Cart", cartSchema);

