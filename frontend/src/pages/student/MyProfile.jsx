
/*import { useEffect, useState } from "react";
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

      //{NAME }
      <p>
        <strong>Name :</strong>{profile.name}
      </p>

      //{ EMAIL }
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

      //{ PHONE }
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


      //{Buttons }
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

export default MyProfile;*/


import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../api/student";
import "./MyProfile.css";

function MyProfile() {
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const data = await getProfile();
    setProfile({
    ...data,
    address: data.addresses?.address,
    city: data.addresses?.city,
    state: data.addresses?.state,
    pincode: data.addresses?.pincode
  });
};

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Handle nested address changes
  /*const handleAddressChange = (e) => {
    setProfile({
      ...profile,
      addresses: {
        ...profile.addresses,
        [e.target.name]: e.target.value
      }
    });
  };*/

  /*const handleSave = async () => {
    await updateProfile(profile);
    alert("Profile updated!");
    setIsEditing(false);
  };
  const handleSave = async () => {
  const updatedProfile = {
    ...profile,

    // ✅ flatten nested address for backend
    address: profile.addresses?.address,
    city: profile.addresses?.city,
    state: profile.addresses?.state,
    pincode: profile.addresses?.pincode
  };

  await updateProfile(updatedProfile);
  alert("Profile updated!");
  setIsEditing(false);
  };*/

  const handleSave = async () => {
  const updatedProfile = {
    ...profile,

    // ✅ extract from nested object
    address: profile.address,
    city: profile.city,
    state: profile.state,
    pincode: profile.pincode
  };

  console.log("Sending payload:", updatedProfile); // 🔍 debug

  await updateProfile(updatedProfile);

  alert("Profile updated!");
  setIsEditing(false);
};

  return (
    <div className="profile-container">
  <div className="profile-card">
    <h2 className="profile-title" style={{textAlign:"center"}}>My Profile</h2>

    <div className="profile-grid">

      {/* LEFT COLUMN */}
      <div className="profile-section">
        <h3>Personal Information</h3>

        <div className="field">
          <span>Name</span>
          <p>{profile.name}</p>
        </div>

        <div className="field">
          <span>Email</span>
          {isEditing ? (
            <input name="email" value={profile.email || ""} onChange={handleChange} />
          ) : <p>{profile.email}</p>}
        </div>

        <div className="field">
          <span>Phone</span>
          {isEditing ? (
            <input name="phone" value={profile.phone || ""} onChange={handleChange} />
          ) : <p>{profile.phone}</p>}
        </div>

        <div className="field"><span>Gender</span><p>{profile.gender}</p></div>
        <div className="field"><span>Admission No</span><p>{profile.admission_number}</p></div>
        <div className="field"><span>Department</span><p>{profile.department}</p></div>
        <div className="field"><span>Course</span><p>{profile.course}</p></div>
        <div className="field"><span>Semester</span><p>{profile.semester}</p></div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="profile-section">
        <h3>Guardian Details</h3>

        <div className="field"><span>Name</span><p>{profile.guardian_name}</p></div>

        <div className="field">
          <span>Phone</span>
          {isEditing ? (
            <input
              name="guardian_phone"
              value={profile.guardian_phone || ""}
              onChange={handleChange}
            />
          ) : <p>{profile.guardian_phone}</p>}
        </div>

        <div className="field"><span>Relation</span><p>{profile.guardian_relation}</p></div>

        <h3 style={{ marginTop: "20px" }}>Address</h3>

        <div className="field">
          <span>Address</span>
          {isEditing ? (
            <input
              name="address"
              value={profile.address || ""}
              onChange={handleChange}
            />
          ) : <p>{profile.address}</p>}
        </div>

        <div className="field">
          <span>City</span>
          {isEditing ? (
            <input
              name="city"
              value={profile.city || ""}
              onChange={handleChange}
            />
          ) : <p>{profile.city}</p>}
        </div>

        <div className="field">
          <span>State</span>
          {isEditing ? (
            <input
              name="state"
              value={profile.state || ""}
              onChange={handleChange}
            />
          ) : <p>{profile.state}</p>}
        </div>

        <div className="field">
          <span>Pincode</span>
          {isEditing ? (
            <input
              name="pincode"
              value={profile.pincode || ""}
              onChange={handleChange}
            />
          ) : <p>{profile.pincode}</p>}
        </div>

      </div>
    </div>

    {/* BUTTONS */}
    <div className="button-group">
      {!isEditing ? (
        <button onClick={() => setIsEditing(true)} className="edit-btn">
          Edit
        </button>
      ) : (
        <>
          <button onClick={handleSave} className="save-btn">Save</button>
          <button onClick={() => setIsEditing(false)} className="cancel-btn">
            Cancel
          </button>
        </>
      )}
    </div>

  </div>
</div>
  );
}

export default MyProfile;