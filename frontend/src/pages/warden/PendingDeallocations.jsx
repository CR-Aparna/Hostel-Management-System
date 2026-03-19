import { useEffect, useState,React } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { UserMinus, CheckCircle, XCircle, Calendar, Hash, DoorOpen } from "lucide-react";
import { BackButton, DashboardButton } from "../../components/common/NavButtons";

function PendingDeallocations() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get("/room-management/warden/vacate-requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await axiosInstance.put(
        `/room-management/vacate-request/${requestId}/approve`
      );

      alert("Approved successfully");
      fetchRequests();
    }
    catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        alert(err.response.data.detail);
      }
      alert(" Approval failed");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axiosInstance.post(
        `/room-management/vacate-request/${requestId}/reject`
      );

      alert("Rejected successfully");
      fetchRequests();
    }
    catch (err) {
      console.error(err);
      alert(" Rejection failed");
    }
  };

return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Bar */}
        <div className="flex items-center gap-3 mb-8">
          <BackButton />
          <DashboardButton />
        </div>

        {/* Page Header */}
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-rose-600 rounded-2xl shadow-lg shadow-rose-100 text-white">
              <UserMinus size={28} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Pending Deallocation Requests
            </h2>
          </div>
          <p className="text-slate-500 font-medium italic ml-1">
            Review and process student checkout or room exit applications.
          </p>
        </header>

        {requests.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Pending Requests</h3>
            <p className="text-slate-400 mt-2 font-medium">The deallocation queue is currently empty.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Student & ID</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Room</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Reason for Exit</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Request Date</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {requests.map((req) => (
                    <tr key={req.request_id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-lg">{req.student_name}</span>
                          <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1">
                            <Hash size={12} /> {req.admission_number}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-8 py-6 text-center">
                        <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-black text-sm border border-indigo-100 shadow-sm">
                          <DoorOpen size={14} /> {req.room_number}
                        </span>
                      </td>

                      <td className="px-8 py-6 max-w-xs">
                        <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-2 border-slate-200 pl-3">
                          "{req.reason}"
                        </p>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                          <Calendar size={14} className="text-slate-300" />
                          {req.request_date}
                        </div>
                      </td>

                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleReject(req.request_id)}
                            className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all active:scale-95 border border-rose-100 flex items-center gap-2 font-black text-xs px-4"
                            title="Reject Request"
                          >
                            <XCircle size={16} /> Reject
                          </button>
                          <button
                            onClick={() => handleApprove(req.request_id)}
                            className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 active:scale-95 flex items-center gap-2 font-black text-xs px-4"
                            title="Approve Deallocation"
                          >
                            <CheckCircle size={16} /> Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingDeallocations;
