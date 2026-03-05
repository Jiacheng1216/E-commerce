import axios from "axios";
const API_URL = "http://localhost:8080/api/cart";

class CartService {
  //加入購物車
  add(userID, itemID, quantity,action) {
    return axios.post(API_URL, {
      userID,
      itemID,
      quantity,
      action
    });
  }

  //從購物車中刪除(以訂單id)
  deleteCart(id) {
    return axios.delete(API_URL + "/delete/" + id);
  }

  //查找個人加入購物車的商品(以使用者id)
  selfCart(id) {
    return axios.get(API_URL + "/selfCart/" + id);
  }

  //修改訂單資訊(以訂單id)
  updateCart(quantity, id) {
    return axios.put(API_URL + "/edit/" + id, {
      quantity,
    });
  }
}

export default new CartService();
