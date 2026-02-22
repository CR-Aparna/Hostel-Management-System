import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./PendingDeallocations.css";

function PendingDeallocations() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get("/room-management/warden/vacate-requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (studentId) => {
    try {
      await axiosInstance.post(
        `/room-management/rooms/deallocate/${studentId}`
      );

      alert("Deallocated successfully");
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Deallocation failed");
    }
  };

  return (
    <div>
      <h3>Pending Deallocation Requests</h3>

      {requests.length === 0 ? (
        <p>No requests</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Room</th>
              <th>Reason</th>
              <th>Request Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr key={req.request_id}>
                <td>{req.student_id}</td>
                <td>{req.room_number}</td>
                <td>{req.reason}</td>
                <td>{req.request_date}</td>

                <td>
                  <button
                    onClick={() =>
                      handleApprove(req.student_id)
                    }
                  >
                     Deallocate
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

export default PendingDeallocations;
