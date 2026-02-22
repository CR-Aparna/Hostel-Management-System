import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import "../../components/Dashboard.css";
import { useNavigate } from "react-router-dom";

function MealManagementDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar title="Meal Management" />

      <div className="dashboard-container">
        <h2>Meal Operations</h2>

        <div className="card-grid">
          <DashboardCard
            title="Meals"
            description="Manage Weekly meal Plans"
            onClick={() => navigate("/warden/meals")}
          />

          <DashboardCard
            title="Daily Meal"
            description="Track daily meal counts and preferences"
            onClick={() => navigate("/warden/daily-meals")}
          />

          <DashboardCard
            title="Tokens"
            description=" Generate and  Verify Tokens"
            onClick={() => navigate("/warden/meal-tokens")}
          />

          <DashboardCard
            title="Meal Summary"
            description="View Meal Summary(past 7 days)"
            onClick={() => navigate("/warden/meal-summary")}
        />
        </div>
      </div>
    </>
  );
}

export default MealManagementDashboard;
