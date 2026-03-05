import React, { useState, useEffect } from "react";
import ItemService from "../../services/item.service";
import { useNavigate, useParams } from "react-router-dom";
import cartService from "../../services/cart.service";
import "./CartComponent.css";

const CartComponent = ({ currentUser, setCurrentUser }) => {
  let [cartData, setCartData] = useState([]);
  let [cartQuantity, setCartQuantity] = useState(1);
  let [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const handleQuantity = (e) => {
    setCartQuantity(e.target.value);
  };

  useEffect(() => {
    fetchCart();

    // handleUpdateCart();
    // calculateTotalPrice();
  }, []);

  // // 計算總金額
  // const calculateTotalPrice = () => {
  //   let total = 0;
  //   cartData.forEach((cart) => {
  //     total += cart.total;
  //   });
  //   setTotal(total);
  // };

  //進頁面時，查找加入購物車的商品
  const fetchCart = async () => {
    try {
      const response = await cartService.selfCart(currentUser.user._id);
      setCartData(response.data);
      // calculateTotalPrice();
    } catch (e) {
      console.log(e);
    }
  };

  //修改訂單(數量)
  // const handleUpdateCart = async (id) => {
  //   try {
  //     let response = await cartService.updateCart(cartQuantity, id);
  //     // calculateTotalPrice();
  //     fetchCart();
  //     console.log(response);
  //   } catch (e) {
  //     console.log(e.response.data);
  //   }
  // };

  //刪除訂單
  const handleDeleteCart = async (id) => {
    const comfirmed = window.confirm("您確定要刪除訂單嗎? 該操作不可復原");
    if (comfirmed) {
      try {
        let response = await cartService.deleteCart(id);
        // calculateTotalPrice();
        fetchCart();
        navigate("/cart");
      } catch (e) {
        console.log(e.response.data);
      }
    }
  };

  return (
    <div className="cartPage">
      <div className="cartIllustrate">
        <div className="cartIllustrateTitle">
          <p className="cartIllustrateText">商品</p>
        </div>
        <div className="cartIllustratePrice">
          <p className="cartIllustrateText">單價</p>
        </div>
        <div className="cartIllustrateQuantity">
          <p className="cartIllustrateText">數量</p>
        </div>
        <div className="cartIllustrateTotal">
          <p className="cartIllustrateText">總價</p>
        </div>
        <div className="cartIllustrateDelete">
          <p className="cartIllustrateText">刪除訂單</p>
        </div>
      </div>
      {!currentUser && <div>在獲取您的購物車資料之前，您必須先登錄。</div>}
      {cartData && cartData != 0 && (
        <div className="cartContainer">
          {cartData.map((cart) => {
            return (
              <div className="cartRowContainer">
                <div className="cartImgContainer">
                  <img
                    onClick={() =>
                      navigate(`/item/IndividualItem/${cart.itemId._id}`)
                    }
                    src={`http://localhost:8080/images/${cart.itemId.imagePath}`}
                  ></img>
                </div>

                <div className="cartTitle">
                  <p
                    onClick={() =>
                      navigate(`/item/IndividualItem/${cart.itemId._id}`)
                    }
                    className="cartTitleText"
                  >
                    {cart.itemId.title}
                  </p>
                </div>

                <div className="cartPrice">
                  <p className="cartText">{cart.itemId.price}</p>
                </div>

                <div className="cartQuantity">
                  <button className="cartQuantityBtn">-</button>
                  <input
                    className="cartQuantityText"
                    defaultValue={cart.quantity}
                  ></input>
                  <button className="cartQuantityBtn">+</button>
                </div>

                <div className="cartTotal">
                  <p className="cartText">{cart.total}</p>
                </div>

                <div className="cartDelete">
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => handleDeleteCart(cart._id)}
                  ></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="cartCheckout">
        <div className="cartCheckoutTotal">
          <label>總金額 :</label>
          <p className="cartCheckoutTotalText"> ${total}</p>
        </div>
        <div className="buyItem">
          <p className="buyItembtn">去買單</p>
        </div>
      </div>
    </div>
  );
};

export default CartComponent;
