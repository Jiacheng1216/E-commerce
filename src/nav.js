import React from "react";
import { Link } from "react-router-dom";
import logo from "./logo.png";
import "./styles/style.css";

export const nav = () => {
  return (
    <div>
      <nav className="nav">
        <img src={logo} alt="無法顯示" width={"100px"} className="logo" />
        <input className="search"></input>
        <button className="searchbtn">搜尋</button>
        <text className="reg">註冊</text>
        <text className="login">登入</text>
      </nav>
    </div>
  );
};

export default nav;
