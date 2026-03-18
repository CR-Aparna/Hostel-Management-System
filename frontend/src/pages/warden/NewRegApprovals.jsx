import { useEffect, useState, useRef ,React} from "react";
import axiosInstance from "../../utils/axiosInstance";
import { BackButton, DashboardButton } from "../../components/common/NavButtons";
import { UserCheck, Eye, X, GraduationCap, Mail, Phone, ShieldCheck, CreditCard, Utensils, Info } from 'lucide-react';

function PendingNewRegApprovals() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStudent, setCurrentStudent] = useState({});
  const dialogRef = useRef(null);
  

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      const res = await axiosInstance.get("/student-management/warden/pending");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  const getStudentDetails = async (studentId) => {
    try {
      const res = await axiosInstance.get(`/student-management/get_student_by_id/${studentId}`);
      setCurrentStudent(res.data);
    } catch (err) {
      console.error("Failed to fetch student details", err);
    }
  };

  const openModal = (studentId) => {
    getStudentDetails(studentId);
    dialogRef.current.showModal();
  };

  const approveStudent = async (studentId) => {
    try {
      await axiosInstance.put(`/student-management/warden/${studentId}/approve`);
      // remove approved student from list
      setStudents(students.filter(s => s.student_id !== studentId));
    } catch (err) {
      console.error("Approval failed", err);
       if (err.response && err.response.status === 400) {
        alert(err.response.data.detail);
    } else {
      alert("Approval failed");
    }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Row */}
        <div className="flex items-center gap-3 mb-8">
          <BackButton />
          <DashboardButton />
        </div>

        {/* Header */}
        <header className="mb-10">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <UserCheck className="text-indigo-600" size={32} />
            Pending Student Approvals
          </h2>
          <p className="text-slate-500 font-medium italic ml-1">Review and verify new student registrations for hostel access.</p>
        </header>

        {students.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <UserCheck size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Queue Clear!</h3>
            <p className="text-slate-400 mt-2 font-medium">No students are currently awaiting approval.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Name</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Admission No</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact & Dept</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.map((s) => (
                    <tr key={s.student_id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <span className="font-bold text-slate-800 text-lg">{s.name}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-mono font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                          {s.student_admission_number}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-700">{s.department}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                            Sem {s.semester} • {s.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            type="button"
                            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-all active:scale-95"
                            onClick={() => openModal(s.student_id)}
                          >
                            <Eye size={14} /> View
                          </button>
                          <button 
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-100 transition-all active:scale-95"
                            onClick={() => approveStudent(s.student_id)}
                          >
                            Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modernized Dialog Modal */}
        <dialog 
          ref={dialogRef} 
          className="rounded-[2.5rem] shadow-2xl p-0 w-full max-w-2xl backdrop:backdrop-blur-sm backdrop:bg-slate-900/40 border-none overflow-hidden"
        >
          <div className="flex flex-col h-full bg-white">
            {/* Modal Header */}
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <GraduationCap className="text-indigo-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">Verification Profile</h2>
                  <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Registration Data</p>
                </div>
              </div>
              <button 
                onClick={() => dialogRef.current.close()}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {currentStudent && (
              <div className="p-8 overflow-y-auto max-h-[70vh]">
                {/* Core Info Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8 border-b border-slate-100 pb-8">
                  <div className="space-y-4">
                    <DetailItem label="Full Name" value={currentStudent.name} />
                    <DetailItem label="Admission No" value={currentStudent.admission_number} />
                    <DetailItem label="Email" value={currentStudent.email} icon={<Mail size={14}/>} />
                    <DetailItem label="Phone" value={currentStudent.phone} icon={<Phone size={14}/>} />
                  </div>
                  <div className="space-y-4">
                    <DetailItem label="Student ID" value={currentStudent.student_id} />
                    <DetailItem label="Course" value={currentStudent.course} />
                    <DetailItem label="Dept / Sem" value={`${currentStudent.department} / Sem ${currentStudent.semester}`} />
                  </div>
                </div>

                {/* Sub-sections */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck size={14} /> Guardian Details
                    </h5>
                    <div className="bg-slate-50 p-5 rounded-3xl space-y-2 border border-slate-100">
                      <p className="text-sm font-black text-slate-800">{currentStudent.guardian_name}</p>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">{currentStudent.guardian_relation}</p>
                      <p className="text-xs font-mono text-slate-600 flex items-center gap-1.5 pt-1">
                        <Phone size={10} /> {currentStudent.guardian_phone}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                      <Info size={14} /> Preferences
                    </h5>
                    <div className="space-y-3">
                      <PreferenceBadge icon={<Utensils size={12}/>} label="Food" value={currentStudent.preferred_food_type} />
                      <PreferenceBadge icon={<CreditCard size={12}/>} label="Deposit" value={`₹${currentStudent.caution_deposit}`} />
                      <div className="flex justify-between items-center px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-md">
                        <span className="text-[10px] font-black uppercase">Room Pref</span>
                        <span className="text-xs font-bold">{currentStudent.preferred_room_type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => dialogRef.current.close()}
                className="bg-slate-900 text-white font-black px-10 py-3 rounded-2xl shadow-lg active:scale-95 transition-all"
              >
                Close Record
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
}

// Helper components for Modal consistency
const DetailItem = ({ label, value, icon }) => (
  <div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
      {icon && <span className="text-indigo-400">{icon}</span>}
      {value}
    </p>
  </div>
);

const PreferenceBadge = ({ icon, label, value }) => (
  <div className="flex items-center justify-between bg-white border border-slate-100 px-4 py-2 rounded-xl">
    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 italic">
      {icon} {label}
    </span>
    <span className="text-xs font-black text-slate-700">{value}</span>
  </div>
);

export default PendingNewRegApprovals;