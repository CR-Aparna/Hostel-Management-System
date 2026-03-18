import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Settings, MessageSquare, MapPin, Calendar, ClipboardCheck, XCircle, UserPlus } from 'lucide-react';
import { BackButton ,DashboardButton} from "../../components/common/NavButtons";

const AdminMaintenance = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState("maintenance"); // "maintenance" or "complaint"
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEscalatedItems();
  }, [viewMode]);

  const fetchEscalatedItems = async () => {
    setLoading(true);
    try {
      const endpoint = viewMode === "maintenance" 
        ? "/maintenance_and_complaint/warden_approved/maintenances" 
        : "/maintenance_and_complaint/escalated/complaints";
      
      const response = await axiosInstance.get(endpoint);
      setItems(response.data);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error fetching escalated items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminDecision = async (id, decisionData) => {
    try {
      // Assuming you have a unified or separate process endpoint for Admin
      const url = viewMode === "maintenance" 
        ? `/maintenance_and_complaint/${id}/process` // Reuse process endpoint
        : `/maintenance_and_complaint/${id}/resolve`;
      
      await axiosInstance.patch(url, decisionData);
      alert("Decision recorded successfully");
      fetchEscalatedItems();
    } catch (error) {
      alert("Failed to process request");
    }
  };

  return (
  <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
    <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
                  <BackButton />
                  <DashboardButton />
        </div>
      
      {/* Header Section */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Admin Control Center</h2>
          <p className="text-slate-500 font-medium italic">Reviewing items escalated by Warden</p>
        </div>

        {/* Toggle Group */}
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
          <button 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              viewMode === "maintenance" 
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
              : "text-slate-500 hover:bg-slate-50"
            }`}
            onClick={() => setViewMode("maintenance")}
          >
            <Settings size={16} />
            Maintenances
          </button>
          <button 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              viewMode === "complaint" 
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
              : "text-slate-500 hover:bg-slate-50"
            }`}
            onClick={() => setViewMode("complaint")}
          >
            <MessageSquare size={16} />
            Complaints
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Section: List of Escalated Items */}
        <section className="lg:col-span-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="p-10 text-center animate-pulse text-indigo-600 font-bold">Loading requests...</div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-10 text-center border border-dashed border-slate-300">
              <p className="text-slate-400 font-medium text-sm">No escalated items found.</p>
            </div>
          ) : (
            items.map(item => (
              <div 
                key={item.id} 
                onClick={() => setSelectedItem(item)}
                className={`group cursor-pointer p-5 rounded-3xl border transition-all duration-300 ${
                  selectedItem?.id === item.id 
                  ? 'bg-white border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500' 
                  : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider rounded-lg">
                    Room {item.room_number}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h4 className={`font-bold transition-colors ${selectedItem?.id === item.id ? 'text-indigo-600' : 'text-slate-800'}`}>
                  {item.category || item.issue_type}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">
                  "{item.description}"
                </p>
              </div>
            ))
          )}
        </section>

        {/* Right Section: Action Panel */}
        <section className="lg:col-span-8">
          {selectedItem ? (
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-between items-start mb-8 border-b border-slate-50 pb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Review Details</h3>
                  <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest">Action Required</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                    <p className="text-sm font-bold text-slate-700">Room {selectedItem.room_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submission</p>
                    <p className="text-sm font-bold text-slate-700">{new Date(selectedItem.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <ClipboardCheck size={12} /> Detailed Description
                </p>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {selectedItem.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {viewMode === "maintenance" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
                      onClick={() => {
                        const staff = prompt("Assign specialized staff/vendor:");
                        if(staff) handleAdminDecision(selectedItem.id, { 
                            decision: "Assigned", 
                            is_minor_or_emergency: false, 
                            assigned_staff: staff 
                        });
                      }}
                    >
                      <UserPlus size={18} />
                      Approve & Assign
                    </button>
                    <button 
                      className="flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-100 font-bold py-4 rounded-2xl transition-all active:scale-[0.98]"
                      onClick={() => handleAdminDecision(selectedItem.id, { decision: "Rejected", remarks: "Budget Not Approved" })}
                    >
                      <XCircle size={18} />
                      Reject Request
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea 
                      id="adminNote" 
                      placeholder="Enter final admin resolution notes..."
                      className="w-full p-5 bg-slate-50 rounded-3xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none h-32 text-sm font-medium"
                    ></textarea>
                    <button 
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98]"
                      onClick={() => {
                        const note = document.getElementById("adminNote").value;
                        handleAdminDecision(selectedItem.id, { status: "Resolved", action_taken: note });
                      }}
                    >
                      Resolve as Admin
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 p-10 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <ClipboardCheck size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Item Selected</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                Select an escalated request from the list to take final administrative action.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  </div>
);
};

export default AdminMaintenance;