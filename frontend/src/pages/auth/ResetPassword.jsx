import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const token = searchParams.get("token"); // Grabs ?token=... from URL

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post("/auth/reset-password", { token, password });
            alert("Password updated! Please login.");
            navigate("/login");
        } catch (err) {
            alert("Link expired or invalid");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-indigo-100">
  <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
    
    {/* Header with Secure Gradient */}
    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-center text-white">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md mb-4">
        <span className="text-3xl">🛡️</span>
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Set New Password</h2>
      <p className="text-indigo-100 text-sm mt-2">Create a strong password to keep your account secure.</p>
    </div>

    {/* Form Content */}
    <div className="p-8 md:p-10">
      <form onSubmit={handleReset} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">New Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            required 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
          />
          <p className="text-[10px] text-slate-400 ml-1">
            Tip: Use a mix of letters, numbers, and symbols.
          </p>
        </div>

        <button 
          type="submit" 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
        >
          Reset Password
        </button>
      </form>

      {/* Security Note */}
      <div className="mt-8 pt-6 border-t border-slate-50">
        <div className="flex items-start gap-3 text-slate-500 text-xs leading-relaxed">
          <span className="text-indigo-500 text-sm">ⓘ</span>
          <p>Once reset, you will be required to log in again using your new credentials to access your dashboard.</p>
        </div>
      </div>
    </div>
  </div>
</div>
    );
}
export default ResetPassword;