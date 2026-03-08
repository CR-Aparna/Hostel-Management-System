import {useState, useEffect} from "react";
import axiosInstance from "../../utils/axiosInstance";
//import "./PendingInvoices.css";
import { useNavigate } from "react-router-dom";

function PendingPayments() {
    const [pending_payments, setPendingPayments] = useState([]);
    const [invoice_items, setInvoiceItems] = useState([]);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPendingPayments();    
    }, []);
    useEffect(() => {
        if (selectedInvoiceId) {
            fetchInvoiceItems(selectedInvoiceId);
        }
    }, [selectedInvoiceId]);

    const fetchPendingPayments = async () => {
        try{
            const res = await axiosInstance.get("/payment-management/student/invoices");
            setPendingPayments(res.data);
        }
        catch(err){
            console.error(err);    
        }    
    };
    const fetchInvoiceItems = async (invoiceId) => {
        try{
            const res = await axiosInstance.get(`/payment-management/invoice-items/${invoiceId}`);
            setInvoiceItems(res.data);
        }
        catch(err){
            console.error(err);    
        }
    };

    const handlePayNow = async (invoiceId) => {
        try {
            await axiosInstance.get(`/payment-management/current-payment/${invoiceId}`);
            alert("Redirecting to payment page...");
            //fetchPendingPayments();
            navigate(`/student/make-payment/${invoiceId}`)
        } catch (err) {
            console.error(err);
            alert("Payment failed");
        }
    };

    return (
        <div className="pending-invoices">
            <h2>Pending Payments</h2>
            <table className="invoice-table">
                <thead>
                    <tr>
                        <th>Invoice Number</th>
                        <th>Invoice Date</th>
                        <th>Due Date</th>       
                        <th>Amount</th>
                        <th>Payment Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pending_payments.map((pending_payment) => (
                        <tr key={pending_payment.id}>
                            <td>{pending_payment.id}</td>
                            <td>{pending_payment.created_date}</td>
                            <td>{pending_payment.due_date}</td>
                            <td>{pending_payment.amount}</td>
                            <td style={{ color: pending_payment.status.toLowerCase() === 'overdue' ? 'red' : 'inherit' }}>
                                {pending_payment.status}</td>
                            <td>
                                <button onClick={() => handlePayNow(pending_payment.id)}>
                                  Pay Now
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default PendingPayments;