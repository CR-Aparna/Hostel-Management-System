import { useState } from "react";
import { loginUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";
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

      </form>
    </div>
  );
}

export default Login;