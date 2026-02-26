import React, { useState, useEffect } from "react";
import ItemService from "../../services/item.service";
import { useNavigate, useParams } from "react-router-dom";
import "./EditIndividualItem-component.css";

const EditIndividualItemConponent = ({ currentUser, setCurrentUser }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  const navigate = useNavigate();

  const { id } = useParams();

  const [itemData, setItemData] = useState({});

  useEffect(() => {
    fetchItem();
  }, []);

  //查找個別物品
  const fetchItem = async () => {
    try {
      const response = await ItemService.getIndividualItem(id);
      setItemData(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [price, setPrice] = useState("");
  let [quantity, setQuantity] = useState("");
  //選擇檔案 上傳圖片
  let [selectedFile, setSelectedFile] = useState(null);
  //預覽圖片
  let [image, setImage] = useState(null);
  let [message, setMessage] = useState("");

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

  const handleEditItem = async () => {
    //圖片上傳功能
    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      let response = await ItemService.postPhoto(formData);
    } catch (e) {
      setMessage(e.response.data);
    }

    let imagePath = itemData.imagePath;
    if (selectedFile) imagePath = selectedFile.name;
    if (title == "") title = itemData.title;
    if (description == "") description = itemData.description;
    if (price == "") price = itemData.price;
    if (quantity == "") quantity = itemData.quantity;

    try {
      const response = await ItemService.editItem(
        title,
        description,
        price,
        imagePath,
        quantity,
        id
      );

      window.alert("編輯商品成功!");
      navigate(`/profile/IndividualItem/${id}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="editItemPage">
      {currentUser && itemData && itemData.seller && (
        <>
          {currentUser.user._id != itemData.seller.sellerId && (
            <div>不可以修改別人的商品!</div>
          )}
          {currentUser.user._id === itemData.seller.sellerId && (
            <form className="editForm" onSubmit={handleSubmit}>
              <div className="mb-3">
                {/* {message && <div className="alert alert-danger">{message}</div>} */}
                <h1 className="editItemH1">請輸入要更改的資訊</h1>
                <label htmlFor="exampleInputEmail1" className="form-label">
                  商品名稱:
                </label>

                <input
                  type="text"
                  onChange={handleTitle}
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
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

                {!image && (
                  <img
                    class="img-thumbnail"
                    src={`http://localhost:8080/images/${itemData.imagePath}`}
                  ></img>
                )}

                {image && <img class="img-thumbnail" src={image}></img>}
              </div>

              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  商品描述:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputPassword1"
                  onChange={handleDescription}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  價格:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputPassword1"
                  onChange={handlePrice}
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

              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleEditItem}
              >
                完成修改
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default EditIndividualItemConponent;
