import axios from "axios";
const API_URL = "http://localhost:8080/api/item";

class ItemService {
  //上傳商品
  post(title, description, price, seller, imagePath, quantity) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.post(
      API_URL,
      { title, description, price, seller, imagePath, quantity },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  //上傳商品照片
  postPhoto(fd) {
    return axios.post(API_URL + "/postPhoto", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  //查詢所有商品
  get() {
    return axios.get(API_URL + "/showItems");
  }

  //查詢個人商品
  getSelf(id) {
    return axios.get(API_URL + "/selfItems/" + id);
  }

  //刪除商品
  deleteItem(id) {
    return axios.delete(API_URL + "/delete/" + id);
  }

  //查詢個別商品
  getIndividualItem(id) {
    return axios.get(API_URL + "/findItem/" + id);
  }

  //編輯個別商品
  editItem(title, description, price, imagePath, quantity, id) {
    return axios.put(API_URL + "/edit/" + id, {
      title,
      description,
      price,
      imagePath,
      quantity,
    });
  }

  //搜尋商品
  searchItem(keyword) {
    return axios.get(API_URL + "/search?q=" + keyword);
  }
}

export default new ItemService();
