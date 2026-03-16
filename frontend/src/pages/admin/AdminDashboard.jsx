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

function AdminDashboard() {

const navigate = useNavigate();

  return (
    <>
      <Navbar title="Admin Dashboard" />

      <div className="dashboard-container">
        <h2>Welcome 👋</h2>

        <div className="card-grid">
          <DashboardCard 
            title=" Student Management"
            description="View Student Details and Approve Requests"
            onClick={() => navigate("/admin/dashboard/studentmanagementdashboard")}
          />
          <DashboardCard
            title="Room Vacate Requests"
            description="Deallocate and Vacate Students"
            onClick={() => navigate("/admin/dashboard/deallocation-approvals")}
          />
          <DashboardCard
            title="Meal Summary"
            description="View Meal Summary for the month"
            onClick={() => navigate("/admin/dashboard/meal-summary")}
          />
          <DashboardCard
            title="Pending Invoices"
            description="View Pending Payment Invoices"
            onClick={() => navigate("/admin/dashboard/pending-invoices")}
          />
          <DashboardCard
            title="Maintenence Management"
            description="Approve and track maintenance complaints"
            onClick={() => navigate("/admin/maintenance")}
          />
          <DashboardCard
            title="Staff and warden Management"
            description="Manage warden and maintenance staffs"
            onClick={() => navigate("/admin/warden-and-staff")}
          />
        </div>
      </div>
      <Outlet/>
    </>
  );
}

export default AdminDashboard;

