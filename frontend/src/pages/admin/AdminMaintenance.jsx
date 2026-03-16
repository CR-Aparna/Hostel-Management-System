import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./AdminMaintenance.css";

const AdminMaintenance = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState("maintenance"); // "maintenance" or "complaint"
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEscalatedItems();
  }, [viewMode]);

  const fetchEscalatedItems = async () => {
    setLoading(true);
    try {
      const endpoint = viewMode === "maintenance" 
        ? "/maintenance_and_complaint/warden_approved/maintenances" 
        : "/maintenance_and_complaint/escalated/complaints";
      
      const response = await axiosInstance.get(endpoint);
      setItems(response.data);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error fetching escalated items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminDecision = async (id, decisionData) => {
    try {
      // Assuming you have a unified or separate process endpoint for Admin
      const url = viewMode === "maintenance" 
        ? `/maintenance_and_complaint/${id}/process` // Reuse process endpoint
        : `/maintenance_and_complaint/${id}/resolve`;
      
      await axiosInstance.patch(url, decisionData);
      alert("Decision recorded successfully");
      fetchEscalatedItems();
    } catch (error) {
      alert("Failed to process request");
    }
  };

  return (
    <div className="admin-portal">
      <header className="admin-header">
        <div className="title-group">
          <h1>Admin Control Center</h1>
          <p>Reviewing items Escalated by Warden</p>
        </div>
        <div className="toggle-group">
          <button className={viewMode === "maintenance" ? "active" : ""} 
                  onClick={() => setViewMode("maintenance")}>Maintenances</button>
          <button className={viewMode === "complaint" ? "active" : ""} 
                  onClick={() => setViewMode("complaint")}>Complaints</button>
        </div>
      </header>

      <div className="admin-main">
        {/* List of Escalated Items */}
        <section className="admin-list">
          {loading ? <p>Loading...</p> : items.length === 0 ? <p className="empty">No escalated items.</p> : (
            items.map(item => (
              <div 
                key={item.id} 
                className={`admin-item-card ${selectedItem?.id === item.id ? 'active' : ''}`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="item-badge">Room {item.room_number}</div>
                <h4>{item.category || item.issue_type}</h4>
                <p>{item.description.substring(0, 30)}...</p>
              </div>
            ))
          )}
        </section>

        {/* Action Panel */}
        <section className="admin-detail">
          {selectedItem ? (
            <div className="decision-box">
              <h3>Review Details</h3>
              <div className="info-grid">
                <span><strong>From:</strong> Room {selectedItem.room_number}</span>
                <span><strong>Date:</strong> {new Date(selectedItem.created_at).toLocaleDateString()}</span>
              </div>
              <div className="desc-text">
                <strong>Description:</strong>
                <p>{selectedItem.description}</p>
              </div>

              <div className="admin-actions">
                {viewMode === "maintenance" ? (
                  <>
                    <button className="approve-btn" onClick={() => {
                        const staff = prompt("Assign specialized staff/vendor:");
                        if(staff) handleAdminDecision(selectedItem.id, { 
                            decision: "Assigned", 
                            is_minor_or_emergency: false, 
                            assigned_staff: staff // Or an ID if using staffList
                        });
                    }}>Final Approve & Assign</button>
                    <button className="reject-btn" onClick={() => handleAdminDecision(selectedItem.id, { decision: "Rejected", remarks: "Budget Not Approved" })}>Reject Request</button>
                  </>
                ) : (
                  <>
                    <textarea id="adminNote" placeholder="Enter final admin resolution notes..."></textarea>
                    <button className="approve-btn" onClick={() => {
                        const note = document.getElementById("adminNote").value;
                        handleAdminDecision(selectedItem.id, { status: "Resolved", action_taken: note });
                    }}>Resolve as Admin</button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="placeholder">Select an item to take final action</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminMaintenance;