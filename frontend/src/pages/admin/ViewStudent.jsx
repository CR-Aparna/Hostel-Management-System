import { useState } from "react";
import axios from "axios";
import "./ViewStudent.css";

function ViewStudent() {
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState(null);

  const fetchStudent = async () => {
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
    } catch (err) {
      alert("Student not found");
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
      <h3>Preferred Room Type</h3>
      <div className="profile-grid">
        <div className="profile-item">
          <span className="profile-label">Room Type</span>
          <span className="profile-value">{student.preferred_room_type}</span>
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

  </div>
)}
    </div>
  );
}

export default ViewStudent;
