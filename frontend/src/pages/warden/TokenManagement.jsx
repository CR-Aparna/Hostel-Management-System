import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import "./TokenManagement.css";

function TokenManagement() {
  const [date, setDate] = useState("");
  const [counts, setCounts] = useState(null);
  const [tokenCode, setTokenCode] = useState("");
  const [generatedToken, setGeneratedToken] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);

  // 📊 Fetch meal count
  const fetchCounts = async () => {
    if (!date) return alert("Select a date");

    try {
      const res = await axiosInstance.get(
        `/meal-management/meal/count/${date}`
      );
      setCounts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch counts");
    }
  };

  // ⚡ Manual token generation
  const generateTokens = async () => {
    if (!date) return alert("Select a date");

    try {
      const res = await axiosInstance.post(
        `/meal-management/generate-tokens/${date}`
      );

      setGeneratedToken(res.data);
    } catch (err) {
      console.error(err);
      alert("Generation failed");
    }
  };

  // 🔍 Verify token
  const verifyToken = async () => {
    if (!tokenCode) return alert("Enter token");

    try {
      const res = await axiosInstance.post(
        `/meal-management/verify-token/${tokenCode}`,
      );

      setVerificationResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Invalid token");
    }
  };

  return (
    <>
      <Navbar title="Meal Token Management" />

      <div className="container">

        {/* 📅 Date Selection */}
        <div className="section">
          <h3>Select Date</h3>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button onClick={fetchCounts}>Get Meal Count</button>
        </div>

        {/* 📊 Meal Count */}
        {counts && (
          <div className="section">
            <h3>Meal Count</h3>
            <p>Breakfast: {counts.breakfast}</p>
            <p>Lunch: {counts.lunch}</p>
            <p>Dinner: {counts.dinner}</p>
          </div>
        )}

        {/* ⚡ Manual Token Generation */}
        <div className="section">
          <h3>Generate Tokens (Manual)</h3>
          <button onClick={generateTokens}>
            Generate Tokens
          </button>
          <p className="note">
            (Auto generation happens after 9 PM)
          </p>
          {generatedToken && (
            <div className="result">
              alert({generatedToken.message});
            </div>
          )}
        </div>

        {/* 🔍 Token Verification */}
        <div className="section">
          <h3>Verify Token</h3>

          <input
            type="text"
            placeholder="Enter token code"
            value={tokenCode}
            onChange={(e) => setTokenCode(e.target.value)}
          />

          <button onClick={verifyToken}>Verify</button>

          {verificationResult && (
            <div className="result">
              <p><b>Student:</b> {verificationResult.student_id}</p>
              <p><b>Meal:</b> {verificationResult.meal_type}</p>
              <p><b>Date:</b> {verificationResult.date}</p>
              <p><b>Status:</b> {verificationResult.status}</p>
            </div>
          )}
        </div>

      </div>
    </>
  );
}

export default TokenManagement;
