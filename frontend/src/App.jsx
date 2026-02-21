import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import WardenDashboard from "./pages/warden/WardenDashboard";
import RoomManagementDashboard from "./pages/warden/RoomManagementDashboard";
import PendingAllocations from "./pages/warden/PendingAllocations";
import ProtectedRoute from "./components/ProtectedRoute";
import PendingStudents from "./pages/admin/PendingStudents";
import ViewStudent from "./pages/admin/ViewStudent";
import MyProfile from "./pages/student/MyProfile";


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
      </Routes>
    </BrowserRouter>
  );
}

export default App;


