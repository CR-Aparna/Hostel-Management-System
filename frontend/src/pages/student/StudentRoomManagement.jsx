import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { BedDouble, Home, Layers, Users, IndianRupee, ArrowRightLeft, LogOut } from "lucide-react";
import { BackButton,DashboardButton } from "../../components/common/NavButtons";
import Navbar from "../../components/Navbar";

function StudentRoomManagement() {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [changeRequest, setChangeRequest] = useState({
  requested_room_type: "",
  requested_room_number: "",
  reason: "",
});
  const [showVacateForm, setShowVacateForm] = useState(false);
  const [vacateReason, setVacateReason] = useState("");
  const [pendingRequest, setPendingRequest] = useState(null);

  useEffect(() => {
    fetchRoomDetails();

    window.addEventListener('focus', fetchRoomDetails);
  
    return () => window.removeEventListener('focus', fetchRoomDetails);
  }, []);

  const fetchRoomDetails = async () => {
    try {
      const res = await axiosInstance.get("/room-management/rooms/my-room");
      setRoom(res.data);

      const reqRes = await axiosInstance.get("/room-management/my-change-requests"); 
      const pending = reqRes.data.find(r => r.status === "Pending");
      setPendingRequest(pending);

    } catch (error) {
      console.error("Error fetching room details", error);
      setRoom(null);
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
  setChangeRequest({
    ...changeRequest,
    [e.target.name]: e.target.value,
  });
};

  const handleChangeRequest = async () => {
  try {
    await axiosInstance.post("/room-management/change-request", {
      requested_room_type: changeRequest.requested_room_type || null,
      requested_room_number: changeRequest.requested_room_number || null,
      reason: changeRequest.reason || null,
    });

    alert("Room change request submitted");

    // Reset + close form
    setChangeRequest({
      requested_room_type: "",
      requested_room_number: "",
      reason: "",
    });
    setShowChangeForm(false);

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.detail || "Failed to submit request");
  }
};

  const handleVacateRequest = async () => {
  try {
    await axiosInstance.post("/room-management/vacate-request", {
      reason: vacateReason || null,
    });

    alert("Room vacate request submitted");

    // reset + close form
    setVacateReason("");
    setShowVacateForm(false);

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.detail || "Failed to submit request");
  }
};

  if (loading) return <p>Loading room details...</p>;

return (
  <div className="min-h-screen bg-slate-50 p-4 md:p-8">
    <div className="max-w-4xl mx-auto">

      <Navbar title="My Room"/>
      <div className="flex items-center gap-3">
                <BackButton />
                <DashboardButton />
      </div>

      {/* Title */}
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Room</h2>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 p-8">

        {room ? (
          <div className="space-y-6">

            {/* Room Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <RoomItem icon={<BedDouble />} label="Room Number" value={room.room_number} />
              <RoomItem icon={<Layers />} label="Floor" value={room.floor} />
              <RoomItem icon={<Home />} label="Room Type" value={room.room_type} />
              <RoomItem icon={<Users />} label="Capacity" value={room.capacity} />
              <RoomItem icon={<IndianRupee />} label="Rent Per Day" value={room.rent} />
              <RoomItem icon={<Home />} label="Status" value={room.status} isStatus />

            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <button
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                onClick={() => setShowChangeForm(true)}
                disabled={pendingRequest}
              >
                <ArrowRightLeft size={18} />
                {pendingRequest ? "Room Change Pending..." : "Request Room Change"}
              </button>

              <button
                className="flex-1 bg-rose-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                onClick={() => setShowVacateForm(true)}
              >
                <LogOut size={18} />
                Request Vacate
              </button>
            </div>

            {/* Change Room Form */}
            {showChangeForm && (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6 mt-6">
              
                {/* Header */}
                <div>
                  <h3 className="text-xl font-black tracking-tight text-slate-900">
                    Room Change Request
                  </h3>
                  <p className="text-slate-500 text-sm font-medium italic">
                    Submit your request for approval
                  </p>
                </div>

                {/* Room Type */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Room Type
                  </label>
                  <select
                    name="requested_room_type"
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Room Type</option>
                    <option value="Ordinary and Attached">Ordinary & Attached</option>
                    <option value="Ordinary and Non Attached">Ordinary & Non Attached</option>
                    <option value="AC and attached">AC & Attached</option>
                    <option value="AC and Non attached">AC & Non Attached</option>
                  </select>
                </div>

                {/* Preferred Room */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Preferred Room Number
                  </label>
                  <input
                    type="text"
                    name="requested_room_number"
                    placeholder="Optional"
                    value={changeRequest.requested_room_number}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Reason */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Reason
                  </label>
                  <textarea
                    name="reason"
                    placeholder="Enter reason for room change..."
                    value={changeRequest.reason}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleChangeRequest}
                    disabled={!changeRequest.reason}
                    className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Submit Request
                  </button>
                  <button
                    onClick={() => setShowChangeForm(false)}
                    className="flex-1 bg-slate-200 text-slate-700 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}


            {/* Vacate Form */}
            {showVacateForm && (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6 mt-6">
              
                {/* Header */}
                <div>
                  <h3 className="text-xl font-black tracking-tight text-slate-900">
                    Vacate Room
                  </h3>
                  <p className="text-slate-500 text-sm font-medium italic">
                    Submit your vacating request
                  </p>
                </div>
            
                {/* Reason */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Reason
                  </label>
                  <textarea
                    placeholder="Enter reason for vacating..."
                    value={vacateReason}
                    onChange={(e) => setVacateReason(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                  />
                </div>
            
                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleVacateRequest}
                    disabled={!vacateReason}
                    className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Submit Request
                  </button>
                  <button
                    onClick={() => setShowVacateForm(false)}
                    className="flex-1 bg-slate-200 text-slate-700 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500 font-semibold">
            No room assigned yet.
          </div>
        )}

      </div>
    </div>
  </div>
);
}
const RoomItem = ({ icon, label, value, isStatus }) => (
  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
    <div className="bg-white p-2.5 rounded-xl shadow-sm text-indigo-500">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <p className={`text-sm font-bold ${isStatus ? 'text-emerald-600' : 'text-slate-700'}`}>
        {value}
      </p>
    </div>
  </div>
);

export default StudentRoomManagement;