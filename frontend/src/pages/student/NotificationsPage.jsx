/*import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

function NotificationsPage(){
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            const res = await axiosInstance.get("/notifications/all");
            setNotifications(res.data);
        };
        fetchAll();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await axiosInstance.put(`/notifications/${id}/read`);
            // Update local state: change is_read to true instead of removing it
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
        } catch (err) { console.error(err); }
    };

    return (
        <div className="notifications-container">
            <h2>Your Notifications</h2>
            {notifications.map(n => (
                <div 
                    key={n.id} 
                    className={`notif-card ${n.is_read ? 'read' : 'unread'}`}
                    onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                >
                    <h4>{n.title}</h4>
                    <p>{n.message}</p>
                    <small>{new Date(n.created_at).toLocaleString()}</small>
                </div>
            ))}
        </div>
    );
};

export default NotificationsPage;*/

import { useState, useEffect } from "react";
import { Bell, CheckCircle2, Circle, Clock, ChevronLeft } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { BackButton } from "../../components/common/NavButtons"; // Using your existing back button

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // "all", "unread", "read"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/notifications/all");
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Tab Filtering Logic
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.is_read;
    if (activeTab === "read") return n.is_read;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900">
              Notifications
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              Stay updated with your room status and hostel alerts.
            </p>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex p-1 bg-slate-200/50 rounded-[2rem] mb-8 w-fit">
          {["all", "unread", "read"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-[1.8rem] text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 font-black text-slate-300 animate-pulse uppercase tracking-widest text-sm">
              Loading Alerts...
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                className={`group relative p-6 rounded-[2.5rem] border transition-all cursor-pointer ${
                  n.is_read
                    ? "bg-white/50 border-slate-100 opacity-80"
                    : "bg-white border-white shadow-xl shadow-indigo-100/50 ring-1 ring-indigo-50"
                }`}
              >
                <div className="flex items-start gap-5">
                  {/* Icon Indicator */}
                  <div
                    className={`p-4 rounded-2xl transition-colors ${
                      n.is_read
                        ? "bg-slate-100 text-slate-400"
                        : "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    }`}
                  >
                    {n.is_read ? <CheckCircle2 size={20} /> : <Bell size={20} />}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4
                        className={`text-lg font-black leading-tight ${
                          n.is_read ? "text-slate-600" : "text-slate-900"
                        }`}
                      >
                        {n.title}
                      </h4>
                      {!n.is_read && (
                        <span className="flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                          <Circle size={8} fill="currentColor" /> New
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-sm font-medium mb-4">
                      {n.message}
                    </p>
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                      <Clock size={12} />
                      {new Date(n.created_at).toLocaleString([], { 
                        dateStyle: 'medium', 
                        timeStyle: 'short' 
                      })}
                    </div>
                  </div>
                </div>

                {/* Hover Effect Bar */}
                {!n.is_read && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-600 rounded-r-full group-hover:h-1/2 transition-all" />
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-slate-200">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Bell size={32} />
              </div>
              <h3 className="font-black text-slate-900 text-lg">No Notifications</h3>
              <p className="text-slate-400 font-medium">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;