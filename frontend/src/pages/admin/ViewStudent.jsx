import { useState } from "react";
import axios from "axios";
import "./ViewStudent.css";

function ViewStudent() {
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState(null);
  const [payments, setPayments] = useState([]);

  const fetchStudent = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `http://localhost:8000/student-management/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setStudent(res.data);
      fetchPaymentHistory(studentId);
    } catch (err) {
    alert("Student not found");
    console.error(err);
  }
  };

      // Fetch payment history of that student
  const fetchPaymentHistory = async (student_id) => {
    const token = localStorage.getItem("token");
    try {
      const paymentRes = await axios.get(
      `http://localhost:8000/payment-management/payment-history/${student_id}`, // create this API if not present
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setPayments(paymentRes.data);

  } catch (err) {
    alert("Payment history not found");
    console.error(err);
  }
  };

  
  return (
    <div style={{ padding: "20px" }}>
      <h2>View Student Details</h2>

      <input
        type="number"
        placeholder="Enter Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />

      <button onClick={fetchStudent} style={{ marginLeft: "10px" }}>
        View Student
      </button>

      {student && (
  <div className="profile-content">

    {/* Student Info */}
    <div className="profile-section">
      <h3>Student Info</h3>
      <div className="profile-grid">
        <div className="profile-item">
          <span className="profile-label">ID</span>
          <span className="profile-value">{student.student_id}</span>
        </div>

        <div className="profile-item">
          <span className="profile-label">Name</span>
          <span className="profile-value">{student.name}</span>
        </div>

        <div className="profile-item">
          <span className="profile-label">Admission No</span>
          <span className="profile-value">{student.admission_number}</span>
        </div>

        <div className="profile-item">
          <span className="profile-label">Gender</span>
          <span className="profile-value">{student.gender}</span>
        </div>

        <div className="profile-item">
          <span className="profile-label">Email</span>
          <span className="profile-value">{student.email}</span>
        </div>

        <div className="profile-item">
          <span className="profile-label">Department</span>
          <span className="profile-value">{student.department}</span>
        </div>

        <div className="profile-item">
          <span className="profile-label">Course</span>
          <span className="profile-value">{student.course}</span>
        </div>

        <div className="profile-item">
          <span className="profile-label">Semester</span>
          <span className="profile-value">{student.semester}</span>
        </div>

        <div className="profile-item">
          <span className="profile-label">Phone</span>
          <span className="profile-value">{student.phone}</span>
        </div>
      </div>
    </div>

    <div className="profile-section">
      <h3>Preferred Room and Food Type</h3>
      <div className="profile-grid">
        <div className="profile-item">
          <span className="profile-label">Room Type</span>
          <span className="profile-value">{student.preferred_room_type}</span>
          <span className="profile-label">Food Type</span>
          <span className="profile-value">{student.preferred_food_type}</span>
        </div>
      </div>
    </div>

    {/* Guardian Info */}
    <div className="profile-section">
      <h3>Guardian Info</h3>
      <div className="profile-grid">
        <div className="profile-item">
          <span className="profile-label">Name</span>
          <span className="profile-value">{student.guardian_name}</span>
        </div>

        <div className="profile-item">
          <span className="profile-label">Phone</span>
          <span className="profile-value">{student.guardian_phone}</span>
        </div>

        <div className="profile-item">
          <span className="profile-label">Relation</span>
          <span className="profile-value">{student.guardian_relation}</span>
        </div>
      </div>
    </div>

    {/* Address */}
    <div className="profile-section">
      <h3>Address</h3>
      <div className="profile-grid">
        <div className="profile-item">
          <span className="profile-label">Address</span>
          <span className="profile-value">{student.addresses?.address}</span>
        </div>

        <div className="profile-item">
          <span className="profile-label">City</span>
          <span className="profile-value">{student.addresses?.city}</span>
        </div>

        <div className="profile-item">
          <span className="profile-label">State</span>
          <span className="profile-value">{student.addresses?.state}</span>
        </div>

        <div className="profile-item">
          <span className="profile-label">Pincode</span>
          <span className="profile-value">{student.addresses?.pincode}</span>
        </div>
      </div>
    </div>
    {/* Payment Details */}
<div className="profile-section">
  <h3>Payment Details</h3>
      <span className="profile-label">Caution Deposit</span><br/>
      <span className="profile-value">{student.caution_deposit}</span>

  {payments.length === 0 ? (
    <p>No payment records found</p>
  ) : (
    <div className="profile-grid">
      {payments.map((payment, index) => (
        <div key={index} className="profile-item">
          <span className="profile-label">Order ID</span>
          <span className="profile-value">{payment.order_id}</span>

          <span className="profile-label">Amount</span>
          <span className="profile-value">₹{payment.amount}</span>

          <span className="profile-label">Status</span>
          <span className="profile-value">{payment.status}</span>

          <span className="profile-label">Method</span>
          <span className="profile-value">{payment.payment_method}</span>

          <span className="profile-label">Date and Time</span>
          <span className="profile-value">
            {new Date(payment.created_at).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )}
</div>

  </div>
)}
    </div>
  );
}

export default ViewStudent;
