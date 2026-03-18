import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { UserMinus, Calendar, Hash, DoorOpen, ClipboardList, CheckCircle2 } from 'lucide-react';

function DeallocationApprovals() {
  const [requests, setRequests] = useState([]);

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

  return (
  <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
    <div className="max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Deallocation Requests</h2>
        <p className="text-slate-500 font-medium">Review and finalize student checkout processes.</p>
      </div>

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
  </div>
);
}

export default DeallocationApprovals;
