/*import { useState } from "react";
import { loginUser } from "../../api/auth";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending:",{username,password});  
      const data = await loginUser({ username, password });

      console.log("Response:",data);

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);

      if (data.role === "Student") {
        navigate("/student/dashboard");
      } else if (data.role === "Admin") {
        navigate("/admin/dashboard");
      } else{
        navigate("/warden/dashboard");
      }
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Hostel Management System</h2>
        <p className="subtitle">Login to continue</p>

        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>
        <p style={{ textAlign: "center", marginTop: "10px" }}>
            New student? <a href="/student-management/register">Register here</a>
        </p>
        <p style={{ textAlign: "center", marginTop: "10px" }}>
        <Link to="/forgot-password" style={{ color: "#007bff", textDecoration: "none" }}>
            Forgot Password?
        </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;*/

import { useState } from "react";
import { loginUser } from "../../api/auth";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added for UX
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await loginUser({ username, password });
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);

      if (data.role === "Student") {
        navigate("/student/dashboard");
      } else if (data.role === "Admin") {
        navigate("/admin/dashboard");
      } else if (data.role === "Warden") {
        navigate("/warden/dashboard");
      }else{
        navigate("/staff/dashboard");
      }

    } catch (error) {
      alert("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-box-container">
        {/* Left Side: Visual Branding */}
        <div className="login-visual-side">
          <div className="visual-overlay">
            <div className="branding">
              <span className="logo-icon">🏫</span>
              <h1>Hostel Hub</h1>
            </div>
            <p>Simplifying stay and meal management for modern campus life.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="login-form-side">
          <form className="login-content" onSubmit={handleSubmit}>
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Please enter your credentials to login</p>
            </div>

            <div className="input-field-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-field-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Link to="/forgot-password" title="Recover password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="login-submit-btn" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Login"}
            </button>

            <div className="login-footer">
              <p>
                New student? <Link to="/student-management/register">Register here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;