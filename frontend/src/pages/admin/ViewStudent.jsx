import { useState } from "react";
import axios from "axios";

function ViewStudent() {
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState(null);

  const fetchStudent = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/student-management/${studentId}`,
        {
          headers: {
            "X-User-Id": localStorage.getItem("user_id"),
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
        <div style={{ marginTop: "20px" }}>
          <h3>Student Info</h3>
          <p>ID: {student.student_id}</p>
          <p>Name: {student.name}</p>
          <p>Email: {student.email}</p>
          <p>Department: {student.department}</p>
          <p>Year: {student.year}</p>
          <p>Status: {student.status}</p>
          <p>Phone: {student.phone}</p>
          <p>Date of Joining : {student.date_of_joining}</p>
        </div>
      )}
    </div>
  );
}

export default ViewStudent;
