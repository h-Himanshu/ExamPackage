import { useState } from "react";
import "./login.css";
// import logo from '../../../../public/images/logo.png'
import { useNavigate } from "react-router-dom";

const Login = () => {
  //login credentials
  const [loginCredential, setLoginCredential] = useState({
    username: "",
    password: "",
  });

  const navigation = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/API/login`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginCredential),
    }).then((res) => {
      if (res.ok) {
        console.log(res);
        if (loginCredential.username == "admin") {
          navigation("/admin");
        } else {
          navigation(`/teacher/${loginCredential.username}`);
        }
      } else alert("Username/Password is wrong!!");
    });
  };

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setLoginCredential((prev) => {
      return { ...prev, [id]: value };
    });
  };

  return (
    <>
      <div className="login-wraper">
        <div className="login-logo-wraper">
          <img src="/images/logo.png" alt="logo" />
        </div>
        <h3>Welcome to Exam Copy Managment System</h3>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            id="username"
            className="login-input"
            type="text"
            placeholder="Username"
            onChange={(e) => handleChange(e)}
          />
          <input
            id="password"
            className="login-input"
            type="password"
            placeholder="Password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
