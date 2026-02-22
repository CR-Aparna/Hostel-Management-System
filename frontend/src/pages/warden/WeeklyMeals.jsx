import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import "./Rooms.css";

function WeeklyMeals() {
  const [meals, setMeals] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [newMeal, setNewMeal] = useState({
    day_of_the_week: "",
    breakfast: "",
    lunch: "",
    dinner: "",
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
    <>
      <Navbar title="Weekly Meals" />

      <div className="container">
        <div className="header">
          <h2>All Meal Plans</h2>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close" : "Add New Meal Plan"}
          </button>
        </div>

        {/* Add Room Form */}
        {showForm && (
          <form className="meal-form" onSubmit={handleAddMeal}>
            <select name="day_of_the_week" onChange={handleChange} required>
              <option value="">Select Room Type</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>

            <input name="breakfast" placeholder="Breakfast" type="text" onChange={handleChange} required />
            <input name="lunch" type="text" placeholder="Lunch" onChange={handleChange} required />
            <input name="dinner" type="text" placeholder="Dinner" onChange={handleChange} required />
            
            <button type="submit">Submit</button>
          </form>
        )}

        {/* Rooms Table */}
        <table>
          <thead>
            <tr>
              <th>Meal Id</th>
              <th>Day</th>
              <th>Breakfast</th>
              <th>Lunch</th>
              <th>Dinner</th>
            </tr>
          </thead>

          <tbody>
            {meals.map((meal) => (
              <tr key={meal.id}>
                <td>{meal.id}</td>
                <td>{meal.day}</td>
                <td>{meal.breakfast}</td>
                <td>{meal.lunch}</td>
                <td>{meal.dinner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default WeeklyMeals;
