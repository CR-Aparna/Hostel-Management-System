/*import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import "./PendingAllocations.css";

function PendingAllocations() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState({});

  useEffect(() => {
    fetchPendingStudents();
    fetchAvailableRooms();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      const res = await axiosInstance.get("/room-management/pending-allocations");
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students", err);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const res = await axiosInstance.get("/room-management/available-rooms");
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms", err);
    }
  };

  const handleRoomSelect = (studentId, roomId) => {
    setSelectedRooms({
      ...selectedRooms,
      [studentId]: roomId,
    });
  };

  const handleAllocate = async (studentId) => {
    const roomId = selectedRooms[studentId];

    if (!roomId) {
      alert("Please select a room");
      return;
    }

    try {
      await axiosInstance.post("/room-management/rooms/allocate", {
        student_id: studentId,
        room_id: roomId,
      });

      alert("Room allocated successfully");

      // refresh list
      fetchPendingStudents();
    } catch (err) {
      console.error(err);
      alert("Allocation failed");
    }
  };

  return (
    <>
      <Navbar title="Pending Allocations" />

      <div className="container">
        <h2>Approved Students (Not Allocated)</h2>

        {students.length === 0 ? (
          <p>No pending allocations</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Preference</th>
                <th>Select Room</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => {
                // Filter rooms based on preference
                const filteredRooms = rooms.filter(
                  (room) =>
                    !student.preferred_room_type ||
                    room.room_type === student.preferred_room_type
                );

                return (
                  <tr key={student.student_id}>
                    <td>{student.name}</td>
                    <td>{student.preferred_room_type || "None"}</td>

                    <td>
                      <select
                        onChange={(e) =>
                          handleRoomSelect(student.student_id, e.target.value)
                        }
                      >
                        <option value="">Select Room</option>

                        {filteredRooms.map((room) => (
                          <option key={room.room_id} value={room.room_id}>
                            Room {room.room_number} ({room.room_type})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          handleAllocate(student.student_id)
                        }
                      >
                        Allocate
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default PendingAllocations;*/


import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import "./PendingAllocations.css";

function PendingAllocations() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState({});
  const [suggestedRooms, setSuggestedRooms] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch students and rooms
      const studentsRes = await axiosInstance.get(
        "/room-management/pending-allocations"
      );
      const roomsRes = await axiosInstance.get(
        "/room-management/available-rooms"
      );

      setStudents(studentsRes.data);
      setRooms(roomsRes.data);

      // 🔥 Fetch suggested rooms in parallel
      const suggestionPromises = studentsRes.data.map((student) =>
        axiosInstance.get(
          `/room-management/rooms/suggested/${student.student_id}`
        )
      );

      const results = await Promise.all(suggestionPromises);

      const suggestions = {};
      studentsRes.data.forEach((student, index) => {
        suggestions[student.student_id] = results[index].data;
      });

      setSuggestedRooms(suggestions);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const handleRoomSelect = (studentId, roomId) => {
    setSelectedRooms({
      ...selectedRooms,
      [studentId]: roomId,
    });
  };

  const handleAllocate = async (studentId) => {
    const roomId = selectedRooms[studentId];

    if (!roomId) {
      alert("Please select a room");
      return;
    }

    try {
      await axiosInstance.post("/room-management/rooms/allocate", {
        student_id: studentId,
        room_id: roomId,
      });

      alert("Room allocated successfully");

      // Refresh data
      fetchAllData();
    } catch (err) {
      console.error(err);
      alert("Allocation failed");
    }
  };

  return (
    <>
      <Navbar title="Pending Allocations" />

      <div className="container">
        <h2>Approved Students (Not Allocated)</h2>

        {students.length === 0 ? (
          <p>No pending allocations</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Preference</th>
                <th>Select Room</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => {
                const studentSuggestedData =
                  suggestedRooms[student.student_id] || {};
                const preferredRooms = studentSuggestedData.preferred_rooms || [];

                return (
                  <tr key={student.student_id}>
                    <td>{student.name}</td>
                    <td>{student.preferred_room_type || "None"}</td>

                    <td>
                      <select
                        onChange={(e) =>
                          handleRoomSelect(
                            student.student_id,
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Room</option>

                        {/* ⭐ Preferred Rooms */}
                        {preferredRooms.length > 0 && (
                          <optgroup label="Preferred Rooms">
                            {preferredRooms.map((room) => (
                              <option
                                key={room.room_id}
                                value={room.room_id}
                              >
                                ⭐ Room {room.room_number} (
                                {room.room_type})
                              </option>
                            ))}
                          </optgroup>
                        )}

                        {/* Other Rooms */}
                        <optgroup label="Other Rooms">
                          {rooms
                            .filter(
                              (room) =>
                                !preferredRooms.some(
                                  (s) =>
                                    s.room_id === room.room_id
                                )
                            )
                            .map((room) => (
                              <option
                                key={room.room_id}
                                value={room.room_id}
                              >
                                Room {room.room_number} (
                                {room.room_type})
                              </option>
                            ))}
                        </optgroup>
                      </select>
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          handleAllocate(student.student_id)
                        }
                      >
                        Allocate
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default PendingAllocations;
