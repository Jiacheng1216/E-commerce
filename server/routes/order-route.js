const Cart = require("../models").cart;
const router = require("express").Router();
const Order = require("../models").order;
const SubOrder = require("../models").subOrder;
const User = require("../models").user;

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

// 更新子訂單某個商品完成狀態 api
router.put("/item/:subOrderItemId", async (req, res) => {
  const { subOrderItemId } = req.params;

  try {
    const updatedSubOrder = await SubOrder.findOneAndUpdate(
      { "items._id": subOrderItemId },
      {
        $set: { "items.$.completed": true },
      },
      { new: true }
    ).populate("items.itemId", "price");

    if (!updatedSubOrder) {
      return res.status(404).send("找不到該商品所屬的訂單資料...");
    }

    const targetItem = updatedSubOrder.items.id(subOrderItemId);

    //撥款給賣家
    const sellerId = updatedSubOrder.seller;
    const profit = targetItem.quantity * targetItem.itemId.price;
    await User.updateOne({ _id: sellerId }, { $inc: { balance: profit } });

    return res.status(200).send({
      msg: "成功更新商品完成狀態",
      order: updatedSubOrder,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send("伺服器錯誤，無法更新狀態...");
  }
});

//查詢符合買家id的訂單資料
router.get("/buyHistory/:buyerId", async (req, res) => {
  try {
    let orderData = await Order.find({ buyer: req.params.buyerId }).populate({
      path: "subOrders",
      populate: [
        {
          path: "seller",
          select: "username email",
        },
        {
          path: "items.itemId",
          select: "title imagePath price",
        },
      ],
    });

    return res.status(200).send({
      orderData,
      msg: "成功查詢訂單資料",
    });
  } catch (e) {
    return res.status(500).send("無法查詢訂單資料...");
  }
});

// 查詢賣家的販賣紀錄 API
router.get("/sellerHistory/:sellerId", async (req, res) => {
  const sellerId = req.params.sellerId;
  try {
    const mySubOrders = await SubOrder.find({
      seller: sellerId,
    }).select("_id");
    const mySubOrderIds = mySubOrders.map((doc) => doc._id);

    const salesRecords = await Order.find({
      subOrders: { $in: mySubOrderIds },
    })
      .populate("buyer", "username email") // 填充買家資訊
      .populate({
        path: "subOrders",
        match: { seller: sellerId }, // 只填充屬於該賣家的子訂單內容
        populate: { path: "items.itemId" },
      })
      .sort({ createdAt: -1 }); // 依時間排序，最新的在前面

    return res.status(200).send({
      salesRecords,
      msg: "成功查詢訂單資料",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send("無法取得販賣紀錄...");
  }
});

module.exports = router;
