import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthServeice from "../../services/auth.service";
import "./Nav-Component.css";
import cart from "../Assets/cart.png";
import CartService from "../../services/cart.service";

const NavComponent = ({ currentUser, setCurrentUser }) => {
  let [cartQuantity, setCartQuantity] = useState(0);

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
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item dropdown">
            {/* 購物車頁面 */}
            <Link to="cart">
              <div className="navCartQuantityAndCart">
                {cartQuantity > 0 && (
                  <p className="navCartQuantity">{cartQuantity}</p>
                )}
                <img src={cart} width={50}></img>
              </div>
            </Link>
            <a
              className="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {currentUser.user.username}
            </a>

            <ul className="dropdown-menu">
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  個人頁面
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/postItem">
                  我要刊登
                </Link>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>
              <li className="nav-item">
                <Link onClick={handleLogout} className="nav-link" to="/">
                  登出
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      )}
    </main>
  );
};

export default NavComponent;
