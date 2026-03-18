import { useEffect, useState,React } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { BackButton, DashboardButton } from "../../components/common/NavButtons";
import { Plus, X, DoorOpen, Users, Layers, Tag, User } from "lucide-react";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [newRoom, setNewRoom] = useState({
    room_number: "",
    floor: "",
    capacity: "",
    room_type: "",
    rent: ""
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axiosInstance.get("/room-management/rooms/details");
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms", err);
    }
  };

  const handleChange = (e) => {
    setNewRoom({
      ...newRoom,
      [e.target.name]: e.target.value
    });
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/room-management/rooms", newRoom);
      alert("Room added successfully");

      setShowForm(false);
      setNewRoom({
        room_number: "",
        floor: "",
        capacity: "",
        room_type: "",
        rent: ""
      });

      fetchRooms();
    } catch (err) {
      console.error(err);
      alert("Failed to add room");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title="Rooms" />

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <BackButton />
              <DashboardButton />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <DoorOpen className="text-indigo-600" size={32} />
              All Rooms
            </h2>
            <p className="text-slate-500 font-medium italic">Monitor occupancy and manage room inventory.</p>
          </div>

          <button 
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all active:scale-95 shadow-lg ${
              showForm 
              ? "bg-rose-50 text-rose-600 shadow-rose-100 border border-rose-100 hover:bg-rose-100" 
              : "bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700"
            }`}
          >
            {showForm ? <X size={20} /> : <Plus size={20} />}
            {showForm ? "Close Form" : "Add New Room"}
          </button>
        </div>

        {/* Add Room Form Section */}
        {showForm && (
          <div className="mb-12 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Plus className="text-indigo-600" size={20} />
              Create New Room Entry
            </h3>
            <form className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4" onSubmit={handleAddRoom}>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Number</label>
                <input name="room_number" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 101" onChange={handleChange} required />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Floor</label>
                <input name="floor" type="number" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500" placeholder="Floor No" onChange={handleChange} required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacity</label>
                <input name="capacity" type="number" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500" placeholder="Max Students" onChange={handleChange} required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Type</label>
                <select name="room_type" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 cursor-pointer" onChange={handleChange} required>
                  <option value="">Select Type</option>
                  <option value="AC and attached">AC & Attached</option>
                  <option value="AC and Non attached">AC & Non Attached</option>
                  <option value="Ordinary and Attached">Ordinary & Attached</option>
                  <option value="Ordinary and Non Attached">Ordinary & Non Attached</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rent (₹)</label>
                <input name="rent" type="number" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500" placeholder="Monthly Rent" onChange={handleChange} required />
              </div>

              <div className="md:col-span-3 lg:col-span-5 flex justify-end pt-2">
                <button type="submit" className="bg-slate-900 text-white px-10 py-3 rounded-xl font-black hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
                  Register Room
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Rooms Table Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Room Info</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Type & Rent</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Occupancy</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Current Occupants</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rooms.map((room) => (
                  <tr key={room.room_number} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-black">
                          {room.room_number}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">Floor {room.floor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-700">{room.room_type}</p>
                      <p className="text-xs font-black text-indigo-500 tracking-tight">₹{room.rent} / month</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-lg font-black text-slate-800">{room.current_occupancy} / {room.capacity}</span>
                        <div className="w-12 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full transition-all ${room.status === "Full" ? "bg-rose-500" : "bg-indigo-500"}`}
                            style={{ width: `${(room.current_occupancy / room.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        room.status === "Full" 
                        ? "bg-rose-50 text-rose-600 border border-rose-100" 
                        : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {room.occupants.length === 0 ? (
                        <span className="text-slate-400 text-xs italic font-medium">Vacant</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {room.occupants.map((s) => (
                            <span key={s.student_id} className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[11px] font-bold border border-slate-200">
                              <User size={10} /> {s.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Rooms;
