import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import { BackButton,DashboardButton } from "../../components/common/NavButtons";
import { 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  ChevronLeft, 
  Info, 
  Moon, 
  User 
} from "lucide-react";

const StudentAttendancePage = ({ studentId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Default to current month and year
  const [reportDate, setReportDate] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const fetchMyStats = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/student-management/attendance/monthly-report?month=${reportDate.month}&year=${reportDate.year}`
        );
        
        // If the array is empty, it means no attendance records exist for this month yet
        setStats(res.data[0] || { Present: 0, Absent: 0, "On Leave": 0, Total: 0 });
        setError(null);
      } catch (err) {
        setError("Could not load your attendance data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyStats();
  }, [studentId, reportDate]);

  // Logic to handle empty months
  const totalDays = stats?.Total || 0;
  const percentage = totalDays > 0 
    ? ((stats.Present / totalDays) * 100).toFixed(1) 
    : "0.0";
  
  const isEligible = parseFloat(percentage) >= 75;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar title="My Attendance" />
      <div className="flex items-center gap-4 mb-8">
                  <BackButton />
                  <DashboardButton />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Month Selector & Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Attendance</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
              <Calendar size={14} /> {monthNames[reportDate.month - 1]} {reportDate.year} Reporting Cycle
            </p>
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            <select 
              value={reportDate.month}
              onChange={(e) => setReportDate({ ...reportDate, month: parseInt(e.target.value) })}
              className="bg-transparent px-4 py-2 font-black text-xs uppercase text-slate-600 outline-none cursor-pointer"
            >
              {monthNames.map((name, index) => (
                <option key={name} value={index + 1}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {error ? (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl text-rose-600 font-bold text-center">
            {error}
          </div>
        ) : (
          <>
            {/* Main Scorecard Card */}
            <div className={`rounded-[3.5rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden mb-8 transition-colors duration-500 ${isEligible ? 'bg-slate-900' : 'bg-rose-900'}`}>
              <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
                <div className="text-center lg:text-left">
                  <p className="text-white/50 font-black text-xs uppercase tracking-[0.3em] mb-4">Current Eligibility</p>
                  <div className="flex items-baseline justify-center lg:justify-start gap-1">
                    <h2 className="text-8xl md:text-9xl font-black tracking-tighter">{percentage}</h2>
                    <span className="text-4xl font-black opacity-40">%</span>
                  </div>
                  
                  <div className={`flex items-center gap-2 mt-6 font-black uppercase text-[10px] tracking-widest px-4 py-2 rounded-full inline-flex ${isEligible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-rose-200'}`}>
                    {isEligible ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    <span>{isEligible ? 'Eligible for Mess Rebate' : 'Below Attendance Threshold'}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full lg:w-72">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
                    <p className="text-[10px] uppercase font-bold text-white/40 mb-1 tracking-wider">Present</p>
                    <p className="text-4xl font-black">{stats.Present}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
                    <p className="text-[10px] uppercase font-bold text-white/40 mb-1 tracking-wider">Absent</p>
                    <p className="text-4xl font-black text-rose-400">{stats.Absent}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl col-span-2 text-center">
                    <p className="text-[10px] uppercase font-bold text-white/40 mb-1 tracking-wider">Leave Days</p>
                    <p className="text-3xl font-black text-amber-400">{stats["On Leave"]}</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative Circle */}
              <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/5 rounded-full blur-[80px]"></div>
            </div>

            {/* Insight Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm flex gap-5">
                <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                  <Info size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 uppercase text-xs mb-2 tracking-widest">Attendance Policy</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    A minimum of <strong>75% attendance</strong> is required to maintain your hostel residency and qualify for mess fee concessions.
                  </p>
                </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-amber-50/50 border border-amber-100 shadow-sm flex gap-5">
                <div className="h-12 w-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                  <Calendar size={24} />
                </div>
                <div>
                  <h4 className="font-black text-amber-600 uppercase text-xs mb-2 tracking-widest">Leave Impact</h4>
                  <p className="text-amber-700/70 text-sm leading-relaxed">
                    Approved "Leave" days are excluded from the penalty logic. They do not count as absences in your final mess bill calculation.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentAttendancePage;