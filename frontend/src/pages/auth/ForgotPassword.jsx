import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";


function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post("/auth/forgot-password", { email });
            alert("Check your console (or email) for the reset link!");
        } catch (err) {
            alert("Error sending request");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-indigo-100">
  <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
    
    {/* Header with Gradient Accent */}
    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-center text-white">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md mb-4">
        <span className="text-3xl">🔑</span>
      </div>
      <h2 className="text-2xl font-bold italic tracking-tight">Forgot Password</h2>
      <p className="text-indigo-100 text-sm mt-2">No worries, it happens! We'll help you get back in.</p>
    </div>

    {/* Form Content */}
    <div className="p-8 md:p-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
          <input 
            type="email" 
            placeholder="Enter your registered email" 
            required 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
        >
          Send Reset Link
        </button>
      </form>

      {/* Back to Login Footer */}
      <div className="mt-8 pt-6 border-t border-slate-50 text-center">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Login
        </Link>
      </div>
    </div>
  </div>
</div>
    );
}
export default ForgotPassword;