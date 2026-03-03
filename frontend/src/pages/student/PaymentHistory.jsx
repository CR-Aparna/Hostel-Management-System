import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./PaymentHistory.css";

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const res = await axiosInstance.get("/payment-management/payment-history");
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payment history:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2>💳 Payment History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <table className="payment-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Method</th>
              <th>Transaction ID</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.order_id}</td>
                <td>₹{payment.amount}</td>
                <td className={payment.status === "success" ? "success" : "failed"}>
                  {payment.status}
                </td>
                <td>{payment.payment_method || "—"}</td>
                <td>{payment.transaction_id || "—"}</td>
                <td>
                  {payment.created_at
                    ? new Date(payment.created_at).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PaymentHistory;