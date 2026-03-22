import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import "../../components/Dashboard.css";
import { useNavigate } from "react-router-dom";
import {Utensils,Ticket} from "lucide-react";
import { BackButton,DashboardButton } from "../../components/common/NavButtons";

function MealManagement() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar title="Meal Management" />

      <div className="dashboard-container">
        <div className="flex gap-3">
                    <BackButton />
                    <DashboardButton />
        </div>
        <div className="card-grid">
          <DashboardCard
            icon={<Utensils />}
            title="Meal Preference Management"
            description="See daily meal plan and update your meal preferences"
            onClick={() => navigate("/student/meal-preference")}
          />

          <DashboardCard
            icon={<Ticket />}
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
