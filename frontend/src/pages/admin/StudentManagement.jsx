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
import { useNavigate ,Link, Outlet} from "react-router-dom";
import { UserPlus, Search, ArrowRight, GraduationCap } from 'lucide-react';
import React from "react";

function StudentManagementDashboard() {

const navigate = useNavigate();

  return (
  <div className="min-h-screen bg-slate-50">
    <Navbar title="Student Management Dashboard" />

    <main className="max-w-6xl mx-auto p-6 md:p-10">
      {/* Welcome Header */}
      <header className="mb-10">
        <div className="flex items-center gap-4 mb-2">
          <p className="text-slate-500 font-medium ml-1">
          Manage registrations and student records from one central hub.
        </p>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Card 1: Pending Approvals */}
        <div 
          onClick={() => navigate("/admin/dashboard/pending")}
          className="group cursor-pointer relative overflow-hidden bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-colors"></div>
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-300">
              <UserPlus size={28} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Pending Student Approvals
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
              Review and approve new registrations. Ensure all student documents and details are verified before granting access.
            </p>
            <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
              Review Queue <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Card 2: View Student */}
        <div 
          onClick={() => navigate("/admin/dashboard/view-student")}
          className="group cursor-pointer relative overflow-hidden bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-slate-50 rounded-full blur-3xl group-hover:bg-slate-100 transition-colors"></div>
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform duration-300">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              View Student Records
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
              Search for specific students to view their full profile, payment history, room allocation, and current status.
            </p>
            <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-widest">
              Search Database <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

      </div>

      {/* Nested Route Content */}
      <div className="mt-12">
        <Outlet />
      </div>
    </main>
  </div>
);
}

export default StudentManagementDashboard;

