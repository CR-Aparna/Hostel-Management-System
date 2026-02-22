import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import "../../components/Dashboard.css";
import { useNavigate } from "react-router-dom";

function MealManagement() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar title="Meal Management" />

      <div className="dashboard-container">
        <h2>Meals</h2>

        <div className="card-grid">
          <DashboardCard
            title="Meal Preference Management"
            description="See daily meal plan and update your meal preferences"
            onClick={() => navigate("/student/meal-preference")}
          />

          <DashboardCard
            title="Get Meal Tokens"
            description="Get your meal tokens for each day"
            onClick={() => navigate("/student/meal-tokens")}
          />
        </div>
      </div>
    </>
  );
}

export default MealManagement;
