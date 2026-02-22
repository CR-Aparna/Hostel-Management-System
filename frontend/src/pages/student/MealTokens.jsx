import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

function MealTokens() {
  const [tokens, setTokens] = useState([]);
  //const [message, setMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    const res = await axiosInstance.get(`/meal-management/my-tokens/${today}`);
    setTokens(res.data);
  };

  /*const generateTokens = async () => {
    await axiosInstance.post(`/tokens/generate/${today}`);
    fetchTokens();
  };

  const handleVerify = async () => {
    try {
      const res = await axiosInstance.post("/tokens/verify", {
        token: verifyToken,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Invalid token ❌");
    }
  };*/

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

export default MealTokens;
