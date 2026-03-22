import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Download, Filter, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { BackButton, DashboardButton } from '../../components/common/NavButtons';

const AdminAttendanceReport = () => {
  const [report, setReport] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    fetchReport();
  }, [selectedMonth]);

  const fetchReport = async () => {
    const res = await axiosInstance.get(`/student-management/attendance/monthly-report?month=${selectedMonth}&year=2026`);
    setReport(res.data);
  };

  const avgAttendance = report.length > 0 
    ? (report.reduce((acc, curr) => acc + (curr.Present / curr.Total), 0) / report.length * 100).toFixed(1)
    : "0.0"

  const lowAttendanceCount = report.filter(row => {
    const percentage = (row.Present / row.Total) * 100;
    return percentage < 75;
  }).length;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <Navbar title="Attendance Report"/>
      <div className="flex items-center gap-3 mb-8">
                      <BackButton />
                      <DashboardButton />
            </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Monthly Attendance</h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">Administrative Control Panel</p>
          </div>
          
          <div className="flex gap-3">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white border-none shadow-sm rounded-2xl px-6 py-3 font-bold text-slate-700 outline-none ring-1 ring-slate-200"
            >
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
              {/* Add other months */}
            </select>
            <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
              <Download size={18} /> Export PDF
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-slate-400 text-xs font-black uppercase mb-2">Total Students</p>
                <h2 className="text-4xl font-black text-slate-900">{report.length}</h2>
            </div>
            <div className="bg-emerald-500 p-8 rounded-[2.5rem] shadow-xl shadow-emerald-100 text-white">
        <p className="opacity-80 text-xs font-black uppercase mb-2">Avg. Attendance</p>
        <h2 className="text-4xl font-black">{avgAttendance}%</h2>
    </div>

    {/* Dynamic Low Attendance Card */}
    <div className={`p-8 rounded-[2.5rem] border shadow-sm ${
        lowAttendanceCount > 0 ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-100'
    }`}>
        <p className={`${lowAttendanceCount > 0 ? 'text-rose-400' : 'text-slate-400'} text-xs font-black uppercase mb-2`}>
            Low Attendance ({"<"}75%)
        </p>
        <h2 className={`text-4xl font-black ${lowAttendanceCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {lowAttendanceCount.toString().padStart(2, '0')}
        </h2>
    </div>
        </div>

        {/* Report Table */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Student Details</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-center">Present</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-center">On Leave</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-center">Absent</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-right">Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {report.map(row => {
                const percentage = ((row.Present / row.Total) * 100).toFixed(1);
                return (
                  <tr key={row.student_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-800">{row.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{row.admission_no}</p>
                    </td>
                    <td className="px-8 py-6 text-center font-black text-slate-600">{row.Present}</td>
                    <td className="px-8 py-6 text-center font-black text-slate-400">{row["On Leave"]}</td>
                    <td className="px-8 py-6 text-center font-black text-rose-500">{row.Absent}</td>
                    <td className="px-8 py-6 text-right">
                      <span className={`px-4 py-2 rounded-xl text-xs font-black ${
                        percentage >= 75 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                      }`}>
                        {percentage}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendanceReport;