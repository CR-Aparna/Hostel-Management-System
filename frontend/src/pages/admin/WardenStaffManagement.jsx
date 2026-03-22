import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { 
  UserPlus, Wrench, ShieldCheck, Mail, Phone, 
  Lock, User, CheckCircle2, AlertCircle, Search, Calendar, Activity, XCircle
} from "lucide-react";
import { BackButton , DashboardButton} from "../../components/common/NavButtons";


const WardenStaffManagement = () => {
  const [activeTab, setActiveTab] = useState("warden");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [searchError, setSearchError] = useState("");

  // States for Form Data
  const [wardenData, setWardenData] = useState({
    name: "", username: "", email: "", password: "", phone: "", gender: "Male"
  });

  const [staffData, setStaffData] = useState({
    name: "", category: "Plumbing", phone: "", email: "", username: "", password: ""
  });

  const validateForm = () => {
  let errors = {};

  const data = activeTab === "warden" ? wardenData : staffData;

  if (!data.name.trim()) {
    errors.name = "Name is required";
  }else if (!/^[A-Za-z\s]+$/.test(data.name)) {
  errors.name = "Only alphabets allowed";
  }
  if (!data.username.trim()) errors.username = "Username is required";

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.password.trim()) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Minimum 6 characters required";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^\d{10}$/.test(data.phone)) {
    errors.phone = "Phone must be 10 digits";
  }

  if (activeTab === "staff" && !data.category) {
    errors.category = "Category is required";
  }

  if (activeTab === "warden" && !data.gender) {
    errors.gender = "Gender is required";
  }

  return errors;
};

  //const handleWardenChange = (e) => setWardenData({ ...wardenData, [e.target.name]: e.target.value });
  //const handleStaffChange = (e) => setStaffData({ ...staffData, [e.target.name]: e.target.value });

  /*const handleWardenChange = (e) => {
    setWardenData({ ...wardenData, [e.target.name]: e.target.value });
    //setFormErrors({ ...formErrors, [e.target.name]: "" });
    setFormErrors(prev => ({
      ...prev,
      [e.target.name]: ""
      }));
  };*/
  const handleWardenChange = (e) => {
  const { name, value } = e.target;

  setWardenData({ ...wardenData, [name]: value });

  let error = "";

  if (name === "name") {
    if (!value.trim()) error = "Name is required";
    else if (!/^[A-Za-z\s]+$/.test(value)) error = "Only letters allowed";
  }

  if (name === "email") {
    if (!value.trim()) error = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email format";
  }

  if (name === "password") {
    if (!value.trim()) error = "Password is required";
    else if (value.length < 6) error = "Minimum 6 characters required";
  }

  if (name === "phone") {
    if (!/^\d{10}$/.test(value)) error = "Phone must be 10 digits";
  }

  setFormErrors({ ...formErrors, [name]: error });
};

  /*const handleStaffChange = (e) => {
    setStaffData({ ...staffData, [e.target.name]: e.target.value });
    //setFormErrors({ ...formErrors, [e.target.name]: "" });
    setFormErrors(prev => ({
      ...prev,
      [e.target.name]: ""
      }));
  };*/

  const handleStaffChange = (e) => {
  const { name, value } = e.target;

  setStaffData({ ...staffData, [name]: value });

  let error = "";

  if (name === "name") {
    if (!value.trim()) error = "Name is required";
    else if (!/^[A-Za-z\s]+$/.test(value)) error = "Only letters allowed";
  }

  if (name === "email") {
    if (!value.trim()) error = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email format";
  }

  if (name === "password") {
    if (!value.trim()) error = "Password is required";
    else if (value.length < 6) error = "Minimum 6 characters required";
  }

  if (name === "phone") {
    if (!/^\d{10}$/.test(value)) error = "Phone must be 10 digits";
  }

  setFormErrors({ ...formErrors, [name]: error });
};

  const switchTab = (tab) => {
    setActiveTab(tab);
    setMessage({ type: "", text: "" });
    setSearchId("");
    setSearchResult(null);
  };

  const validateSearch = (value) => {
  if (!value.trim()) return `${activeTab} ID is required`;

  if (!/^\d+$/.test(value)) return "ID must be numeric";

  return "";
};

  // --- Search Functionality ---
  const handleSearch = async () => {
    const error = validateSearch(searchId);

    if (error) {
      setSearchError(error);
      return;
    }

    setSearchError("");

    
    setLoading(true);
    setMessage({ type: "", text: "" });
    setSearchResult(null);

    try {
      const endpoint = activeTab === "warden" 
        ? `/user-management/warden/${searchId}` 
        : `/user-management/staff/${searchId}`;
      
      const res = await axiosInstance.get(endpoint);
      setSearchResult(res.data);
      setMessage({ type: "success", text: "Record found!" });
    } catch (err) {
      setMessage({ type: "error", text: `No ${activeTab} found with this ID` });
    } finally {
      setLoading(false);
    }
  };

  // --- Submit Functionality ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    console.log(errors); 

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (activeTab === "warden") {
        await axiosInstance.post("/user-management/create-warden", wardenData);
        setWardenData({ name: "", username: "", email: "", password: "", phone: "", gender: "Male" });
      } else {
        await axiosInstance.post("/user-management/add-staff", staffData);
        setStaffData({ name: "", category: "Plumbing", phone: "", email: "", username: "", password: "" });
      }
      setMessage({ type: "success", text: `${activeTab} registered successfully!` });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.detail || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="flex items-center gap-3 mb-8">
                  <BackButton />
                  <DashboardButton />
        </div>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Personnel Management</h1>
          <p className="text-slate-500 mt-2">Manage warden accounts and maintenance staff profiles.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          
          {/* Tab Selection */}
          <div className="flex p-2 bg-slate-100/50 m-6 rounded-2xl">
            <button className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === "warden" ? "bg-white text-indigo-600 shadow-md" : "text-slate-500 hover:text-slate-700"}`} onClick={() => switchTab("warden")}>
              <ShieldCheck size={18} /> Manage Warden
            </button>
            <button className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === "staff" ? "bg-white text-indigo-600 shadow-md" : "text-slate-500 hover:text-slate-700"}`} onClick={() => switchTab("staff")}>
              <Wrench size={18} /> Manage Staff
            </button>
          </div>

          <div className="px-8 pb-10">
            {/* Search Section */}
            <div className="mb-10 bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block ml-1">Lookup Personnel</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder={`Enter ${activeTab} ID...`} 
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    value={searchId}
                    onChange={(e) => {setSearchId(e.target.value);
                      setSearchError("");
                    }}
                  />
                </div>
                <button onClick={handleSearch} disabled={loading || !searchId} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50 transition-all">Search</button>
              </div>
              {searchError && (
                  <p className="text-red-500 text-xs mt-2 font-semibold">
                    {searchError}
                  </p>
              )}
            </div>

            {/* Displaying Search Result OR Form */}
            {searchResult ? (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Personnel Profile</h2>
                  <button onClick={() => setSearchResult(null)} className="flex items-center gap-1 text-rose-500 text-sm font-bold hover:bg-rose-50 px-3 py-1 rounded-lg transition-colors">
                    <XCircle size={16} /> Close Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ProfileItem icon={<User />} label="Name" value={activeTab === 'warden' ? searchResult.warden_name : searchResult.staff_name} />
                  <ProfileItem icon={<UserPlus />} label="Username" value={activeTab === 'warden' ? searchResult.warden_username : searchResult.staff_username} />
                  <ProfileItem icon={<Mail />} label="Email" value={activeTab === 'warden' ? searchResult.warden_email : searchResult.staff_email} />
                  <ProfileItem icon={<Phone />} label="Phone" value={activeTab === 'warden' ? searchResult.warden_phone : searchResult.staff_phone} />
                  <ProfileItem icon={<Calendar />} label="Joining Date" value={searchResult.warden_date_of_joining || "N/A"} />
                  <ProfileItem icon={<Activity />} label="Status" value={searchResult.status || "Active"} isStatus />
                  {activeTab === 'staff' && <ProfileItem icon={<Wrench />} label="Category" value={searchResult.staff_category} />}
                  {activeTab === 'warden' && <ProfileItem icon={<ShieldCheck />} label="Gender" value={searchResult.warden_gender} />}
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-slate-800 mb-6 px-2">Register New {activeTab}</h2>
                {message.text && (
                  <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
                    {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="text-sm font-semibold">{message.text}</span>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeTab === "warden" ? (
                      <>
                        <InputGroup icon={<User size={18}/>} label="Full Name">
                          <input type="text" name="name" placeholder="John Doe" value={wardenData.name} onChange={handleWardenChange} className="form-input-custom" />
                          {formErrors.name && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                          )}
                        </InputGroup>
                        <InputGroup icon={<UserPlus size={18}/>} label="Username">
                          <input type="text" name="username" placeholder="warden_01" value={wardenData.username} onChange={handleWardenChange} required className="form-input-custom" />
                          {formErrors.username && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>
                          )}                        
                        </InputGroup>
                        <InputGroup icon={<Mail size={18}/>} label="Email Address">
                          <input type="email" name="email" placeholder="warden@hostel.com" value={wardenData.email} onChange={handleWardenChange} required className="form-input-custom" />
                          {formErrors.email && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                          )}  
                        </InputGroup>
                        <InputGroup icon={<Lock size={18}/>} label="Password">
                          <input type="password" name="password" placeholder="••••••••" value={wardenData.password} onChange={handleWardenChange} required className="form-input-custom" />
                          {formErrors.password && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                          )}                        
                        </InputGroup>
                        <InputGroup icon={<Phone size={18}/>} label="Phone Number">
                          <input type="tel" name="phone" placeholder="+91 0000000000" value={wardenData.phone} onChange={handleWardenChange} required className="form-input-custom" />
                          {formErrors.phone && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                          )}                        
                        </InputGroup>
                        <InputGroup icon={<ShieldCheck size={18}/>} label="Gender">
                          <select name="gender" value={wardenData.gender} onChange={handleWardenChange} className="form-input-custom">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          {formErrors.gender && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>
                          )}                          
                        </InputGroup>
                      </>
                    ) : (
                      <>
                        <InputGroup icon={<User size={18}/>} label="Staff Name">
                          <input type="text" name="name" placeholder="Robert Smith" value={staffData.name} onChange={handleStaffChange} required className="form-input-custom" />
                          {formErrors.name && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                          )}
                        </InputGroup>
                        <InputGroup icon={<Wrench size={18}/>} label="Category">
                          <select name="category" value={staffData.category} onChange={handleStaffChange} className="form-input-custom">
                            <option value="Plumbing">Plumbing</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Maintenance Technician">Maintenance Technician</option>
                          </select>
                          {formErrors.category && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>
                          )}
                        </InputGroup>
                        <InputGroup icon={<Phone size={18}/>} label="Phone Number">
                          <input type="tel" name="phone" placeholder="+91 0000000000" value={staffData.phone} onChange={handleStaffChange} required className="form-input-custom" />
                          {formErrors.phone && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                          )}
                        </InputGroup>
                        <InputGroup icon={<Mail size={18}/>} label="Email Address">
                          <input type="email" name="email" placeholder="staff@hostel.com" value={staffData.email} onChange={handleStaffChange} required className="form-input-custom" />
                          {formErrors.email && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                          )}
                        </InputGroup>
                        <InputGroup icon={<UserPlus size={18}/>} label="Username">
                          <input type="text" name="username" placeholder="staff_rob" value={staffData.username} onChange={handleStaffChange} required className="form-input-custom" />
                          {formErrors.username && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>
                          )}
                        </InputGroup>
                        <InputGroup icon={<Lock size={18}/>} label="Password">
                          <input type="password" name="password" placeholder="••••••••" value={staffData.password} onChange={handleStaffChange} required className="form-input-custom" />
                          {formErrors.password && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                          )}
                        </InputGroup>
                      </>
                    )}
                  </div>
                  <button type="submit" disabled={loading} className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 shadow-lg ${loading ? "bg-slate-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"}`}>
                    {loading ? "Processing..." : `Register ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .form-input-custom { width: 100%; padding: 0.75rem 1rem; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; outline: none; transition: all 0.2s; font-size: 0.875rem; }
        .form-input-custom:focus { background-color: #fff; border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
      `}</style>
    </div>
  );
};

// Helper Components
const InputGroup = ({ icon, label, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{icon} {label}</label>
    {children}
  </div>
);

const ProfileItem = ({ icon, label, value, isStatus }) => (
  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
    <div className="bg-white p-2.5 rounded-xl shadow-sm text-indigo-500">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className={`text-sm font-bold ${isStatus ? 'text-emerald-600' : 'text-slate-700'}`}>{value}</p>
    </div>
  </div>
);

export default WardenStaffManagement;