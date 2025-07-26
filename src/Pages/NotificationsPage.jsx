// src/Pages/NotificationsPage.jsx (Refactored Code)
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchNotifications } from '../features/notificationSlice'; // Make sure this path is correct

// Helper function to format date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// --- YEH AAPKA MAIN REFACTORED COMPONENT HAI ---
const NotificationsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Redux store se notifications ka data lein
    const { items: notifications, loading, unreadCount } = useSelector((state) => state.notifications);

    useEffect(() => {
        // Notifications ko 'read' mark karne ka function
        const markAsRead = async () => {
            // Sirf tab call karein jab unread notifications hon
            if (unreadCount > 0) {
                try {
                    const token = localStorage.getItem('token');
                    // Ensure you have REACT_APP_API_URL in your .env file
                    const API_URL = process.env.REACT_APP_API_URL || 'https://server-fundify.up.railway.app';
                    await axios.post(`${API_URL}/api/notifications/read`, {}, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    // Unread count ko 0 karne ke liye notifications dobara fetch karein
                    dispatch(fetchNotifications());
                } catch (error) {
                    console.error("Failed to mark notifications as read", error);
                }
            }
        };

        // Component load hotay hi notifications fetch karein
        dispatch(fetchNotifications());
        // Aur unko read mark karein
        markAsRead();

    }, [dispatch, unreadCount]); // Dependency array se navigate aur isAuthenticated hata diya hai

    return (
        // Is component mein ab Header/Footer nahi hain
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Notifications</h1>
            
            {loading && notifications.length === 0 ? (
                <p className="text-center py-10">Loading notifications...</p>
            ) : notifications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">You have no notifications.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notif) => (
                        <div 
                            key={notif._id}
                            className={`p-4 rounded-lg shadow-sm transition-colors duration-300 ${notif.isRead ? 'bg-white' : 'bg-green-50 border-l-4 border-green-500'}`}
                            onClick={() => notif.link && navigate(notif.link)}
                            style={{ cursor: notif.link ? 'pointer' : 'default' }}
                        >
                            <p className="text-gray-800">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatDate(notif.createdAt)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
