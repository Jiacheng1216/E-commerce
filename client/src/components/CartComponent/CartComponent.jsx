import React, { useState, useEffect } from "react";
import ItemService from "../../services/item.service";
import { useNavigate, useParams } from "react-router-dom";
import cartService from "../../services/cart.service";
import "./CartComponent.css";

const CartComponent = ({ currentUser, setCurrentUser, setCartQuantity }) => {
  let [cartData, setCartData] = useState([]);
  let [total, setTotal] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  //進頁面時，查找加入購物車的商品
  const fetchCart = async () => {
    try {
      const response = await cartService.selfCart(currentUser.user._id);
      setCartData(response.data.calcuEveryItemPriceSelfCart);
      setTotal(response.data.calcuTotalPrice);
      setCartQuantity(response.data.calcuEveryItemPriceSelfCart.length);
    } catch (e) {
      console.log(e);
    }
  };

  //修改訂單(數量)
  const handleUpdateCart = async (itemId, quantity, action) => {
    try {
      let response = await cartService.add(
        currentUser.user._id,
        itemId,
        quantity,
        action
      );

      fetchCart();
    } catch (e) {
      console.log(e.response.data);
    }
  };

  //刪除訂單
  const handleDeleteCart = async (itemId, quantity) => {
    const comfirmed = window.confirm("您確定要刪除訂單嗎? 該操作不可復原");
    if (comfirmed) {
      try {
        let response = await cartService.add(
          currentUser.user._id,
          itemId,
          -quantity
        );
        fetchCart();
      } catch (e) {
        console.log(e.response.data);
      }
    }
  };

  return (
    <div className="cartPage">
      <div className="cartIllustrate">
        <div className="col-product">
          <p className="cartIllustrateText">商品</p>
        </div>
        <div className="col-price">
          <p className="cartIllustrateText">單價</p>
        </div>
        <div className="col-quantity">
          <p className="cartIllustrateText">數量</p>
        </div>
        <div className="col-total">
          <p className="cartIllustrateText">總價</p>
        </div>
        <div className="col-action">
          <p className="cartIllustrateText">操作</p>
        </div>
      </div>
      {!currentUser && <div>在獲取您的購物車資料之前，您必須先登錄。</div>}
      {cartData.length > 0 && (
        <div className="cartContainer">
          {cartData.map((cart) => {
            return (
              <div className="cartRowContainer" key={cart._id}>
                <div className="col-product product-info">
                  <div className="cartImgContainer">
                    <img
                      onClick={() =>
                        navigate(`/item/IndividualItem/${cart.itemId._id}`)
                      }
                      src={`http://localhost:8080/images/${cart.itemId.imagePath}`}
                    ></img>
                  </div>
                  <p
                    className="cartTitleText"
                    onClick={() =>
                      navigate(`/item/IndividualItem/${cart.itemId._id}`)
                    }
                  >
                    {cart.itemId.title}
                  </p>
                </div>

                <div className="col-price">
                  <p className="cartText">{cart.itemId.price}</p>
                </div>

                <div className="col-quantity">
                  <div className="quantity-control">
                    <button
                      className="cartQuantityBtn"
                      onClick={() => {
                        handleUpdateCart(cart.itemId._id, -1);
                      }}
                    >
                      -
                    </button>
                    <input
                      className="cartQuantityText"
                      value={cart.quantity}
                      onChange={(e) => {
                        const newQuantity = Number(e.target.value);

                        handleUpdateCart(
                          cart.itemId._id,
                          newQuantity,
                          "directAdjust"
                        );
                      }}
                    ></input>
                    <button
                      className="cartQuantityBtn"
                      onClick={() => {
                        handleUpdateCart(cart.itemId._id, 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="col-total">
                  <p className="cartText text-red">{cart.itemTotal}</p>
                </div>

                <div className="col-action">
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() =>
                      handleDeleteCart(cart.itemId._id, cart.quantity)
                    }
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
