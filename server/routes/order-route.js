const router = require("express").Router();
const order = require("../models").order;

router.use((req, res, next) => {
  console.log("正在接收一個跟訂單有關的請求...");
  next();
});

//新增訂單api
router.post("/", async (req, res) => {
  const { buyer, seller, items, totalPrice } = req.body;

  try {
    let newOrder = new order({
      buyer,
      seller,
      items,
      totalPrice,
    });

    await newOrder.save();

    return res.status(200).send({
      msg: "成功新增訂單資料",
      order: newOrder,
    });
  } catch (e) {
    return res.status(500).send("無法更新訂單資料...");
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
