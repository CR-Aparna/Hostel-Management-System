import { useEffect, useState ,React,cloneElement} from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { Users, Leaf, Drumstick, TrendingUp, Utensils, Trash2, Calendar } from "lucide-react";
import { BackButton, DashboardButton } from "../../components/common/NavButtons";

function MealSummary({ title = "Meal Summary", showNav = true }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axiosInstance.get("/meal-management/monthly-summary");
        setSummary(res.data);
      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-indigo-600 font-bold animate-pulse">
      Loading Monthly Report...
    </div>
  );
  
  if (!summary) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-red-500 font-bold">
      Failed to load summary data.
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {showNav && <Navbar title={title} />}
      
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-8">
               <BackButton />
               <DashboardButton />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Monthly Summary: <span className="text-indigo-600">{summary.summary_period}</span>
            </h2>
            <p className="text-slate-500 font-medium italic">Overview of hostel residents and meal consumption</p>
          </div>
        </div>

        {/* 📊 Top Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<Users />} label="Total Students" value={summary.students.total} color="bg-slate-900" />
          <StatCard icon={<Leaf />} label="Vegetarian" value={summary.students.vegetarian} color="bg-emerald-500" />
          <StatCard icon={<Drumstick />} label="Non-Vegetarian" value={summary.students.non_vegetarian} color="bg-amber-500" />
          <StatCard icon={<TrendingUp />} label="Food Efficiency" value={summary.usage_metrics.efficiency_rate} color="bg-indigo-600" isHighlight />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 🍽️ Opt-in Breakdown */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Utensils size={20} className="text-indigo-600" />
              Monthly Opt-in Totals
            </h3>
            <div className="space-y-4">
              <MealRow label="Breakfast" value={summary.meal_breakdown.breakfast} />
              <MealRow label="Lunch" value={summary.meal_breakdown.lunch} />
              <MealRow label="Dinner" value={summary.meal_breakdown.dinner} />
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="font-black text-slate-900 uppercase tracking-widest text-xs">Total Bookings</span>
                <span className="text-2xl font-black text-indigo-600">{summary.usage_metrics.total_meals_opted}</span>
              </div>
            </div>
          </div>

          {/* 🗑️ Waste Analytics */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Trash2 size={20} className="text-rose-500" />
              Consumption vs Waste
            </h3>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Actual Meals Served</label>
                  <span className="text-xs font-bold text-slate-900">{summary.usage_metrics.total_meals_consumed} meals</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                    style={{ width: summary.usage_metrics.efficiency_rate }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-rose-50 rounded-3xl border border-rose-100">
                <div>
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Unconsumed (Waste)</p>
                  <p className="text-2xl font-black text-rose-600">{summary.usage_metrics.wastage_count}</p>
                </div>
                <div className="text-rose-200">
                   <Trash2 size={40} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Small Helper Components
const StatCard = ({ icon, label, value, color, isHighlight }) => (
  <div className={`p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 transition-transform hover:-translate-y-1 ${isHighlight ? 'bg-indigo-50 border-indigo-100' : 'bg-white'}`}>
    <div className={`p-3 rounded-2xl text-white ${color} shadow-lg`}>
      {cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <h3 className="text-2xl font-black text-slate-900">{value}</h3>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
  </div>
);

const MealRow = ({ label, value }) => (
  <div className="flex justify-between items-center group">
    <span className="text-slate-500 font-bold group-hover:text-slate-900 transition-colors">{label}</span>
    <span className="font-mono font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg">{value}</span>
  </div>
);

export default MealSummary;