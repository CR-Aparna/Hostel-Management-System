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
import { Users, DoorOpen, Utensils, FileText, Settings, ShieldCheck } from "lucide-react";

function AdminDashboard() {

const navigate = useNavigate();

  return (
    
      <div className="min-h-screen bg-slate-50 flex">
      {/* Main Content Area */}
      <div className="flex-1">
        <Navbar title="Admin Command Center" />

        <main className="p-8 max-w-7xl mx-auto">
          {/* Welcome Header */}
          <section className="mb-10">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-[2rem] p-10 text-white shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
               <div className="relative z-10">
                 <h2 className="text-4xl font-extrabold mb-2">Welcome Back, 👋</h2>
                 <p className="text-indigo-100 max-w-md">
                   Here's what's happening with the hostel management system today.
                 </p>
               </div>
            </div>
          </section>

          {/* Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DashboardCard 
              icon={<Users />}
              title="Student Management"
              description="Review student details, verify profiles, and approve admission requests."
              onClick={() => navigate("/admin/dashboard/studentmanagementdashboard")}
            />
            <DashboardCard
              icon={<DoorOpen />}
              title="Vacate Requests"
              description="Process room deallocations and manage move-out checkouts."
              onClick={() => navigate("/admin/dashboard/deallocation-approvals")}
            />
            <DashboardCard
              icon={<Utensils />}
              title="Meal Summary"
              description="Daily and monthly mess consumption reports for inventory planning."
              onClick={() => navigate("/admin/dashboard/meal-summary")}
            />
            <DashboardCard
              icon={<FileText />}
              title="Payment Management"
              description="Track unpaid bills, generate monthly invoices, and send reminders."
              onClick={() => navigate("/admin/dashboard/payment-management")}
            />
            <DashboardCard
              icon={<Settings />}
              title="Maintenance"
              description="Review complaints, assign staff, and track repair progress."
              onClick={() => navigate("/admin/maintenance")}
            />
            <DashboardCard
              icon={<ShieldCheck />}
              title="Staff & Wardens"
              description="Manage permissions and duties for hostel staff and wardens."
              onClick={() => navigate("/admin/warden-and-staff")}
            />
          </div>
        </main>
        <Outlet />
      </div>
    </div>

  );
}

export default AdminDashboard;

