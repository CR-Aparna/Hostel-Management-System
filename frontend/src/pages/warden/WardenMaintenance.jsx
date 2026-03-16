import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./WardenMaintenance.css";

const WardenMaintenance = () => {
  const [items, setItems] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState("maintenance");
  const [filter, setFilter] = useState("Pending");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    fetchStaff();
  }, [viewMode, filter]);

  const fetchStaff = async () => {
    try {
      const res = await axiosInstance.get("/maintenance_and_complaint/staff");
      setStaffList(res.data);
    } catch (err) { console.error("Staff fetch error:", err); }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = viewMode === "maintenance" 
        ? "/maintenance_and_complaint/all" 
        : "/maintenance_and_complaint/all-complaints";
      const response = await axiosInstance.get(endpoint, { params: { status: filter } });
      setItems(response.data);
      setSelectedItem(null); // Reset detail view on filter change
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionData) => {
    try {
      const url = viewMode === "maintenance" 
        ? `/maintenance_and_complaint/${selectedItem.id}/process`
        : `/maintenance_and_complaint/${selectedItem.id}/resolve`;
      
      await axiosInstance.patch(url, actionData);
      fetchData();
    } catch (error) {
      alert("Action failed. Please check inputs.");
    }
  };

  return (
    <div className="admin-dashboard">
      {/* 1. Sidebar Control Panel */}
      <aside className="dashboard-sidebar">
        <div className="branding">
          <h2>Warden Portal</h2>
        </div>
        
        <nav className="view-nav">
          <button className={viewMode === "maintenance" ? "active" : ""} 
                  onClick={() => setViewMode("maintenance")}>🔧 Maintenance</button>
          <button className={viewMode === "complaint" ? "active" : ""} 
                  onClick={() => setViewMode("complaint")}>📢 Complaints</button>
        </nav>

        <div className="filter-section">
          <label>Status Filter</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="Pending">New Requests</option>
            <option value="Assigned">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </aside>

      {/* 2. List View */}
      <main className="content-area">
        <section className="list-pane">
          <header className="pane-header">
            <h3>{viewMode.toUpperCase()} ({items.length})</h3>
          </header>
          <div className="scroll-list">
            {loading ? <p>Loading...</p> : items.map(item => (
              <div 
                key={item.id} 
                className={`list-item ${selectedItem?.id === item.id ? "selected" : ""} ${item.is_emergency ? "emergency" : ""}`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="item-info">
                  <span className="room-badge">Room {item.room_number || "N/A"}</span>
                  <p className="item-desc">{item.description.substring(0, 40)}...</p>
                </div>
                <span className="item-date">{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Detail View / Action Pane */}
        <section className="detail-pane">
          {selectedItem ? (
            <div className="detail-card">
              <header>
                <h2>Request Details</h2>
                <span className={`status-pill ${selectedItem.status.toLowerCase()}`}>{selectedItem.status}</span>
              </header>

              <div className="detail-body">
                <p><strong>Category:</strong> {selectedItem.category || selectedItem.issue_type}</p>
                <p><strong>Room Number:</strong> {selectedItem.room_number}</p>
                <div className="full-desc">
                  <strong>Full Description:</strong>
                  <p>{selectedItem.description}</p>
                </div>
              </div>

              {filter === "Pending" && (
                <div className="action-footer">
                  {viewMode === "maintenance" ? (
                    <div className="assign-form">
                      <select id="staffSelect" defaultValue="">
                        <option value="" disabled>Choose Staff Member</option>
                        {staffList.map(s => <option key={s.staff_id} value={s.staff_id}>{s.name} ({s.category})</option>)}
                      </select>
                      <button className="primary-btn" onClick={() => {
                        const sId = document.getElementById("staffSelect").value;
                        if(sId) handleAction({ decision: "Assigned", assigned_staff: parseInt(sId) });
                        else alert("Please select staff");
                      }}>Assign & Start</button>
                      <button className="warn-btn" onClick={() => handleAction({ decision: "Escalated to Admin " })}>Send to Admin</button>
                      <button className="danger-btn" onClick={() => handleAction({ decision: "Reject", remarks: "Invalid" })}>Reject</button>
                    </div>
                  ) : (
                    <div className="resolve-form">
                      <textarea id="resNote" placeholder="Enter resolution notes..."></textarea>
                      <button className="primary-btn" onClick={() => {
                        const note = document.getElementById("resNote").value;
                        if(note) handleAction({ action_taken: note, status: "Resolved" });
                        else alert("Enter notes first");
                      }}>Close Complaint</button>
                      <button className="primary-btn" onClick={() => {
                        handleAction({ status: "Escalated to Admin" });
                      }}>Escalate to Admin</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">Select a request from the list to take action</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default WardenMaintenance;