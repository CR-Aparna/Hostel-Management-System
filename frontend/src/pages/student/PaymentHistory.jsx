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
  const handleDownload = async (invoiceId) => {
  try {
    const response = await axiosInstance.get(`/payment-management/download-receipt/${invoiceId}`, {
      responseType: 'blob', // IMPORTANT: Tells Axios to handle binary data
    });

    // Create a temporary link element to trigger the download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `receipt_${invoiceId}.pdf`);
    
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed", error);
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
              <th>Actions</th>
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
                  {payment.payment_date
                    ? new Date(payment.payment_date).toLocaleDateString('en-IN')
                    : "—"}
                </td>
                <td>
                    <button onClick={() => handleDownload(payment.invoice_id)}>Download Receipt</button>
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