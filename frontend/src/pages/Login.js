import React, { useState, useEffect } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from '../store/actions/authActions';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Check if user is already remembered (cookie/session)
  useEffect(() => {
    axios.get("http://localhost:5000/api/current-user", { withCredentials: true })
      .then(res => {
        if (res.data.user) {
          dispatch(login(res.data.user));
          navigate("/dashboard");
        }
      })
      .catch(() => {
        // not logged in, ignore
      });
  }, [dispatch, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/login",
        { email, password, role },
        { withCredentials: true } // ✅ important for cookies
      );

      if (res.data.success) {
        localStorage.setItem("userId", res.data.user.user_id);
  localStorage.setItem("userName", res.data.user.name);
        dispatch(login(res.data.user));
        alert("Login Successfully");
        navigate("/dashboard");
      } else {
        alert(res.data.message || "Invalid credentials");
      }
    } catch (error) {
      alert("Error logging in user");
    }
  };

  return (
    <div className="login-container">
      <div className="register-box">
        <h2>Login 🌱</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <select
            value={role}
            onChange={(e)=>setRole(e.target.value)}
            className="role-select"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account?{" "}
          <span className="navigate" onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
