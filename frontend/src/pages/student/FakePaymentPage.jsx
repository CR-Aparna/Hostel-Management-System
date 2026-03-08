import { useState , useEffect} from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useParams } from "react-router-dom";

function FakePaymentPage() {
  const [current_payment, setCurrentPayment] = useState({});
  // ✅ NEW: payment method state
  const [method, setMethod] = useState("UPI");
  const { invoiceId } = useParams();

  useEffect(() => {
    fetchPaymentDetails(invoiceId);
  }, [invoiceId]);

  const fetchPaymentDetails = async (invoiceId) => {
    try {
      const res = await axiosInstance.get(`/payment-management/current-payment/${invoiceId}`);
      setCurrentPayment({ 
        order_id: res.data.order_id,
        amount: res.data.amount,
        status: res.data.status
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayment = async (status) => {
    try{  
      const res = await axiosInstance.post("/payment-management/verify", {
        status,
        method, // ✅ dynamic now
      });
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }

    if (status === "success") {
      alert("✅ Payment Successful");
      window.location.href = "/student/dashboard";
    } else {
      alert("❌ Payment Failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Payment Gateway 🏦</h2>
      <p>Order ID: {current_payment.order_id}</p>
      <p>Amount: {current_payment.amount}</p>
      <p>Status: {current_payment.status}</p>

      {/* ✅ NEW: Payment Method Selection */}
      <h3>Select Payment Method</h3>

      <label>
        <input
          type="radio"
          value="UPI"
          checked={method === "UPI"}
          onChange={(e) => setMethod(e.target.value)}
        />
        UPI
      </label>

      <br />

      <label>
        <input
          type="radio"
          value="Card"
          checked={method === "Card"}
          onChange={(e) => setMethod(e.target.value)}
        />
        Card
      </label>

      <br />

      <label>
        <input
          type="radio"
          value="NetBanking"
          checked={method === "NetBanking"}
          onChange={(e) => setMethod(e.target.value)}
        />
        Net Banking
      </label>

      <br /><br />

      <button onClick={() => handlePayment("success")}>
        Pay Now (Success)
      </button>

      <br /><br />

      <button onClick={() => handlePayment("failure")}>
        Fail Payment
      </button>
    </div>
  );
}

export default FakePaymentPage;