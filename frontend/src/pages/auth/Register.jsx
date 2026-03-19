import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {InputField,SelectField} from "../../components/FormComponents";
import { Link } from "react-router-dom";


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
  guardian_name: "",
  guardian_phone: "",
  guardian_relation: "",

  address: "",
  city: "",
  state: "",
  pincode: "",

  preferred_room_type: "",
  preferred_food_type: "",
  caution_deposit:""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/student-management/register", form);
      alert("Registration successful. Wait for admin approval.");
    } catch (err) {
      alert("Registration failed");
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
            <InputField label="Full Name" name="name" placeholder="John Doe" onChange={handleChange} required />
            <InputField label="Email Address" name="email" type="email" placeholder="john@example.com" onChange={handleChange} required />
            <InputField label="Phone Number" name="phone" placeholder="+91 0000000000" onChange={handleChange} required />
            <InputField label="Admission Number" name="admission_number" placeholder="ADM/2024/001" onChange={handleChange} required />
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
            <InputField label="Gender" name="gender" placeholder="Male / Female / Other" onChange={handleChange} required />
            <InputField label="Current Semester" name="semester" type="number" placeholder="1" onChange={handleChange} required />
            <InputField label="Username" name="username" placeholder="johndoe123" onChange={handleChange} required />
            <InputField label="Password" name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
          </div>
        </section>

        {/* --- SECTION: Guardian Information --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
            <span className="w-8 h-[1px] bg-indigo-200"></span>
            Guardian Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField label="Name" name="guardian_name" placeholder="Guardian Name" onChange={handleChange} required />
            <InputField label="Phone" name="guardian_phone" placeholder="Phone Number" onChange={handleChange} required />
            <InputField label="Relation" name="guardian_relation" placeholder="Father / Mother" onChange={handleChange} required />
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
              <InputField label="Permanent Address" name="address" placeholder="House No, Street, Area" onChange={handleChange} required />
            </div>
            <InputField label="City" name="city" placeholder="City" onChange={handleChange} required />
            <InputField label="State" name="state" placeholder="State" onChange={handleChange} required />
            <InputField label="Pincode" name="pincode" placeholder="000000" onChange={handleChange} required />
          </div>
        </section>

        {/* --- SECTION: Hostel Preferences --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
            <span className="w-8 h-[1px] bg-indigo-200"></span>
            Preferences & Payment
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField 
              label="Room Type" 
              name="preferred_room_type" 
              value={form.preferred_room_type} 
              onChange={handleChange} 
              options={[
                "Ordinary and Attached", 
                "Ordinary and Non Attached", 
                "AC and attached", 
                "AC and Non attached"
              ]} 
            />
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
    </div>
  </div>
</div>
  );
}

export default Register;
