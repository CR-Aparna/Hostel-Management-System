import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import "../../components/Dashboard.css";
import { useNavigate } from "react-router-dom";

function RoomManagementDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar title="Rooms Management" />

      <div className="dashboard-container">
        <h2>Room Operations</h2>

        <div className="card-grid">
          <DashboardCard
            title="Pending Allocations"
            description="Allocate rooms to approved students"
            onClick={() => navigate("/warden/pending-allocations")}
          />

          <DashboardCard
            /*title="Room Change Requests"
            description="Handle student room change requests"
            onClick={() => navigate("/warden/room-change-requests")}
          />
          <DashboardCard
            title="Add New Room"
            description="Create and manage rooms"
            onClick={() => navigate("/warden/add-room")}
          />

          <DashboardCard
            title="View All Rooms"
            description="Check room availability and status"
            onClick={() => navigate("/warden/all-rooms")}*/
        />
        </div>
      </div>
    </>
  );
}

export default RoomManagementDashboard;
