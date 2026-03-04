/*import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import "../../components/Dashboard.css";
import "../../components/Navbar.css";
import { Link, Outlet } from "react-router-dom";

function AdminDashboard() {
  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar *//*}
      <div style={{ width: "220px", padding: "20px", background: "#f3f4f6" }}>
        <h3>Admin</h3>

        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="pending">
              Student Approvals
            </Link>
          </li>
          <li>
            <Link to="view-student">View Student Details</Link>
          </li>
          <li>
            <Link to="deallocation-approvals">Room Vacate Requests</Link>
          </li>
          <li>
            <Link to="meal-summary">View Meal Summary</Link>
          </li>
          <li>
            <Link to="pending-invoices">Pending Invoices</Link>
          </li>
        </ul>
      </div>

      {/* Content *//*}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>

    </div>
  );
}

export default AdminDashboard; */


import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import "../../components/Dashboard.css";
import "../../components/Navbar.css";
import { useNavigate } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";

function StudentManagementDashboard() {

const navigate = useNavigate();

  return (
    <>
      <Navbar title="Student Management Dashboard" />

      <div className="dashboard-container">
        <h2>Welcome 👋</h2>

        <div className="card-grid">
          <DashboardCard 
            title="Pending Student Approvals"
            description="Approve New Registrations"
            onClick={() => navigate("/admin/dashboard/pending")}
          />
          <DashboardCard
            title="View Student"
            description="View the details of a particular student"
            onClick={() => navigate("/admin/dashboard/view-student")}
          />
        </div>
      </div>
      <Outlet/>
    </>
  );
}

export default StudentManagementDashboard;

