/*import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

function MealTokens() {
  const [tokens, setTokens] = useState([]);
  const [date, setDate] = useState("");

  useEffect(() => {
    const effectiveDate = getEffectiveDate();
    setDate(effectiveDate);
    fetchTokens(effectiveDate);
  }, []);


  const getEffectiveDate = () => {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setHours(21, 0, 0, 0);

    if (now > cutoff) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    }

    return now.toISOString().split("T")[0];
  };

  const fetchTokens = async (date) => {
    try {
      const res = await axiosInstance.get(
        `/meal-management/my-tokens/${date}`
      );
      setTokens(res.data);
    } catch (err) {
      console.error("Error fetching tokens", err);
    }
  };

  return (
    <div>
      <h2>🎟️ Your Meal Tokens</h2>

      <h4>Your Meal Preferences for <span style={{ color: '#da1a5a', fontWeight: 'bold' }}>{date}</span></h4>

      {tokens.length === 0 ? (
        <p>No tokens available</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Meal</th>
              <th style={{ textAlign: 'center' }}>Token</th>
            </tr>
          </thead>

          <tbody>
            {tokens.map((t) => (
              <tr key={t.id}>
                <td>{t.meal_type.toUpperCase()}</td>
                <td>{t.token_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MealTokens;*/

import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import QRCode from "react-qr-code"; // 👈 Import the QR component

function MealTokens() {
  const [tokens, setTokens] = useState([]);
  const [date, setDate] = useState("");

  useEffect(() => {
    const effectiveDate = getEffectiveDate();
    setDate(effectiveDate);
    fetchTokens(effectiveDate);
  }, []);

  const getEffectiveDate = () => {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setHours(21, 0, 0, 0);

    if (now > cutoff) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    }
    return now.toISOString().split("T")[0];
  };

  const fetchTokens = async (date) => {
    try {
      const res = await axiosInstance.get(`/meal-management/my-tokens/${date}`);
      setTokens(res.data);
    } catch (err) {
      console.error("Error fetching tokens", err);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center" }}>🎟️ Your Meal Tokens</h2>
      <h4 style={{ textAlign: "center" }}>
        Date: <span style={{ color: "#da1a5a" }}>{date}</span>
      </h4>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
        {tokens.length === 0 ? (
          <p style={{ textAlign: "center" }}>No tokens available for this date.</p>
        ) : (
          tokens.map((t) => (
            <div 
              key={t.id} 
              style={{
                border: "2px solid #eee",
                borderRadius: "15px",
                padding: "20px",
                textAlign: "center",
                backgroundColor: "#fff",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}
            >
              <h3 style={{ marginTop: 0, color: "#333" }}>{t.meal_time.toUpperCase()}</h3>
              
              {/* QR CODE CONTAINER */}
              <div style={{ background: "white", padding: "15px", display: "inline-block", borderRadius: "10px", border: "1px solid #f0f0f0" }}>
                <QRCode 
                  value={t.short_pin} // The 6-digit PIN is hidden in this QR
                  size={160} 
                  level="H" 
                />
              </div>

              {/* BACKUP PIN DISPLAY */}
              <div style={{ marginTop: "15px" }}>
                <p style={{ fontSize: "12px", color: "#888", marginBottom: "5px" }}>VERIFICATION PIN</p>
                <h1 style={{ letterSpacing: "8px", margin: "0", fontSize: "2.5rem", color: "#222" }}>
                  {t.short_pin}
                </h1>
              </div>

              <p style={{ fontSize: "12px", color: "#da1a5a", marginTop: "10px" }}>
                Present this to the Warden at the mess entrance.
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MealTokens;
