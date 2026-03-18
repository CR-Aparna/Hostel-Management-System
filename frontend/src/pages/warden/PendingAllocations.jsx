import { useEffect, useState,React } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { BackButton, DashboardButton } from "../../components/common/NavButtons";
import { UserPlus, Star, Home, CheckCircle } from "lucide-react";


function PendingAllocations() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState({});
  const [suggestedRooms, setSuggestedRooms] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch students and rooms
      const studentsRes = await axiosInstance.get(
        "/room-management/pending-allocations"
      );
      const roomsRes = await axiosInstance.get(
        "/room-management/available-rooms"
      );

      setStudents(studentsRes.data);
      setRooms(roomsRes.data);

      // 🔥 Fetch suggested rooms in parallel
      const suggestionPromises = studentsRes.data.map((student) =>
        axiosInstance.get(
          `/room-management/rooms/suggested/${student.student_id}`
        )
      );

      const results = await Promise.all(suggestionPromises);

      const suggestions = {};
      studentsRes.data.forEach((student, index) => {
        suggestions[student.student_id] = results[index].data;
      });

      setSuggestedRooms(suggestions);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const handleRoomSelect = (studentId, roomId) => {
    setSelectedRooms({
      ...selectedRooms,
      [studentId]: roomId,
    });
  };

  const handleAllocate = async (studentId,roomId) => {
    const roomNumber = selectedRooms[studentId];

    if (!roomNumber) {
      alert("Please select a room");
      return;
    }

    try {
      await axiosInstance.post("/room-management/rooms/allocate", {
        student_id: studentId,
        room_number: roomNumber,
      });

      alert("Room allocated successfully");

      // Refresh data
      fetchAllData();
    } catch (err) {
      console.error(err);
      alert("Allocation failed");
    }
  };

return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title="Pending Allocations" />

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        
        {/* Navigation Row */}
        <div className="flex items-center gap-3 mb-8">
          <BackButton />
          <DashboardButton />
        </div>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 text-white">
              <UserPlus size={28} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Approved Students
            </h2>
          </div>
          <p className="text-slate-500 font-medium italic ml-1">
            Assign rooms to students who have been cleared for admission.
          </p>
        </header>

        {students.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-slate-200 shadow-sm">
            <CheckCircle size={48} className="mx-auto text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">All Caught Up!</h3>
            <p className="text-slate-400 mt-2 font-medium">No pending allocations at this time.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Detail</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Preference</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Select Room</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.map((student) => {
                    const studentSuggestedData = suggestedRooms[student.student_id] || {};
                    const preferredRooms = studentSuggestedData.preferred_rooms || [];

                    return (
                      <tr key={student.student_id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <span className="font-bold text-slate-800 text-lg block">{student.name}</span>
                          <span className="text-xs text-slate-400 font-mono uppercase tracking-tighter">Admission No: {student.admission_number}</span>
                        </td>
                        
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                            student.preferred_room_type?.includes("AC") 
                            ? "bg-indigo-50 text-indigo-600 border-indigo-100" 
                            : "bg-slate-50 text-slate-600 border-slate-100"
                          }`}>
                            <Star size={10} />
                            {student.preferred_room_type || "No Preference"}
                          </span>
                        </td>

                        <td className="px-8 py-6">
                          <select
                            className="w-full max-w-[200px] bg-slate-100 border-none rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all"
                            onChange={(e) => handleRoomSelect(student.student_id, e.target.value)}
                          >
                            <option value="">Select Room</option>
                            {preferredRooms.length > 0 && (
                              <optgroup label="⭐ Preferred (Matching)">
                                {preferredRooms.map((room) => (
                                  <option key={room.room_number} value={room.room_number}>
                                    Room {room.room_number} ({room.room_type})
                                  </option>
                                ))}
                              </optgroup>
                            )}
                            <optgroup label="🏠 All Other Vacancies">
                              {rooms
                                .filter((room) => !preferredRooms.some((s) => s.room_number === room.room_number))
                                .map((room) => (
                                  <option key={room.room_number} value={room.room_number}>
                                    Room {room.room_number} ({room.room_type})
                                  </option>
                                ))}
                            </optgroup>
                          </select>
                        </td>

                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => handleAllocate(student.student_id)}
                            className="bg-slate-900 text-white font-black px-6 py-2.5 rounded-xl text-xs hover:bg-indigo-600 transition-all shadow-lg active:scale-95 flex items-center gap-2 ml-auto"
                          >
                            <Home size={14} />
                            Allocate
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default PendingAllocations;
