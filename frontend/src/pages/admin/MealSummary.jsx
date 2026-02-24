import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";

function WeeklySummary() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axiosInstance.get("/meal-management/meal-summary");
      setSummary(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching summary");
    }
  };

  return (
    <>
      <Navbar title="Weekly Meal Summary" />

      <div className="container">
        <h2>Weekly Summary</h2>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Breakfast</th>
              <th>Lunch</th>
              <th>Dinner</th>
            </tr>
          </thead>

          <tbody>
            {summary.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.breakfast}</td>
                <td>{item.lunch}</td>
                <td>{item.dinner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default WeeklySummary;
