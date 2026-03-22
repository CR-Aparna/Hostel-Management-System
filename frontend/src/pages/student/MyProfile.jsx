import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../api/student";
import { User, Mail, Phone, MapPin, Home, Users } from "lucide-react";
import Navbar from "../../components/Navbar";
import { BackButton, DashboardButton } from "../../components/common/NavButtons";
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
  <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
    
    <div className="bg-white w-full max-w-5xl rounded-3xl shadow-xl p-8">
      <Navbar title="My Profile"/>
      <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <DashboardButton />
      <div/>
      </div>
      {/* Title */}
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
        My Profile
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* LEFT COLUMN */}
        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <User size={18}/> Personal Information
          </h3>

          {/* Name */}
          <Field icon={<User size={16}/>} label="Name">
            <p>{profile.name}</p>
          </Field>

          {/* Email */}
          <Field icon={<Mail size={16}/>} label="Email">
            {isEditing ? (
              <input name="email" value={profile.email || ""} onChange={handleChange} className="input" />
            ) : <p>{profile.email}</p>}
          </Field>

          {/* Phone */}
          <Field icon={<Phone size={16}/>} label="Phone">
            {isEditing ? (
              <input name="phone" value={profile.phone || ""} onChange={handleChange} className="input" />
            ) : <p>{profile.phone}</p>}
          </Field>

          <Field label="Gender"><p>{profile.gender}</p></Field>
          <Field label="Admission No"><p>{profile.admission_number}</p></Field>
          <Field label="Department"><p>{profile.department}</p></Field>
          <Field label="Course"><p>{profile.course}</p></Field>
          <Field label="Semester"><p>{profile.semester}</p></Field>
        </div>

        {/* RIGHT COLUMN */}
        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Users size={18}/> Guardian Details
          </h3>

          <Field label="Name"><p>{profile.guardian_name}</p></Field>

          <Field icon={<Phone size={16}/>} label="Phone">
            {isEditing ? (
              <input
                name="guardian_phone"
                value={profile.guardian_phone || ""}
                onChange={handleChange}
                className="input"
              />
            ) : <p>{profile.guardian_phone}</p>}
          </Field>

          <Field label="Relation"><p>{profile.guardian_relation}</p></Field>

          <h3 className="text-lg font-semibold text-slate-700 mt-6 mb-4 flex items-center gap-2">
            <Home size={18}/> Address
          </h3>

          <Field icon={<MapPin size={16}/>} label="Address">
            {isEditing ? (
              <input name="address" value={profile.address || ""} onChange={handleChange} className="input" />
            ) : <p>{profile.address}</p>}
          </Field>

          <Field label="City">
            {isEditing ? (
              <input name="city" value={profile.city || ""} onChange={handleChange} className="input" />
            ) : <p>{profile.city}</p>}
          </Field>

          <Field label="State">
            {isEditing ? (
              <input name="state" value={profile.state || ""} onChange={handleChange} className="input" />
            ) : <p>{profile.state}</p>}
          </Field>

          <Field label="Pincode">
            {isEditing ? (
              <input name="pincode" value={profile.pincode || ""} onChange={handleChange} className="input" />
            ) : <p>{profile.pincode}</p>}
          </Field>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition"
            >
              Cancel
            </button>
          </>
        )}
      </div>

    </div>
  </div>
);

}

const Field = ({ icon, label, children }) => (
  <div className="mb-3">
    <span className="text-xs text-slate-500 flex items-center gap-2 mb-1">
      {icon} {label}
    </span>
    <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm">
      {children}
    </div>
  </div>
);

export default MyProfile;