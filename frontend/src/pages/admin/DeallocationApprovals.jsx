import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./DeallocationApprovals.css";

function DeallocationApprovals() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get("/room-management/admin/vacate-requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await axiosInstance.put(
        `/room-management/vacate-request/${requestId}/approve`
      );

      alert("Approved successfully");
      fetchRequests();
    }
    catch (err) {
      console.error(err);
      alert(" Approval failed");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axiosInstance.post(
        `/room-management/vacate-request/${requestId}/reject`
      );

      alert("Rejected successfully");
      fetchRequests();
    }
    catch (err) {
      console.error(err);
      alert(" Rejection failed");
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
                      handleApprove(req.request_id)
                    }
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      handleReject(req.request_id)
                    }
                  >
                    Reject
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

export default DeallocationApprovals;
