import React from 'react';
import { useNavigate } from "react-router-dom";
import { 
  UtensilsCrossed, 
  Ticket, 
  CalendarOff, 
  BarChart3, 
  ArrowRight,
  ChefHat
} from "lucide-react";
import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import { BackButton, DashboardButton } from "../../components/common/NavButtons";

function MealManagementDashboard() {
  const navigate = useNavigate();

  const mealModules = [
    {
      title: "Meals",
      description: "Design and manage weekly meal plans and kitchen schedules.",
      path: "/warden/meals",
      icon: <ChefHat size={24} />
    },
    {
      title: "Token Management",
      description: "Generate daily mess tokens and verify student meal attendance.",
      path: "/warden/meal-tokens",
      icon: <Ticket size={24} />
    },
    {
      title: "Mess Cut Requests",
      description: "Review and approve student applications for mess leave.",
      path: "/warden/mess-cut-requests",
      icon: <CalendarOff size={24} />
    },
    {
      title: "Meal Summary",
      description: "Analyze consumption trends and feedback from the past 7 days.",
      path: "/warden/meal-summary",
      icon: <BarChart3 size={24} />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title="Meal Management" />

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
              <UtensilsCrossed size={24} />
            </div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900">
              Meal Operations
            </h2>
          </div>
          <p className="text-slate-500 font-medium text-lg ml-1">
            Oversee the mess schedule, inventory, and student dining requests.
          </p>
        </header>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mealModules.map((module, index) => (
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

export default MealManagementDashboard;