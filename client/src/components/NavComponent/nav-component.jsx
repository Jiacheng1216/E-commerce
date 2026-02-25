import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthServeice from "../../services/auth.service";
import "./Nav-Component.css";
import cart from "../Assets/cart.png";
import CartService from "../../services/cart.service";

const NavComponent = ({ currentUser, setCurrentUser }) => {
  let [cartQuantity, setCartQuantity] = useState(0);
  const [openMenu, setOpenMenu] = useState(false);

  const handleLogout = () => {
    AuthServeice.logout();
    window.alert("登出成功，即將被導向首頁");
    setCurrentUser(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCart();
    }, 1000); // 每隔 1 秒更新一次
    return () => clearInterval(interval);
  }, []);

  // 查找購物車有多少商品
  const fetchCart = async () => {
    try {
      const response = await CartService.selfCart(currentUser.user._id);
      setCartQuantity(response.data.length);
    } catch (e) {
      console.log(e);
    }
  };

  // 點擊頁面其他地方自動關閉下拉選單
  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <main className="nav-main">
      <div className="left-section">
        {/* logo按鈕 */}
        <div className="logo-div">
          <Link to="/">
            <img src="logo.png" alt="logo" width={60} height={60} />
            <p>電商網站</p>
          </Link>
        </div>

        {/* 按鈕列表 */}
        <nav className="nav-div">
          <ul>
            <li className="item-view-btn">
              <Link to="/item">商品一覽</Link>
            </li>
            <li className="test-btn">
              <Link to="/">測試</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* 搜尋框 */}
      <div className="search-div">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </div>

      {!currentUser && (
        <Link className="login-btn" to="/Login">
          登入
        </Link>
      )}

      {currentUser && (
        <div className="cart-user-div">
          {/* 購物車按鈕 */}
          <Link className="navCartQuantityAndCart" to="cart">
            {cartQuantity > 0 && (
              <p className="navCartQuantity">{cartQuantity}</p>
            )}
            <img src={cart} width={50}></img>
          </Link>

          {/* 使用者名稱＋下拉選單 */}
          <div className="user-name-menu-div">
            <a
              className="user-name"
              onClick={(e) => {
                e.stopPropagation(); // 阻止 document click
                setOpenMenu(!openMenu);
              }}
            >
              {currentUser.user.username} ▼
            </a>
            {openMenu && (
              <ul
                className="dropdownMenu"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <li className="">
                  <Link
                    className=""
                    to="/profile"
                    onClick={() => {
                      setOpenMenu(false);
                    }}
                  >
                    個人頁面
                  </Link>
                </li>

                <li className="">
                  <Link
                    className=""
                    to="/postItem"
                    onClick={() => {
                      setOpenMenu(false);
                    }}
                  >
                    我要刊登
                  </Link>
                </li>

                <li className="logout-li">
                  <Link
                    onClick={() => {
                      handleLogout();
                      setOpenMenu(false);
                    }}
                    className=""
                    to="/"
                  >
                    登出
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default NavComponent;
