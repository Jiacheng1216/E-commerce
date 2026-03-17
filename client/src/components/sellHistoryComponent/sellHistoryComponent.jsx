import React, { useState, useEffect } from "react";
import "./sellHistoryComponent.css";
import orderService from "../../services/order.service";

const SellHistoryComponent = ({ currentUser }) => {
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await orderService.getOrdersBySeller(
        currentUser.user._id
      );
      setOrderData(response.data.salesRecords);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="sellHistoryPage">
      <h2 className="page-title">我的販賣記錄</h2>

      {orderData && orderData.length > 0 ? (
        orderData.map((order) => (
          <div key={order._id} className="main-order-card">
            {/* 總訂單頭部資訊 */}
            <div className="main-order-header">
              <div className="info-group">
                <span className="label">訂單編號：</span>
                <span className="order-id">{order._id}</span>
              </div>
              <div className="info-group">
                <span className="label">下單時間：</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              {/* <div
                className={`status-tag ${
                  order.completed ? "completed" : "processing"
                }`}
              >
                {order.completed ? "已完成" : "處理中"}
              </div> */}
            </div>

            {/* 子訂單 (按賣家拆分) */}
            <div className="sub-orders-list">
              {order.subOrders?.map((subOrder) => (
                <div key={subOrder._id} className="seller-package">
                  <div className="seller-info">
                    <i className="fas fa-store"></i>
                    <span>
                      買家：<strong>{order.buyer?.username}</strong>
                    </span>
                    <span className="seller-email">({order.buyer?.email})</span>
                  </div>

                  {/* 商品列表 */}
                  <div className="items-list">
                    {subOrder.items?.map((item) => (
                      <div key={item._id} className="product-item">
                        <img
                          src={`http://localhost:8080/images/${item.itemId?.imagePath}`}
                          alt={item.itemId?.title}
                          className="product-img"
                        />
                        <div className="product-detail">
                          <p className="product-title">{item.itemId?.title}</p>
                          <p className="product-qty">x {item.quantity}</p>
                        </div>
                        <div className="product-price">
                          ${item.itemId?.price}
                        </div>
                        <button className="product-receive" disabled="false">
                          {item.completed ? "買家已收貨" : "買家未收貨"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="no-data">目前沒有任何販賣記錄</div>
      )}
    </div>
  );
};

export default SellHistoryComponent;
