import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ItemService from "../../services/item.service";
import CartService from "../../services/cart.service";
import "./IndividualItem-component.css";

const IndividualItemComponent = ({ currentUser, setCurrentUser }) => {
  const { id } = useParams();
  const [itemData, setItemData] = useState([]);
  let [quantity, setQuantity] = useState("");

  useEffect(() => {
    fetchItem();
  }, []);

  const handleQuantity = (e) => {
    setQuantity(e.target.value);
  };

  const navigate = useNavigate();

  //查找個別物品
  const fetchItem = async () => {
    try {
      const response = await ItemService.getIndividualItem(id);
      setItemData(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  //加入購物車
  const handleAddCart = async () => {
    if (!currentUser) {
      window.alert("請先登入會員!");
      navigate("/login");
      return;
    }

    if (quantity == "") quantity = 1;
    if (quantity > itemData.quantity) {
      window.alert("已超過剩餘數量!");
      return;
    }

    try {
      let response = await CartService.add(
        currentUser.user._id,
        itemData._id,
        quantity,
        itemData.imagePath,
        itemData.title,
        itemData.price
      );
      window.alert("加入購物車成功!");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="individualItemPage">
      <div className="itemContainer">
        <div className="imgContainer">
          <img src={`http://localhost:8080/images/${itemData.imagePath}`}></img>
        </div>
        <div className="itemDataContainer">
          {/* 標題 */}
          <h5 className="itemTitle">{itemData.title}</h5>
          {/* 描述 */}
          <p className="itemDescription">{itemData.description}</p>
          {/* 價格 */}
          <p className="itemPrice">${itemData.price}</p>

          {/* 購買數量 */}
          <div className="itemQuantityContainer">
            <p>
              數量:{" "}
              <input
                className="quantityInput"
                onChange={handleQuantity}
                type="number"
                id="quantity"
                min="1"
                max={itemData.quantity}
              ></input>
            </p>
            <p className="itemQuantity">剩餘: {itemData.quantity} 個</p>
          </div>

          {currentUser &&
          itemData.seller &&
          itemData.seller.sellerId == currentUser.user._id ? (
            <div className="addCartContainer">
              <Link to={`/edit/${itemData._id}`}>編輯商品</Link>
            </div>
          ) : (
            <div onClick={handleAddCart} className="addCartContainer">
              加入購物車
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndividualItemComponent;
