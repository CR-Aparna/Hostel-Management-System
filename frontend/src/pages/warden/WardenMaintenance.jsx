import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { BackButton, DashboardButton } from "../../components/common/NavButtons";
import { 
  Wrench, 
  Megaphone, 
  Filter, 
  Calendar, 
  MapPin, 
  UserCog, 
  AlertTriangle, 
  CheckCircle,
  ChevronRight,
  Inbox,
  X
} from "lucide-react";

const WardenMaintenance = () => {
  const [items, setItems] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState("maintenance");
  const [filter, setFilter] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
const [logForm, setLogForm] = useState({
  room_number: "",
  category: "Plumbing",
  description: "",
  assigned_staff: "",
  is_emergency: true
});

const handleLogSubmit = async (e) => {
  e.preventDefault();
  try {
    await axiosInstance.post("/maintenance_and_complaint/submit", {
      ...logForm,
      assigned_staff: parseInt(logForm.assigned_staff)
    });
    alert("Emergency task logged and closed.");
    setShowLogModal(false);
    fetchData(); // Refresh list
  } catch (err) {
    alert("Failed to log task.");
  }
};

  useEffect(() => {
    fetchData();
    fetchStaff();
  }, [viewMode, filter]);

  const fetchStaff = async () => {
    try {
      const res = await axiosInstance.get("/maintenance_and_complaint/staff");
      setStaffList(res.data);
    } catch (err) { console.error("Staff fetch error:", err); }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = viewMode === "maintenance" 
        ? "/maintenance_and_complaint/all-maintenances" 
        : "/maintenance_and_complaint/all-complaints";
      const response = await axiosInstance.get(endpoint, { params: { status: filter } });
      setItems(response.data);
      setSelectedItem(null); // Reset detail view on filter change
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionData) => {
    try {
      const url = viewMode === "maintenance" 
        ? `/maintenance_and_complaint/${selectedItem.id}/process`
        : `/maintenance_and_complaint/${selectedItem.id}/resolve`;
      
      await axiosInstance.patch(url, actionData);
      fetchData();
    } catch (error) {
      alert("Action failed. Please check inputs.");
    }
  };

  const handleMarkRoomMaintenance = async (roomNumber) => {
  const confirmAction = window.confirm(
    `Marking Room ${roomNumber} for maintenance will notify all occupants via email and dashboard. Proceed?`
  );

  if (confirmAction) {
    try {
      // Using the endpoint path we established earlier
      await axiosInstance.patch(`/maintenance_and_complaint/rooms/${roomNumber}/maintenance`);
      alert("Room status updated and students notified successfully.");
      fetchData(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update room status");
    }
  }
};
return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar title="Warden Administration" />

      <main className="flex-1 max-w-[1600px] mx-auto w-full p-6 md:p-8 flex flex-col gap-6">
        
        {/* Top Navigation & Stats Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <BackButton />
            <DashboardButton />
          </div>
          
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
            <button 
              onClick={() => setViewMode("maintenance")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs transition-all ${
                viewMode === "maintenance" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Wrench size={16} /> MAINTENANCE
            </button>
            <button 
              onClick={() => setViewMode("complaint")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs transition-all ${
                viewMode === "complaint" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Megaphone size={16} /> COMPLAINTS
            </button>
            <button 
  onClick={() => setShowLogModal(true)}
  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-all ml-4"
>
  <AlertTriangle size={16} className="text-orange-400" /> LOG EMERGENCY
</button>

{/* --- LOG EMERGENCY MODAL --- */}
{showLogModal && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-slate-900">Log Emergency Repair</h3>
        <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
      </div>

      <form onSubmit={handleLogSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Room No</label>
            <input 
              type="number" required
              className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setLogForm({...logForm, room_number: e.target.value})}
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Assign Staff</label>
            <select 
              required
              className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setLogForm({...logForm, assigned_staff: e.target.value})}
            >
              <option value="">Select Staff</option>
              {staffList.map(s => <option key={s.staff_id} value={s.staff_id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Description</label>
          <textarea 
            required
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
            placeholder="What was repaired?"
            onChange={(e) => setLogForm({...logForm, description: e.target.value})}
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          Finalize & Log as Closed
        </button>
      </form>
    </div>
  </div>
  )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[600px]">
          
          {/* 1. Sidebar Control Panel (Status Filters) */}
          <aside className="lg:col-span-3 space-y-6">
            <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Filter size={16} /> Filter Status
              </h3>
              <div className="space-y-2">
                {[
                  { id: "Pending", label: "New Requests", color: "bg-orange-500" },
                  { id: "Assigned", label: "Assigned", color: "bg-indigo-500" },
                  { id: "In Progress", label: "In Progress", color: "bg-amber-500" },
                  { id: "Resolved", label: "Resolved", color: "bg-emerald-500" },
                  { id: "Rejected", label: "Rejected", color: "bg-rose-500" },
                  { id: "Escalated to Admin", label: "Escalated to Admin", color: "bg-rose-500" }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-bold text-sm ${
                      filter === f.id ? "bg-slate-900 text-white" : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${f.color}`} />
                      {f.label}
                    </div>
                    {filter === f.id && <ChevronRight size={14} />}
                  </button>
                ))}
              </div>
            </section>
          </aside>

          {/* 2. List View (Master) */}
          <section className="lg:col-span-4 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <header className="px-6 py-4 bg-slate-900 flex justify-between items-center">
              <h3 className="text-white text-xs font-black uppercase tracking-widest">
                {viewMode} Requests ({items.length})
              </h3>
            </header>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="animate-spin mb-2"><Wrench size={24}/></div>
                  <p className="text-xs font-bold uppercase tracking-widest">Loading Items...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-12">
                  <Inbox className="mx-auto text-slate-200 mb-2" size={40} />
                  <p className="text-slate-400 text-sm font-bold">No requests found</p>
                </div>
              ) : items.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedItem(item)}
                  className={`group p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                    selectedItem?.id === item.id 
                    ? "border-indigo-600 bg-indigo-50/50" 
                    : "border-transparent bg-slate-50 hover:bg-slate-100"
                  } ${item.is_emergency ? "ring-2 ring-rose-500 ring-offset-2" : ""}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-1 bg-white rounded-lg text-[10px] font-black text-indigo-600 shadow-sm">
                      ROOM {item.room_number || "N/A"}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-700 line-clamp-2">
                    {item.description}
                  </p>
                  {item.is_emergency && (
                    <div className="mt-2 flex items-center gap-1 text-rose-600 text-[10px] font-black uppercase">
                      <AlertTriangle size={12} /> Emergency
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 3. Detail View (Action Pane) */}
          <section className="lg:col-span-5">
            {selectedItem ? (
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden h-full flex flex-col">
                <header className="p-8 pb-4">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Request Details</h2>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                      selectedItem.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                      selectedItem.status === 'Assigned' ? 'bg-indigo-100 text-indigo-600' :
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {selectedItem.status}
                    </span>
                    <p className="text-sm font-bold text-slate-700">updated at: {selectedItem.updated_at
                        ? new Date(selectedItem.updated_at).toLocaleDateString()
                        : "Not updated yet"}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Category</label>
                      <p className="text-sm font-bold text-slate-700 capitalize">{selectedItem.category || selectedItem.issue_type}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Student Details</label>
              <p className="text-sm font-bold text-slate-700">Room No : {selectedItem.room_number}</p>
              <p className="text-sm font-bold text-slate-700">Adm No : {selectedItem.admission_number}</p>
              <p className="text-sm font-bold text-slate-700">Name : {selectedItem.student_name}</p>
            </div>
            {/* NEW BUTTON: MARK ROOM MAINTENANCE */}
            <button 
              onClick={() => handleMarkRoomMaintenance(selectedItem.room_number)}
              title="Mark entire room as Under Maintenance"
              className="p-2 bg-amber-100 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
            >
              <Wrench size={18} />
            </button>
          </div>
                  </div>
                </header>

                <div className="px-8 flex-1">
                  <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-[2rem]">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Description</h4>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">
                      {selectedItem.description}
                    </p>
                  </div>
                </div>

                <div className="px-8 flex-1">
                  <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-[2rem]">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Assigned Staff/Resolved By</h4>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">
                      Name : {selectedItem.staff_name ? selectedItem.staff_name : selectedItem.resolved_by}
                    </p>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">
                      Id : {selectedItem.assigned_staff ? selectedItem.assigned_staff : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Dynamic Action Footer */}
                <div className="p-8 mt-auto">
                  {filter === "Pending" && (
                    <div className="bg-slate-900 p-6 rounded-[2rem] space-y-4">
                      {viewMode === "maintenance" ? (
                        <div className="space-y-4">
                          <div className="relative">
                            <select 
                              id="staffSelect" 
                              defaultValue=""
                              className="w-full bg-slate-800 border-none text-white rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 appearance-none"
                            >
                              <option value="" disabled>Choose Staff Member</option>
                              {staffList.map(s => <option key={s.staff_id} value={s.staff_id}>{s.name} ({s.category})</option>)}
                            </select>
                            <UserCog className="absolute right-3 top-3 text-slate-500" size={18} />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button 
                              onClick={() => {
                                const sId = document.getElementById("staffSelect").value;
                                if(sId) handleAction({ decision: "Assign", assigned_staff: parseInt(sId) });
                                else alert("Please select staff");
                              }}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                              <CheckCircle size={16}/> Assign & Start
                            </button>
                            <button 
                              onClick={() => handleAction({ decision: "Reject", remarks: "Invalid" })}
                              className="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white py-3 rounded-xl font-black text-xs transition-all border border-rose-500/20 active:scale-95"
                            >
                              Reject Request
                            </button>
                            <button 
                              onClick={() => handleAction({ decision: "Escalated to Admin" })}
                              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-black text-xs transition-all active:scale-95"
                            >
                              Escalate
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <textarea 
                            id="resNote" 
                            placeholder="Enter resolution notes..."
                            className="w-full bg-slate-800 border-none text-white rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                          ></textarea>
                          <div className="flex gap-3">
                            <button 
                              onClick={() => {
                                const note = document.getElementById("resNote").value;
                                if(note) handleAction({ action_taken: note, status: "Resolved" });
                                else alert("Enter notes first");
                              }}
                              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-black text-xs transition-all active:scale-95"
                            >
                              Close Complaint
                            </button>
                            <button 
                              onClick={() => handleAction({ status: "Escalated to Admin" })}
                              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-black text-xs transition-all active:scale-95"
                            >
                              Escalate
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full bg-slate-100 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center">
                <div className="p-6 bg-white rounded-full shadow-sm mb-4">
                  <Filter className="text-slate-300" size={48} />
                </div>
                <h3 className="text-slate-900 font-black text-lg mb-2">Selection Required</h3>
                <p className="text-slate-500 text-sm font-medium max-w-[250px]">
                  Select a request from the middle list to view details and take action.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default WardenMaintenance;