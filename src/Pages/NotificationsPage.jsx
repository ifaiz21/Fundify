import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../features/notificationSlice';
import HeaderLayout from './Layout/HeaderLayout';
import FooterLayout from './Layout/FooterLayout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Helper function to format date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const NotificationsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: notifications, loading, unreadCount } = useSelector((state) => state.notifications);
    const { isAuthenticated } = useSelector((state) => state.user);

    useEffect(() => {
        if (!isAuthenticated) {
            //navigate('/login');
            return;
        }

        // Mark notifications as read when the page is viewed
        const markAsRead = async () => {
            if (unreadCount > 0) {
                try {
                    const token = localStorage.getItem('token');
                    const config = { headers: { 'Authorization': `Bearer ${token}` } };
                    const API_URL = process.env.REACT_APP_API_URL;
                    await axios.post(`${API_URL}/api/notifications/read`, {}, config);
                    // Fetch notifications again to update the unread count to 0
                    dispatch(fetchNotifications());
                } catch (error) {
                    console.error("Failed to mark notifications as read", error);
                }
            }
        };

        dispatch(fetchNotifications());
        markAsRead();

    }, [dispatch, isAuthenticated, navigate, unreadCount]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <HeaderLayout />
            <main className="flex-1 py-8 sm:py-12">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h1>
                    {loading ? (
                        <p>Loading notifications...</p>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow-md">
                            <p className="text-gray-500">You have no notifications.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map((notif) => (
                                <div key={notif._id} 
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
            </main>
            <FooterLayout />
        </div>
    );
};

export default NotificationsPage;