import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./PendingStudents.css";

function PendingStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStudent, setCurrentStudent] = useState({});
  const dialogRef = useRef(null);

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

  const getStudentDetails = async (studentId) => {
    try {
      const res = await axiosInstance.get(`/student-management/${studentId}`);
      setCurrentStudent(res.data);
    } catch (err) {
      console.error("Failed to fetch student details", err);
    }
  };

  const openModal = (studentId) => {
    getStudentDetails(studentId);
    dialogRef.current.showModal();
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
              <th>Student ID</th>
              <th>Email</th>
              <th>Department</th>
              <th>Current Semester</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.student_id}>
                <td>{s.name}</td>
                <td>{s.student_id}</td>
                <td>{s.email}</td>
                <td>{s.department}</td>
                <td>{s.semester}</td>
                <td>
                  <button
                    type="button"
                    style={{ marginBottom: "5px" }}
                    onClick={() => openModal(s.student_id)}
                  >
                    View
                  </button>                  
                  <button onClick={() => approveStudent(s.student_id)}>
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <dialog ref={dialogRef} style={{width: '40%', height: '40%'}}>
        <h2>Dialog Title</h2>
        <p>This is the content of the dialog.</p>
        {currentStudent && (
          <div>
            <p>Name: {currentStudent.name}</p>
            <p>Student ID: {currentStudent.student_id}</p>
            <p>Admission Number :{currentStudent.admission_number}</p>
            <p>Email: {currentStudent.email}</p>
            <p>Phone: {currentStudent.phone}</p>
            <p>Department: {currentStudent.department}</p>
            <p>Course: {currentStudent.course}</p>
            <p>Semester: {currentStudent.semester}</p>
            <h5>Guardian Details</h5>
            <p>Guardian Name: {currentStudent.guardian_name}</p>
            <p>Guardian Phone: {currentStudent.guardian_phone}</p>
            <p>Guardian Relation: {currentStudent.guardian_relation}</p>
          </div>
        )}
        <button onClick={() => dialogRef.current.close()}>
          Close
        </button>
      </dialog>
    </div>
  );
}

export default PendingStudents;