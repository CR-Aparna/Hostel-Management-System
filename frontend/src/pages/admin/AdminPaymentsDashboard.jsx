import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import "../../components/Dashboard.css";
import "../../components/Navbar.css";
import { useNavigate } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";
import { ShieldCheck, ReceiptIndianRupee} from "lucide-react";
import { BackButton,DashboardButton } from "../../components/common/NavButtons";

function AdminPaymentsDashboard() {

const navigate = useNavigate();

  return (
    
      <div className="min-h-screen bg-slate-50 flex">
        
      {/* Main Content Area */}
      <div className="flex-1">
        <Navbar title="Admin Payments Dashboard" />

        <main className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                  <BackButton />
                  <DashboardButton />
            </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DashboardCard 
              icon={< ReceiptIndianRupee/>}
              title="Invoices"
              description="Review student invoices"
              onClick={() => navigate("/admin/dashboard/invoices")}
            />
            <DashboardCard
              icon={<ShieldCheck />}
              title="Pending Invoices"
              description="Review pending student invoices and generate invoices."
              onClick={() => navigate("/admin/dashboard/pending-invoices")}
            />
            
          </div>
        </main>
        <Outlet />
      </div>
    </div>

  );
}

export default AdminPaymentsDashboard;