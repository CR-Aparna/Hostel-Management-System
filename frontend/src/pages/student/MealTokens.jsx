import { useEffect, useState ,React} from "react";
import axiosInstance from "../../utils/axiosInstance";
import QRCode from "react-qr-code"; // 👈 Import the QR component
import Navbar from "../../components/Navbar";
import { BackButton, DashboardButton } from "../../components/common/NavButtons";
import { Ticket, Calendar, ShieldCheck, QrCode } from "lucide-react";

function MealTokens() {
  const [tokens, setTokens] = useState([]);
  const [date, setDate] = useState("");

  useEffect(() => {
    const effectiveDate = getEffectiveDate();
    setDate(effectiveDate);
    fetchTokens(effectiveDate);
  }, []);

  const getEffectiveDate = () => {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setHours(21, 0, 0, 0);

    if (now > cutoff) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    }
    return now.toISOString().split("T")[0];
  };

  const fetchTokens = async (date) => {
    try {
      const res = await axiosInstance.get(`/meal-management/my-tokens/${date}`);
      setTokens(res.data);
    } catch (err) {
      console.error("Error fetching tokens", err);
    }
  };

return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar title="Digital Meal Pass" />

      <main className="flex-1 max-w-lg mx-auto w-full p-6 md:p-8 space-y-8">
        
        {/* Navigation Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <BackButton />
            <DashboardButton />
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Pass Date</span>
             <span className="text-sm font-bold text-indigo-600 leading-tight">{date}</span>
          </div>
        </div>

        <header className="text-center space-y-2">
          <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-indigo-600 mb-2">
            <Ticket size={32} />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Your Tokens</h2>
          <p className="text-slate-500 text-sm font-medium italic">Present these at the mess entrance</p>
        </header>

        <div className="flex flex-col gap-8 mt-6">
          {tokens.length === 0 ? (
            <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center space-y-3">
              <Calendar className="mx-auto text-slate-300" size={48} />
              <p className="text-slate-400 font-bold tracking-tight">No tokens available for today.</p>
            </div>
          ) : (
            tokens.map((t) => (
              <div 
                key={t.id} 
                className="relative bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-slate-100 overflow-hidden"
              >
                {/* Meal Header */}
                <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
                  <h3 className="text-white text-xs font-black uppercase tracking-[0.2em]">
                    {t.meal_time} Pass
                  </h3>
                  <ShieldCheck className="text-indigo-400" size={18} />
                </div>

                <div className="p-8 text-center space-y-6">
                  {/* QR CODE CONTAINER */}
                  <div className="relative inline-block group">
                    <div className="absolute -inset-2 bg-indigo-50 rounded-[2rem] scale-95 group-hover:scale-100 transition-transform duration-500"></div>
                    <div className="relative bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm inline-block">
                      <QRCode 
                        value={t.short_pin} 
                        size={180} 
                        level="H" 
                        className="mx-auto"
                      />
                    </div>
                  </div>

                  {/* TICKET DIVIDER (Visual Dash) */}
                  <div className="flex items-center gap-4 py-2">
                    <div className="h-[2px] flex-1 bg-dashed border-t-2 border-dashed border-slate-200" />
                    <div className="text-slate-300"><QrCode size={16}/></div>
                    <div className="h-[2px] flex-1 bg-dashed border-t-2 border-dashed border-slate-200" />
                  </div>

                  {/* VERIFICATION PIN */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification PIN</p>
                    <h1 className="text-5xl font-black tracking-[0.25em] text-slate-900 font-mono">
                      {t.short_pin}
                    </h1>
                  </div>

                  {/* FOOTER INFO */}
                  <div className="bg-rose-50 rounded-2xl p-4 mt-4">
                    <p className="text-[11px] font-bold text-rose-600 leading-tight">
                      Valid only for today. Present this to the Warden at the mess entrance.
                    </p>
                  </div>
                </div>

                {/* Decorative Ticket Notches */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-slate-50 rounded-r-full border border-l-0 border-slate-100 shadow-inner"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-slate-50 rounded-l-full border border-r-0 border-slate-100 shadow-inner"></div>
              </div>
            ))
          )}
        </div>

        {/* Support Footer */}
        <footer className="text-center pb-8">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Problems with your pass? Contact Warden Office
          </p>
        </footer>
      </main>
    </div>
  );
}

export default MealTokens;
