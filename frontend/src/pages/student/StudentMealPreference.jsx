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


import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

function StudentMealPreference() {
  const [mealPlan, setMealPlan] = useState({});
  const [preferences, setPreferences] = useState({
    breakfast: true,   // ✅ default TRUE
    lunch: true,
    dinner: true,
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

  return (
    <div>
      <h2>🍽️ Tomorrow's Meal Plan</h2>

      <div>
        <p><b>Breakfast:</b> {mealPlan?.breakfast || "Not set"}</p>
        <p><b>Lunch:</b> {mealPlan?.lunch || "Not set"}</p>
        <p><b>Dinner:</b> {mealPlan?.dinner || "Not set"}</p>
      </div>

      <h3>DESELECT meals you DON'T want (default: all selected)</h3>
      <h4 style={{ color: "blue" }}>Set your preferences before 9 pm</h4>

      <label>
        <input
          type="checkbox"
          name="breakfast"
          checked={preferences.breakfast}
          onChange={handleChange}
        />
        Breakfast
      </label>

      <br />

      <label>
        <input
          type="checkbox"
          name="lunch"
          checked={preferences.lunch}
          onChange={handleChange}
        />
        Lunch
      </label>

      <br />

      <label>
        <input
          type="checkbox"
          name="dinner"
          checked={preferences.dinner}
          onChange={handleChange}/>
        Dinner
      </label>

      <br /><br />

      <button onClick={handleSubmit} disabled={isAfterCutoff}>Save Preferences</button>

      {/* ✅ Display selected meals */}
      <div>
        <h4>Your Selected Meals for Tomorrow ({formattedDate})</h4>

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

export default StudentMealPreference;