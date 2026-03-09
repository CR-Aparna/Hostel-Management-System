import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

function NotificationsPage(){
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            const res = await axiosInstance.get("/notifications/all");
            setNotifications(res.data);
        };
        fetchAll();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await axiosInstance.put(`/notifications/${id}/read`);
            // Update local state: change is_read to true instead of removing it
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
        } catch (err) { console.error(err); }
    };

    return (
        <div className="notifications-container">
            <h2>Your Notifications</h2>
            {notifications.map(n => (
                <div 
                    key={n.id} 
                    className={`notif-card ${n.is_read ? 'read' : 'unread'}`}
                    onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                >
                    <h4>{n.title}</h4>
                    <p>{n.message}</p>
                    <small>{new Date(n.created_at).toLocaleString()}</small>
                </div>
            ))}
        </div>
    );
};

export default NotificationsPage;