/*import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

function StudentMealPreference() {
  const [mealPlan, setMealPlan] = useState({});
  const [preferences, setPreferences] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchMealPlan();
    fetchPreferences();
  }, []);

  const fetchMealPlan = async () => {
    const res = await axiosInstance.get(`/meal-management/meal-plan`);
    setMealPlan(res.data);
  };

  const fetchPreferences = async () => {
  try {
    const res = await axiosInstance.get(`/meal-management/get/meal-preferences/today/${today}`);

    if (res.data) {
      setPreferences({
        student_id:res.data.student_id,
        breakfast: res.data.breakfast ?? false,
        lunch: res.data.lunch ?? false,
        dinner: res.data.dinner ?? false,
      });
    }
  } catch (err) {
    console.log("No preferences found");
  }
  };

  const handleChange = (e) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = async () => {
  try {
    await axiosInstance.post(`/meal-management/meal-preference`, {
      breakfast: preferences.breakfast,
      lunch: preferences.lunch,
      dinner: preferences.dinner,
    });

    alert("Preferences saved!");
  } catch (err) {
    console.error(err);

    // ✅ Show backend error message
    const errorMsg =
      err.response?.data?.detail || "Something went wrong";

    alert(errorMsg);
    }
  };


  return (
    <div>
      <h2>🍽️ Today's Meal Plan</h2>

      <div>
        <p><b>Breakfast:</b> {mealPlan?.breakfast || "Not set"}</p>
        <p><b>Lunch:</b> {mealPlan?.lunch || "Not set"}</p>
        <p><b>Dinner:</b> {mealPlan?.dinner || "Not set"}</p>
      </div>

      <h3>Set Your Preferences</h3>

      <label>
        <input
          type="checkbox"
          name="breakfast"
          checked={preferences.breakfast}
          onChange={handleChange}
        />
        Breakfast
      </label>

      <label>
        <input
          type="checkbox"
          name="lunch"
          checked={preferences.lunch}
          onChange={handleChange}
        />
        Lunch
      </label>

      <label>
        <input
          type="checkbox"
          name="dinner"
          checked={preferences.dinner}
          onChange={handleChange}
        />
        Dinner
      </label>

      <br /><br />
      <button onClick={handleSubmit}>Save Preferences</button>
      <div>
        <h4>Your Today's Meal Plan</h4>
        {preferences.breakfast || preferences.lunch || preferences.dinner ? (
          <ul>
            {preferences.breakfast && <li>Breakfast</li>}
            {preferences.lunch && <li>Lunch</li>}
            {preferences.dinner && <li>Dinner</li>}
          </ul>
        ) : (
          <p>No meals selected</p>
        )}
      </div>
    </div>
  );
}

export default StudentMealPreference;*/


import { useEffect, useState,React } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { BackButton, DashboardButton } from "../../components/common/NavButtons";
import { 
  Utensils, 
  Clock, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Coffee,
  Sun,
  Moon,
  Info
} from "lucide-react";

function StudentMealPreference() {
  const [mealPlan, setMealPlan] = useState({});
  const [preferences, setPreferences] = useState({
    breakfast: true,   // ✅ default TRUE
    lunch: true,
    dinner: true,
  });
  const [messCutForm, setMessCutForm] = useState({
    from_date: "",
    to_date: "",
    reason: "",
  });

  // ✅ Tomorrow date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedDate = tomorrow.toISOString().split("T")[0];
  const isAfterCutoff = new Date().getHours() >= 21;

  useEffect(() => {
    fetchMealPlan();
    fetchPreferences();

  }, []);

  const fetchMealPlan = async () => {
    const res = await axiosInstance.get(`/meal-management/meal-plan`);
    setMealPlan(res.data);
  };

  // ✅ Fetch TOMORROW preferences
  const fetchPreferences = async () => {
    try {
      const res = await axiosInstance.get(
        `/meal-management/get/meal-preferences/tomorrow`
      );

      if (res.data) {
        setPreferences({
          breakfast: res.data.breakfast ?? true,
          lunch: res.data.lunch ?? true,
          dinner: res.data.dinner ?? true,
        });
      }
    } catch (err) {
      console.log("No preferences found → default all meals");
    }
  };

  const handleChange = (e) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = async () => {
    try {
      await axiosInstance.post(`/meal-management/meal-preference`, {
        breakfast: preferences.breakfast,
        lunch: preferences.lunch,
        dinner: preferences.dinner,
      });

      alert("Preferences saved!");

      // ✅ Refresh preferences after saving
      //fetchPreferences();

    } catch (err) {
      console.error(err);

      const errorMsg =
        err.response?.data?.detail || "Something went wrong";

      alert(errorMsg);
    }
  };

  const handleMessCutChange = (e) => {
  setMessCutForm({
    ...messCutForm,
    [e.target.name]: e.target.value
  });
};

const handleMessCutSubmit = async () => {
  try {
    await axiosInstance.post("/meal-management/apply-mess-cut", {
      from_date: messCutForm.from_date,
      to_date: messCutForm.to_date,
      reason: messCutForm.reason
    });

    alert("Mess cut request submitted!");

    // Reset form
    setMessCutForm({
      from_date: "",
      to_date: "",
      reason: ""
    });

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.detail || "Failed to apply mess cut");
  }
};

