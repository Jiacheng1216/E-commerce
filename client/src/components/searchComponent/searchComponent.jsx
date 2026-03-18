import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import ItemService from "../../services/item.service";
import "./searchComponent.css";

const SearchComponent = ({ currentUser, setCurrentUser }) => {
  const [itemData, setItems] = useState([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  const fetchSearchResults = async () => {
    try {
      // 向後端 API 發送請求
      const response = await ItemService.searchItem(query);
      setItems(response.data.results);
    } catch (err) {
      console.error("搜尋失敗", err);
    }
  };

  return (
    <div className="searchPage">
      {!currentUser && <h1 className="hint">進行登入以開始購買商品</h1>}
      <h1 className="itemPageH1">搜尋 {query} 的結果如下</h1>

      {itemData && itemData.length != 0 && (
        <div className="itemCard-container">
          {itemData.map((item) => {
            return (
              <div className="itemCard" key={item._id}>
                <Link to={`/item/IndividualItem/${item._id}`}>
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

export default SearchComponent;
