import { useEffect, useState ,React} from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Html5QrcodeScanner } from "html5-qrcode";
import Navbar from "../../components/Navbar";
import { BackButton, DashboardButton } from "../../components/common/NavButtons";
import { 
  Ticket, 
  Calendar, 
  Search, 
  QrCode, 
  CameraOff, 
  Zap, 
  CheckCircle2, 
  User, 
  Clock,
  Loader2, 
  AlertCircle
} from "lucide-react";

function TokenManagement() {
  const [date, setDate] = useState("");
  const [counts, setCounts] = useState(null);
  const [tokenCode, setTokenCode] = useState("");
  const [generatedToken, setGeneratedToken] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // 📊 Fetch meal count
  const fetchCounts = async () => {
    if (!date) return alert("Select a date");

    try {
      const res = await axiosInstance.get(
        `/meal-management/meal/count/${date}`
      );
      setCounts(res.data);
      setStatusMessage(null);
    } catch (err) {
      console.error(err);
      setStatusMessage({ text :"Failed to fetch counts", type: "error"});
    }
  };

  // ⚡ Manual token generation
  const generateTokens = async () => {
    if (!date) return setStatusMessage({ text :"Select a date", type: "error"});

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await axiosInstance.post(
        `/meal-management/generate-tokens/${date}`
      );

      const isNew = !res.data.message.toLowerCase().includes("already");

      setStatusMessage({
        text: res.data.message,
        type: isNew ? "success" : "info",
      });

      setTimeout(() => setStatusMessage(null), 5000);

      //fetchCounts();

      setGeneratedToken(res.data);
    } catch (err) {
      console.error(err);
      setStatusMessage({ text :"Failed to generate tokens", type: "error"});
    } finally {
      setLoading(false);
    }

  };

  // 🔍 Verify token
  const verifyToken = async () => {
    if (!tokenCode) return alert("Enter token");

    try {
      const res = await axiosInstance.post(
        `/meal-management/warden/verify/${tokenCode}`,
      );

      setVerificationResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Invalid token");
    }
  };

  useEffect(() => {
    let scanner = null;
    if (isScanning) {
      scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      });

      scanner.render(
        (decodedText) => {
          // decodedText is the 6-digit PIN from the QR code
          setTokenCode(decodedText);
          handleVerification(decodedText); // Auto-verify on scan
          scanner.clear(); // Stop scanning after success
          setIsScanning(false);
        },
        (error) => {
          // Scanning... no need to log every frame error
        }
      );
    }
    return () => {
      if (scanner) scanner.clear();
    };
  }, [isScanning]);

  const handleVerification = async (code) => {
    const finalCode = code || tokenCode;
    if (!finalCode) return setStatusMessage({ text :"Enter or scan a token", type: "error"}); // alert("Enter or scan a token");

    try {
      const res = await axiosInstance.post(`/meal-management/warden/verify/${finalCode}`);
      setVerificationResult(res.data);
      setTokenCode(""); // Clear input on success
      setStatusMessage(null);
    } catch (err) {
      console.error(err);
      setStatusMessage({ 
        text: err.response?.data?.detail || "Invalid or Expired Token", 
        type: "error" 
      });
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title="Meal Token Management" />

      <main className="max-w-5xl mx-auto p-6 md:p-10">
        
        {/* Navigation Row */}
        <div className="flex items-center gap-3 mb-8">
          <BackButton />
          <DashboardButton />
        </div>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 text-white">
              <Ticket size={28} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Token & Verification
            </h2>
          </div>
          <p className="text-slate-500 font-medium italic ml-1">
            Monitor meal counts, generate daily tokens, and verify student dining access.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Selection & Stats */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 📅 Date Selection Card */}
            <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Calendar size={16} /> Select Date
              </h3>
              <div className="flex gap-3">
                <input
                  type="date"
                  className="flex-1 bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setStatusMessage(null);               
                  }}
                />
                <button 
                  onClick={fetchCounts}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-xs hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Search size={16} /> Get Counts
                </button>
              </div>
            </section>

            {/* 📊 Detailed Meal Count Table */}
            {counts && (
              <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-slate-900 px-6 py-4">
                  <h3 className="text-white text-xs font-black uppercase tracking-widest">
                    Meal Count: {date}
                  </h3>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-50">
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Meal Time</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-emerald-500">Veg</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-rose-500">Non-Veg</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-900 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {['breakfast', 'lunch', 'dinner'].map((meal) => (
                      <tr key={meal} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-700 capitalize">{meal}</td>
                        <td className="px-6 py-4 text-sm font-black text-emerald-600">{counts[meal].veg}</td>
                        <td className="px-6 py-4 text-sm font-black text-rose-600">{counts[meal].non_veg}</td>
                        <td className="px-6 py-4 text-sm font-black text-slate-900 text-right">{counts[meal].total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* ⚡ Manual Token Generation Card */}
            <section className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100 relative overflow-hidden">
              {/* Feedback Message Overlay */}
              {statusMessage && (
                <div className={`mb-4 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                  statusMessage.type === 'success' ? 'bg-emerald-500 text-white' : 
                  statusMessage.type === 'error' ? 'bg-rose-500 text-white' : 'bg-indigo-200 text-indigo-900'
                }`}>
                  {statusMessage.type === 'error' ? <AlertCircle size={18}/> : <CheckCircle2 size={18}/>}
                  <p className="text-xs font-black uppercase tracking-tight">{statusMessage.text}</p>
                </div>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-indigo-900 font-black text-lg mb-1 flex items-center gap-2">
                    <Zap size={20} className={loading ? "animate-pulse text-yellow-500" : "fill-indigo-600 text-indigo-600"} />
                    Token Generation
                  </h3>
                  <p className="text-indigo-600/70 text-xs font-medium max-w-xs">
                    Use manual mode for immediate overrides if auto-generation hasn't run.
                  </p>
                </div>
                <button 
                  onClick={generateTokens}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-xs shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={16}/> : "Generate Now"}
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Verification Section */}
          <div className="lg:col-span-5">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 h-full">
              <h3 className="text-slate-900 font-black text-xl mb-6 flex items-center gap-2">
                <QrCode className="text-indigo-600" size={24} />
                Verification
              </h3>

              <div className="space-y-6">
                {/* Scanner Toggle */}
                <button 
                  onClick={() => setIsScanning(!isScanning)}
                  className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 ${
                    isScanning 
                    ? "bg-rose-50 text-rose-600 border border-rose-100" 
                    : "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                  }`}
                >
                  {isScanning ? <CameraOff size={20} /> : <QrCode size={20} />}
                  {isScanning ? "Stop Scanner" : "Open QR Scanner"}
                </button>

                {/* Camera Viewport */}
                {isScanning && (
                  <div className="overflow-hidden rounded-2xl border-4 border-slate-900 bg-black">
                    <div id="reader" className="w-full"></div>
                  </div>
                )}

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                  <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="bg-white px-4">Or Enter Pin</span>
                  </div>
                </div>

                {/* Manual PIN Input */}
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="0 0 0 0 0 0"
                    maxLength={6}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-center text-2xl font-black tracking-[0.5em] text-indigo-600 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-200 placeholder:tracking-normal placeholder:text-sm"
                    value={tokenCode}
                    onChange={(e) => setTokenCode(e.target.value)}
                  />
                  <button 
                    onClick={() => handleVerification()}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95"
                  >
                    Verify PIN
                  </button>
                </div>

                {/* ✅ Verification Result Card */}
                {verificationResult && (
                  <div className="mt-6 bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] animate-in zoom-in duration-300">
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-sm uppercase mb-4">
                      <CheckCircle2 size={18} /> Verified Successfully
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700"><User size={16}/></div>
                        <p className="text-sm font-bold text-slate-700">{verificationResult.student_name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700"><Clock size={16}/></div>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-tighter">
                          {verificationResult.meal_time} • {verificationResult.date}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setVerificationResult(null)}
                      className="mt-6 w-full py-2 text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      Clear Result
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TokenManagement;
