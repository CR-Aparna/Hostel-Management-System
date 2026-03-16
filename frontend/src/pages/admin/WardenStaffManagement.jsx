import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./WardenStaffManagement.css";

const WardenStaffManagement = () => {
  const [activeTab, setActiveTab] = useState("warden");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Separate states for different data structures
  const [wardenData, setWardenData] = useState({
    name: "", username: "", email: "", password: "", phone: "", gender: "Male"
  });

  const [staffData, setStaffData] = useState({
    name: "", category: "Plumbing", phone: "", email: "",username:"",password:""
  });

  const handleWardenChange = (e) => setWardenData({ ...wardenData, [e.target.name]: e.target.value });
  const handleStaffChange = (e) => setStaffData({ ...staffData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (activeTab === "warden") {
        await axiosInstance.post("/user-management/create-warden", wardenData);
        setWardenData({ name: "", username: "", email: "", password: "", phone: "", gender: "Male" });
      } else {
        await axiosInstance.post("/user-management/add-staff", staffData);
        setStaffData({ name: "", category: "Plumbing", phone: "", email: "" });
      }
      setMessage({ type: "success", text: `${activeTab === 'warden' ? 'Warden' : 'Staff'} created successfully!` });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.detail || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mgmt-container">
      <div className="mgmt-card">
        <div className="tab-header">
          <button className={activeTab === "warden" ? "active" : ""} onClick={() => {setActiveTab("warden"); setMessage({type:"",text:""})}}>Manage Warden</button>
          <button className={activeTab === "staff" ? "active" : ""} onClick={() => {setActiveTab("staff"); setMessage({type:"",text:""})}}>Manage Staff</button>
        </div>

        <h2>{activeTab === "warden" ? "Create Warden Account" : "Register Maintenance Staff"}</h2>
        
        {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit} className="mgmt-form">
          {activeTab === "warden" ? (
            <div className="form-grid">
              <input type="text" name="name" placeholder="Full Name" value={wardenData.name} onChange={handleWardenChange} required />
              <input type="text" name="username" placeholder="Username (for login)" value={wardenData.username} onChange={handleWardenChange} required />
              <input type="email" name="email" placeholder="Email Address" value={wardenData.email} onChange={handleWardenChange} required />
              <input type="password" name="password" placeholder="Password" value={wardenData.password} onChange={handleWardenChange} required />
              <input type="tel" name="phone" placeholder="Phone Number" value={wardenData.phone} onChange={handleWardenChange} required />
              <select name="gender" value={wardenData.gender} onChange={handleWardenChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          ) : (
            <div className="form-grid">
              <input type="text" name="name" placeholder="Staff Name" value={staffData.name} onChange={handleStaffChange} required />
              <select name="category" value={staffData.category} onChange={handleStaffChange}>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Maintenance Technician">Maintenance Technician</option>
              </select>
              <input type="tel" name="phone" placeholder="Phone Number" value={staffData.phone} onChange={handleStaffChange} required />
              <input type="email" name="email" placeholder="Email Address" value={staffData.email} onChange={handleStaffChange} required />
              <input type="text" name="username" placeholder="Username" value={staffData.username} onChange={handleStaffChange} required />
              <input type="password" name="password" placeholder="Password" value={staffData.password} onChange={handleStaffChange} required />
            </div>
          )}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Processing..." : `Register ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WardenStaffManagement;