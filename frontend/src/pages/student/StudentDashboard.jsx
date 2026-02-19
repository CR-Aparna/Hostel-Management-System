import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import "../../components/Dashboard.css";
import "../../components/Navbar.css";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {

const navigate = useNavigate();

  return (
    <>
      <Navbar title="Student Dashboard" />

      <div className="dashboard-container">
        <h2>Welcome 👋</h2>

        <div className="card-grid">
          <DashboardCard 
            title="My Profile"
            description="View your personal and academic details"
            onClick={() => navigate("/student/myprofile")}
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

/*import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import "../../components/Dashboard.css";
import "../../components/Navbar.css";
import { Link, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function StudentDashboard() {

  const navigate = useNavigate();

  return (
    <div style={{ display: "flex" }}>
      
      
      <div style={{ width: "220px", padding: "20px", background: "#f3f4f6" }}>
        <h3>Admin</h3>

        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <Link to="/student/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="pending">
              Student Approvals
            </Link>
          </li>
          <li>
            <Link to="view-student">View Student Details</Link>
          </li>
        </ul>
      </div>

      //{/* Content *///}
      /*<div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>

    </div>
  );
}

export default StudentDashboard; */