import { useEffect, useState,React } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { BackButton, DashboardButton } from "../../components/common/NavButtons";
import { 
  History, 
  Download, 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  Calendar, 
  Search,
  FileText
} from "lucide-react";

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const res = await axiosInstance.get("/payment-management/payment-history");
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payment history:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = async (invoiceId) => {
  try {
    const response = await axiosInstance.get(`/payment-management/download-receipt/${invoiceId}`, {
      responseType: 'blob', // IMPORTANT: Tells Axios to handle binary data
    });

    // Create a temporary link element to trigger the download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `receipt_${invoiceId}.pdf`);
    
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed", error);
  }
};

return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar title="Financial Records" />

      <main className="flex-1 max-w-[1400px] mx-auto w-full p-6 md:p-8 space-y-6">
        
        {/* Top Navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <BackButton />
            <DashboardButton />
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200 text-slate-500">
            <Calendar size={16} />
            <span className="text-xs font-black uppercase tracking-widest">Full Statement</span>
          </div>
        </div>

        <header className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-slate-900 rounded-2xl shadow-lg text-white">
            <History size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Payment History</h2>
            <p className="text-slate-500 text-sm font-medium">View and download your past transaction receipts</p>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="animate-spin mb-4 text-indigo-600"><History size={40}/></div>
              <p className="text-xs font-black uppercase tracking-[0.2em]">Fetching Records...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-slate-200">
                <Search size={40} />
              </div>
              <p className="text-slate-400 font-bold tracking-tight">No payment records found in your account.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Method</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Date</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 leading-tight">#{payment.order_id}</span>
                          <span className="text-[10px] font-mono text-slate-400">{payment.transaction_id || "TXN-PENDING"}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-5 text-sm font-bold text-slate-600">
                        <div className="flex items-center gap-2">
                          <CreditCard size={14} className="text-indigo-400" />
                          {payment.payment_method || "—"}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          payment.status === "success" 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : "bg-rose-50 text-rose-600 border-rose-100"
                        }`}>
                          {payment.status === "success" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {payment.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-center text-sm font-bold text-slate-500">
                        {payment.payment_date
                          ? new Date(payment.payment_date).toLocaleDateString('en-IN')
                          : "—"}
                      </td>

                      <td className="px-6 py-5 text-right font-black text-slate-900">
                        ₹{payment.amount}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => handleDownload(payment.invoice_id)}
                          className="inline-flex items-center gap-2 bg-white hover:bg-slate-900 hover:text-white border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
                        >
                          <Download size={14} /> Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bottom Notice */}
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <FileText size={14} />
          <p className="text-[10px] font-bold uppercase tracking-[0.1em]">
            Official Digital Receipts generated by HostelHub Financial Systems
          </p>
        </div>
      </main>
    </div>
  );
}

export default PaymentHistory;