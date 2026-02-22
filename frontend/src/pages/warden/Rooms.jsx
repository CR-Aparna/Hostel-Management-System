import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import "./Rooms.css";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [newRoom, setNewRoom] = useState({
    room_number: "",
    floor: "",
    capacity: "",
    room_type: "",
    rent: ""
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axiosInstance.get("/room-management/rooms/details");
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms", err);
    }
  };

  const handleChange = (e) => {
    setNewRoom({
      ...newRoom,
      [e.target.name]: e.target.value
    });
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/room-management/rooms", newRoom);
      alert("Room added successfully");

      setShowForm(false);
      setNewRoom({
        room_number: "",
        floor: "",
        capacity: "",
        room_type: "",
        rent: ""
      });

      fetchRooms();
    } catch (err) {
      console.error(err);
      alert("Failed to add room");
    }
  };

  return (
    <>
      <Navbar title="Rooms" />

      <div className="container">
        <div className="header">
          <h2>All Rooms</h2>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close" : "Add Room"}
          </button>
        </div>

        {/* Add Room Form */}
        {showForm && (
          <form className="room-form" onSubmit={handleAddRoom}>
            <input name="room_number" placeholder="Room Number" onChange={handleChange} required />
            <input name="floor" type="number" placeholder="Floor" onChange={handleChange} required />
            <input name="capacity" type="number" placeholder="Capacity" onChange={handleChange} required />

            <select name="room_type" onChange={handleChange} required>
              <option value="">Select Room Type</option>
              <option value="AC and attached">AC & Attached</option>
              <option value="AC and Non attached">AC & Non Attached</option>
              <option value="Ordinary and Attached">Ordinary & Attached</option>
              <option value="Ordinary and Non Attached">Ordinary & Non Attached</option>
            </select>

            <input name="rent" type="number" placeholder="Rent" onChange={handleChange} required />

            <button type="submit">Submit</button>
          </form>
        )}

        {/* Rooms Table */}
        <table>
          <thead>
            <tr>
              <th>Room No</th>
              <th>Type</th>
              <th>Floor</th>
              <th>Capacity</th>
              <th>Occupied</th>
              <th>Status</th>
              <th>Occupants</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((room) => (
              <tr key={room.room_number}>
                <td>{room.room_number}</td>
                <td>{room.room_type}</td>
                <td>{room.floor}</td>
                <td>{room.capacity}</td>
                <td>{room.current_occupancy}</td>

                <td>
                  <span className={
                    room.status === "Full" ? "status-full" : "status-available"
                  }>
                    {room.status}
                  </span>
                </td>

                <td>
                  {room.occupants.length === 0 ? (
                    "None"
                  ) : (
                    <ul>
                      {room.occupants.map((s) => (
                        <li key={s.student_id}>{s.name}</li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Rooms;
