import axios from "axios";
const API_URL = "http://localhost:8080/api/order";

class OrderService {
  //建立訂單
  createOrder(buyer, items, totalPrice) {
    return axios.post(API_URL, {
      buyer,
      items,
      totalPrice,
    });
  }

  // 更新訂單狀態
  updateOrderStatus(completed) {
    return axios.put(API_URL + "/:orderId/complete", {
      completed,
    });
  }

  //查詢買家訂單
  getOrdersByBuyer(buyerId) {
    return axios.get(API_URL + `/${buyerId}`);
  }
}

export default new OrderService();
