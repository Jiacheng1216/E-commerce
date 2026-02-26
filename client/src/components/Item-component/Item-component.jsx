import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemService from "../../services/item.service";
import "./Item-component.css";
import { Link } from "react-router-dom";

const ItemComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    fetchItem();
  }, []);

  //查找所有物品
  const fetchItem = async () => {
    try {
      const response = await ItemService.get();
      setItemData(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="itemPage">
      {!currentUser && <h1 className="hint">進行登入以開始購買商品</h1>}
      <h1 className="itemPageH1">商品一覽</h1>

      {itemData && itemData.length != 0 && (
        <div className="itemCard-container">
          {itemData.map((item) => {
            return (
              <div className="itemCard" key={item._id}>
                <Link to={`IndividualItem/${item._id}`}>
                  <img
                    src={`http://localhost:8080/images/${item.imagePath}`}
                    className="card-img"
                    alt="..."
                  ></img>
                  <div className="card-body">
                    <h2 className="card-text-title">{item.title}</h2>
                    <span className="card-text-price">$ {item.price}</span>
                    <span className="card-text-author">
                      由 {item.seller.sellerName} 刊登
                    </span>
                    <span className="card-text-date">
                      {item.date[0]}
                      {item.date[1]}
                      {item.date[2]}
                      {item.date[3]} 年 {item.date[5]}
                      {item.date[6]} 月 {item.date[8]}
                      {item.date[9]} 日 {item.date[11]}
                      {item.date[12]} : {item.date[14]}
                      {item.date[15]} 上傳
                    </span>
                    <span className="card-text-quantity">
                      剩餘: {item.quantity} 個
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ItemComponent;
