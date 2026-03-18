import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
const AdminInvoiceManager = lazy(() => import("./pages/admin/AdminInvoiceManager")); 
const AdminPaymentsDashboard = lazy(() => import("./pages/admin/AdminPaymentsDashboard")); 
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const WardenDashboard = lazy(() => import("./pages/warden/WardenDashboard"));
const RoomManagementDashboard = lazy(() => import("./pages/warden/RoomManagementDashboard"));
const PendingAllocations = lazy(() => import("./pages/warden/PendingAllocations"));
const PendingDeallocations = lazy(() => import("./pages/warden/PendingDeallocations"));
const Rooms = lazy(() => import("./pages/warden/Rooms"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const PendingStudents = lazy(() => import("./pages/admin/PendingStudents"));
const ViewStudent = lazy(() => import("./pages/admin/ViewStudent"));
const MyProfile = lazy(() => import("./pages/student/MyProfile"));
const DeallocationApprovals = lazy(() => import("./pages/admin/DeallocationApprovals"));
const RoomChangeRequests = lazy(() => import("./pages/warden/RoomChangeRequests"));
const MealManagementDashboard = lazy(() => import("./pages/warden/MealManagementDashboard"));
const WeeklyMeals = lazy(() => import("./pages/warden/WeeklyMeals"));
const MealSummary = lazy(() => import("./pages/warden/MealSummary"));
const TokenManagement = lazy(() => import("./pages/warden/TokenManagement"));
const MealManagement = lazy(() => import("./pages/student/MealManagement"));
const StudentMealPreference = lazy(() => import("./pages/student/StudentMealPreference"));
const MealTokens = lazy(() => import("./pages/student/MealTokens"));
const StudentRoomManagement = lazy(() => import("./pages/student/StudentRoomManagement"));
const MessCutRequests = lazy(() => import("./pages/warden/MessCutRequests"));
const FakePaymentPage = lazy(() => import("./pages/student/FakePaymentPage"));
const PaymentDashboard = lazy(() => import("./pages/student/PaymentDashboard"));
const PaymentHistory = lazy(() => import("./pages/student/PaymentHistory"));
const PendingInvoices = lazy(() => import("./pages/admin/PendingInvoices"));
const StudentManagementDashboard = lazy(() => import("./pages/admin/StudentManagement"));
const PendingNewRegApprovals = lazy(() => import("./pages/warden/NewRegApprovals"));
const PendingPayments = lazy(() => import("./pages/student/PendingPayments"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const NotificationsPage = lazy(() => import("./pages/student/NotificationsPage"));
const WardenStaffManagement = lazy(() => import("./pages/admin/WardenStaffManagement"));
const MaintenanceAndComplaints = lazy(() => import("./pages/student/MaintenanceAndComplaints"));
const WardenMaintenance = lazy(() => import("./pages/warden/WardenMaintenance"));
const AdminMaintenance = lazy(() => import("./pages/admin/AdminMaintenance"));
const StaffDashboard = lazy(() => import("./pages/staff/StaffDashboard"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home/>} />

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
            <Route path="/admin/dashboard/payment-management" element={<AdminPaymentsDashboard/>}/>
            <Route path="/admin/dashboard/invoices" element={<AdminInvoiceManager/>}/>

          

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

          {/*Staff*/}
          <Route path="/staff/dashboard" element={<ProtectedRoute allowedRole="Maintenance Staff"><StaffDashboard/></ProtectedRoute>}/>

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;


