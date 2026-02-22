import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import WardenDashboard from "./pages/warden/WardenDashboard";
import RoomManagementDashboard from "./pages/warden/RoomManagementDashboard";
import PendingAllocations from "./pages/warden/PendingAllocations";
import PendingDeallocations from "./pages/warden/PendingDeallocations";
import Rooms from "./pages/warden/Rooms";
import ProtectedRoute from "./components/ProtectedRoute";
import PendingStudents from "./pages/admin/PendingStudents";
import ViewStudent from "./pages/admin/ViewStudent";
import MyProfile from "./pages/student/MyProfile";
import DeallocationApprovals from "./pages/admin/DeallocationApprovals";
import RoomChangeRequests from "./pages/warden/RoomChangeRequests";
import MealManagementDashboard from "./pages/warden/MealManagementDashboard";
import WeeklyMeals from "./pages/warden/WeeklyMeals";
import DailyMealCount from "./pages/warden/DailyMealCount";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/student-management/register" element={<Register />} />

        {/* Student */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="Student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="pending" element={<PendingStudents />} />
          <Route path="view-student" element={<ViewStudent />} />
          <Route path="deallocation-approvals" element={<DeallocationApprovals />} />
        </Route>

        {/* Student */}
        <Route
          path="/student/myprofile"
          element={
            <ProtectedRoute allowedRole="Student">
              <MyProfile />
            </ProtectedRoute>
          }
        />

        <Route path="/warden/dashboard" element={<ProtectedRoute allowedRole="Warden"><WardenDashboard /></ProtectedRoute>}/>
        <Route path="/warden/roommanagementdashboard" element={<RoomManagementDashboard />} />
        <Route path="/warden/pending-allocations" element={<PendingAllocations/>} />
        <Route path="/warden/pending-deallocations" element={<PendingDeallocations/>} />
        <Route path="/warden/rooms" element={<Rooms/>} />
        <Route path="/warden/room-change-requests" element={<RoomChangeRequests/>} />
        <Route path="/warden/mealmanagementdashboard" element={<MealManagementDashboard />} />
        <Route path="/warden/meals" element={<WeeklyMeals/>} />
        <Route path="/warden/daily-meals" element={<DailyMealCount/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;


