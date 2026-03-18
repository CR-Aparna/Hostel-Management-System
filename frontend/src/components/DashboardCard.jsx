import { ChevronRight } from "lucide-react";

function DashboardCard({ title, description, onClick, icon = "📁" }) {
  return (
    <div 
      onClick={onClick} 
      className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between min-h-[200px]"
    >
      <div>
        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          {icon}
        </div>
        <h4 className="text-xl font-bold text-slate-900 mb-2">{title}</h4>
        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
      </div>
      
      <div className="mt-6 flex items-center text-indigo-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
        Manage Now <ChevronRight size={16} className="ml-1" />
      </div>
    </div>
  );
}
export default DashboardCard;