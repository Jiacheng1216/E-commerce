import React, { useState } from "react";
import ItemService from "../../services/item.service";
import { useNavigate } from "react-router-dom";
import "./postItem-component.css";

const PostItemComponent = ({ currentUser, setCurrentUser }) => {
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [price, setPrice] = useState("");
  let [quantity, setQuantity] = useState("");
  //選擇檔案 上傳圖片
  let [selectedFile, setSelectedFile] = useState(null);
  //預覽圖片
  let [image, setImage] = useState(null);
  // 錯誤訊息
  let [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const navigate = useNavigate();

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handlePrice = (e) => {
    setPrice(e.target.value);
  };

  const handleQuantity = (e) => {
    setQuantity(e.target.value);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    //預覽圖片功能
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostItem = async () => {
    if (!selectedFile) {
      window.alert("請至少上傳一張圖片!");
      return;
    }

    //圖片上傳功能
    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      let response = await ItemService.postPhoto(formData);
    } catch (e) {
      setMessage(e.response.data);
    }

    try {
      let response = await ItemService.post(
        title,
        description,
        price,
        {
          sellerId: currentUser.user._id,
          sellerName: currentUser.user.username,
        },
        selectedFile.name,
        quantity
      );
      console.log(response.data);
      window.alert("刊登商品成功!");
      navigate("/profile");
    } catch (e) {
      setMessage(e.response.data);
    }
  };

  return (
    <div className="editPage">
      <form
        className="editForm"
        method="post"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h1 className="postItemH1">請輸入商品資訊</h1>
        <div className="mb-3">
          {message && <div className="alert alert-danger">{message}</div>}
          <label htmlFor="exampleInputTitle" className="form-label">
            商品名稱:
          </label>

          <input
            onChange={handleTitle}
            type="text"
            className="form-control"
            id="exampleInputTitle"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="examplephoto" className="form-label">
            商品圖片:
          </label>
          <input
            name="photo"
            type="file"
            onChange={handleFileChange}
            className="form-control"
            id="examplephoto"
          />
          <br></br>
          <img src={image} class="img-thumbnail" alt="Preview"></img>
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputDescription" className="form-label">
            描述:
          </label>
          <input
            onChange={handleDescription}
            type="text"
            className="form-control"
            id="exampleInputDescription"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputPrice" className="form-label">
            價錢:
          </label>
          <input
            onChange={handlePrice}
            type="text"
            className="form-control"
            id="exampleInputPrice"
          />
        </div>

        <div className="quantitydiv">
          <label for="quantity">數量：</label>
          <input
            className="quantityInput"
            onChange={handleQuantity}
            type="number"
            id="quantity"
            min="1"
            max="100"
          ></input>
        </div>

        <button className="btn btn-primary" onClick={handlePostItem}>
          刊登商品
        </button>
      </form>
    </div>
  );
};

export default PostItemComponent;