return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar title="Meal Management" />

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-8 space-y-8">
        
        {/* Top Navigation */}
        <div className="flex items-center gap-3">
          <BackButton />
          <DashboardButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* SECTION 1: TOMORROW'S MEAL PLAN */}
          <section className="space-y-6">
            <header className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 text-white">
                <Utensils size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Tomorrow's Menu</h2>
                <p className="text-slate-500 text-sm font-medium italic">{formattedDate}</p>
              </div>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 space-y-4">
                {/* Menu Items */}
                {[
                  { label: "Breakfast", icon: <Coffee size={18}/>, value: mealPlan?.breakfast },
                  { label: "Lunch", icon: <Sun size={18}/>, value: mealPlan?.lunch },
                  { label: "Dinner", icon: <Moon size={18}/>, value: mealPlan?.dinner }
                ].map((meal) => (
                  <div key={meal.label} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="text-indigo-500">{meal.icon}</div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{meal.label}</p>
                      <p className="text-sm font-bold text-slate-700">{meal.value || "Not set"}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Preferences Selection */}
              <div className="p-8 bg-slate-900 text-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-sm uppercase tracking-widest">My Selection</h3>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase ${isAfterCutoff ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-300'}`}>
                    <Clock size={12} /> {isAfterCutoff ? "Closed" : "Ends 9 PM"}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {["breakfast", "lunch", "dinner"].map((meal) => (
                    <label 
                      key={meal} 
                      className={`cursor-pointer group flex flex-col items-center p-3 rounded-2xl transition-all border-2 ${
                        preferences[meal] 
                        ? "bg-indigo-600 border-indigo-400 shadow-lg" 
                        : "bg-slate-800 border-slate-700 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name={meal}
                        className="hidden"
                        checked={preferences[meal]}
                        onChange={handleChange}
                      />
                      <span className="text-[10px] font-black uppercase tracking-tighter mb-1 capitalize">{meal}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${preferences[meal] ? 'bg-white border-white' : 'border-slate-600'}`}>
                        {preferences[meal] && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                      </div>
                    </label>
                  ))}
                </div>

                <button 
                  onClick={handleSubmit} 
                  disabled={isAfterCutoff}
                  className="w-full bg-white text-slate-900 disabled:bg-slate-700 disabled:text-slate-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl"
                >
                  {isAfterCutoff ? "Preferences Locked" : "Save Preferences"}
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 2: APPLY FOR MESS CUT */}
          <section className="space-y-6">
            <header className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 text-white">
                <Calendar size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Mess Cut Request</h2>
                <p className="text-slate-500 text-sm font-medium italic">Apply for absence adjustments</p>
              </div>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">From Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="from_date"
                      value={messCutForm.from_date}
                      onChange={handleMessCutChange}
                      className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">To Date</label>
                  <input
                    type="date"
                    name="to_date"
                    value={messCutForm.to_date}
                    onChange={handleMessCutChange}
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center">Reason for Leave</label>
                <textarea
                  name="reason"
                  value={messCutForm.reason}
                  onChange={handleMessCutChange}
                  placeholder="Enter medical or personal reason..."
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                />
              </div>

              <div className="bg-indigo-50 p-4 rounded-2xl flex items-start gap-3">
                <Info size={16} className="text-indigo-500 mt-0.5" />
                <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">
                  Mess cuts are subject to Warden approval. Ensure you apply at least 24 hours in advance.
                </p>
              </div>

              <button 
                onClick={handleMessCutSubmit}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 hover:bg-slate-800 flex items-center justify-center gap-2"
              >
                Apply Mess Cut <ChevronRight size={16} />
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

export default StudentMealPreference;