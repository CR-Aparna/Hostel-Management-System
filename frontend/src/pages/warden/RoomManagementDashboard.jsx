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
            title="Rooms"
            description="View Existing Room Details and Add New Details"
            onClick={() => navigate("/warden/rooms")}
          />

          <DashboardCard
            title="Allocations"
            description="Allocate rooms to students"
            onClick={() => navigate("/warden/pending-allocations")}
          />

          <DashboardCard
            title="Deallocations"
            description="Deallocate students"
            onClick={() => navigate("/warden/pending-deallocations")}
          />

          <DashboardCard
            title="Rooms Change Requests"
            description="Approve or Reject Room Change Requests"
            onClick={() => navigate("/warden/room-change-requests")}
        />
        </div>
      </div>
    </>
  );
}

export default RoomManagementDashboard;
