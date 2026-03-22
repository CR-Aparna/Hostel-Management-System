import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { UserMinus, Calendar, Hash, DoorOpen, ClipboardList, CheckCircle2 } from 'lucide-react';
import { BackButton,DashboardButton } from "../../components/common/NavButtons";

function DeallocationApprovals() {
  const [requests, setRequests] = useState([]);
  // Add these to your existing useState hooks
const [history, setHistory] = useState([]);
const [isHistoryOpen, setIsHistoryOpen] = useState(false);
const [historyLoading, setHistoryLoading] = useState(false);



  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get("/room-management/admin/vacate-requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  

  const handleApprove = async (studentId) => {
    try {
      await axiosInstance.post(
        `/room-management/rooms/deallocate/${studentId}`
      );

      alert("Deallocated successfully");
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Deallocation failed");
    }
  };

  const fetchHistory = async () => {
  setHistoryLoading(true);
  try {
    const res = await axiosInstance.get("/room-management/vacate/history");
    setHistory(res.data);
    setIsHistoryOpen(true);
  } catch (err) {
    console.error(err);
    alert("Could not load history");
  } finally {
    setHistoryLoading(false);
  }
};

  return (
  <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
    <div className="max-w-6xl mx-auto">

      <div className="flex items-center gap-3 mb-8">
                <BackButton />
                <DashboardButton />
      </div>
      
      {/* Page Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Deallocation Requests</h2>
        <p className="text-slate-500 font-medium">Review and finalize student checkout processes.</p>
      </div>
      <button 
        onClick={fetchHistory}
        disabled={historyLoading}
        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
      >
        <ClipboardList size={18} />
        {historyLoading ? "Loading..." : "View Vacate History"}
      </button>

      {requests.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">All caught up!</h3>
          <p className="text-slate-400 mt-2">No pending deallocation requests at the moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Student</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Admission No</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Room</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Reason</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Request Date</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {requests.map((req) => (
                  <tr key={req.request_id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {req.student_name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800">{req.student_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                        {req.admission_number}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-black">
                        <DoorOpen size={12} />
                        {req.room_number}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-2 max-w-[200px]">
                        <ClipboardList size={14} className="text-slate-300 mt-1 shrink-0" />
                        <p className="text-sm text-slate-600 font-medium leading-tight italic">
                          "{req.reason}"
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={14} />
                        <span className="text-xs font-bold uppercase">{req.request_date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => handleApprove(req.student_id)}
                        className="inline-flex items-center gap-2 bg-white border border-red-100 text-red-600 hover:bg-red-600 hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 group-hover:shadow-md"
                      >
                        <UserMinus size={16} />
                        Deallocate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
    {/* Vacate History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Vacate History</h3>
                <p className="text-slate-500 text-sm font-medium">Archive of all completed and rejected requests</p>
              </div>
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-colors"
              >
                <CheckCircle2 size={20} />
              </button>
            </div>
      
            {/* Modal Body - Scrollable Area */}
            <div className="overflow-auto p-2 custom-scrollbar">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="sticky top-0 bg-slate-50 z-10">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Detail</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Room</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {history.map((item) => (
                    <tr key={item.request_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 text-sm">{item.student_name}</div>
                        <div className="text-[11px] text-slate-400 font-medium">{item.admission_number} • {item.department}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                          {item.room_number}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter ${
                          item.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">
                        {new Date(item.vacate_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                
              {history.length === 0 && (
                <div className="p-20 text-center text-slate-400 font-medium">
                  No history records found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeallocationApprovals;
