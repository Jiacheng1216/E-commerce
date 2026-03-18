import React, { useState } from "react";
import AuthService from "../../services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import "./login-component.css";

const LoginComponent = ({ currentUser, setCurrentUser }) => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    // 阻止瀏覽器刷新
    event.preventDefault();
    handleLogin();
  };

  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      let response = await AuthService.login(email, password);
      localStorage.setItem("user", JSON.stringify(response.data));
      window.alert("登入成功，您現在將被重新導向個人資料頁面");
      setCurrentUser(AuthService.getCurrentUser());
      navigate("/profile");
    } catch (e) {
      setMessage(e.response.data);
    }
  };

  return (
    <div className="loginPage">
      <form className="loginForm" onSubmit={handleSubmit}>
        {message && <div className="errorMessage">{message}</div>}
        <h1>登入</h1>
        <input
          onChange={handleEmail}
          type="email"
          className="loginPage-input"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Email"
        />

        <input
          onChange={handlePassword}
          type="password"
          className="loginPage-input"
          id="exampleInputPassword1"
          placeholder="Password"
        />

        <p className="form-check-label">
          沒有帳戶嗎?<Link to={"/register"}>註冊</Link>一個
        </p>

        <button className="loginPage-loginBtn" type="submit">
          登入
        </button>
      </form>
    </div>
  );
};

export default LoginComponent;
