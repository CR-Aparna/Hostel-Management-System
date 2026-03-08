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
        <div className="auth-container">
            <h2>Set New Password</h2>
            <form onSubmit={handleReset}>
                <input type="password" placeholder="New Password" required 
                       onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
}
export default ResetPassword;