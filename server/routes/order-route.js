const Cart = require("../models").cart;
const router = require("express").Router();
const Order = require("../models").order;
const SubOrder = require("../models").subOrder;

router.use((req, res, next) => {
  console.log("正在接收一個跟訂單有關的請求...");
  next();
});

//新增訂單api
router.post("/", async (req, res) => {
  const { buyer, items, totalPrice } = req.body;

  try {
    // 依照 seller 分群
    const groupedBySeller = items.reduce((acc, item) => {
      const sellerId = item.itemId.seller.sellerId;
      if (!acc[sellerId]) {
        acc[sellerId] = [];
      }
      acc[sellerId].push(item);
      return acc;
    }, {});

    // 建立所有子訂單
    const subOrderIds = [];

    for (const sellerId in groupedBySeller) {
      const sellerItems = groupedBySeller[sellerId];

      // 計算該賣家的子訂單總計
      const subTotal = sellerItems.reduce(
        (sum, i) => sum + i.itemId.price * i.quantity,
        0
      );

      const newSubOrder = new SubOrder({
        seller: sellerId,
        items: sellerItems.map((i) => ({
          itemId: i.itemId._id,
          quantity: i.quantity,
          price: i.itemId.price,
        })),
        totalPrice: subTotal,
      });

      const savedSubOrder = await newSubOrder.save();
      subOrderIds.push(savedSubOrder._id);
    }

    // 建立總訂單
    const newOrder = new Order({
      buyer: buyer,
      subOrders: subOrderIds,
      totalPrice: totalPrice,
    });

    const savedOrder = await newOrder.save();

    //清空該用戶的購物車
    await Cart.findOneAndDelete({ userId: buyer });

    return res.status(200).send({
      msg: "成功新增訂單資料，已自動按賣家拆單",
      order: savedOrder,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send("下單失敗，伺服器錯誤");
  }
});

//更新訂單完成狀態api
router.put("/:orderId/complete", async (req, res) => {
  const { completed } = req.body;

  try {
    let orderData = await order.findById(req.params.orderId);

    if (!orderData) {
      return res.status(404).send("找不到訂單資料...");
    }

    orderData.completed = completed;
    await orderData.save();

    return res.status(200).send({
      msg: "成功更新訂單完成狀態",
      order: orderData,
    });
  } catch (e) {
    return res.status(500).send("無法更新訂單完成狀態...");
  }
});

module.exports = router;
