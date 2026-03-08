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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/student-management/register" element={<Register />} />

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
          < Route path="/admin/dashboard/meal-summary" element={<MealSummary />} />
          <Route path="/admin/dashboard/pending-invoices" element={<PendingInvoices/>}/>
        

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
        <Route path="/warden/daily-meals" element={<DailyMealCount/>} />
        <Route path="/warden/meal-summary" element={<MealSummary/>} />
        <Route path="/warden/meal-tokens" element={<TokenManagement/>} />
        <Route path="/warden/mess-cut-requests" element={<MessCutRequests/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;


