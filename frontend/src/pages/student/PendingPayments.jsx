import {useState, useEffect} from "react";
import axiosInstance from "../../utils/axiosInstance";
//import "./PendingInvoices.css";
import { useNavigate } from "react-router-dom";

function PendingPayments() {
    const [pending_payments, setPendingPayments] = useState([]);
    const [invoice_items, setInvoiceItems] = useState([]);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPendingPayments();    
    }, []);
    useEffect(() => {
        if (selectedInvoiceId) {
            setSelectedInvoiceId(selectedInvoiceId);
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
            setShowModal(true);
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
            {pending_payments.length === 0 ? (
                <p>No pending payments</p>
            ) : (
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
                                <td>{pending_payment.created_date ? new Date(pending_payment.created_date).toLocaleDateString("en-IN") : '--'}</td>
                                <td>{pending_payment.due_date ? new Date(pending_payment.due_date).toLocaleDateString("en-IN") : '--' }</td>
                                <td>{pending_payment.amount}</td>
                                <td style={{ color: pending_payment.status.toLowerCase() === 'overdue' ? 'red' : 'inherit' }}>
                                    {pending_payment.status}</td>
                                <td>
                                    <button onClick={() => handlePayNow(pending_payment.id)}>
                                      Pay Now
                                    </button>
                                    <button onClick={() => fetchInvoiceItems(pending_payment.id)}>
                                      View Fee Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Fee Breakdown</h3>
                        <table className="details-table">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice_items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.description || item.item_name}</td>
                                        <td>{item.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}
export default PendingPayments;