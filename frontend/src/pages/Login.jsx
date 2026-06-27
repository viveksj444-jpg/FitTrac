import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } =
    useContext(AuthContext);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res =
        await API.post(
          "/auth/login",
          formData
        );

      login(res.data.token);

      alert("Login Successful");

      navigate("/dashboard");
    } catch (err) {
      alert(
        err?.response?.data
          ?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <button type="submit">
          Login
        </button>
      </form>

      <br />

      <Link to="/signup">
        Create Account
      </Link>
    </div>
  );
};

export default Login;