import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import "../../components/Dashboard.css";
import "../../components/Navbar.css";
import { useNavigate } from "react-router-dom";

function PaymentDashboard() {

const navigate = useNavigate();

  return (
    <>
      <Navbar title="Payment Dashboard" />

      <div className="dashboard-container">
        <h4>View Your Payment Details and make payments 💵</h4>

        <div className="card-grid">
          <DashboardCard 
            title="Payment History"
            description="View your payment History"
            onClick={() => navigate("/student/payment-history")}
          />
          <DashboardCard
            title="Pending Payments"
            description="Make your pending payments"
            onClick={() => navigate("/student/pending-payments")}
          />
         </div>
      </div>
    </>
  );
} 

export default PaymentDashboard;