import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./TokenManagement.css";

function TokenManagement() {
  const [date, setDate] = useState("");
  const [counts, setCounts] = useState(null);
  const [tokenCode, setTokenCode] = useState("");
  const [generatedToken, setGeneratedToken] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

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
        `/meal-management/warden/verify/${tokenCode}`,
      );

      setVerificationResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Invalid token");
    }
  };

  useEffect(() => {
    let scanner = null;
    if (isScanning) {
      scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      });

      scanner.render(
        (decodedText) => {
          // decodedText is the 6-digit PIN from the QR code
          setTokenCode(decodedText);
          handleVerification(decodedText); // Auto-verify on scan
          scanner.clear(); // Stop scanning after success
          setIsScanning(false);
        },
        (error) => {
          // Scanning... no need to log every frame error
        }
      );
    }
    return () => {
      if (scanner) scanner.clear();
    };
  }, [isScanning]);

  const handleVerification = async (code) => {
    const finalCode = code || tokenCode;
    if (!finalCode) return alert("Enter or scan a token");

    try {
      const res = await axiosInstance.post(`/meal-management/warden/verify/${finalCode}`);
      setVerificationResult(res.data);
      setTokenCode(""); // Clear input on success
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Invalid or Expired Token");
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

        {/* 📊 Detailed Meal Count Table */}
{counts && (
  <div className="section">
    <h3>Detailed Meal Count for {date}</h3>
    <table className="count-table">
      <thead>
        <tr>
          <th style={{ color: 'black' }}>Meal Type</th>
          <th style={{ color: 'green' }}>Veg</th>
          <th style={{ color: 'red' }}>Non-Veg</th>
          <th style={{ color: 'black' }}>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Breakfast</b></td>
          <td>{counts.breakfast.veg}</td>
          <td>{counts.breakfast.non_veg}</td>
          <td><b>{counts.breakfast.total}</b></td>
        </tr>
        <tr>
          <td><b>Lunch</b></td>
          <td>{counts.lunch.veg}</td>
          <td>{counts.lunch.non_veg}</td>
          <td><b>{counts.lunch.total}</b></td>
        </tr>
        <tr>
          <td><b>Dinner</b></td>
          <td>{counts.dinner.veg}</td>
          <td>{counts.dinner.non_veg}</td>
          <td><b>{counts.dinner.total}</b></td>
        </tr>
      </tbody>
    </table>
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

        {/* 🔍 Token Verification Section */}
        <div className="section">
          <h3>Verify Student Meal</h3>

          <div style={{ marginBottom: "20px" }}>
            <button 
              onClick={() => setIsScanning(!isScanning)}
              style={{ backgroundColor: isScanning ? "#ff4d4d" : "#4CAF50", color: "white" }}
            >
              {isScanning ? "Stop Camera" : "📸 Open QR Scanner"}
            </button>
          </div>

          {/* Camera Viewport */}
          {isScanning && <div id="reader" style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}></div>}

          <div style={{ marginTop: "20px" }}>
            <p>-- OR ENTER PIN MANUALLY --</p>
            <input
              type="text"
              placeholder="6-digit PIN"
              value={tokenCode}
              onChange={(e) => setTokenCode(e.target.value)}
              style={{ textAlign: "center", fontSize: "1.2rem", letterSpacing: "3px" }}
            />
            <button onClick={() => handleVerification()}>Verify Manually</button>
          </div>

          {verificationResult && (
            <div className={`result-card ${verificationResult.status === "Consumed" ? "success" : "error"}`} 
                 style={{ border: "2px solid green", padding: "15px", marginTop: "20px", borderRadius: "10px" }}>
              <h4 style={{ color: "green", margin: "0 0 10px 0" }}>✅ VERIFIED SUCCESSFULLY</h4>
              <p><b>Student Name:</b> {verificationResult.student_name}</p>
              <p><b>Meal Type:</b> <span style={{ textTransform: "uppercase" }}>{verificationResult.meal_time}</span></p>
              <p><b>Date:</b> {verificationResult.date}</p>
              <button onClick={() => setVerificationResult(null)}>Clear Result</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TokenManagement;
