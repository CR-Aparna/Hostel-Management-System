import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Tool, CreditCard, Bell, ChevronLeft, LogOut } from 'lucide-react';

const DashboardLayout = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(null);

  // 1. Define menus for each role
  const menus = {
    Admin: [
      { id: 'students', icon: <Users size={20} />, title: 'Students', path: '/admin/dashboard/studentmanagementdashboard' },
      { id: 'maintenance', icon: <Tool size={20} />, title: 'Maintenance', path: '/admin/maintenance' },
      { id: 'finance', icon: <CreditCard size={20} />, title: 'Invoices', path: '/admin/dashboard/pending-invoices' },
      
    ],
    Warden: [
      { id: 'attendance', icon: <Users size={20} />, title: 'Attendance', path: '/warden/attendance' },
      { id: 'rooms', icon: <LayoutDashboard size={20} />, title: 'Room Allocation', path: '/warden/rooms' },
    ],
    Student: [
      { id: 'my-room', icon: <LayoutDashboard size={20} />, title: 'My Room', path: '/student/room' },
      { id: 'fees', icon: <CreditCard size={20} />, title: 'Payments', path: '/student/fees' },
      { id: 'complaints', icon: <Tool size={20} />, title: 'Complaints', path: '/student/complaints' },
    ]
  };

  const currentMenu = menus[role] || [];

  // 2. Sync active tab with URL (so it stays selected on refresh)
  useEffect(() => {
    const currentItem = currentMenu.find(item => location.pathname.includes(item.path));
    if (currentItem) setActiveTab(currentItem.id);
    else if (location.pathname.endsWith('/dashboard')) setActiveTab(null);
  }, [location, currentMenu]);

  const handleNav = (item) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Reusable Navbar */}
      <Navbar title={`${role} Portal`} />

      <div className="flex flex-1 overflow-hidden">
        {/* SHARED SIDEBAR - Only shows when a card is selected */}
        {activeTab && (
          <aside className="w-64 bg-white border-r border-slate-200 p-4 hidden md:flex flex-col animate-in slide-in-from-left duration-300">
            <button 
              onClick={() => { setActiveTab(null); navigate(`/${role.toLowerCase()}/dashboard`); }}
              className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-8 hover:ml-1 transition-all"
            >
              <ChevronLeft size={16} /> Back to Grid
            </button>
            
            <nav className="space-y-2">
              {currentMenu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {item.icon} {item.title}
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* DYNAMIC CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          {!activeTab ? (
            /* THE GRID VIEW */
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900">Welcome, {role}</h1>
                <p className="text-slate-500">Select a module to continue</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentMenu.map((item) => (
                  <DashboardCard 
                    key={item.id}
                    title={item.title}
                    icon={item.icon}
                    onClick={() => handleNav(item)}
                    description={`Access and manage your ${item.title.toLowerCase()}.`}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* THE INNER PAGE VIEW */
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <Outlet /> 
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;