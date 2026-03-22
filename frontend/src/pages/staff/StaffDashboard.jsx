import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {useNavigate} from "react-router-dom";
import { Wrench, Clock, CheckCircle, LogOut, AlertTriangle } from "lucide-react";
import Navbar from "../../components/Navbar";



const StaffDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyTasks();
  }, []);


  const fetchMyTasks = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/maintenance_and_complaint/staff/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axiosInstance.patch(`/maintenance_and_complaint/staff/tasks/${taskId}/update-status`, null, {
        params: { new_status: newStatus }
      });
      fetchMyTasks(); // Refresh to show updated status
    } catch (err) {
      alert("Failed to update task status.");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed": return "status-done";
      case "Assigned": return "status-new";
      default: return "status-pending";
    }
  };

return (
  <div className="min-h-screen bg-slate-50 flex flex-col">
    <Navbar title = "Staff Dashboard"/>

    {/* Header */}
    <header className="bg-white border-b border-slate-100 px-6 md:px-10 py-6 flex items-center justify-between">
      
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          My Work Orders
        </h1>
        <p className="text-slate-500 text-sm font-medium italic">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <div className="flex items-center gap-4">

        {/* Active Count */}
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">
          <Clock size={14} />
          {tasks.filter(t => t.status !== "Completed").length} Active
        </div>
        
      </div>
    </header>

    {/* Main */}
    <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-8">

      {loading ? (
        <div className="text-center text-slate-500 font-semibold py-10">
          Loading tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center text-slate-500 font-semibold py-10">
          🎉 All caught up! No tasks assigned.
        </div>
      ) : (
        <div className="space-y-6">
          {tasks.map(task => (
            <div
              key={task.id}
              className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 ${
                task.is_emergency ? "ring-2 ring-rose-500" : ""
              }`}
            >

              {/* Left Section */}
              <div className="space-y-3">

                {/* Meta */}
                <div className="flex items-center gap-3 flex-wrap">

                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Room {task.room_number}
                  </span>

                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusClass(task.status)}`}>
                    {task.status}
                  </span>

                  {task.is_emergency && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-rose-500/10 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                      <AlertTriangle size={12} /> Emergency
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Wrench size={18} className="text-indigo-500" />
                  {task.category}
                </h3>

                {/* Description */}
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  {task.description}
                </p>

              </div>

              {/* Actions */}
              <div className="flex flex-col md:flex-row gap-3">

                {task.status === "Assigned" && (
                  <button
                    onClick={() => updateTaskStatus(task.id, "In Progress")}
                    className="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    ▶ Start Work
                  </button>
                )}

                {task.status === "In Progress" && (
                  <button
                    onClick={() => updateTaskStatus(task.id, "Resolved")}
                    className="bg-emerald-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={14} />
                    Mark Completed
                  </button>
                )}

                {task.status === "Completed" && (
                  <span className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest px-4 py-2">
                    <CheckCircle size={14} />
                    Verified
                  </span>
                )}

              </div>

            </div>
          ))}
        </div>
      )}
    </main>
  </div>
);
};

export default StaffDashboard;