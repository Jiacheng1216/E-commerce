import React from "react";
import "./FooterComponent.css";

const FooterComponent = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* 品牌介紹 */}
        <div className="footer-section">
          <h3 className="footer-logo">電商平台</h3>
          <p className="footer-desc">
            練習全端用的專案，使用React+Express.js+Mongodb+TypeScript製作，提供高品質、多元化的商品選擇。
          </p>
        </div>

        {/* 快速連結 */}
        <div className="footer-section">
          <h4>服務項目</h4>
          <ul>
            <li><a href="/">首頁</a></li>
            <li><a href="/item">所有商品</a></li>
            <li><a href="/cart">我的購物車</a></li>
          </ul>
        </div>

        {/* 幫助與支援 */}
        <div className="footer-section">
          <h4>幫助與支援</h4>
          <ul>
            <li><a href="#">退換貨政策</a></li>
            <li><a href="#">常見問題 FAQ</a></li>
            <li><a href="#">隱私權聲明</a></li>
            <li><a href="#">聯繫我們</a></li>
          </ul>
        </div>

        {/* 聯絡資訊 */}
        <div className="footer-section">
          <h4>聯繫我們</h4>
          <p>Email: support@gmail.com</p>
          <p>電話: (02) 2345-6789</p>
          <p>地址: </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 電商平台 All rights reserved.</p>
      </div>
    </footer>
  );
};

export default FooterComponent;