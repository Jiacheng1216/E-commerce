import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthServeice from "../../services/auth.service";
import "./Nav-Component.css";
import cart from "../Assets/cart.png";

const NavComponent = ({ currentUser, setCurrentUser, cartQuantity }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${keyword}`);
    }
  };

  const handleLogout = () => {
    AuthServeice.logout();
    window.alert("登出成功，即將被導向首頁");
    setCurrentUser(null);
  };

  // 點擊頁面其他地方自動關閉下拉選單
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenu(false);
      setOpenMobileMenu(false);
    };
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
            {/* <li className="test-btn">
              <Link to="/">測試</Link>
            </li> */}
          </ul>
        </nav>
      </div>

      {/* 搜尋框 */}
      <form className="search-div" onSubmit={handleSearch}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>

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
                <li className="navBalance">{currentUser.user.balance} 🪙</li>
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

                <li className="">
                  <Link
                    className=""
                    to="/buyHistory"
                    onClick={() => {
                      setOpenMenu(false);
                    }}
                  >
                    購買記錄
                  </Link>
                </li>

                <li className="">
                  <Link
                    className=""
                    to="/sellHistory"
                    onClick={() => {
                      setOpenMenu(false);
                    }}
                  >
                    販賣記錄
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

      {/* rwd */}
      <div
        className="hamburger"
        onClick={(e) => {
          e.stopPropagation();
          setOpenMobileMenu(!openMobileMenu);
        }}
      >
        ☰
      </div>
      {openMobileMenu && (
        <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
          {/* 搜尋 */}
          <form onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search"
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>

          <li className="navBalance">{currentUser.user.balance} 🪙</li>

          <Link to="/item" onClick={() => setOpenMobileMenu(false)}>
            商品一覽
          </Link>

          {!currentUser && (
            <Link to="/Login" onClick={() => setOpenMobileMenu(false)}>
              登入
            </Link>
          )}

          {currentUser && (
            <>
              <Link to="/cart" onClick={() => setOpenMobileMenu(false)}>
                購物車 ({cartQuantity})
              </Link>

              <Link to="/profile" onClick={() => setOpenMobileMenu(false)}>
                個人頁面
              </Link>

              <Link to="/postItem" onClick={() => setOpenMobileMenu(false)}>
                我要刊登
              </Link>

              <Link to="/buyHistory" onClick={() => setOpenMobileMenu(false)}>
                購買記錄
              </Link>

              <Link to="/sellHistory" onClick={() => setOpenMobileMenu(false)}>
                販賣記錄
              </Link>

              <div
                onClick={() => {
                  handleLogout();
                  setOpenMobileMenu(false);
                }}
              >
                登出
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
};

export default NavComponent;
