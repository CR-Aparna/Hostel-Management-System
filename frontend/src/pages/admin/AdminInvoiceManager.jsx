import React, { useState } from 'react';
import axiosInstance from "../../utils/axiosInstance";
import { Search, Receipt, Calendar, CheckCircle, AlertCircle } from "lucide-react";

const AdminInvoiceManager = () => {
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchStudent = async (e) => {
    e.preventDefault();
    if (!admissionNumber.trim()) return;

    setLoading(true);
    setStudent(null); // Clear previous results
    setInvoices([]);

    try {
      // Step 1: Use your new path-based search endpoint
      const res = await axiosInstance.get(`/student-management/search/${admissionNumber}`);
      
      if (res.data) {
        setStudent(res.data);
        // Step 2: Use the student_id from the response to fetch invoices
        fetchInvoices(res.data.student_id);
      }
    } catch (err) {
      alert("Student not found with this Admission Number");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async (id) => {
    try {
      const res = await axiosInstance.get(`/payment-management/all_invoices/${id}`);
      setInvoices(res.data);
    } catch (err) {
      console.error("Error fetching invoices", err);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Receipt className="text-indigo-600" /> Student Invoice Lookup
        </h2>
        
        <form onSubmit={handleSearchStudent} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Enter Admission Number (e.g., ADM/2024/001)"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400 text-sm"
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {/* Invoice Results Table (Remains the same as previous version) */}
      {student && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4 px-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
              <p className="text-sm text-slate-500">Admission No: {student.admission_number}</p>
            </div>
            <span className="bg-indigo-50 text-indigo-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {invoices.length} Invoices Found
            </span>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Month/Year</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Due Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoices.length > 0 ? (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                            <Calendar size={18} />
                          </div>
                          <span className="font-semibold text-slate-700">
                            {getMonthName(inv.month)} {inv.year}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">₹{inv.total_amount}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        {new Date(inv.due_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-indigo-600 hover:text-indigo-800 font-bold text-sm">View Details</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">No invoices generated for this student yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ... StatusBadge and getMonthName helpers remain the same
const StatusBadge = ({ status }) => {
  const isPaid = status.toLowerCase() === "paid";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold capitalize ${
      isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
    }`}>
      {isPaid ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
      {status}
    </span>
  );
};

const getMonthName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString('default', { month: 'long' });
};

export default AdminInvoiceManager;