import React from 'react';
import { useNavigate, Outlet } from "react-router-dom";
import { 
  UserPlus, 
  DoorOpen, 
  Utensils, 
  Wrench, 
  LayoutDashboard,
  Check
} from "lucide-react";
import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard"; // Import your reusable component

function WardenDashboard() {
  const navigate = useNavigate();

  // Define the menu structure
  const menuItems = [
    {
      title: "New Student Registrations",
      description: "Review and approve new student registration requests.",
      path: "/warden/new-student-registrations",
      icon: <UserPlus size={24} />
    },
    {
      title: "Room Management",
      description: "Monitor room availability and student allocation details.",
      path: "/warden/roommanagementdashboard",
      icon: <DoorOpen size={24} />
    },
    {
      title: "Meal Management",
      description: "Track student meal consumption and daily kitchen updates.",
      path: "/warden/mealmanagementdashboard",
      icon: <Utensils size={24} />
    },
    {
      title: "Maintenance",
      description: "Approve and track repair requests and complaints.",
      path: "/warden/maintenance-complaints",
      icon: <Wrench size={24} />
    },
    {
      title: "Attendance",
      description: "Mark and view student attendance records.",
      path: "/warden/attendance",
      icon: <Check size={24} />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title="Warden Dashboard" />

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 text-white">
              <LayoutDashboard size={24} />
            </div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900">
              Welcome 👋
            </h2>
          </div>
          <p className="text-slate-500 font-medium text-lg ml-1">
            Overview of your daily hostel management operations.
          </p>
        </header>

        {/* Using your Reusable DashboardCard in a Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, index) => (
            <DashboardCard 
              key={index}
              title={item.title}
              description={item.description}
              icon={item.icon}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>

        {/* This allows nested routes (like room management) to render below the cards if needed */}
        <div className="mt-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default WardenDashboard;

