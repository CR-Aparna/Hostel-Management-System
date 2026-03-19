import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  CalendarDays, 
  FileText 
} from "lucide-react";
import { BackButton,DashboardButton } from "../../components/common/NavButtons";
import Navbar from "../../components/Navbar";

function WardenMessCut() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get("/meal-management/mess-cut-requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch requests");
    }
  };

  const handleApprove = async (request_id) => {
    try {
      await axiosInstance.put(`/meal-management/${request_id}/approve`);
      alert("Request approved");
      fetchRequests(); // refresh
    } catch (err) {
      console.error(err);
      alert("Failed to approve");
    }
  };

  const handleReject = async (request_id) => {
    try {
      await axiosInstance.put(`/meal-management/${request_id}/reject`);
      alert("Request rejected");
      fetchRequests(); // refresh
    } catch (err) {
      console.error(err);
      alert("Failed to reject");
    }
  };

return (
  <main className="min-h-screen bg-slate-50">
    <Navbar title="Mess Cut Requests"/>
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <BackButton />
        <DashboardButton />
      </div>
      <header className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 text-white">
          <ClipboardList size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Mess Cut Requests
          </h2>
          <p className="text-slate-500 font-medium italic">
            Review and manage student absence requests for mess billing adjustments.
          </p>
        </div>
      </header>

      {requests.length === 0 ? (
        <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
          <p className="text-slate-400 font-bold">No requests found at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="group bg-white rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 overflow-hidden flex"
            >
              {/* Status Indicator Strip */}
              <div className={`w-2 ${
                req.status === "Approved" ? "bg-emerald-500" : 
                req.status === "Rejected" ? "bg-rose-500" : "bg-orange-400"
              }`} />

              <div className="p-6 flex-1">
                {/* Top Row: Student & Status */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                      <User size={16} />
                    </div>
                    <span className="font-black text-slate-700 tracking-tight">ID: {req.student_id}</span>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    req.status === "Approved" ? "bg-emerald-50 text-emerald-600" : 
                    req.status === "Rejected" ? "bg-rose-50 text-rose-600" : "bg-orange-50 text-orange-600"
                  }`}>
                    {req.status}
                  </span>
                </div>

                {/* Date Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">From</label>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <CalendarDays size={14} className="text-indigo-500" />
                      {req.from_date}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">To</label>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <CalendarDays size={14} className="text-indigo-500" />
                      {req.to_date}
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="mb-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Reason</label>
                  <div className="flex items-start gap-2 text-sm font-medium text-slate-600 italic">
                    <FileText size={14} className="mt-1 flex-shrink-0" />
                    "{req.reason}"
                  </div>
                </div>

                {/* Actions */}
                {req.status === "pending" && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-slate-50">
                    <button 
                      onClick={() => handleApprove(req.id)}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} /> Approve
                    </button>

                    <button
                      onClick={() => handleReject(req.id)}
                      className="flex-1 bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 py-3 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </main>

  );
}

export default WardenMessCut;