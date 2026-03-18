import { useState, useEffect } from "react";
import AuthService from "../../services/auth.service";
import ItemService from "../../services/item.service";
import "./profile-component.css";
import { Link, useNavigate } from "react-router-dom";

const ProfileComponent = ({ currentUser, setCurrentUser }) => {
  const [itemData, setItemData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItem();
  }, []);

  //進頁面時 查找個人刊登物品
  const fetchItem = async () => {
    try {
      const response = await ItemService.getSelf(currentUser.user._id);
      setItemData(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  //刪除商品
  const handleDeleteItem = async (id) => {
    const comfirmed = window.confirm("您確定要刪除商品嗎? 該操作不可復原");
    if (comfirmed) {
      try {
        let response = await ItemService.deleteItem(id);
        fetchItem();
        navigate("/profile");
      } catch (e) {
        console.log(e.response.data);
      }
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="profilePage">
      {!currentUser && <div>在獲取您的個人資料之前，您必須先登錄。</div>}
      {currentUser && (
        <div className="profileInfoDiv">
          <h2>個人資訊</h2>
          <span>姓名：</span>
          <div>{currentUser.user.username}</div>
          <span>用戶ID：</span>
          <div>{currentUser.user._id}</div>
          <span>Email：</span>
          <div>{currentUser.user.email}</div>
        </div>
      )}

      {currentUser && (
        <div className="postItemDiv">
          <h2 className="itemPageH1">您刊登的商品</h2>
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
                    <button
                      className="deleteItemBtn"
                      onClick={handleDeleteItem}
                    >
                      下架物品
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
