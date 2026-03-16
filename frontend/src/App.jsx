import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import MealSummary from "./pages/warden/MealSummary";
import TokenManagement from "./pages/warden/TokenManagement";
import MealManagement from "./pages/student/MealManagement";
import StudentMealPreference from "./pages/student/StudentMealPreference";
import MealTokens from "./pages/student/MealTokens";
import StudentRoomManagement from "./pages/student/StudentRoomManagement";
import MessCutRequests from "./pages/warden/MessCutRequests";
import FakePaymentPage from "./pages/student/FakePaymentPage";
import PaymentDashboard from "./pages/student/PaymentDashboard";
import PaymentHistory from "./pages/student/PaymentHistory";
import PendingInvoices from "./pages/admin/PendingInvoices";
import StudentManagementDashboard from "./pages/admin/StudentManagement";
import PendingNewRegApprovals from "./pages/warden/NewRegApprovals";
import PendingPayments from "./pages/student/PendingPayments";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import NotificationsPage from "./pages/student/NotificationsPage";
import WardenStaffManagement from "./pages/admin/WardenStaffManagement";
import MaintenanceAndComplaints from "./pages/student/MaintenanceAndComplaints";
import WardenMaintenance from "./pages/warden/WardenMaintenance";
import AdminMaintenance from "./pages/admin/AdminMaintenance";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/student-management/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/student/notifications" element={< NotificationsPage/>}/>

        {/* Student */}
        <Route path="/student/dashboard" 
          element={<ProtectedRoute allowedRole="Student"><StudentDashboard /></ProtectedRoute>}/>
        <Route path="/student/myprofile"
          element={<ProtectedRoute allowedRole="Student"><MyProfile /></ProtectedRoute>}/>
        <Route path="/student/mealmanagement" element={<MealManagement/>} />
        <Route path="/student/meal-preference" element={<StudentMealPreference/>} />
        <Route path="/student/meal-tokens" element={<MealTokens/>} />
        <Route path="/student/roommanagement" element={<ProtectedRoute allowedRole="Student"><StudentRoomManagement /></ProtectedRoute>}/>
        <Route path="/student/fee-management" element={<PaymentDashboard/>}/>
        <Route path="/student/payment-history" element={<PaymentHistory/>}/>
        <Route path="/student/make-payment/:invoiceId" element={<FakePaymentPage/>}/>
        <Route path="/student/pending-payments" element={<PendingPayments/>}/>
        <Route path="/student/maintenance-and-complaint-management" element={<MaintenanceAndComplaints/>}/>


        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminDashboard/>
            </ProtectedRoute>
          }
        /> <Route path="/admin/dashboard/studentmanagementdashboard" element={<StudentManagementDashboard/>}/>
          <Route path="/admin/dashboard/pending" element={<PendingStudents />} />
          <Route path="/admin/dashboard/view-student" element={<ViewStudent />} />
          <Route path="/admin/dashboard/deallocation-approvals" element={<DeallocationApprovals />} />
          <Route path="/admin/dashboard/meal-summary" element={<MealSummary />} />
          <Route path="/admin/dashboard/pending-invoices" element={<PendingInvoices/>}/>
          <Route path="/admin/warden-and-staff" element={<WardenStaffManagement/>}/>
          <Route path="/admin/maintenance" element={<AdminMaintenance/>}/>

        

        {/* Warden */}
        <Route path="/warden/dashboard" element={<ProtectedRoute allowedRole="Warden"><WardenDashboard /></ProtectedRoute>}/>
        <Route path="/warden/new-student-registrations" element={<PendingNewRegApprovals/>}/>
        <Route path="/warden/roommanagementdashboard" element={<RoomManagementDashboard />} />
        <Route path="/warden/pending-allocations" element={<PendingAllocations/>} />
        <Route path="/warden/pending-deallocations" element={<PendingDeallocations/>} />
        <Route path="/warden/rooms" element={<Rooms/>} />
        <Route path="/warden/room-change-requests" element={<RoomChangeRequests/>} />
        <Route path="/warden/mealmanagementdashboard" element={<MealManagementDashboard />} />
        <Route path="/warden/meals" element={<WeeklyMeals/>} />
        <Route path="/warden/meal-summary" element={<MealSummary/>} />
        <Route path="/warden/meal-tokens" element={<TokenManagement/>} />
        <Route path="/warden/mess-cut-requests" element={<MessCutRequests/>} />
        <Route path="/warden/maintenance-complaints" element={<WardenMaintenance/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;


