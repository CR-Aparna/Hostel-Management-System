import { useEffect, useState } from "react";
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
    const res = await axiosInstance.get(`/meal-management/meal-plan/${today}`);
    setMealPlan(res.data);
  };

  const fetchPreferences = async () => {
  try {
    const res = await axiosInstance.get(`/meal-management/meal-preferences/${today}`);

    if (res.data) {
      setPreferences({
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
      date: today,
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
    </div>
  );
}

export default StudentMealPreference;
