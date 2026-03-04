import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import "../../components/Dashboard.css";
import "../../components/Navbar.css";
import { useNavigate} from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";

function StudentDashboard() {
  const [invoices, setInvoices] = useState([]);
  

useEffect(() => {
  fetchInvoices();
}, []);

const fetchInvoices = async () => {
  const res = await axiosInstance.get("/payment-management/student/invoices");
  setInvoices(res.data);
  };

  const overdueInvoices = invoices.filter(inv => inv.is_overdue);

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
            title="Room Management"
            description="Room details,room change requests,vacate requests"
            onClick={() => navigate("/student/roommanagement")}
          />
          <DashboardCard
            title="Meal Details"
            description="Set your meal preferences view meal plans and get tokens"
            onClick={() => navigate("/student/mealmanagement")}
          />
          <DashboardCard
            title="Fee Management"
            description="View Fee details and make payments"
            onClick={() => navigate("/student/fee-management")}
          />
        </div>
        <div>
      {overdueInvoices.length > 0 && (
      <div style={{ color: "red", fontWeight: "bold" }}>
        ⚠️ You have overdue invoice(s). Please pay immediately.
      </div>
      )}
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