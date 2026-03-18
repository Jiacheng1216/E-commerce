const router = require("express").Router();
const Cart = require("../models").cart;

router.use((req, res, next) => {
  console.log("正在接收一個跟購物車有關的請求...");
  next();
});

// 更新購物車的路由
router.post("/", async (req, res) => {
  const { userID, itemID, quantity, action} = req.body;

  try {
    //尋找整筆user的購物車資料
    let cart = await Cart.findOne({userId:userID});

    //如果找不到user的購物車資料
    if(!cart || cart == undefined){
      let cart = new Cart({
        userId:userID,
        items:[{itemId:itemID,quantity:quantity}]
      })

      await cart.save();
      return res.status(200).send(
        {
          msg: "成功新增購物車資料",
          cart,  
        }
      )
    }

    //尋找使用者裡商品的資料
    const itemIndex = cart.items.findIndex(i => i.itemId.toString() === itemID)

    //如果找得到商品資料
    if(itemIndex > -1){
      if(action == "directAdjust"){
        cart.items[itemIndex].quantity = Number(quantity);
      }else{
        cart.items[itemIndex].quantity += Number(quantity);
      }

      //如果購物車商品數量為0
      if(cart.items[itemIndex].quantity == 0){
        cart.items.splice(itemIndex,1);
        await cart.save();
        return res.status(203).send(
          {
            msg: "成功從購物車中刪除商品",
            cart,  
          }
        )
      }

      await cart.save();
      return res.status(202).send({
        msg: "成功從購物車中更新商品數量",
        cart,  
      })
    }else{
      cart.items.push({itemId:itemID,quantity:quantity})
      await cart.save();
      return res.status(201).send({
        msg: "成功從購物車中新增商品",
        cart,  
      })
    }
  } catch (e) {
    return res.status(500).send("無法更新購物車資料...");
  }
});

//以用戶id來查詢購物車中的商品
router.get("/selfCart/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const selfCart = await Cart.findOne({ userId: userId }).populate("items.itemId");

    const calcuEveryItemPriceSelfCart = selfCart.items.map((item)=>{
      const price = item.itemId.price;
      const itemTotalPrice = price * item.quantity;

      return{
        _id: item._id,
        itemId: item.itemId,
        quantity: item.quantity,
        itemTotal:itemTotalPrice
      }
    })

    const calcuTotalPrice = calcuEveryItemPriceSelfCart.reduce((sum,item)=>{
      return sum+ item.itemTotal;
    },0)

    res.send({cartId:selfCart._id,calcuEveryItemPriceSelfCart,calcuTotalPrice});
  } catch (e) {
    res.status(500).send("無法查詢個人加入購物車的商品");
  }
});

//以訂單id刪除購物車商品
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     const cartID = req.params.id;
//     const deleteCart = await Cart.findByIdAndDelete(cartID);
//     if (!deleteCart) return res.status(404).json({ error: "訂單未找到" });
//     return res.send({
//       msg: "刪除訂單成功",
//       deleteCart,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).send("刪除購物車商品時出錯");
//   }
// });

//查找資料庫中所有訂單
// router.get("/showCart", async (req, res) => {
//   try {
//     const allCart = await Cart.find();
//     return res.send(allCart);
//   } catch (e) {
//     res.status(500).send("無法查詢所有訂單");
//   }
// });


//以訂單id更新訂單資訊
// router.put("/edit/:id", async (req, res) => {
//   const cartID = req.params.id;
//   const { quantity } = req.body;

//   try {
//     const cart = await Cart.findById(cartID);
//     if (!cartID) return res.status(404).send("訂單未找到");

//     cart.quantity = quantity;

//     const updatedCart = await cart.save();
//     res.status(200).send({ msg: "訂單資訊更新成功!", updatedCart });
//   } catch (e) {
//     res.status(500).send("無法更新訂單資訊");
//   }
// });

module.exports = router;

