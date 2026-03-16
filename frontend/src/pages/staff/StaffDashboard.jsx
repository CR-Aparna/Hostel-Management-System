import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {useNavigate} from "react-router-dom";
import "./StaffDashboard.css";


const StaffDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear your auth token
    localStorage.removeItem("user");  // Clear user info
    navigate("/login");               // Redirect to login page
  };

  const fetchMyTasks = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/maintenance_and_complaint/staff/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axiosInstance.patch(`/maintenance_and_complaint/staff/tasks/${taskId}/update-status`, null, {
        params: { new_status: newStatus }
      });
      fetchMyTasks(); // Refresh to show updated status
    } catch (err) {
      alert("Failed to update task status.");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed": return "status-done";
      case "Assigned": return "status-new";
      default: return "status-pending";
    }
  };

  return (
    <div className="staff-portal">
      <header className="staff-header">
        <div className="welcome">
          <h1>My Work Orders</h1>
          <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div className="header-actions">
        <div className="task-count">
          <span>{tasks.filter(t => t.status !== "Completed").length} Active</span>
        </div>
        <button className="logout-icon-btn" onClick={handleLogout} title="Logout">
            Logout 🚪
          </button>
        </div>
      </header>

      <main className="task-container">
        {loading ? (
          <div className="loader">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">🎉 All caught up! No tasks assigned.</div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={`task-item ${task.is_emergency ? "critical" : ""}`}>
              <div className="task-main">
                <div className="task-meta">
                  <span className="room-label">Room {task.room_number}</span>
                  <span className={`status-pill ${getStatusClass(task.status)}`}>{task.status}</span>
                </div>
                <h3>{task.category}</h3>
                <p>{task.description}</p>
              </div>

              <div className="task-actions">
                {task.status === "Assigned" && (
                  <button className="btn-start" onClick={() => updateTaskStatus(task.id, "In Progress")}>
                    ▶ Start Work
                  </button>
                )}
                {task.status === "In Progress" && (
                  <button className="btn-complete" onClick={() => updateTaskStatus(task.id, "Completed")}>
                    ✅ Mark Completed
                  </button>
                )}
                {task.status === "Completed" && (
                  <span className="completion-check">Verified ✓</span>
                )}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default StaffDashboard;