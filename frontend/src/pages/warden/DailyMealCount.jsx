import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";

function DailyMealCount() {
  const [data, setData] = useState([]);
  const [date, setDate] = useState("");

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get(`/meal-management/meal/count/${date}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching meal count");
    }
  };

  return (
    <>
      <Navbar title="Daily Meal Count" />

      <div className="container">
        <h2>Meal Count</h2>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button onClick={fetchData}>Get Count</button>

        {data && (
          <table>
            <thead>
              <tr>
                <th>Meal</th>
                <th>Count</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Breakfast</td>
                <td>{data.breakfast || 0}</td>
              </tr>
              <tr>
                <td>Lunch</td>
                <td>{data.lunch || 0}</td>
              </tr>
              <tr>
                <td>Dinner</td>
                <td>{data.dinner || 0}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default DailyMealCount;
