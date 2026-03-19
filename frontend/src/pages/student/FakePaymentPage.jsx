import { useState , useEffect,React} from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useParams } from "react-router-dom";
import { 
  CreditCard, 
  Smartphone, 
  Landmark, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  AlertCircle
} from "lucide-react";

function FakePaymentPage() {
  const [current_payment, setCurrentPayment] = useState({});
  // ✅ NEW: payment method state
  const [method, setMethod] = useState("UPI");
  const { invoiceId } = useParams();

  useEffect(() => {
    fetchPaymentDetails(invoiceId);
  }, [invoiceId]);

  const fetchPaymentDetails = async (invoiceId) => {
    try {
      const res = await axiosInstance.get(`/payment-management/current-payment/${invoiceId}`);
      setCurrentPayment({ 
        order_id: res.data.order_id,
        amount: res.data.amount,
        status: res.data.status
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayment = async (status) => {
    try{  
      const res = await axiosInstance.post("/payment-management/verify", {
        status,
        method, // ✅ dynamic now
      });
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }

    if (status === "success") {
      alert("✅ Payment Successful");
      window.location.href = "/student/dashboard";
    } else {
      alert("❌ Payment Failed");
    }
  };

return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      
      {/* 🔒 Security Header */}
      <div className="flex items-center gap-2 mb-8 text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
        <Lock size={12} /> Secure 256-bit SSL Encrypted Payment
      </div>

      <main className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 overflow-hidden border border-slate-100">
        
        {/* Order Summary Header */}
        <header className="bg-slate-900 p-8 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Order ID</p>
              <h2 className="text-sm font-mono font-bold">{current_payment.order_id}</h2>
            </div>
            <div className="bg-indigo-500/20 p-2 rounded-xl border border-indigo-500/30">
              <ShieldCheck className="text-indigo-400" size={20} />
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Amount to Pay</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-medium opacity-60">₹</span>
              <span className="text-4xl font-black tracking-tight">{current_payment.amount}</span>
            </div>
          </div>
        </header>

        {/* Payment Methods Section */}
        <div className="p-8 space-y-6">
          <h3 className="text-slate-900 font-black text-lg tracking-tight mb-4">Select Payment Method</h3>
          
          <div className="space-y-3">
            {/* UPI Option */}
            <label className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              method === "UPI" ? "border-indigo-600 bg-indigo-50/50" : "border-slate-100 hover:bg-slate-50"
            }`}>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${method === "UPI" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  <Smartphone size={20} />
                </div>
                <span className="font-bold text-slate-700">UPI (GPay, PhonePe)</span>
              </div>
              <input
                type="radio"
                className="w-5 h-5 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                value="UPI"
                checked={method === "UPI"}
                onChange={(e) => setMethod(e.target.value)}
              />
            </label>

            {/* Card Option */}
            <label className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              method === "Card" ? "border-indigo-600 bg-indigo-50/50" : "border-slate-100 hover:bg-slate-50"
            }`}>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${method === "Card" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  <CreditCard size={20} />
                </div>
                <span className="font-bold text-slate-700">Debit / Credit Card</span>
              </div>
              <input
                type="radio"
                className="w-5 h-5 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                value="Card"
                checked={method === "Card"}
                onChange={(e) => setMethod(e.target.value)}
              />
            </label>

            {/* NetBanking Option */}
            <label className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              method === "NetBanking" ? "border-indigo-600 bg-indigo-50/50" : "border-slate-100 hover:bg-slate-50"
            }`}>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${method === "NetBanking" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  <Landmark size={20} />
                </div>
                <span className="font-bold text-slate-700">Net Banking</span>
              </div>
              <input
                type="radio"
                className="w-5 h-5 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                value="NetBanking"
                checked={method === "NetBanking"}
                onChange={(e) => setMethod(e.target.value)}
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 space-y-3">
            <button 
              onClick={() => handlePayment("success")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-indigo-100"
            >
              Pay Now <ArrowRight size={18} />
            </button>

            <button 
              onClick={() => handlePayment("failure")}
              className="w-full bg-white text-slate-400 hover:text-rose-500 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <AlertCircle size={14} /> Simulate Failure
            </button>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <footer className="bg-slate-50 p-6 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
            By clicking Pay Now, you agree to HostelHub's Terms of Service.<br/>
            Payments are processed securely via our banking partners.
          </p>
        </footer>
      </main>
      
      {/* Logos of Payment Partners (Visual Only) */}
      <div className="mt-8 flex gap-6 opacity-30 grayscale items-center">
        <span className="font-black italic text-xl">VISA</span>
        <span className="font-black italic text-xl">mastercard</span>
        <span className="font-black italic text-xl">UPI</span>
      </div>
    </div>
  );
}

export default FakePaymentPage;