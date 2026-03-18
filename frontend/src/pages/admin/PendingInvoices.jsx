import { useState, useEffect,React } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { CreditCard, User, Calendar, Receipt, Send, ChevronRight, AlertCircle } from 'lucide-react';

function PendingInvoices() {
    const [invoices, setInvoices] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // 1. ADD THIS STATE to store the selection
    const [selectedStudentId, setSelectedStudentId] = useState("");

    useEffect(() => {
        fetchActiveStudents();
        fetchInvoices();
    }, []);

    const fetchActiveStudents = async () => {
        try {
            const res = await axiosInstance.get("/student-management/get/active-students"); 
            setStudents(res.data);
        } catch (err) {
            console.error("Error fetching students", err);
        }
    };


    const fetchInvoices = async () => {
        try {
            const res = await axiosInstance.get("/payment-management/all-pending-invoices");
            setInvoices(res.data);
        } catch (err) {
            console.error("Error fetching invoices", err);
        }
    };

    
    // 2. CRITICAL FIX: Ensure studentId is passed correctly
    const handleGenerateInvoice = async (id) => {
        if (!id) {
            alert("Please select a student first!");
            return;
        }

        setLoading(true);
        try {
            // This 'id' must be a simple number/string, NOT an event object
            const response = await axiosInstance.post(`/payment-management/generate-invoice/${id}`);
            if (response.data.invoice_status) {
                alert("Invoice already exists!");
            } else {
                alert("Invoice generated successfully!");
            }
            setSelectedStudentId(""); // Reset dropdown
            fetchInvoices(); 
        } catch (err) {
            // Improved error alert to avoid [object Object]
            const errorMsg = err.response?.data?.detail || "Failed to generate invoice.";
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
        <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <header className="mb-10">
                <h2 className="text-3xl font-black tracking-tight text-slate-900">Payment Management</h2>
                <p className="text-slate-500 font-medium">Generate and monitor monthly student invoices.</p>
            </header>

            {/* Quick Invoice Generation Section */}
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Receipt size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Quick Invoice Generation</h3>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Select Student
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select 
                                className="w-full pl-12 pr-10 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm font-bold text-slate-700 appearance-none cursor-pointer"
                                value={selectedStudentId} 
                                onChange={(e) => setSelectedStudentId(e.target.value)}
                            >
                                <option value="">Choose a student from the list...</option>
                                {students.map(s => (
                                    <option key={s.student_id} value={s.student_id}>
                                        {s.name} — {s.admission_number}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronRight size={18} className="rotate-90" />
                            </div>
                        </div>
                    </div>

                    <button 
                        disabled={loading || !selectedStudentId} 
                        onClick={() => handleGenerateInvoice(selectedStudentId)}
                        className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <CreditCard size={18} />
                        )}
                        {loading ? "Generating..." : "Generate Invoice"}
                    </button>
                </div>
            </section>

            {/* Pending Payments List Section */}
            <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <AlertCircle className="text-amber-500" size={20} />
                        Pending Payments
                    </h3>
                    <span className="px-4 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">
                        {invoices.length} Items Total
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Details</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Billing Cycle</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Due Date</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {invoices.length > 0 ? (
                                invoices.map((invoice) => (
                                    <tr key={invoice.id} className="group hover:bg-slate-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-slate-800">{invoice.student_name}</p>
                                            <p className="text-xs font-mono text-slate-400">{invoice.student_admission_number}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                                <Calendar size={14} className="text-indigo-400" />
                                                {invoice.month}/{invoice.year}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-medium text-slate-500">
                                            {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-IN') : "--"}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-lg font-black text-slate-900">₹{invoice.total_amount}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all shadow-md active:scale-95">
                                                <Send size={14} />
                                                Inform Student
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <p className="text-slate-400 font-medium italic">No pending invoices found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    </div>
);
}

export default PendingInvoices;