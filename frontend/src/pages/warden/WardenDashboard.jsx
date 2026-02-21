import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import "../../components/Dashboard.css";
import "../../components/Navbar.css";
import { useNavigate } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";

function WardenDashboard() {

const navigate = useNavigate();

  return (
    <>
      <Navbar title="Warden Dashboard" />

      <div className="dashboard-container">
        <h2>Welcome 👋</h2>

        <div className="card-grid">
          <DashboardCard 
            title="Room Management"
            description="View Room and Allocation details"
            onClick={() => navigate("/warden/roommanagementdashboard")}
          />
          <DashboardCard
            title="Meal Management"
            description="Meal Details"
          />
          <DashboardCard
            title="Maintenance Management"
            description="Approve and track maintenance complaints"
          />
        </div>
      </div>
      <Outlet/>
    </>
  );
}

export default WardenDashboard;

