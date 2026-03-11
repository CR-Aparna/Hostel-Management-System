import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import "./MealSummary.css";

function MealSummary() {
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

  if (loading) return <div className="loading">Loading Monthly Report...</div>;
  if (!summary) return <div className="error">Failed to load summary data.</div>;

  return (
    <>
      <Navbar title="Warden Dashboard" />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h2>Monthly Summary: {summary.summary_period}</h2>
          <p>Overview of hostel residents and meal consumption</p>
        </header>

        {/* 📊 Top Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="icon">👥</span>
            <div className="stat-info">
              <h3>{summary.students.total}</h3>
              <p>Total Students</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="icon">🥗</span>
            <div className="stat-info">
              <h3>{summary.students.vegetarian}</h3>
              <p>Vegetarian</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="icon">🍗</span>
            <div className="stat-info">
              <h3>{summary.students.non_vegetarian}</h3>
              <p>Non-Vegetarian</p>
            </div>
          </div>
          <div className="stat-card highlight">
            <span className="icon">📈</span>
            <div className="stat-info">
              <h3>{summary.usage_metrics.efficiency_rate}</h3>
              <p>Food Efficiency</p>
            </div>
          </div>
        </div>

        <div className="details-section">
          {/* 🍽️ Opt-in Breakdown */}
          <div className="detail-card">
            <h3>Monthly Opt-in Totals</h3>
            <ul className="meal-list">
              <li>
                <span>Breakfast</span>
                <strong>{summary.meal_breakdown.breakfast}</strong>
              </li>
              <li>
                <span>Lunch</span>
                <strong>{summary.meal_breakdown.lunch}</strong>
              </li>
              <li>
                <span>Dinner</span>
                <strong>{summary.meal_breakdown.dinner}</strong>
              </li>
              <li className="total-row">
                <span>Total Bookings</span>
                <strong>{summary.usage_metrics.total_meals_opted}</strong>
              </li>
            </ul>
          </div>

          {/* 🗑️ Waste Analytics */}
          <div className="detail-card waste-card">
            <h3>Consumption vs Waste</h3>
            <div className="waste-metrics">
              <div className="metric">
                <label>Actual Meals Served</label>
                <div className="bar-container">
                  <div 
                    className="bar consumed" 
                    style={{ width: summary.usage_metrics.efficiency_rate }}
                  ></div>
                </div>
                <span>{summary.usage_metrics.total_meals_consumed} meals</span>
              </div>
              <div className="metric">
                <label>Unconsumed (Waste)</label>
                <span>{summary.usage_metrics.wastage_count} meals</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MealSummary;
