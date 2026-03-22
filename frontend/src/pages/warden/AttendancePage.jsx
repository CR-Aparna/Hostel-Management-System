/*import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Check, X, Plane, Clock } from "lucide-react";

const AttendancePage = () => {
  const [students, setStudents] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState("All");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const uniqueFloors = ["All", ...new Set(students.map(s => s.floor).filter(f => f !== "N/A"))].sort();

  const filteredStudents = selectedFloor === "All" 
    ? students 
    : students.filter(s => s.floor === selectedFloor);

  useEffect(() => {
    fetchList();
  }, [selectedDate]);

  const fetchList = async () => {
    const res = await axiosInstance.get(`/student-management/attendance/daily-list?target_date=${selectedDate}`);
    setStudents(res.data);
  };

  const updateStatus = async (studentId, newStatus) => {
    try {
      await axiosInstance.post("/student-management/attendance/mark", {
        student_id: studentId,
        status: newStatus,
        date: selectedDate
      });
      // Optimistic Update
      setStudents(prev => prev.map(s => 
        s.student_id === studentId ? { ...s, status: newStatus } : s
      ));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-slate-900">Nightly Attendance</h1>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 rounded-xl border border-slate-200 font-bold text-sm"
        />
      </div>

      <div className="space-y-3">
        {students.map((s) => (
          <div key={s.student_id} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
            <div>
              <p className="font-bold text-slate-800 uppercase text-sm">{s.name}</p>
              <p className="text-[10px] text-slate-400 font-bold">ROOM {s.room_number}</p>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
              {[
                { id: "Present", icon: <Check size={14}/>, color: "bg-emerald-500" },
                { id: "On Leave", icon: <Plane size={14}/>, color: "bg-amber-500" },
                { id: "Absent", icon: <X size={14}/>, color: "bg-rose-500" }
              ].map((btn) => (
                <button
                  key={btn.id}
                  disabled={s.is_locked}
                  onClick={() => updateStatus(s.student_id, btn.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                    s.status === btn.id ? `${btn.color} text-white shadow-md` : "text-slate-400"
                  } ${s.is_locked ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {btn.icon} {btn.id}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendancePage;*/


import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Check, X, Plane, LayoutGrid } from "lucide-react";

const AttendancePage = () => {
  const [students, setStudents] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState("All");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchList();
  }, [selectedDate]);

  const fetchList = async () => {
    try {
      const res = await axiosInstance.get(`/student-management/attendance/daily-list?target_date=${selectedDate}`);
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  const updateStatus = async (studentId, newStatus) => {
    try {
      await axiosInstance.post("/student-management/attendance/mark", {
        student_id: studentId,
        status: newStatus,
        date: selectedDate
      });
      // Optimistic Update: update local state immediately
      setStudents(prev => prev.map(s => 
        s.student_id === studentId ? { ...s, status: newStatus } : s
      ));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Helper logic for filtering
  const uniqueFloors = ["All", ...new Set(students.map(s => s.floor).filter(f => f !== "N/A"))].sort();
  const filteredStudents = selectedFloor === "All" 
    ? students 
    : students.filter(s => s.floor === selectedFloor);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hostel Attendance</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
            Viewing: {selectedFloor === "All" ? "Full Hostel" : `Floor ${selectedFloor}`}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase ml-2">Date:</span>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-1 rounded-lg font-bold text-sm outline-none text-indigo-600"
          />
        </div>
      </div>

      {/* Floor Navigation */}
      <div className="flex flex-wrap gap-2 mb-10 bg-slate-200/50 p-1.5 rounded-[2rem]">
        {uniqueFloors.map(floor => (
          <button
            key={floor}
            onClick={() => setSelectedFloor(floor)}
            className={`flex-1 min-w-[100px] py-3 rounded-[1.5rem] text-[10px] font-black uppercase transition-all ${
              selectedFloor === floor 
                ? "bg-white text-slate-900 shadow-sm scale-[1.02]" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {floor === "All" ? "All Students" : `Floor ${floor}`}
          </button>
        ))}
      </div>

      {/* Student List */}
      <div className="space-y-4">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <LayoutGrid size={40} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No students found</p>
          </div>
        ) : (
          filteredStudents.map((s) => (
            <div key={s.student_id} className="bg-white p-5 pl-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between shadow-sm transition-all hover:border-indigo-100">
              <div className="flex flex-col">
                <span className="font-black text-slate-800 text-sm tracking-tight uppercase">{s.name}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-md">ROOM {s.room_number}</span>
                  <span className="bg-indigo-50 text-indigo-400 text-[9px] font-black px-2 py-0.5 rounded-md">FLOOR {s.floor}</span>
                </div>
              </div>

              {/* Status Controls */}
              <div className="flex bg-slate-50 p-1.5 rounded-[1.8rem] gap-1 border border-slate-100">
                {[
                  { id: "Present", icon: <Check size={14}/>, color: "bg-emerald-500", text: "text-emerald-600" },
                  { id: "On Leave", icon: <Plane size={14}/>, color: "bg-amber-500", text: "text-amber-600" },
                  { id: "Absent", icon: <X size={14}/>, color: "bg-rose-500", text: "text-rose-600" }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    disabled={s.is_locked}
                    onClick={() => updateStatus(s.student_id, btn.id)}
                    className={`flex items-center justify-center gap-2 w-10 h-10 sm:w-auto sm:px-5 rounded-[1.2rem] transition-all ${
                      s.status === btn.id 
                        ? `${btn.color} text-white shadow-lg` 
                        : `text-slate-300 hover:bg-white hover:shadow-sm`
                    } ${s.is_locked ? "opacity-30 cursor-not-allowed grayscale" : ""}`}
                    title={btn.id}
                  >
                    {btn.icon}
                    <span className="hidden md:inline text-[10px] font-black uppercase tracking-tighter">{btn.id}</span>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AttendancePage;