import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useState, useEffect } from "react";

function Navbar({ title }) {
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const res = await axiosInstance.get("/notifications/unread");
                setUnreadCount(res.data.length);
            } catch (err) {
                console.error("Error fetching notifications", err);
            }
        };
        fetchUnreadCount();
        // Check for new notifications every 2 minutes
        const interval = setInterval(fetchUnreadCount, 120000);
        return () => clearInterval(interval);
    }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <h3>{title}</h3>
      <button onClick={logout}>Logout</button>
      <nav>
            {/* Other nav items */}
            <div className="notification-bell" onClick={() => navigate("/student/notifications")}>
                <span>🔔</span>
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </div>
        </nav>
    </div>  
  );
}

export default Navbar;
