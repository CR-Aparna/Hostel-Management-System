import {useState, useEffect,React} from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { BackButton,DashboardButton } from "../../components/common/NavButtons";
import Navbar from "../../components/Navbar";
import { 
  CreditCard, 
  Receipt, 
  Calendar, 
  IndianRupee, 
  ArrowUpRight, 
  Info, 
  X,
  Clock,
  AlertCircle
} from "lucide-react";

function PendingPayments() {
    const [pending_payments, setPendingPayments] = useState([]);
    const [invoice_items, setInvoiceItems] = useState([]);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPendingPayments();    
    }, []);
    useEffect(() => {
        if (selectedInvoiceId) {
            setSelectedInvoiceId(selectedInvoiceId);
        }
    }, [selectedInvoiceId]);

    const fetchPendingPayments = async () => {
        try{
            const res = await axiosInstance.get("/payment-management/student/invoices");
            setPendingPayments(res.data);
        }
        catch(err){
            console.error(err);    
        }    
    };
    const fetchInvoiceItems = async (invoiceId) => {
        try{
            const res = await axiosInstance.get(`/payment-management/invoice-items/${invoiceId}`);
            setInvoiceItems(res.data);
            setShowModal(true);
        }
        catch(err){
            console.error(err);    
        }
    };

    const handlePayNow = async (invoiceId) => {
        try {
            await axiosInstance.get(`/payment-management/current-payment/${invoiceId}`);
            alert("Redirecting to payment page...");
            //fetchPendingPayments();
            navigate(`/student/make-payment/${invoiceId}`)
        } catch (err) {
            console.error(err);
            alert("Payment failed");
        }
    };


 return (
    <main className="min-h-screen bg-slate-50">
        < Navbar title="Pending Payments"/>
        <div className="flex items-center gap-4 mb-8">
            <BackButton />
            <DashboardButton />
        </div>
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 text-white">
          <Receipt size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Pending Payments
          </h2>
          <p className="text-slate-500 font-medium italic">
            Review your outstanding dues and settle invoices to avoid late fees.
          </p>
        </div>
      </header>

      {pending_payments.length === 0 ? (
        <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="text-slate-300" size={32} />
          </div>
          <p className="text-slate-400 font-bold tracking-tight">Everything is settled! No pending invoices.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Inv #</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center">Invoice Date</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center">Due Date</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pending_payments.map((pending_payment) => (
                  <tr key={pending_payment.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-5 font-mono font-bold text-slate-600">
                      #{pending_payment.id}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-700">
                        <Calendar size={14} className="text-slate-400" />
                        {pending_payment.created_date ? new Date(pending_payment.created_date).toLocaleDateString("en-IN") : '--'}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-700">
                        <Clock size={14} className="text-slate-400" />
                        {pending_payment.due_date ? new Date(pending_payment.due_date).toLocaleDateString("en-IN") : '--'}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right font-black text-slate-900">
                      ₹{pending_payment.amount}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                        pending_payment.status.toLowerCase() === 'overdue' 
                        ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                        : 'bg-orange-50 text-orange-600 border border-orange-100'
                      }`}>
                        {pending_payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handlePayNow(pending_payment.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-2"
                        >
                          Pay Now <ArrowUpRight size={14} />
                        </button>
                        <button 
                          onClick={() => fetchInvoiceItems(pending_payment.id)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-xl transition-all"
                          title="View Details"
                        >
                          <Info size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ✅ Fee Breakdown Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <header className="bg-slate-900 p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <IndianRupee className="text-indigo-400" size={20} />
                <h3 className="font-black text-sm uppercase tracking-widest">Fee Breakdown</h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </header>

            <div className="p-8">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">Item Description</th>
                    <th className="pb-3 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {invoice_items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-4 text-sm font-bold text-slate-700">
                        {item.description || item.item_name}
                      </td>
                      <td className="py-4 text-sm font-black text-slate-900 text-right">
                        ₹{item.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="mt-8 pt-6 border-t border-slate-100">
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-full bg-slate-900 text-white py-3 rounded-2xl font-black text-xs hover:bg-slate-800 transition-all"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </main>
  );
}
export default PendingPayments;