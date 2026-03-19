import { useEffect, useState,React } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { BackButton, DashboardButton } from "../../components/common/NavButtons";
import { ChefHat, Plus, X, Calendar, Utensils, Coffee, Sun, Moon, Leaf, Drumstick } from "lucide-react";


function WeeklyMeals() {
  const [meals, setMeals] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [newMeal, setNewMeal] = useState({
    day_of_the_week: "",
    breakfast: "",
    lunch: "",
    dinner: "",
    meal_type:""
  });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const res = await axiosInstance.get("/meal-management/meal-plan/week");
      setMeals(res.data);
    } catch (err) {
      console.error("Error fetching meals", err);
    }
  };

  const handleChange = (e) => {
    setNewMeal({
      ...newMeal,
      [e.target.name]: e.target.value
    });
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/meal-management/weekly-meal-plan", newMeal);
      alert("Meal added successfully");

      setShowForm(false);
      setNewMeal({
        day_of_the_week: "",
        breakfast: "",
        lunch: "",
        dinner: "",
      });

      fetchMeals();
    } catch (err) {
      console.error(err);
      alert("Failed to add Meal");
    }
  };

return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title="Weekly Meals" />

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <BackButton />
              <DashboardButton />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ChefHat className="text-indigo-600" size={32} />
              All Meal Plans
            </h2>
            <p className="text-slate-500 font-medium italic">Configure the recurring weekly menu for the mess.</p>
          </div>

          <button 
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all active:scale-95 shadow-lg ${
              showForm 
              ? "bg-rose-50 text-rose-600 shadow-rose-100 border border-rose-100 hover:bg-rose-100" 
              : "bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700"
            }`}
          >
            {showForm ? <X size={20} /> : <Plus size={20} />}
            {showForm ? "Close Form" : "Add New Meal Plan"}
          </button>
        </div>

        {/* Add Meal Plan Form */}
        {showForm && (
          <div className="mb-12 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Utensils className="text-indigo-600" size={20} />
              Create Weekly Menu Entry
            </h3>
            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" onSubmit={handleAddMeal}>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Meal Type</label>
                <select name="meal_type" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 cursor-pointer" onChange={handleChange} required>
                  <option value="">Select Category</option>
                  <option value="vegetarian">Veg</option>
                  <option value="non-vegetarian">Non Veg</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Day of Week</label>
                <select name="day_of_the_week" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 cursor-pointer" onChange={handleChange} required>
                  <option value="">Select Day</option>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Breakfast</label>
                <input name="breakfast" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500" placeholder="Morning menu" type="text" onChange={handleChange} required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lunch</label>
                <input name="lunch" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500" placeholder="Afternoon menu" type="text" onChange={handleChange} required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dinner</label>
                <input name="dinner" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500" placeholder="Evening menu" type="text" onChange={handleChange} required />
              </div>
              
              <div className="md:col-span-2 lg:col-span-5 flex justify-end pt-2">
                <button type="submit" className="bg-slate-900 text-white px-10 py-3 rounded-xl font-black hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
                  Save Meal Plan
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Meal Plans Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Day & Type</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400"><div className="flex items-center gap-2"><Coffee size={14}/> Breakfast</div></th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400"><div className="flex items-center gap-2"><Sun size={14}/> Lunch</div></th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400"><div className="flex items-center gap-2"><Moon size={14}/> Dinner</div></th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Plan ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {meals.map((meal) => (
                  <tr key={meal.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-800 flex items-center gap-2">
                          <Calendar size={14} className="text-indigo-500" />
                          {meal.day}
                        </span>
                        <span className={`inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                          meal.meal_type === "vegetarian" 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : "bg-rose-50 text-rose-600 border-rose-100"
                        }`}>
                          {meal.meal_type === "vegetarian" ? <Leaf size={10}/> : <Drumstick size={10}/>}
                          {meal.meal_type}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium text-slate-600">{meal.breakfast}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium text-slate-600">{meal.lunch}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium text-slate-600">{meal.dinner}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-xs font-mono font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                        #{meal.id}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default WeeklyMeals;
