
import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import "../../components/Dashboard.css";
import { useNavigate ,Link, Outlet} from "react-router-dom";
import { UserPlus, Search, ArrowRight, GraduationCap } from 'lucide-react';
import React from "react";
import { BackButton,DashboardButton } from "../../components/common/NavButtons";
import { useCounters } from "../../components/Hooks/useCounters";

function StudentManagementDashboard() {

  const navigate = useNavigate();
  const {counters}=useCounters();

  return (
  <div className="min-h-screen bg-slate-50">
    <Navbar title="Student Management Dashboard" />

    <main className="max-w-6xl mx-auto p-6 md:p-10">
      <div className="flex items-center gap-3 mb-8">
          <BackButton />
          <DashboardButton />
        </div>

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

        {/* Card 1: Pending Student Approvals */}
        <DashboardCard
              icon={<UserPlus />}
              title="Pending Student Approvals"
              description="Review and approve new registrations. Ensure all student documents and details are verified before granting access."
              onClick={() => navigate("/admin/dashboard/pending")}
              badgeCount={counters.pending_registrations}
        />

        {/* Card 2: View Student Records */}
      <DashboardCard
              icon={<Search />}
              title="View Student Records"
              description="Search for specific students to view their full profile, payment history, room allocation, and current status."
              onClick={() => navigate("/admin/dashboard/view-student")}
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

export default StudentManagementDashboard;

