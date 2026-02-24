import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./StudentRoomManagement.css";

function StudentRoomManagement() {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [changeRequest, setChangeRequest] = useState({
  requested_room_type: "",
  requested_room_number: "",
  reason: "",
});
  const [showVacateForm, setShowVacateForm] = useState(false);
  const [vacateReason, setVacateReason] = useState("");

  useEffect(() => {
    fetchRoomDetails();
  }, []);

  const fetchRoomDetails = async () => {
    try {
      const res = await axiosInstance.get("/room-management/rooms/my-room");
      setRoom(res.data);
    } catch (error) {
      console.error("Error fetching room details", error);
      setRoom(null);
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
  setChangeRequest({
    ...changeRequest,
    [e.target.name]: e.target.value,
  });
};

  const handleChangeRequest = async () => {
  try {
    await axiosInstance.post("/room-management/change-request", {
      requested_room_type: changeRequest.requested_room_type || null,
      requested_room_number: changeRequest.requested_room_number || null,
      reason: changeRequest.reason || null,
    });

    alert("Room change request submitted");

    // Reset + close form
    setChangeRequest({
      requested_room_type: "",
      requested_room_number: "",
      reason: "",
    });
    setShowChangeForm(false);

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.detail || "Failed to submit request");
  }
};

  const handleVacateRequest = async () => {
  try {
    await axiosInstance.post("/room-management/vacate-request", {
      reason: vacateReason || null,
    });

    alert("Room vacate request submitted");

    // reset + close form
    setVacateReason("");
    setShowVacateForm(false);

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.detail || "Failed to submit request");
  }
};

  if (loading) return <p>Loading room details...</p>;

  return (
    <div className="room-container">
      <h2>My Room</h2>

      {room ? (
        <div className="room-card">
          <p><strong>Room Number:</strong> {room.room_number}</p>
          <p><strong>Floor:</strong> {room.floor}</p>
          <p><strong>Room Type:</strong> {room.room_type}</p>
          <p><strong>Status:</strong>{room.status}</p>
          <p><strong>Capacity:</strong> {room.capacity}</p>
          <p><strong>Rent Per Day:</strong>{room.rent}</p>

          <div className="room-actions">
  <button
    className="change-btn"
    onClick={() => setShowChangeForm(true)}
  >
    Request Room Change
  </button>

  <button
  className="vacate-btn"
  onClick={() => setShowVacateForm(true)}
>
  Request Vacate
</button>
    </div>
    {showChangeForm && (
  <div className="change-form">
    <h3>Room Change Request</h3>

    <select name="requested_room_type" onChange={handleInputChange}>
        <option value="">Select Room Type</option>
        <option value="Ordinary and Attached">Ordinary & Attached</option>
        <option value="Ordinary and Non Attached">Ordinary & Non Attached</option>
        <option value="AC and attached">AC & Attached</option>
        <option value="AC and Non attached">AC & Non Attached</option>
    </select>

    <input
      type="text"
      name="requested_room_number"
      placeholder="Preferred Room Number (optional)"
      value={changeRequest.requested_room_number}
      onChange={handleInputChange}
    />

    <textarea
      name="reason"
      placeholder="Reason for change"
      value={changeRequest.reason}
      onChange={handleInputChange}
    />

    <div className="form-actions">
      <button onClick={handleChangeRequest} disabled={!changeRequest.reason}>Submit</button>
      <button onClick={() => setShowChangeForm(false)}>Cancel</button>
    </div>
  </div>
)}
{showVacateForm && (
  <div className="vacate-form">
    <h3>Vacate Room</h3>

    <textarea
      placeholder="Reason for vacating"
      value={vacateReason}
      onChange={(e) => setVacateReason(e.target.value)}
    />

    <div className="form-actions">
      <button onClick={handleVacateRequest} disabled={!vacateReason}>
        Submit
      </button>
      <button onClick={() => setShowVacateForm(false)}>
        Cancel
      </button>
    </div>
  </div>
)}
        </div>
        
      ) : (
        <div className="no-room">
          <p>No room assigned yet.</p>
        </div>
      )}
      
    </div>
  );
}

export default StudentRoomManagement;