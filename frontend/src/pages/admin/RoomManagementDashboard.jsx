import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import "../../components/Dashboard.css";
import { useNavigate ,Link, Outlet} from "react-router-dom";
import { UserPlus, Search, ArrowRight, GraduationCap } from 'lucide-react';
import React from "react";
import { BackButton,DashboardButton } from "../../components/common/NavButtons";

function AdminRoomManagementDashboard() {

const navigate = useNavigate();

  return (
  <div className="min-h-screen bg-slate-50">
    <Navbar title="Room Management Dashboard" />

    <main className="max-w-6xl mx-auto p-6 md:p-10">
      <div className="flex items-center gap-3 mb-8">
          <BackButton />
          <DashboardButton />
        </div>

      {/* Welcome Header */}
      <header className="mb-10">
        <div className="flex items-center gap-4 mb-2">
          <p className="text-slate-500 font-medium ml-1">
          Manage room details, availability, and student deallocations.
        </p>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Card 1: Pending Approvals */}
        <div 
          onClick={() => navigate("/admin/dashboard/manage-rooms")}
          className="group cursor-pointer relative overflow-hidden bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-colors"></div>
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-300">
              <UserPlus size={28} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Manage Rooms
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
              View and manage room details, availability.
            </p>
            <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
              Review Queue <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Card 2: View Student */}
        <div 
          onClick={() => navigate("/admin/dashboard/deallocation-approvals")}
          className="group cursor-pointer relative overflow-hidden bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-slate-50 rounded-full blur-3xl group-hover:bg-slate-100 transition-colors"></div>
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform duration-300">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Deallocation Requests
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
              View and manage student deallocation requests.
            </p>
            <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-widest">
              Review Queue <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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

export default AdminRoomManagementDashboard