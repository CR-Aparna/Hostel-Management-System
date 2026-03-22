import React, { useState, useEffect } from "react";
import { 
  DoorOpen, Search, Layers, User, Users, 
  CreditCard, Info, X, ChevronRight, Hash 
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance"; // Ensure this path is correct
import { BackButton, DashboardButton } from "../../components/common/NavButtons";

function ManageRooms() {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal States
  const [selectedRoomData, setSelectedRoomData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [searchError , setSearchError] = useState("");

  // Fetch rooms for the floor
  const fetchRooms = async (floor) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/room-management/rooms_in_a_floor/${floor}`);
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific room details (The Search Logic)
  const fetchRoomDetails = async (roomNumber) => {
      if (!roomNumber.trim()) {
      setSearchError("Room number is required");
      return;
    }

    if (!/^\d+$/.test(roomNumber)) {
      setSearchError("Room number must contain only digits");
      return;
    }

    const roomInt = parseInt(roomNumber, 10);

    if (roomInt <= 0) {
      setSearchError("Room number must be greater than 0");
      return;
    }

    setSearchError(""); 
     
    setModalLoading(true);
    setIsModalOpen(true);
    try {
      const res = await axiosInstance.get(`/room-management/rooms/details/${roomInt}`);
      setSelectedRoomData(res.data);
    } catch (err) {
      alert("Room not found or error fetching details");
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(selectedFloor);
  }, [selectedFloor]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900 font-sans">
      <div className="flex items-center gap-3 mb-8">
        <BackButton />
        <DashboardButton />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900">Room Management</h2>
            <p className="text-slate-500 font-medium">Manage allocations, occupancy, and room types.</p>
          </div>
          
          {/* Quick Search */}
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search Room No..."
                className="w-full md:w-64 pl-12 pr-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value);
                                setSearchError('')}}
                onKeyDown={(e) => e.key === 'Enter' && fetchRoomDetails(searchQuery)}
              />
            </div>
            <button 
              onClick={() => fetchRoomDetails(searchQuery)}
              className="bg-slate-900 text-white px-6 rounded-2xl font-black hover:bg-slate-800 transition-all text-xs uppercase tracking-widest"
            >
              Find
            </button>
            {searchError && (
                <p className="text-red-500 text-xs mt-2 font-semibold">
                    {searchError}
                </p>
            )}
          </div>
        </div>

        {/* Floor Selection Bar */}
        <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3 px-4">
            <Layers className="text-indigo-600" size={20} />
            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Select Floor</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFloor(f)}
                className={`px-8 py-3 rounded-2xl text-sm font-black transition-all ${
                  selectedFloor === f 
                  ? "bg-slate-900 text-white shadow-xl scale-105" 
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                }`}
              >
                {`F${f}`}
              </button>
            ))}
          </div>
        </div>

        {/* Room Grid */}
        {loading ? (
          <div className="text-center py-20 font-black text-slate-300 animate-pulse uppercase tracking-widest">Fetching Floor Data...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {rooms.map((room) => (
              <button
                key={room.room_number}
                onClick={() => fetchRoomDetails(room.room_number)}
                className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all hover:-translate-y-1 text-center"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 mx-auto mb-4 transition-colors">
                  <DoorOpen size={32} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-1">{room.room_number}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{room.room_type}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* --- ROOM DETAILS MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-50 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="bg-white p-8 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
                  <Hash size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Room {selectedRoomData?.room_number}</h3>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{selectedRoomData?.room_type} Room</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {modalLoading ? (
              <div className="p-20 text-center font-bold text-slate-400 animate-pulse">Loading Details...</div>
            ) : (
              <div className="p-8 max-h-[70vh] overflow-y-auto space-y-6">
                
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <ModalStat label="Rent" value={`₹${selectedRoomData?.rent}`} icon={<CreditCard size={14}/>}/>
                  <ModalStat label="Capacity" value={`${selectedRoomData?.capacity} Beds`} icon={<Users size={14}/>}/>
                  <ModalStat 
                    label="Status" 
                    value={selectedRoomData?.status} 
                    highlight={selectedRoomData?.status === "Available" ? "text-emerald-500" : "text-rose-500"}
                  />
                </div>

                {/* Occupants List */}
                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <User size={16} className="text-indigo-500"/> Current Occupants
                  </h4>
                  <div className="space-y-3">
                    {selectedRoomData?.occupants?.length > 0 ? (
                      selectedRoomData.occupants.map((student) => (
                        <div key={student.student_id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-indigo-50 transition-colors">
                          <div>
                            <p className="font-bold text-slate-900">{student.name}</p>
                            <p className="text-[10px] font-bold text-slate-400">{student.department}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black text-indigo-600 uppercase bg-white px-3 py-1 rounded-lg border border-indigo-100">
                              {student.course}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-slate-400 font-bold text-sm italic">No occupants allocated yet.</div>
                    )}
                  </div>
                </div>

                {/* Slots info */}
                <div className="bg-indigo-600 rounded-[2rem] p-6 text-white flex justify-between items-center shadow-xl shadow-indigo-200">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Available Slots</p>
                    <p className="text-3xl font-black">{selectedRoomData?.available_slots}</p>
                  </div>
                  <Info size={40} className="opacity-20" />
                </div>

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function ModalStat({ label, value, icon, highlight = "text-slate-900" }) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center">
      <div className="flex items-center justify-center gap-1.5 mb-1 text-slate-400 font-black uppercase text-[9px] tracking-widest">
        {icon} {label}
      </div>
      <div className={`text-sm font-black ${highlight}`}>{value}</div>
    </div>
  );
}

export default ManageRooms;