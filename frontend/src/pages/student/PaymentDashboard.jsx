import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import "../../components/Dashboard.css";
import "../../components/Navbar.css";
import { useNavigate } from "react-router-dom";
import { BackButton,DashboardButton } from "../../components/common/NavButtons";
import { History,IndianRupeeIcon } from "lucide-react";

function PaymentDashboard() {

const navigate = useNavigate();

  return (
    <>
      <Navbar title="Payment Dashboard" />

      <div className="dashboard-container">
        <div className="flex gap-3">
          <BackButton />
          <DashboardButton />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">View Your Payment Details and make payments 💵</h2>

        <div className="card-grid">
          <DashboardCard 
            icon={<History/>}
            title="Payment History"
            description="View your payment History"
            onClick={() => navigate("/student/payment-history")}
          />
          <DashboardCard
            icon={<IndianRupeeIcon/>}
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