import React, { useState, useEffect } from "react";
import "./buyHistoryComponent.css";
import orderService from "../../services/order.service";

const BuyHistoryComponent = ({ currentUser }) => {
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await orderService.getOrdersByBuyer(
        currentUser.user._id
      );
      setOrderData(response.data.orderData);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="buy-history-container">
      <h2 className="page-title">我的購買記錄</h2>

      {orderData.length > 0 ? (
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
              <div
                className={`status-tag ${
                  order.completed ? "completed" : "processing"
                }`}
              >
                {order.completed ? "已完成" : "處理中"}
              </div>
            </div>

            {/* 子訂單 (按賣家拆分) */}
            <div className="sub-orders-list">
              {order.subOrders?.map((subOrder) => (
                <div key={subOrder._id} className="seller-package">
                  <div className="seller-info">
                    <i className="fas fa-store"></i>
                    <span>
                      賣家：<strong>{subOrder.seller?.username}</strong>
                    </span>
                    <span className="seller-email">
                      ({subOrder.seller?.email})
                    </span>
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
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 總結算 */}
            <div className="main-order-footer">
              <div className="total-label">實付總額</div>
              <div className="total-amount">${order.totalPrice}</div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-data">目前沒有任何購買記錄</div>
      )}
    </div>
  );
};

export default BuyHistoryComponent;
