import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import cartService from "../../services/cart.service";
import "./CheckoutComponent.css"; // 建議建一個新的 CSS 以便微調
import orderService from "../../services/order.service";

const CheckoutComponent = ({ currentUser }) => {
  const [cartData, setCartData] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartService.selfCart(currentUser.user._id);
      setCartData(response.data.calcuEveryItemPriceSelfCart);
      setTotal(response.data.calcuTotalPrice);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCheckout = async () => {
    // TODO : 根據 paymentMethod 進行結帳流程
    try {
      let response = await orderService.createOrder(
        currentUser.user._id,
        cartData,
        total
      );

      window.alert(response.data.msg + "，現在跳轉回購物車頁面");
      navigate("/cart");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="checkoutPage">
      <h2 className="checkoutSectionTitle">1. 確認訂單內容</h2>

      {/* 上方區塊：訂單明細 (複用購物車樣式) */}
      <div className="checkoutOrderSummary">
        <div className="cartIllustrate">
          <div className="col-product">商品</div>
          <div className="col-price">單價</div>
          <div className="col-quantity">數量</div>
          <div className="col-total">小計</div>
        </div>

        <div className="cartContainer">
          {cartData.map((item) => (
            <div className="cartRowContainer" key={item._id}>
              <div className="col-product product-info">
                <div className="cartImgContainer">
                  <img
                    src={`http://localhost:8080/images/${item.itemId.imagePath}`}
                    alt=""
                    onClick={() =>
                      navigate(`/item/IndividualItem/${item.itemId._id}`)
                    }
                  />
                </div>
                <p
                  className="cartTitleText"
                  onClick={() =>
                    navigate(`/item/IndividualItem/${item.itemId._id}`)
                  }
                >
                  {item.itemId.title}
                </p>
              </div>
              <div className="col-price">${item.itemId.price}</div>
              <div className="col-quantity">x {item.quantity}</div>
              <div className="col-total text-red">${item.itemTotal}</div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="checkoutSectionTitle">2. 付款方式</h2>

      {/* 下方區塊：付款選擇 */}
      <div className="paymentSection">
        <div className="paymentOptions">
          <label
            className={`paymentOption ${
              paymentMethod === "credit_card" ? "active" : ""
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="credit_card"
              checked={paymentMethod === "credit_card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <div className="paymentIcon">💳</div>
            <span>信用卡 / 金融卡</span>
          </label>

          <label
            className={`paymentOption ${
              paymentMethod === "cash" ? "active" : ""
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <div className="paymentIcon">💵</div>
            <span>貨到付款 (現金)</span>
          </label>
        </div>

        {/* 信用卡資訊輸入框 (只有選擇信用卡時顯示) */}
        {paymentMethod === "credit_card" && (
          <div className="creditCardForm">
            <input type="text" placeholder="卡號 (0000 0000 0000 0000)" />
            <div className="cardRow">
              <input type="text" placeholder="有效期限 (MM/YY)" />
              <input type="text" placeholder="CVC" />
            </div>
          </div>
        )}
      </div>

      {/* 最後結帳欄位 */}
      <div className="finalActionRow">
        <div className="finalTotal">
          應付總額：<span className="text-red">${total}</span>
        </div>
        <button className="confirmPayBtn" onClick={handleCheckout}>
          確認結帳
        </button>
      </div>
    </div>
  );
};

export default CheckoutComponent;
