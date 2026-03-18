import React from 'react';
import { useNavigate } from "react-router-dom";
import { DoorOpen, UserPlus, UserMinus, ArrowLeftRight, LayoutDashboard } from "lucide-react";
import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import { BackButton, DashboardButton } from "../../components/common/NavButtons";
function RoomManagementDashboard() {
  const navigate = useNavigate();

  const roomModules = [
    {
      title: "Rooms",
      description: "View existing room details, availability, and add new room records.",
      path: "/warden/rooms",
      icon: <DoorOpen size={24} />
    },
    {
      title: "Allocations",
      description: "Assign rooms to newly approved students and manage bedding.",
      path: "/warden/pending-allocations",
      icon: <UserPlus size={24} />
    },
    {
      title: "Deallocations",
      description: "Process student checkout requests and finalize room exits.",
      path: "/warden/pending-deallocations",
      icon: <UserMinus size={24} />
    },
    {
      title: "Change Requests",
      description: "Review, approve, or reject student requests for room swaps.",
      path: "/warden/room-change-requests",
      icon: <ArrowLeftRight size={24} />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title="Rooms Management" />

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        
        {/* Navigation Bar */}
        <div className="flex items-center gap-3 mb-8">
          <BackButton />
          <DashboardButton />
        </div>

        {/* Page Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 text-white">
              <DoorOpen size={24} />
            </div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900">
              Room Operations
            </h2>
          </div>
          <p className="text-slate-500 font-medium text-lg ml-1">
            Manage allocations, room inventory, and student movement requests.
          </p>
        </header>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roomModules.map((module, index) => (
            <DashboardCard
              key={index}
              title={module.title}
              description={module.description}
              icon={module.icon}
              onClick={() => navigate(module.path)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default RoomManagementDashboard;
