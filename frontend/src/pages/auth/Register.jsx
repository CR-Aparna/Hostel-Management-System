import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./Register.css";

function Register() {
  const [form, setForm] = useState({
  name: "",
  email: "",
  phone: "",
  department: "",
  year: "",
  username: "",
  password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/student-management/register", form);
      alert("Registration successful. Wait for admin approval.");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit}>
        <h2>Student Registration</h2>

        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
        <input name="department" placeholder="Department" onChange={handleChange} required />
        <input name="year" type="number" placeholder="Current Semester" onChange={handleChange} required />
        <input name="username" placeholder="Username" onChange={handleChange} required/>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
