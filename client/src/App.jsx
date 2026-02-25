import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Register from "./components/register-component/register-component";
import Login from "./components/login-component/login-component";
import Profile from "./components/profile-component/profile-component";
import { useState } from "react";
import AuthService from "./services/auth.service";
import ItemComponent from "./components/Item-component/Item-component";
import PostItemComponent from "./components/postItem-component/postItem-component";
import IndividualItemComponent from "./components/IndividualItem-compoent/IndividualItem-component";
import UserIndividualItemComponent from "./components/UserIndividualItem-component/UserIndividualItem-component";
import EditIndividualItemConponent from "./components/EditIndividualItem-component/EditIndividualItem-component";
import HomeComponent from "./components/HomeComponent/HomeComponent";
import CartComponent from "./components/CartComponent/CartComponent";

function App() {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        >
          {/* 首頁 */}
          <Route
            index
            element={
              <HomeComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          {/* 註冊頁面 */}
          <Route path="register" element={<Register />} />

          {/* 登入頁面 */}
          <Route
            path="login"
            element={
              <Login
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />

          {/* 個人檔案頁面 */}
          <Route
            path="profile"
            element={
              <Profile
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />

          {/* 商品一覽頁面 */}
          <Route
            path="item"
            element={
              <ItemComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />

          {/* 刊登物品頁面 */}
          <Route
            path="postItem"
            element={
              <PostItemComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />

          {/* 商品一覽 個別物品資訊頁面 */}
          <Route
            path="item/IndividualItem/:id"
            element={
              <IndividualItemComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />

          {/* 個人檔案 個別物品資訊頁面 */}
          <Route
            path="profile/IndividualItem/:id"
            element={
              <UserIndividualItemComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />

          {/* 編輯商品資訊頁面 */}
          <Route
            path="edit/:id"
            element={
              <EditIndividualItemConponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />

          {/* 購物車頁面 */}
          <Route
            path="cart"
            element={
              <CartComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
