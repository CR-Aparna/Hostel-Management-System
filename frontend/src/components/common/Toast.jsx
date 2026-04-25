import { X, CheckCircle, AlertTriangle } from "lucide-react";

const Toast = ({ message, type = "error", onClose }) => {
  const styles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
  };

  const icons = {
    success: <CheckCircle size={18} />,
    error: <AlertTriangle size={18} />,
    warning: <AlertTriangle size={18} />,
  };

  return (
    <div className={`fixed top-6 right-6 z-50 border px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 ${styles[type]}`}>
      {icons[type]}
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;