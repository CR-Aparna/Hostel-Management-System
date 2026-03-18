import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useState, useEffect } from "react";
import { LogOut, Bell, User } from "lucide-react"; // Using lucide-react for consistency

function Navbar({ title }) {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const userRole = localStorage.getItem("role");
  const userName = localStorage.getItem("username") || "User"; // Fallback to "User" if name is missing

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await axiosInstance.get("/notifications/unread");
        setUnreadCount(res.data.length);
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 120000);
    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        {userRole === "Student" && (
          <button 
            onClick={() => navigate("/student/notifications")}
            className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>
        )}

        {/* User Profile & Logout */}
        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">{userName}</p>
            <p className="text-xs text-slate-500 mt-1 capitalize">{userRole}</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-600 px-4 py-2 rounded-xl text-sm font-semibold transition-all border border-transparent hover:border-rose-100"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;