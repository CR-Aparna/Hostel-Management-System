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
        <div className="auth-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Enter your email" required 
                       onChange={(e) => setEmail(e.target.value)} />
                <button type="submit">Send Reset Link</button>
            </form>
            <Link to="/login">Back to Login</Link>
        </div>
    );
}
export default ForgotPassword;