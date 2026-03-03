import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

function WardenMessCut() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get("/meal-management/mess-cut-requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch requests");
    }
  };

  const handleApprove = async (request_id) => {
    try {
      await axiosInstance.put(`/meal-management/${request_id}/approve`);
      alert("Request approved");
      fetchRequests(); // refresh
    } catch (err) {
      console.error(err);
      alert("Failed to approve");
    }
  };

  const handleReject = async (request_id) => {
    try {
      await axiosInstance.put(`/meal-management/${request_id}/reject`);
      alert("Request rejected");
      fetchRequests(); // refresh
    } catch (err) {
      console.error(err);
      alert("Failed to reject");
    }
  };

  return (
    <div>
      <h2>Mess Cut Requests</h2>

      {requests.length === 0 ? (
        <p>No requests found</p>
      ) : (
        requests.map((req) => (
          <div
            key={req.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p><b>Student ID:</b> {req.student_id}</p>
            <p><b>From:</b> {req.from_date}</p>
            <p><b>To:</b> {req.to_date}</p>
            <p><b>Reason:</b> {req.reason}</p>
            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  color:
                    req.status === "Approved"
                      ? "green"
                      : req.status === "Rejected"
                      ? "red"
                      : "orange",
                }}
              >
                {req.status}
              </span>
            </p>

            {req.status === "pending" && (
              <div>
                <button onClick={() => handleApprove(req.id)}>
                  Approve
                </button>

                <button
                  onClick={() => handleReject(req.id)}
                  style={{ marginLeft: "10px" }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default WardenMessCut;