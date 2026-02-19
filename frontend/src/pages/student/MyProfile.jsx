
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../api/student";

function MyProfile() {
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const data = await getProfile();
    setProfile(data);
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    await updateProfile(profile);
    alert("Profile updated!");
    setIsEditing(false);
  };

  return (
    <div>
      <h2>My Profile</h2>

      {/* NAME */}
      <p>
        <strong>Name :</strong>{profile.name}
      </p>

      {/* EMAIL */}
      <p>
        <strong>Email :</strong>{" "}
        {isEditing ? (
          <input
            name="email"
            value={profile.email || ""}
            onChange={handleChange}
          />
        ) : (
          profile.email
        )}
      </p>

      {/* PHONE */}
      <p>
        <strong>Phone :</strong>{" "}
        {isEditing ? (
          <input
            name="phone"
            value={profile.phone || ""}
            onChange={handleChange}
          />
        ) : (
          profile.phone
        )}
      </p>

      <p>
        <strong>Gender :</strong>{profile.gender}
      </p>

      <p>
        <strong>Admission Number :</strong>{profile.admission_number}
      </p>

      <p>
        <strong>Department :</strong>{profile.department}
      </p>

      <p>
        <strong>Course :</strong>{profile.course}
      </p>

      <p>
        <strong> Current Semester :</strong>{profile.semester}
      </p>

      <p>
        <strong>Guardian Name :</strong>{profile.guardian_name}
      </p>

      <p>
        <strong>Guardian Phone :</strong>{" "}
        {isEditing ? (
          <input
            name="guardian_phone"
            value={profile.guardian_phone || ""}
            onChange={handleChange}
          />
        ) : (
          profile.guardian_phone
        )}
      </p>  

      <p>
        <strong>Guardian Relation :</strong>{profile.guardian_relation}
      </p>


      {/* Buttons */}
      {!isEditing ? (
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      ) : (
        <>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </>
      )}
    </div>
  );
}

export default MyProfile;
