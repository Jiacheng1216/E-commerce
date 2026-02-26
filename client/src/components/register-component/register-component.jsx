import React, { useState } from "react";
import AuthService from "../../services/auth.service";
//重新導向功能
import { Link, useNavigate } from "react-router-dom";
import "./register-component.css";

const RegisterComponent = () => {
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");

  //預處理提交表單時默認提交並導向其他地方
  const handleSubmit = (event) => {
    event.preventDefault();
    handleRegister();
  };

  const navigate = useNavigate();

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleRegister = () => {
    AuthService.register(email, username, password)
      .then(() => {
        window.alert("註冊成功，您現在將被導向到登入頁面");
        navigate("/login");
      })
      .catch((e) => {
        setMessage(e.response.data);
      });
  };

  return (
    <div className="registerPage">
      <form className="registerForm" onSubmit={handleSubmit}>
        {message && <div className="errorMessage">{message}</div>}

        <h1>註冊</h1>
        <input
          onChange={handleEmail}
          type="email"
          className="register-input"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Email"
        />

        <input
          onChange={handleUsername}
          type="text"
          className="register-input"
          id="exampleInputUsername"
          placeholder="Username"
        />

        <input
          onChange={handlePassword}
          type="password"
          className="register-input"
          id="exampleInputPassword1"
          placeholder="Password"
        />

        <p>
          已經有帳號了？立即<Link to={"/login"}>登入</Link>
        </p>

        <button type="submit" className="register-btn">
          註冊
        </button>
      </form>
    </div>
  );
};

export default RegisterComponent;
