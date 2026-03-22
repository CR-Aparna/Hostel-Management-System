import { ChevronRight } from "lucide-react";

function DashboardCard({ title, description, onClick, icon = "📁", badgeCount = 0 }) {
  return (
    <div 
      onClick={onClick} 
      className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between min-h-[200px]"
    >
      <div>
        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          {icon}
        
        {badgeCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black px-2 py-1 min-w-[24px] rounded-full border-4 border-white shadow-lg shadow-rose-200 animate-in zoom-in duration-300">
            {badgeCount > 9 ? "9+" : badgeCount}
          </div>
          )}
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