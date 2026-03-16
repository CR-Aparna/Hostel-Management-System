import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./MaintenanceAndComplaints.css";

const MaintenanceAndComplaints = () => {
  const [activeTab, setActiveTab] = useState("maintenance");
  const [history, setHistory] = useState([]);
  
  // MATCHING YOUR SCHEMAS EXACTLY
  const [maintData, setMaintData] = useState({ 
    description: "", 
    category: "Plumbing", 
    room_number: "", 
    //is_emergency: false 
  });

  const [complaintData, setComplaintData] = useState({ 
    subject: "", 
    description: "", 
    issue_type: "Mess", 
    //is_anonymous: false 
  });

  useEffect(() => {
    fetchHistory();
  }, [activeTab]);

  const fetchHistory = async () => {
    try {
      const endpoint = activeTab === "maintenance" 
        ? "/maintenance_and_complaint/my-maintenance" 
        : "/maintenance_and_complaint/my-complaints";
      const res = await axiosInstance.get(endpoint);
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === "maintenance") {
        await axiosInstance.post("/maintenance_and_complaint/submit", maintData);
        setMaintData({ description: "", category: "Plumbing", room_number: "", is_emergency: false });
      } else {
        await axiosInstance.post("/maintenance_and_complaint/file", complaintData);
        setComplaintData({ subject: "", description: "", issue_type: "Mess", is_anonymous: false });
      }
      alert("Submitted successfully!");
      fetchHistory();
    } catch (err) {
      alert(err.response?.data?.detail || "Submission failed");
    }
  };

  return (
    <div className="student-mgmt-container">
      <div className="tab-switcher">
        <button className={activeTab === "maintenance" ? "active" : ""} onClick={() => setActiveTab("maintenance")}>Maintenance</button>
        <button className={activeTab === "complaint" ? "active" : ""} onClick={() => setActiveTab("complaint")}>Complaints</button>
      </div>

      {/*Wrapper*/}
      <div className="main-content">
      <div className="form-card">
        <h3>{activeTab === "maintenance" ? "New Repair Request" : "New Grievance"}</h3>
        <form onSubmit={handleSubmit}>
          {activeTab === "maintenance" ? (
            <>
              <div className="form-row">
                <select value={maintData.category} onChange={(e) => setMaintData({...maintData, category: e.target.value})}>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Others">Others</option>
                </select>
                <input type="text" placeholder="Room No." value={maintData.room_number} onChange={(e) => setMaintData({...maintData, room_number: e.target.value})} required />
              </div>
              <textarea placeholder="Describe the problem (e.g. Tap leaking in washbasin)..." value={maintData.description} onChange={(e) => setMaintData({...maintData, description: e.target.value})} required />
            </>
          ) : (
            <>
              <input type="text" placeholder="Complaint Subject" value={complaintData.subject} onChange={(e) => setComplaintData({...complaintData, subject: e.target.value})} required />
              <select value={complaintData.issue_type} onChange={(e) => setComplaintData({...complaintData, issue_type: e.target.value})}>
                <option value="Mess">Mess / Food</option>
                <option value="Security">Security</option>
                <option value="Discipline">Discipline</option>
              </select>
              <textarea placeholder="Provide details..." value={complaintData.description} onChange={(e) => setComplaintData({...complaintData, description: e.target.value})} required />
            </>
          )}
          <button type="submit" className="submit-btn">Submit to Warden</button>
        </form>
      </div>

      <div className="history-section">
        <h3>My Recent Requests</h3>
        <div className="list-container">
          {history.length > 0 ?(
          history.map(item => (
            <div key={item.id} className="history-item">
              <div className="item-main">
                <strong>{activeTab === "maintenance" ? item.category : item.subject}</strong>
                <p>{item.description}</p>
              </div>
              <div className="item-meta">
                <span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span>
                <small>{new Date(item.created_at).toLocaleDateString()}</small>
              </div>
            </div>
          ))) : (
            <p className="no-data">No history found</p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default MaintenanceAndComplaints;