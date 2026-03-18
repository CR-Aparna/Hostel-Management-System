import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';

/**
 * BackButton: Simply takes the user to the previous page in history
 */
export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="group flex items-center gap-2 px-4 py-2 bg-white text-slate-600 font-bold text-sm rounded-xl border border-slate-100 shadow-sm hover:bg-slate-50 hover:text-indigo-600 transition-all active:scale-95"
    >
      <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
      Back
    </button>
  );
};

/**
 * DashboardButton: Sends the user to their specific dashboard based on role
 */
export const DashboardButton = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleGoDashboard = () => {
    const dashboardMap = {
      "Admin": "/admin/dashboard",
      "Student": "/student/dashboard",
      "Warden": "/warden/dashboard",
      "Maintenance Staff": "/staff/dashboard"
    };
    navigate(dashboardMap[role] || "/login");
  };

  return (
    <button
      onClick={handleGoDashboard}
      className="group flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-xl shadow-lg shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-100 transition-all active:scale-95"
    >
      <LayoutDashboard size={18} />
      Home
    </button>
  );
};