import { useState, useEffect } from "react";
import { loginUser } from "../../api/auth";
import { Link, useNavigate} from "react-router-dom";
import { HomeButton } from "../../components/common/NavButtons";
import Toast from "../../components/common/Toast";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added for UX
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (token && role) {
      // Redirect to their specific dashboard if they are already logged in
      const dashboardMap = {
        "Student": "/student/dashboard",
        "Admin": "/admin/dashboard",
        "Warden": "/warden/dashboard",
        "Maintenance Staff": "/staff/dashboard"
      };
      navigate(dashboardMap[role] || "/staff/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await loginUser({ username, password });
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);

      if (data.role === "Student") {
        navigate("/student/dashboard");
      } else if (data.role === "Admin") {
        navigate("/admin/dashboard");
      } else if (data.role === "Warden") {
        navigate("/warden/dashboard");
      }else{
        navigate("/staff/dashboard");
      }

    } catch (error) {
      setToast({ message: "Invalid credentials", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-indigo-100">
      
    <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
    
    {/* Left Side: Visual Branding */}
    <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 to-violet-700 p-12 text-white flex flex-col justify-between relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-4xl bg-white/20 p-2 rounded-2xl backdrop-blur-sm">🏫</span>
          <h1 className="text-3xl font-bold tracking-tight">Hostel Hub</h1>
        </div>
        <h2 className="text-4xl font-extrabold leading-tight mb-4">
          Your Home <br /> Away From Home.
        </h2>
        <p className="text-indigo-100 text-lg leading-relaxed max-w-xs">
          Simplifying stay and meal management for modern campus life.
        </p>
      </div>

      <div className="relative z-10 mt-auto pt-12">
        <HomeButton />
        <p className="text-sm text-indigo-200">© 2026 Hostel Hub Management System</p>
      </div>
    </div>

    {/* Right Side: Form */}
    <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
      <form className="w-full max-w-sm mx-auto" onSubmit={handleSubmit}>
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-500">Please enter your credentials to login</p>
        </div>

        {/* Username Field */}
        <div className="space-y-2 mb-6">
          <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2 mb-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          {toast && (
              <Toast 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast(null)} 
              />
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end mb-8">
          <Link 
            to="/forgot-password" 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mb-8"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Authenticating...
            </span>
          ) : "Login"}
        </button>

        {/* Footer */}
        <div className="text-center">
          <p className="text-slate-600 text-sm">
            New student?{' '}
            <Link 
              to="/student-management/register" 
              className="font-bold text-indigo-600 hover:text-indigo-700"
            >
              Register here
            </Link>
          </p>
        </div>
      </form>
    </div>
  </div>
</div>
  );
}

export default Login;