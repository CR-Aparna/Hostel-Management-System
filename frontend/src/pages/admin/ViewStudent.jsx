import { useState } from "react";
import axios from "axios";
import { 
  User, Search, BookOpen, Phone, MapPin, 
  CreditCard, Shield, Users, Briefcase, ChevronRight, Filter 
} from "lucide-react";
import { BackButton,DashboardButton } from "../../components/common/NavButtons";

// Define your departments here
const DEPARTMENTS = [
  "Computer Applications",
  "Computer Science",
  "Mechanical",
  "Civil",
  "Electronics and Communication",
  "Electrical and Electronics",
  "Business Administration",
];

function ViewStudent() {
  const [studentAdmissionNumber, setStudentAdmissionNumber] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [student, setStudent] = useState(null);
  const [departmentStudents, setDepartmentStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");


 const validateAdmissionNumber = (value) => {
  if (!value || value.trim() === "") {
    return "Admission number is required";
  }

  const regex = /^[a-zA-Z0-9/-]+$/;

  if (!regex.test(value)) {
    return "Invalid format (only letters, numbers, /, - allowed)";
  }

  return "";
};

  const fetchStudent = async (admNo = studentAdmissionNumber) => {

  const error = validateAdmissionNumber(admNo);

  if (error) {
    setSearchError(error);
    return;
  }

  setSearchError(""); // clear error
  const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8000/student-management/search/${admNo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudent(res.data);
      setDepartmentStudents([]); 
      setStudentAdmissionNumber(admNo); // Sync input with clicked student
    } catch (err) {
      setSearchError("Student not found");
    } finally {
      setLoading(false);
    }
  };

  const fetchByDepartment = async (dept) => {
    if (!dept){
      setDepartmentStudents([]);
      return;
    } 
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8000/student-management/get-students-list-by-department/`,
        { headers: { Authorization: `Bearer ${token}` } ,
        params: { department: dept } }
      );
      setDepartmentStudents(res.data);
      setStudent(null);
    } catch (err) {
      alert("No students found in this department");
      setDepartmentStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeptChange = (e) => {
    const dept = e.target.value;
    setSelectedDepartment(dept);

    setStudent(null);
    if (dept){
      fetchByDepartment(dept);
    } else{
      setDepartmentStudents([]);
    }
     // Automatically fetch when a department is selected
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div className="flex items-center gap-3 mb-8">
                <BackButton />
                <DashboardButton />
              </div>
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Student Explorer</h2>
            <p className="text-slate-500">Manage records and view detailed student profiles.</p>
          </div>
          {loading && <span className="text-indigo-600 font-bold animate-pulse text-sm">Loading data...</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Search by Admission */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">Quick Lookup</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Admission Number..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm font-medium"
                  value={studentAdmissionNumber}
                  onChange={(e) => setStudentAdmissionNumber(e.target.value.trim())}
                />
                {searchError && (
                  <p className="text-red-500 text-xs mt-2">{searchError}</p>
                  )}
              </div>
              <button onClick={() => fetchStudent()} disabled={!studentAdmissionNumber.trim()} className="bg-slate-900 text-white px-6 rounded-xl font-bold hover:bg-slate-800 transition-all text-sm">
                Search
              </button>
            </div>
          </div>

          {/* Select by Department */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">Department Filter</label>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              <select
                className="w-full pl-12 pr-10 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm font-bold text-slate-700 appearance-none cursor-pointer"
                value={selectedDepartment}
                onChange={handleDeptChange}
              >
                <option value="">Select a Department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {selectedDepartment === "" && (
                  <p className="text-red-400 text-xs mt-2">
                        Please select a department to view students
                  </p>
                  )}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronRight size={18} className="rotate-90" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {departmentStudents.length > 0 && (
          <div className="mb-10">
            <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-4 ml-2">
              Students in {selectedDepartment} ({departmentStudents.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4">
              {departmentStudents.map((s) => (
                <button 
                  key={s.student_id}
                  onClick={() => fetchStudent(s.admission_number)}
                  className="bg-white p-5 rounded-3xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all text-left flex items-center justify-between group"
                >
                  <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{s.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{s.admission_number}</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Student Profile View (Same as previous, omitted for brevity but stays below) */}
        {student && (
          <div className="animate-in fade-in zoom-in-95 duration-500 space-y-6 pb-20">
            
            {/* Top Grid: Primary Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Profile Card */}
              <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600">
                    <User size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{student.name}</h3>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest">
                      {student.admission_number}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <DataPoint label="Email" value={student.email} icon={<Search size={14}/>}/>
                  <DataPoint label="Gender" value={student.gender} icon={<User size={14}/>}/>
                  <DataPoint label="Phone" value={student.phone} icon={<Phone size={14}/>}/>
                  <DataPoint label="Department" value={student.department} icon={<Users size={14}/>}/>
                  <DataPoint label="Course" value={student.course} icon={<BookOpen size={14}/>}/>
                  <DataPoint label="Semester" value={student.semester} icon={<Briefcase size={14}/>}/>
                </div>
              </div>

              {/* Preferences & Payment */}
              <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl shadow-indigo-900/10">
                  <h4 className="flex items-center gap-2 font-bold mb-4"><CreditCard size={18}/> Payment</h4>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Caution Deposit</p>
                  <p className="text-3xl font-black">₹{student.caution_deposit}</p>
                </div>
                
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                  <h4 className="flex items-center gap-2 font-bold mb-4 text-slate-800"><Shield size={18}/> Preferences</h4>
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-slate-600">Room: <span className="text-slate-900 font-bold">{student.preferred_room_type}</span></p>
                    <p className="text-sm font-medium text-slate-600">Food: <span className="text-slate-900 font-bold">{student.preferred_food_type}</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Grid: Family & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Guardian */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Users size={20} className="text-indigo-500"/> Primary Guardian Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <DataPoint label="Name" value={student.guardians? student.guardians[0].name : "N/A"} />
                  <DataPoint label="Relation" value={student.guardians? student.guardians[0].relation : "N/A"} />
                  <DataPoint label="Phone" value={student.guardians? student.guardians[0].phone : "N/A"} />
                  <DataPoint label="Address" value={student.guardians? student.guardians[0].address : "N/A"} />
                </div>
              </div>
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Users size={20} className="text-indigo-500"/> Local Guardian Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <DataPoint label="Name" value={student.guardians? student.guardians[1].name : "N/A"} />
                  <DataPoint label="Relation" value={student.guardians? student.guardians[1].relation : "N/A"} />
                  <DataPoint label="Phone" value={student.guardians? student.guardians[1].phone : "N/A"} />
                  <DataPoint label="Address" value={student.guardians? student.guardians[1].address : "N/A"} />
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><MapPin size={20} className="text-indigo-500"/> Residence</h3>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">{student.addresses?.address}</p>
                  <p className="text-sm text-slate-500">{student.addresses?.city}, {student.addresses?.state}</p>
                  <p className="text-xs font-mono text-indigo-600 mt-2">{student.addresses?.pincode}</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
      {student && departmentStudents.length === 0 && selectedDepartment && (
  <button 
    onClick={() => fetchByDepartment(selectedDepartment)}
    className="mb-4 text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline"
  >
    ← Back to {selectedDepartment} List
  </button>
)}
    </div>
  );
}

// ... (Keep DataPoint helper component) ...

// Sub-component for clean data display
function DataPoint({ label, value, icon }) {
  return (
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-700 truncate">{value || 'N/A'}</p>
    </div>
  );
}

export default ViewStudent;
