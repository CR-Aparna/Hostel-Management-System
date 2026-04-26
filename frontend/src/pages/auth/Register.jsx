import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {InputField,SelectField} from "../../components/FormComponents";
import { Link } from "react-router-dom";

const validate = (name, value) => {
  if (!value || value.toString().trim() === "") {
    return "This field is required";
  }

  const nameRegex = /^[a-zA-Z\s]*$/;
  const admissionRegex = /^[a-zA-Z0-9/-]*$/;

  switch (name) {
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? ""
        : "Invalid email address";

    case "phone":
    case "guardians_primary_phone":
    case "guardians_local_phone":
      return /^\d{10}$/.test(value)
        ? ""
        : "Must be a 10-digit number";

    case "pincode":
      return /^\d{6}$/.test(value)
        ? ""
        : "Must be 6 digits";

    case "password":
      return value.length >= 8
        ? ""
        : "Password must be at least 8 characters";

    case "name":
    case "guardians_primary_name":
    case "guardians_primary_relation":
    case "guardians_local_name":
    case "guardians_local_relation":
      if (value.length < 3) return "Name is too short";
      if (!nameRegex.test(value))
        return "Only alphabets allowed";
      return "";

    case "admission_number":
      if (!admissionRegex.test(value))
        return "Only alphanumeric, '/' and '-' allowed";
      return "";

    case "username":
      if (value.length < 4) 
        return "Username must be at least 4 characters";
      if (value.includes(" "))
        return "Username Should not contain Spaces";
      return "";

    case "semester":
      if (value < 1 || value > 8)
        return "Semester must be between 1 and 8";
      return "";

    default:
      return "";
  }
};
function Register() {
  const [form, setForm] = useState({
  name: "",
  email: "",
  phone: "",
  department: "",
  semester: "",
  username: "",
  password: "",
  admission_number: "",
  gender: "",
  course: "",
  // guardian_name: "",
  // guardian_phone: "",
  // guardian_relation: "",
  guardians: {
    primary: {
      name: "",
      phone: "",
      relation: "",
      address: ""
    },
    local: {
      name: "",
      phone: "",
      relation: "",
      address: ""
    }
  },

  sameAsPrimary: false,

  address: "",
  city: "",
  state: "",
  pincode: "",

  preferred_room_type: "",
  preferred_food_type: "",
  caution_deposit:""
  });

  const [errors, setErrors] = useState({});
  const rentMap = {
  "Ordinary and Attached": "₹900/month",
  "Ordinary and Non Attached": "₹1350/month",
  "AC and attached": "₹2400/month",
  "AC and Non attached": "₹2100/month",
  };
  const [showRules, setShowRules] = useState(false);
  const [acceptedRules, setAcceptedRules] = useState(false);

  const handleChange = (e) => {
  const { name, value } = e.target;

  // Trim only for text fields
  const trimmedValue = typeof value === "string" ? value.replace(/\s+/g, " ").trimStart() : value;

  // Update form
  setForm((prev) => ({
    ...prev,
    [name]: trimmedValue
  }));

  // Validate field
  const errorMsg = validate(name, trimmedValue);

  setErrors((prev) => ({
    ...prev,
    [name]: errorMsg
  }));
};

  const handleGuardianChange = (type, field, value) => {
    const name = `guardians_${type}_${field}`;
    setForm({
      ...form,
      guardians: {
        ...form.guardians,
        [type]: {
          ...form.guardians[type],
          [field]: value
        }
      }
    });

    const errorMsg = validate(name, value);

      setErrors((prev) => ({
        ...prev,
        [name]: errorMsg
    }));
  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!acceptedRules) {
    alert("You must accept the Rules & Regulations");
    return;
  }

  let currentErrors = {};

  Object.keys(form).forEach((key) => {
    const error = validate(key, form[key]);
    if (error) currentErrors[key] = error;
  });
  ["primary", "local"].forEach((type) => {
      Object.keys(form.guardians[type]).forEach((field) => {
        const key = `guardians_${type}_${field}`;
        const value = form.guardians[type][field];

        const error = validate(key, value);
        if (error) currentErrors[key] = error;
  });
  });

  setErrors(currentErrors);

  if (Object.keys(currentErrors).length > 0) {
    alert("Please fix the errors before submitting");
    return;
  }
  const payload = {
  ...form,
  guardians: [
    {
      ...form.guardians.primary,
      type: "Primary"
    },
    {
      ...form.guardians.local,
      type: "Local"
    }
  ]
};

  try {
    await axiosInstance.post("/student-management/register", payload);
    alert("Registration successful. Wait for admin approval.");
  } catch (err) {
    const serverMsg = err.response?.data?.detail || "Registration failed";
    alert(serverMsg);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-10 selection:bg-indigo-100">
  <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
    
    {/* Left Side: Branding & Progress Info */}
    <div className="md:w-1/4 bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white hidden md:flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-10">
          <span className="text-3xl bg-white/20 p-2 rounded-xl backdrop-blur-sm">🏫</span>
          <h1 className="text-xl font-bold tracking-tight">Hostel Hub</h1>
        </div>
        
        <h2 className="text-3xl font-extrabold leading-tight mb-6">Join Our Community.</h2>
        <p className="text-indigo-100 text-sm leading-relaxed">
          Fill out the form to secure your spot in the hostel. Please ensure all information is accurate.
        </p>
      </div>

      <div className="mt-auto relative z-10 pt-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm font-medium text-indigo-100">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">1</div>
            Personal Info
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-indigo-200/50">
            <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-xs">2</div>
            Preferences
          </div>
        </div>
      </div>
    </div>

    {/* Right Side: Form */}
    <div className="flex-1 p-8 md:p-12 max-h-[90vh] overflow-y-auto custom-scrollbar">
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="border-b border-slate-100 pb-6">
          <h2 className="text-3xl font-bold text-slate-900">Student Registration</h2>
          <p className="text-slate-500 mt-1">Create your profile to get started</p>
        </div>

        {/* --- SECTION: Basic Information --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
            <span className="w-8 h-[1px] bg-indigo-200"></span>
            Basic Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Full Name" name="name" value={form.name} placeholder="John Doe" onChange={handleChange} error={errors.name} required />
            <InputField label="Email Address" name="email" type="email" value={form.email} placeholder="john@example.com" onChange={handleChange}  error={errors.email} required />
            <InputField label="Phone Number" name="phone" value={form.phone} placeholder="+91 0000000000" onChange={handleChange} error={errors.phone} required />
            <InputField label="Admission Number" name="admission_number" value={form.admission_number} placeholder="ADM/2024/001" onChange={handleChange} error={errors.admission_number} required />
            {/*<InputField label="Department" name="department" placeholder="Computer Science" onChange={handleChange} required />*/}
            <SelectField 
              label="Department" 
              name="department" 
              value={form.department} 
              onChange={handleChange} 
              options={[
                "Computer Applications",
                "Computer Science",
                "Mechanical",
                "Civil",
                "Electronics and Communication",
                "Electrical and Electronics",
                "Business Administration"
              ]} 
            />
            {/*<InputField label="Course" name="course" placeholder="B.Tech" onChange={handleChange} required />*/}
            <SelectField 
              label="Course" 
              name="course" 
              value={form.course} 
              onChange={handleChange} 
              options={[
                "Civil Engineering",
                "Mechanical Engineering",
                "Computer Science and Engineering",
                "Electronics and Communication Engineering",
                "Electrical and Electronics Engineering",
                "Computer Science and Engineering (AI/ML)",
                "Computer Science and Engineering (Data Science)",
                "BCA",
                "MCA",
                "MBA",
                "MTech Civil Engineering",
                "MTech Mechanical Engineering",
                "PhD"
              ]} 
            />
            <SelectField 
              label="Gender" 
              name="gender" 
              value={form.gender} 
              onChange={handleChange} 
              options={[
                "Female",
                "Male",
                "Other",
              ]} 
            />
            <InputField label="Current Semester" name="semester" type="number" value={form.semester} placeholder="1" min="1" onChange={handleChange} error={errors.semester} required />
            <InputField label="Username" name="username" placeholder="johndoe123" value={form.username} onChange={handleChange} error={errors.username} required/>
            <InputField label="Password" name="password" type="password" value={form.password} placeholder="••••••••" onChange={handleChange} error={errors.password} required />
          </div>
        </section>

        {/* --- SECTION: Guardian Information --- */}
        {/* <section className="space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
            <span className="w-8 h-[1px] bg-indigo-200"></span>
            Guardian Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField label="Name" name="guardian_name" value={form.guardian_name} placeholder="Guardian Name" onChange={handleChange} error={errors.guardian_name} required />
            <InputField label="Phone" name="guardian_phone" value={form.guardian_phone} placeholder="Phone Number" onChange={handleChange} error={errors.guardian_phone} required />
            <InputField label="Relation" name="guardian_relation" value={form.guardian_relation} placeholder="Father / Mother" onChange={handleChange} error={errors.guardian_relation} required />
          </div>
        </section> */}
        {/* --- SECTION: Guardian Information --- */}
        <section className="space-y-8">

          <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
            <span className="w-8 h-[1px] bg-indigo-200"></span>
            Guardian Information
          </div>

          {/* 🔹 PRIMARY GUARDIAN */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Primary Guardian</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="Name"
                name="guardians_primary_name"
                value={form.guardians.primary.name}
                placeholder="Guardian Name"
                onChange={(e) =>
                  handleGuardianChange("primary", "name", e.target.value)
                }
                error={errors.guardians_primary_name}
                required
              />

              <InputField
                label="Phone"
                name="guardians_primary_phone"
                value={form.guardians.primary.phone}
                placeholder="Phone Number"
                onChange={(e) =>
                  handleGuardianChange("primary", "phone", e.target.value)
                }
                error={errors.guardians_primary_phone}
                required
              />

              <InputField
                label="Relation"
                name="guardians_primary_relation"
                value={form.guardians.primary.relation}
                placeholder="Father / Mother"
                onChange={(e) =>
                  handleGuardianChange("primary", "relation", e.target.value)
                }
                error={errors.guardians_primary_relation}
                required
              />

              <InputField
                label="Address"
                name="guardians_primary_address"
                value={form.guardians.primary.address}
                placeholder=""
                onChange={(e) =>
                  handleGuardianChange("primary", "address", e.target.value)
                }
                error={errors.guardians_primary_address}
                required
              />
            </div>
          </div>
              
          {/* 🔥 SAME AS PRIMARY CHECKBOX */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.sameAsPrimary}
              onChange={(e) => {
                const checked = e.target.checked;
              
                setForm((prev) => ({
                  ...prev,
                  sameAsPrimary: checked,
                  guardians: {
                    ...prev.guardians,
                    local: checked
                      ? { ...prev.guardians.primary }
                      : { name: "", phone: "", relation: "", address: "" }
                  }
                }));
              }}
            />
            <label className="text-sm text-gray-600">
              Local Guardian same as Primary
            </label>
          </div>
            
          {/* 🔹 LOCAL GUARDIAN */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Local Guardian</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="Name"
                name="guardians_local_name"
                value={form.guardians.local.name}
                placeholder="Local Guardian Name"
                disabled={form.sameAsPrimary}
                onChange={(e) =>
                  handleGuardianChange("local", "name", e.target.value)
                }
                error={errors.guardians_local_name}
                required
              />

              <InputField
                label="Phone"
                name="guardians_local_phone"
                value={form.guardians.local.phone}
                placeholder="Phone Number"
                disabled={form.sameAsPrimary}
                onChange={(e) =>
                  handleGuardianChange("local", "phone", e.target.value)
                }
                error={errors.guardians_local_phone}
                required
              />

              <InputField
                label="Relation"
                name="guardians_local_relation"
                value={form.guardians.local.relation}
                placeholder="Uncle / Relative"
                disabled={form.sameAsPrimary}
                onChange={(e) =>
                  handleGuardianChange("local", "relation", e.target.value)
                }
                error={errors.guardians_local_relation}
                required
              />

              <InputField
                label="Address"
                name="guardians_local_address"
                value={form.guardians.local.address}
                placeholder=""
                disabled={form.sameAsPrimary}
                onChange={(e) =>
                  handleGuardianChange("local", "address", e.target.value)
                }
                error={errors.guardians_local_address}
                required
              />
            </div>
          </div>
              
        </section>

        {/* --- SECTION: Address --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
            <span className="w-8 h-[1px] bg-indigo-200"></span>
            Address Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <InputField label="Permanent Address" name="address" value={form.address} placeholder="House No, Street, Area" onChange={handleChange} error={errors.address} required />
            </div>
            <InputField label="City" name="city" value={form.city} placeholder="City" onChange={handleChange} error={errors.city} required />
            <InputField label="State" name="state" value={form.state} placeholder="State" onChange={handleChange} error={errors.state} required />
            <InputField label="Pincode" name="pincode" value={form.pincode} placeholder="000000" onChange={handleChange} error={errors.pincode} required />
          </div>
        </section>

        {/* --- SECTION: Hostel Preferences --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
            <span className="w-8 h-[1px] bg-indigo-200"></span>
            Preferences & Payment
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
            <SelectField 
              label="Room Type" 
              name="preferred_room_type" 
              value={form.preferred_room_type} 
              onChange={handleChange} 
              options={[
                "Ordinary and Attached",
                "Ordinary and Non Attached", 
                "AC and attached",  
                "AC and Non attached",
              ]} 
            />
            {form.preferred_room_type && (
              <p style={{ marginTop: "5px", color: "indigo",fontSize:"12px" }}>
                 Approx Rent: {rentMap[form.preferred_room_type]} can vary with the capacity
              </p>
            )}
            </div>
            <SelectField 
              label="Food Type" 
              name="preferred_food_type" 
              value={form.preferred_food_type} 
              onChange={handleChange} 
              options={["non-vegetarian", "vegetarian"]} 
            />
            <SelectField 
              label="Caution Deposit" 
              name="caution_deposit" 
              value={form.caution_deposit} 
              onChange={handleChange} 
              options={["paid", "unpaid"]} 
            />
          </div>
        </section>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={acceptedRules}
            onChange={(e) => setAcceptedRules(e.target.checked)}
            className="mt-1"
          />

          <p className="text-sm text-gray-600">
            I agree to the{" "}
            <span
              className="text-indigo-600 font-semibold cursor-pointer hover:underline"
              onClick={() => setShowRules(true)}
            >
              Rules & Regulations
            </span>
          </p>
        </div>

        {/* --- Submit Button --- */}
        <div className="pt-6">
          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] mb-4"
          >
            Create Student Account
          </button>
          <p className="text-center text-slate-500 text-sm">
            Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Login here</Link>
          </p>
        </div>
      </form>
      {showRules && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl">

            <h2 className="text-xl font-bold mb-4 text-slate-900">
              Hostel Rules & Regulations
            </h2>

            <div className="text-sm text-slate-600 space-y-2 max-h-64 overflow-y-auto">
              <p>• Students must maintain discipline at all times.</p>
              <p>• Visitors are allowed only during permitted hours.</p>
              <p>• Any damage to hostel property will be fined.</p>
              <p>• Noise after 10 PM is strictly prohibited.</p>
              <p>• Mess rules must be followed strictly.</p>
              <p>• Any misconduct may lead to cancellation of hostel stay.</p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowRules(false)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  </div>
</div>

);
}

export default Register;
