import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import "./RoomChangeRequests.css";

function RoomChangeRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get(
        "/room-management/change-requests"
      );
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await axiosInstance.post(
        `/room-management/change-request/${requestId}/approve`
      );

      alert("Room change approved");
      fetchRequests();
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.detail || "Approval failed");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axiosInstance.post(
        `/room-management/change-request/${requestId}/reject`
      );

      alert("Request rejected");
      fetchRequests();
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.detail || "Rejection failed");
    }
  };

  return (
    <>
      <Navbar title="Room Change Requests" />

      <div className="container">
        <h2>Pending Room Change Requests</h2>

        {requests.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Current Room</th>
                <th>Preferred Type</th>
                <th>Preferred Room</th>
                <th>Reason</th>
                <th>Request Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr key={req.request_id}>
                  <td>{req.student_id}</td>
                  <td>{req.current_room_number}</td>
                  <td>{req.requested_room_type}</td>
                  <td>{req.requested_room_number}</td>
                  <td>{req.reason}</td>
                  <td>{req.request_date}</td>

                  <td>
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(req.request_id)}
                    >
                      Approve
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() => handleReject(req.request_id)}
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
    </>
  );
}

export default RoomChangeRequests;
