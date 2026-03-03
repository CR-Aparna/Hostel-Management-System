import {useState, useEffect} from "react";
import axiosInstance from "../../utils/axiosInstance";
//import "./PendingInvoices.css";

function PendingInvoices() {
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        const res = await axiosInstance.get("/payment-management/all-pending-invoices");
        setInvoices(res.data);
    };

    return (
        <div className="pending-invoices">
            <h2>Pending Invoices</h2>
            <table>
                <thead>
                    <tr>
                        <th>Student Id</th>
                        <th>Student Name</th>
                        <th>Invoice ID</th>
                        <th>Month</th>
                        <th>Year</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Due Date</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                            <td>{invoice.student_id}</td>
                            <td>{invoice.student_name}</td>
                            <td>{invoice.id}</td>
                            <td>{invoice.month}</td>
                            <td>{invoice.year}</td>
                            <td>{invoice.status}</td>                            
                            <td>{invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : "--"}</td>
                            <td>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "--"}</td>
                            <td>₹{invoice.total_amount}</td>
                            <td>
                                <button>Inform Student</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PendingInvoices;