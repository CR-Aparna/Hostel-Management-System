import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import "../../components/Dashboard.css";
import { useNavigate ,Link, Outlet} from "react-router-dom";
import { DoorOpen,UserMinus } from 'lucide-react';
import React from "react";
import { BackButton,DashboardButton } from "../../components/common/NavButtons";
import { useCounters } from "../../components/Hooks/useCounters";


function AdminRoomManagementDashboard() {

const navigate = useNavigate();
const { counters } = useCounters();

//onClick={() => navigate("/admin/dashboard/manage-rooms")},Manage Rooms,View and manage room details, availability.
//onClick={() => navigate("/admin/dashboard/deallocation-approvals")}, Deallocation Requests,View and manage student deallocation requests.

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
        

        {/* Card 1: Manage Rooms */}
        <DashboardCard
              icon={<DoorOpen size={24} />}
              title="Manage Rooms"
              description="View and manage room details, availability."
              onClick={() => navigate("/admin/dashboard/manage-rooms")}
            />

        {/* Card 2: Deallocation Requests */}
        <DashboardCard
              icon={<UserMinus size={24} />}
              title="Deallocation Requests"
              description="View and manage student deallocation requests."
              onClick={() => navigate("/admin/dashboard/deallocation-approvals")}
              badgeCount={counters.pending_deallocations}
            />

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