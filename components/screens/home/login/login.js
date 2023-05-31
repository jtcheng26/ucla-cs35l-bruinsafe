import React from "react";
import "./login.css";
import personImage from "../../../../assets/User_alt_fill.png";
import lock from "../../../../assets/lock.png";

const Login = () => {
  return (
    <div className="login-container">
      <h1 className="login-logo">BruinSafe</h1>
      <button className="login-box1">username</button>
      <img className="login-person" src={personImage} alt="Person" />
      <button className="login-box2">password</button>
      <img className="login-lock" src={lock} alt="Lock" />
      <button className="login-submit">submit</button>
    </div>
  );
};

export default Login;
