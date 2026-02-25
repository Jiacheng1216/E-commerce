import React from "react";
import "./HomeComponent.css";
import arrow from "../Assets/arrow.png";
import shoppingBag from "../Assets/ShoppingBag.png";
import { Link } from "react-router-dom";

const HomeComponent = ({ currentUser, setCurrentUser }) => {
  return (
    <div className="home">
      <main>
        <div className="main-left">
          <h1>開始使用</h1>
          <p>你可以在這個網站上刊登您的商品，或是購買別人刊登的商品。</p>
          {!currentUser && (
            <Link to="/Login">
              <button className="home-btn">
                <div>立即登入開始使用</div>
                <img src={arrow} alt=""></img>
              </button>
            </Link>
          )}
          {currentUser && (
            <Link to="/item">
              <button className="home-btn">
                <div>開始購買商品</div>
                <img src={arrow} alt=""></img>
              </button>
            </Link>
          )}
        </div>
        <div className="main-right">
          <img src={shoppingBag}></img>
        </div>
      </main>
    </div>
  );
};

export default HomeComponent;
