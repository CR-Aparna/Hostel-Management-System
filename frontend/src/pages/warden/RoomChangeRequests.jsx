import { useEffect, useState,React } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { ArrowLeftRight, CheckCircle, XCircle, Calendar, Home, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import { BackButton, DashboardButton } from "../../components/common/NavButtons";


function RoomChangeRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get(
        "/room-management/change-requests"
      );
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await axiosInstance.post(
        `/room-management/change-request/${requestId}/approve`
      );

      alert("Room change approved");
      fetchRequests();
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.detail || "Approval failed");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axiosInstance.post(
        `/room-management/change-request/${requestId}/reject`
      );

      alert("Request rejected");
      fetchRequests();
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.detail || "Rejection failed");
    }
  };

return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title="Room Change Requests" />

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        
        {/* Navigation Bar */}
        <div className="flex items-center gap-3 mb-8">
          <BackButton />
          <DashboardButton />
        </div>

        {/* Page Header */}
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 text-white">
              <ArrowLeftRight size={28} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Room Change Requests
            </h2>
          </div>
          <p className="text-slate-500 font-medium italic ml-1">
            Review student applications for transferring between rooms.
          </p>
        </header>

        {requests.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Pending Requests</h3>
            <p className="text-slate-400 mt-2 font-medium">All room change applications have been processed.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Student ID</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Room Transition</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Preferred Type</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Reason</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {requests.map((req) => (
                    <tr key={req.request_id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <span className="text-sm font-mono font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                          {req.student_id}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
                          <Calendar size={12} /> {req.request_date}
                        </div>
                      </td>
                      
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase">From</p>
                            <span className="font-bold text-slate-700">{req.current_room_number}</span>
                          </div>
                          <ArrowRight size={16} className="text-indigo-400 mt-3" />
                          <div className="text-center">
                            <p className="text-[10px] font-black text-indigo-500 uppercase">To</p>
                            <span className="font-bold text-indigo-600">{req.requested_room_number || "TBD"}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase border border-slate-200">
                          {req.requested_room_type}
                        </span>
                      </td>

                      <td className="px-8 py-6 max-w-xs">
                        <p className="text-sm text-slate-500 font-medium italic leading-relaxed line-clamp-2" title={req.reason}>
                          "{req.reason}"
                        </p>
                      </td>

                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleReject(req.request_id)}
                            className="flex items-center gap-2 bg-white text-rose-600 border border-rose-100 px-4 py-2 rounded-xl text-xs font-black hover:bg-rose-50 transition-all active:scale-95"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                          <button
                            onClick={() => handleApprove(req.request_id)}
                            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
                          >
                            <CheckCircle size={14} /> Approve
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
      </main>
    </div>
  );
}

export default RoomChangeRequests;
