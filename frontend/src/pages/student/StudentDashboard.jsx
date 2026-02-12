import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import "../../components/Dashboard.css";
import "../../components/Navbar.css";

function StudentDashboard() {
  return (
    <>
      <Navbar title="Student Dashboard" />

      <div className="dashboard-container">
        <h2>Welcome 👋</h2>

        <div className="card-grid">
          <DashboardCard
            title="My Profile"
            description="View your personal and academic details"
          />
          <DashboardCard
            title="Room Details"
            description="Check your allocated room information"
          />
          <DashboardCard
            title="Complaints"
            description="Raise and track maintenance complaints"
          />
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;