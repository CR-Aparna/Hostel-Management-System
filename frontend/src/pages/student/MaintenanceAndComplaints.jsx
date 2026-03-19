import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { BackButton, DashboardButton } from "../../components/common/NavButtons";
import { 
  Wrench, 
  AlertCircle, 
  History, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  ChevronRight,
  PlusCircle
} from "lucide-react";

const MaintenanceAndComplaints = () => {
  const [activeTab, setActiveTab] = useState("maintenance");
  const [history, setHistory] = useState([]);
  
  // MATCHING YOUR SCHEMAS EXACTLY
  const [maintData, setMaintData] = useState({ 
    description: "", 
    category: "Plumbing", 
    room_number: "", 
    //is_emergency: false 
  });

  const [complaintData, setComplaintData] = useState({ 
    subject: "", 
    description: "", 
    issue_type: "Mess", 
    //is_anonymous: false 
  });

  useEffect(() => {
    fetchHistory();
  }, [activeTab]);

  const fetchHistory = async () => {
    try {
      const endpoint = activeTab === "maintenance" 
        ? "/maintenance_and_complaint/my-maintenance" 
        : "/maintenance_and_complaint/my-complaints";
      const res = await axiosInstance.get(endpoint);
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === "maintenance") {
        await axiosInstance.post("/maintenance_and_complaint/submit", maintData);
        setMaintData({ description: "", category: "Plumbing", room_number: "", is_emergency: false });
      } else {
        await axiosInstance.post("/maintenance_and_complaint/file", complaintData);
        setComplaintData({ subject: "", description: "", issue_type: "Mess", is_anonymous: false });
      }
      alert("Submitted successfully!");
      fetchHistory();
    } catch (err) {
      alert(err.response?.data?.detail || "Submission failed");
    }
  };

return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar title="Support & Requests" />

      <main className="flex-1 max-w-[1400px] mx-auto w-full p-6 md:p-8 space-y-6">
        
        {/* Top Actions & Tab Switcher */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <BackButton />
            <DashboardButton />
          </div>
          
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
            <button 
              onClick={() => setActiveTab("maintenance")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs transition-all ${
                activeTab === "maintenance" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Wrench size={16} /> MAINTENANCE
            </button>
            <button 
              onClick={() => setActiveTab("complaint")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs transition-all ${
                activeTab === "complaint" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <ShieldAlert size={16} /> COMPLAINTS
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: FORM SECTION */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <header className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-2">
                   <PlusCircle className="text-indigo-600" size={24} />
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {activeTab === "maintenance" ? "New Repair" : "New Grievance"}
                   </h2>
                </div>
                <p className="text-slate-400 text-xs font-medium italic">
                  Fill in the details below to notify the hostel administration.
                </p>
              </header>

              <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-5">
                {activeTab === "maintenance" ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                        <select 
                          value={maintData.category} 
                          onChange={(e) => setMaintData({...maintData, category: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 appearance-none"
                        >
                          <option value="Plumbing">Plumbing</option>
                          <option value="Electrical">Electrical</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room No.</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 102" 
                          value={maintData.room_number} 
                          onChange={(e) => setMaintData({...maintData, room_number: e.target.value})} 
                          required 
                          className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                      <textarea 
                        placeholder="Describe the problem (e.g. Tap leaking in washbasin)..." 
                        value={maintData.description} 
                        onChange={(e) => setMaintData({...maintData, description: e.target.value})} 
                        required 
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                      <input 
                        type="text" 
                        placeholder="Brief title of the issue" 
                        value={complaintData.subject} 
                        onChange={(e) => setComplaintData({...complaintData, subject: e.target.value})} 
                        required 
                        className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Type</label>
                      <select 
                        value={complaintData.issue_type} 
                        onChange={(e) => setComplaintData({...complaintData, issue_type: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Mess">Mess / Food</option>
                        <option value="Security">Security</option>
                        <option value="Discipline">Discipline</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Explanation</label>
                      <textarea 
                        placeholder="Provide details..." 
                        value={complaintData.description} 
                        onChange={(e) => setComplaintData({...complaintData, description: e.target.value})} 
                        required 
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                      />
                    </div>
                  </>
                )}
                
                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
                >
                  <Send size={16} /> Submit to Warden
                </button>
              </form>
            </div>
          </section>

          {/* RIGHT: HISTORY SECTION */}
          <section className="lg:col-span-7 space-y-6">
            <header className="flex items-center gap-3 px-2">
              <History className="text-slate-400" size={24} />
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
            </header>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {history.length > 0 ? (
                history.map(item => (
                  <div key={item.id} className="group bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:border-indigo-100 transition-all flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg">
                          {activeTab === "maintenance" ? item.category : item.subject}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Clock size={12} /> {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-700 text-sm font-medium leading-relaxed italic line-clamp-2">
                        "{item.description}"
                      </p>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                        item.status.toLowerCase() === 'resolved' || item.status.toLowerCase() === 'closed'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-orange-50 text-orange-600 border-orange-100'
                       }`}>
                        {item.status}
                       </span>
                       <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-100/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 p-12 text-center">
                  <AlertCircle className="mx-auto text-slate-300 mb-2" size={32} />
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No history found</p>
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default MaintenanceAndComplaints;