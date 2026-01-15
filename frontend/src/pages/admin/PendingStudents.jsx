import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./PendingStudents.css";

function PendingStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      const res = await axiosInstance.get("/student-management/pending");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  const approveStudent = async (studentId) => {
    try {
      await axiosInstance.put(`/student-management/${studentId}/approve`);
      // remove approved student from list
      setStudents(students.filter(s => s.student_id !== studentId));
    } catch (err) {
      console.error("Approval failed", err);
      alert("Approval failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="pending-container">
      <h2>Pending Student Approvals</h2>

      {students.length === 0 ? (
        <p>No pending students</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Year</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.student_id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.department}</td>
                <td>{s.year}</td>
                <td>
                  <button onClick={() => approveStudent(s.student_id)}>
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PendingStudents;
