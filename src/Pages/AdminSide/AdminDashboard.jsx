"use client"

import { useState, useEffect } from "react"
import Sidebar from "./SideBar" // Assume Sidebar is also made responsive
import { Users, DollarSign, Flag, Bell, Download, Menu, X } from "lucide-react" // Added Menu and X icons
import axios from 'axios';

const AdminDashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalDonations, setTotalDonations] = useState(0);
    const [totalCampaigns, setTotalCampaigns] = useState(0);
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [activities, setActivities] = useState([]);
    const [monthlyDonationData, setMonthlyDonationData] = useState(Array(12).fill(0));
    
    // NEW STATE: Sidebar ko mobile par control karne ke liye
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error("Authentication token missing.");
                    return;
                }

                // Fetch Total Users
                const usersRes = await axios.get('https://server-fundify.up.railway.app/api/admin/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (Array.isArray(usersRes.data)) {
                    setTotalUsers(usersRes.data.length);
                }

                // Fetch Total Campaigns
                const campaignsRes = await axios.get('https://server-fundify.up.railway.app/api/admin/campaigns', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (campaignsRes.data && campaignsRes.data.stats) {
                    setTotalCampaigns(campaignsRes.data.stats.total);
                }

                // Fetch Total Donations and Recent Activities
                const donationsRes = await axios.get('https://server-fundify.up.railway.app/api/admin/donations', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (Array.isArray(donationsRes.data)) {
                    const sumDonations = donationsRes.data.reduce((sum, donation) => sum + (donation.amount || 0), 0);
                    setTotalDonations(sumDonations);

                    const recentActivities = donationsRes.data.slice(0, 5).map(donation => ({
                        id: donation._id,
                        type: "Donation",
                        icon: <Download className="h-4 w-4" />,
                        user: donation.userId?.name || donation.honorOf || 'Anonymous',
                        date: new Date(donation.createdAt).toLocaleString(),
                        tags: "Donation",
                        amount: `${(donation.amount || 0).toLocaleString()} PKR`,
                        status: "Completed",
                        statusColor: "bg-green-500",
                    }));
                    setActivities(recentActivities);

                    const currentYear = new Date().getFullYear();
                    const monthlyTotals = Array(12).fill(0);
                    donationsRes.data.forEach(donation => {
                        const date = new Date(donation.createdAt);
                        if (date.getFullYear() === currentYear) {
                            monthlyTotals[date.getMonth()] += (donation.amount || 0);
                        }
                    });

                    const maxMonthlyTotal = Math.max(...monthlyTotals);
                    const scaledMonthlyData = monthlyTotals.map(total => 
                        maxMonthlyTotal > 0 ? Math.round((total / maxMonthlyTotal) * 60) : 0
                    );
                    setMonthlyDonationData(scaledMonthlyData);
                }

                // Fetch Notifications (Feedbacks)
                const feedbacksRes = await axios.get('https://server-fundify.up.railway.app/api/admin/feedbacks', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (Array.isArray(feedbacksRes.data)) {
                    const newFeedbacksCount = feedbacksRes.data.filter(f => f.status === 'New').length;
                    setNotificationsCount(newFeedbacksCount);
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                // Reset states on error
                setTotalUsers(0);
                setTotalDonations(0);
                setTotalCampaigns(0);
                setNotificationsCount(0);
                setActivities([]);
                setMonthlyDonationData(Array(12).fill(0));
            }
        };

        fetchDashboardData();
    }, []);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* --- SIDEBAR RESPONSIVE LOGIC --- */}
            {/* Desktop par sidebar hamesha dikhega, mobile par state se control hoga */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
                <Sidebar />
                {/* Mobile par sidebar band karne ka button */}
                <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 text-white md:hidden">
                    <X className="h-6 w-6" />
                </button>
            </div>
            
            <div className="flex-1 flex flex-col overflow-auto">
                 {/* --- HEADER FOR MOBILE --- */}
                 <header className="md:hidden bg-white shadow-sm p-4 flex items-center">
                    <button onClick={() => setIsSidebarOpen(true)}>
                        <Menu className="h-6 w-6 text-gray-700" />
                    </button>
                    <h1 className="text-xl font-bold ml-4">Dashboard</h1>
                </header>
                
                {/* --- MAIN CONTENT --- */}
                <main className="p-4 sm:p-6 lg:p-8">
                    <h1 className="hidden md:block text-2xl font-bold mb-6">Dashboard</h1>

                    {/* Stats Cards - Ye pehle se responsive tha, koi bari change nahi */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Users Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Users</p>
                                <h3 className="text-2xl font-bold">{totalUsers.toLocaleString()}</h3>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                <Users className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>

                        {/* Total Donations Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Donations</p>
                                <h3 className="text-2xl font-bold">{totalDonations.toLocaleString()} <span className="text-lg">PKR</span></h3>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>

                        {/* Total Campaigns Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Campaigns</p>
                                <h3 className="text-2xl font-bold">{totalCampaigns.toLocaleString()}</h3>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                <Flag className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        
                        {/* Notifications Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">New Feedbacks</p>
                                <h3 className="text-2xl font-bold">{notificationsCount.toLocaleString()}</h3>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                                <Bell className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    {/* --- RESPONSIVE RECENT ACTIVITIES TABLE --- */}
                    <div className="bg-white rounded-lg shadow-sm mb-8">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-lg font-semibold">Recent Activities</h2>
                            <button className="text-sm text-gray-500 hover:text-gray-700">View All</button>
                        </div>
                        {/* Mobile par card layout, Desktop par table */}
                        <div className="md:hidden">
                            {activities.length > 0 ? (
                                activities.map(activity => (
                                    <div key={activity.id} className="p-4 border-b last:border-b-0 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">{activity.icon}</div>
                                                <div>
                                                    <p className="font-medium text-sm">{activity.type}</p>
                                                    <p className="text-xs text-gray-500">{activity.user}</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-sm">{activity.amount}</p>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>{activity.date}</span>
                                            <span className={`px-2 py-1 rounded-full text-white text-xs ${activity.statusColor}`}>{activity.status}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                 <p className="p-4 text-center text-gray-500">No recent activities found.</p>
                            )}
                        </div>
                        
                        {/* Desktop Table (Mobile par hidden) */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs text-gray-500 border-b">
                                        <th className="px-6 py-3 font-medium">Activity Type</th>
                                        <th className="px-6 py-3 font-medium">Date</th>
                                        <th className="px-6 py-3 font-medium">Amount</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.length > 0 ? (
                                        activities.map((activity) => (
                                            <tr key={activity.id} className="border-b last:border-b-0">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">{activity.icon}</div>
                                                        <div>
                                                            <p className="font-medium text-sm">{activity.type}</p>
                                                            <p className="text-xs text-gray-500">{activity.user}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm">{activity.date}</td>
                                                <td className="px-6 py-4 text-sm font-semibold">{activity.amount}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs rounded-full text-white ${activity.statusColor}`}>{activity.status}</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="text-center py-8 text-gray-500">No recent activities found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* --- RESPONSIVE TRANSACTION CHART --- */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-lg font-semibold">Transaction Details (Current Year)</h2>
                            <button className="text-sm text-gray-500 hover:text-gray-700">View Report</button>
                        </div>
                        {/* Wrapper div for horizontal scroll on mobile */}
                        <div className="p-6 overflow-x-auto">
                            <div className="h-64 flex items-end space-x-4" style={{ minWidth: '600px' }}>
                                {monthlyDonationData.map((height, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center justify-end">
                                        <div className="w-10 bg-[#4B5842] rounded-t hover:bg-green-800 transition-colors" style={{ height: `${height * 1.5}%` }}></div>
                                        <span className="text-xs text-gray-500 mt-2">{months[index]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AdminDashboard;