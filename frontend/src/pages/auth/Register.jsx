import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./Register.css";

function Register() {
  const [form, setForm] = useState({
  name: "",
  email: "",
  phone: "",
  department: "",
  semester: "",
  username: "",
  password: "",
  admission_number: "",
  gender: "",
  course: "",
  guardian_name: "",
  guardian_phone: "",
  guardian_relation: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
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

        <h4>Basic Informations</h4>

        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
        <input name="department" placeholder="Department" onChange={handleChange} required />
        <input name ="admission_number" placeholder="Admission Number" onChange={handleChange} required />
        <input name="gender" placeholder="Gender" onChange={handleChange} required />
        <input name="course" placeholder="Course" onChange={handleChange} required />
        <input name="semester" type="number" placeholder="Current Semester" onChange={handleChange} required />
        <input name="username" placeholder="Username" onChange={handleChange} required/>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

        <h4>Guardian Informations</h4>

        <input name="guardian_name" placeholder="Guardian Name" onChange={handleChange} required />
        <input name="guardian_phone" placeholder="Guardian Phone Number" onChange={handleChange} required />
        <input name="guardian_relation" placeholder="Guardian Relation" onChange={handleChange} required />

        <h4>Address Informations</h4>

        <input name="address" placeholder="Address" onChange={handleChange} required />
        <input name="city" placeholder="City" onChange={handleChange} required />
        <input name="state" placeholder="State" onChange={handleChange} required />
        <input name="pincode" placeholder="Pincode" onChange={handleChange} required />
        

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
