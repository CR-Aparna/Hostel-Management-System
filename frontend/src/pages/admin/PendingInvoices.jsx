/*import {useState, useEffect} from "react";
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
                        <th>Admission Number</th>
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
                            <td>{invoice.student_admission_number}</td>
                            <td>{invoice.student_name}</td>
                            <td>{invoice.id}</td>
                            <td>{invoice.month}</td>
                            <td>{invoice.year}</td>
                            <td>{invoice.status}</td>                            
                            <td>{invoice.created_at ? new Date(invoice.created_at).toLocaleDateString('en-IN') : "--"}</td>
                            <td>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-IN') : "--"}</td>
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

export default PendingInvoices

import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./PendingInvoices.css";

function PendingInvoices() {
    const [invoices, setInvoices] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState("")

    useEffect(() => {
        fetchInvoices();
        fetchActiveStudents();
    }, []);

    const fetchInvoices = async () => {
        const res = await axiosInstance.get("/payment-management/all-pending-invoices");
        setInvoices(res.data);
    };

    const fetchActiveStudents = async () => {
        // You'll need an endpoint that returns all active students
        const res = await axiosInstance.get("/student-management/active-students"); 
        setStudents(res.data);
    };

    const handleGenerateInvoice = async (studentId) => {
        setLoading(true);
        try {
            await axiosInstance.post(`/payment-management/generate-invoice/${studentId}`);
            alert("Invoice generated successfully!");
            fetchInvoices(); // Refresh the list to show the new invoice
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to generate invoice. It might already exist.");
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="admin-payment-container">
        <section className="generation-section">
            <h2>Quick Invoice Generation</h2>
            <div className="student-selector">
                <select id="studentSelect" value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)}>
                    <option value="">Choose Student...</option>
                    {students.map(s => (
                        <option key={s.student_id} value={s.student_id}>
                            {s.name} — {s.admission_number}
                        </option>
                    ))}
                </select>
                <button onClick={() => {
                        if (selectedStudentId) {
                            handleGenerateInvoice(selectedStudentId);
                        } else {
                            alert("Please select a student first!");
                        }
                    }}>
                    Generate Invoice
                </button>
            </div>
        </section>

        <section className="list-section">
            <h2>Pending Payments</h2>
            <table className="invoice-table">
                <thead>
                    <tr>
                        <th>Admission No</th>
                        <th>Student Name</th>
                        <th>Month/Year</th>
                        <th>Status</th>
                        <th>Due Date</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                            <td>{invoice.student_admission_number}</td>
                            <td><strong>{invoice.student_name}</strong></td>
                            <td>{invoice.month}/{invoice.year}</td>
                            <td><span className="status-unpaid">{invoice.status}</span></td>
                            <td>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-IN') : "--"}</td>
                            <td className="amount-cell">₹{invoice.total_amount}</td>
                            <td>
                                <button className="inform-btn">Inform Student</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    </div>
);
}

export default PendingInvoices;*/

import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./PendingInvoices.css";

function PendingInvoices() {
    const [invoices, setInvoices] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // 1. ADD THIS STATE to store the selection
    const [selectedStudentId, setSelectedStudentId] = useState("");

    useEffect(() => {
        fetchActiveStudents();
        fetchInvoices();
    }, []);

    const fetchActiveStudents = async () => {
        try {
            const res = await axiosInstance.get("/student-management/get/active-students"); 
            setStudents(res.data);
        } catch (err) {
            console.error("Error fetching students", err);
        }
    };


    const fetchInvoices = async () => {
        try {
            const res = await axiosInstance.get("/payment-management/all-pending-invoices");
            setInvoices(res.data);
        } catch (err) {
            console.error("Error fetching invoices", err);
        }
    };

    
    // 2. CRITICAL FIX: Ensure studentId is passed correctly
    const handleGenerateInvoice = async (id) => {
        if (!id) {
            alert("Please select a student first!");
            return;
        }

        setLoading(true);
        try {
            // This 'id' must be a simple number/string, NOT an event object
            const response = await axiosInstance.post(`/payment-management/generate-invoice/${id}`);
            if (response.data.invoice_status) {
                alert("Invoice already exists!");
            } else {
                alert("Invoice generated successfully!");
            }
            setSelectedStudentId(""); // Reset dropdown
            fetchInvoices(); 
        } catch (err) {
            // Improved error alert to avoid [object Object]
            const errorMsg = err.response?.data?.detail || "Failed to generate invoice.";
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-payment-container">
            <section className="generation-section">
                <h2>Quick Invoice Generation</h2>
                <div className="student-selector">
                    {/* 3. BIND SELECT TO STATE */}
                    <select 
                        value={selectedStudentId} 
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                    >
                        <option value="">Choose Student...</option>
                        {students.map(s => (
                            <option key={s.student_id} value={s.student_id}>
                                {s.name} — {s.admission_number}
                            </option>
                        ))}
                    </select>

                    {/* 4. WRAP CALL IN ARROW FUNCTION */}
                    <button 
                        disabled={loading} 
                        onClick={() => handleGenerateInvoice(selectedStudentId)}
                    >
                        {loading ? "Generating..." : "Generate Invoice"}
                    </button>
                </div>
            </section>

            <section className="list-section">
                <h2>Pending Payments</h2>
                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>Admission No</th>
                            <th>Student Name</th>
                            <th>Month/Year</th>
                            <th>Status</th>
                            <th>Due Date</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.length > 0 ? (
                            invoices.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td>{invoice.student_admission_number}</td>
                                    <td><strong>{invoice.student_name}</strong></td>
                                    <td>{invoice.month}/{invoice.year}</td>
                                    <td><span className="status-unpaid">{invoice.status}</span></td>
                                    <td>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-IN') : "--"}</td>
                                    <td className="amount-cell">₹{invoice.total_amount}</td>
                                    <td>
                                        <button className="inform-btn">Inform Student</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" style={{textAlign: 'center'}}>No pending invoices.</td></tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default PendingInvoices;