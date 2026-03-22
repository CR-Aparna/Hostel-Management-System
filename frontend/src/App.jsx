import { BrowserRouter, Routes, Route, Navigate,Outlet } from "react-router-dom";
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
const AdminRoomManagementDashboard = lazy(() => import("./pages/admin/RoomManagementDashboard"));  
const ManageRooms = lazy(() => import("./pages/admin/ManageRooms"));
const AttendancePage = lazy(() => import("./pages/warden/AttendancePage"));
const AdminAttendanceReport = lazy(() => import("./pages/admin/AdminAttendanceReport"));
const StudentAttendancePage = lazy(() => import("./pages/student/StudentAttendancePage"));
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
          <Route path="/student" 
            element={<ProtectedRoute allowedRole="Student"><Outlet /></ProtectedRoute>}>
            <Route path="dashboard" element={< StudentDashboard/>}/>
            <Route path="myprofile"
              element={<ProtectedRoute allowedRole="Student"><MyProfile /></ProtectedRoute>}/>
            <Route path="mealmanagement" element={<MealManagement/>} />
            <Route path="meal-preference" element={<StudentMealPreference/>} />
            <Route path="meal-tokens" element={<MealTokens/>} />
            <Route path="roommanagement" element={<ProtectedRoute allowedRole="Student"><StudentRoomManagement /></ProtectedRoute>}/>
            <Route path="fee-management" element={<PaymentDashboard/>}/>
            <Route path="payment-history" element={<PaymentHistory/>}/>
            <Route path="make-payment/:invoiceId" element={<FakePaymentPage/>}/>
            <Route path="pending-payments" element={<PendingPayments/>}/>
            <Route path="maintenance-and-complaint-management" element={<MaintenanceAndComplaints/>}/>
            <Route path="attendance-record" element={<StudentAttendancePage/>}/>
          </Route>


          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="Admin">
                <Outlet/>
              </ProtectedRoute>
            }
          > <Route path="dashboard" element={<AdminDashboard/>}/>
            <Route path="dashboard/studentmanagementdashboard" element={<StudentManagementDashboard/>}/>
            <Route path="dashboard/roommanagementdashboard" element={<AdminRoomManagementDashboard/>} />
            <Route path="dashboard/manage-rooms" element={<ManageRooms/>} />
            <Route path="dashboard/pending" element={<PendingStudents />} />
            <Route path="dashboard/view-student" element={<ViewStudent />} />
            <Route path="dashboard/deallocation-approvals" element={<DeallocationApprovals />} />
            <Route path="dashboard/meal-summary" element={<MealSummary />} />
            <Route path="dashboard/pending-invoices" element={<PendingInvoices/>}/>
            <Route path="warden-and-staff" element={<WardenStaffManagement/>}/>
            <Route path="maintenance" element={<AdminMaintenance/>}/>
            <Route path="dashboard/payment-management" element={<AdminPaymentsDashboard/>}/>
            <Route path="dashboard/invoices" element={<AdminInvoiceManager/>}/>
            <Route path="attendance-report" element={<AdminAttendanceReport/>}/>
        </Route>
          

          {/* Warden */}
          <Route path="/warden" element={<ProtectedRoute allowedRole="Warden"><Outlet/></ProtectedRoute>}>
            <Route path="dashboard" element={<WardenDashboard />}/>
            <Route path="new-student-registrations" element={<PendingNewRegApprovals/>}/>
            <Route path="roommanagementdashboard" element={<RoomManagementDashboard />} />
            <Route path="pending-allocations" element={<PendingAllocations/>} />
            <Route path="pending-deallocations" element={<PendingDeallocations/>} />
            <Route path="rooms" element={<Rooms/>} />
            <Route path="room-change-requests" element={<RoomChangeRequests/>} />
            <Route path="mealmanagementdashboard" element={<MealManagementDashboard />} />
            <Route path="meals" element={<WeeklyMeals/>} />
            <Route path="meal-summary" element={<MealSummary/>} />
            <Route path="meal-tokens" element={<TokenManagement/>} />
            <Route path="mess-cut-requests" element={<MessCutRequests/>} />
            <Route path="maintenance-complaints" element={<WardenMaintenance/>} />
            <Route path="attendance" element={<AttendancePage/>}/>
          </Route>

          {/*Staff*/}
          <Route path="/staff/dashboard" element={<ProtectedRoute allowedRole="Maintenance Staff"><StaffDashboard/></ProtectedRoute>}/>

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;


