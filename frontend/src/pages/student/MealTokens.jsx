/*import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

function MealTokens() {
  const [tokens, setTokens] = useState([]);
  

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    const res = await axiosInstance.get(`/meal-management/my-tokens/${today}`);
    setTokens(res.data);
  };


  return (
    <div>
      <h2>🎟️ Your Meal Tokens</h2>

      <ul>
        {tokens.map((t) => (
          <li key={t.id}>
            {t.meal_type.toUpperCase()} → {t.token_code}
          </li>
        ))}
      </ul>

      <hr/>

    </div>
  );
}

export default MealTokens;*/

import { useEffect, useState } from "react";
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

export default MealTokens;
