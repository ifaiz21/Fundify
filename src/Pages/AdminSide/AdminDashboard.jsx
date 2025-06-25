"use client"

import { useState, useEffect } from "react"
import Sidebar from "./SideBar"
import { Users, DollarSign, Flag, Bell, Download } from "lucide-react"
import axios from 'axios';

const AdminDashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalDonations, setTotalDonations] = useState(0);
    const [totalCampaigns, setTotalCampaigns] = useState(0);
    const [notificationsCount, setNotificationsCount] = useState(0); // Notifications ko ab 0 se initialize kiya
    const [activities, setActivities] = useState([]);
    const [monthlyDonationData, setMonthlyDonationData] = useState(Array(12).fill(0));

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error("Authentication token missing.");
                    // Yahan aap user ko login page par redirect kar sakte hain ya ek message dikha sakte hain.
                    // For now, it will just set data to 0 and log an error.
                    setTotalUsers(0);
                    setTotalDonations(0);
                    setTotalCampaigns(0);
                    setNotificationsCount(0);
                    setActivities([]);
                    setMonthlyDonationData(Array(12).fill(0));
                    return;
                }

                // Fetch Total Users
                const usersRes = await axios.get('http://localhost:5000/api/admin/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Users API Response Data:", usersRes.data);
                if (Array.isArray(usersRes.data)) {
                    setTotalUsers(usersRes.data.length);
                } else {
                    console.warn("Users API did not return an array:", usersRes.data);
                    setTotalUsers(0);
                }

                // Fetch Total Campaigns
                const campaignsRes = await axios.get('http://localhost:5000/api/admin/campaigns', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Campaigns API Response Data:", campaignsRes.data);
                if (campaignsRes.data && typeof campaignsRes.data.stats === 'object' && typeof campaignsRes.data.stats.total === 'number') {
                    setTotalCampaigns(campaignsRes.data.stats.total);
                } else {
                    console.warn("Campaigns API did not return expected stats object or total count:", campaignsRes.data);
                    setTotalCampaigns(0);
                }

                // Fetch Total Donations and Recent Activities
                const donationsRes = await axios.get('http://localhost:5000/api/admin/donations', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Donations API Response Data:", donationsRes.data);

                if (Array.isArray(donationsRes.data)) {
                    const sumDonations = donationsRes.data.reduce((sum, donation) => sum + (donation.amount || 0), 0);
                    setTotalDonations(sumDonations);

                    const recentActivities = donationsRes.data.slice(0, 3).map(donation => ({
                        id: donation._id,
                        type: "Donation",
                        icon: <Download className="h-4 w-4" />,
                        user: donation.userId && donation.userId.name ? donation.userId.name : (donation.honorOf || 'Anonymous'),
                        date: donation.createdAt ? new Date(donation.createdAt).toLocaleString() : 'N/A',
                        tags: "Donation",
                        amount: donation.amount ? `${donation.amount.toLocaleString()} PKR` : '0 PKR',
                        status: "Completed",
                        statusColor: "bg-green-500",
                    }));
                    setActivities(recentActivities);

                    const currentYear = new Date().getFullYear();
                    const monthlyTotals = Array(12).fill(0);

                    donationsRes.data.forEach(donation => {
                        const date = new Date(donation.createdAt);
                        if (date.getFullYear() === currentYear) {
                            const month = date.getMonth();
                            monthlyTotals[month] += (donation.amount || 0);
                        }
                    });

                    const maxMonthlyTotal = Math.max(...monthlyTotals);
                    const scaledMonthlyData = monthlyTotals.map(total => 
                        maxMonthlyTotal > 0 ? Math.round((total / maxMonthlyTotal) * 60) : 0
                    );
                    setMonthlyDonationData(scaledMonthlyData);

                } else {
                    console.warn("Donations API did not return an array:", donationsRes.data);
                    setTotalDonations(0);
                    setActivities([]);
                    setMonthlyDonationData(Array(12).fill(0));
                }

                // NEW: Fetch Notifications (Feedbacks)
                const feedbacksRes = await axios.get('http://localhost:5000/api/admin/feedbacks', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Feedbacks API Response Data:", feedbacksRes.data); // **** Yahan check karein ****
                if (Array.isArray(feedbacksRes.data)) {
                    // Assuming 'New' status feedbacks are considered active notifications
                    const newFeedbacksCount = feedbacksRes.data.filter(feedback => feedback.status === 'New').length;
                    setNotificationsCount(newFeedbacksCount); // New feedbacks count
                } else {
                    console.warn("Feedbacks API did not return an array:", feedbacksRes.data);
                    setNotificationsCount(0);
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                console.error("Full error object:", error);
                if (error.response) {
                    console.error("Error response data:", error.response.data);
                    console.error("Error response status:", error.response.status);
                    console.error("Error response headers:", error.response.headers);
                } else if (error.request) {
                    console.error("Error request:", error.request);
                } else {
                    console.error("Error message:", error.message);
                }
                // Set all counts and activities/chart data to 0 on error
                setTotalUsers(0);
                setTotalDonations(0);
                setTotalCampaigns(0);
                setNotificationsCount(0); // Set notifications to 0 on error
                setActivities([]);
                setMonthlyDonationData(Array(12).fill(0));
            }
        };

        fetchDashboardData();
    }, []);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Users Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Users</p>
                                <h3 className="text-2xl font-bold">{typeof totalUsers === 'number' ? totalUsers.toLocaleString() : '0'}</h3>
                                <p className="text-xs text-green-500 mt-1">
                                    <span className="font-medium">+10%</span> from last month {/* Yeh static hai */}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                <Users className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>

                        {/* Total Donations Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Donations</p>
                                <h3 className="text-2xl font-bold">{typeof totalDonations === 'number' ? totalDonations.toLocaleString() : '0'} PKR</h3>
                                <p className="text-xs text-green-500 mt-1">
                                    <span className="font-medium">+15.5%</span> from past week {/* Yeh static hai */}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>

                        {/* Total Campaigns Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Campaigns</p>
                                <h3 className="text-2xl font-bold">{typeof totalCampaigns === 'number' ? totalCampaigns.toLocaleString() : '0'}</h3>
                                <p className="text-xs text-green-500 mt-1">
                                    <span className="font-medium">+2.5%</span> from yesterday {/* Yeh static hai */}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                <Flag className="h-6 w-6 text-green-600" />
                            </div>
                        </div>

                        {/* Notifications Card - NOW DYNAMIC */}
                        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">New Feedbacks</p> {/* Label changed to reflect content */}
                                <h3 className="text-2xl font-bold">{notificationsCount.toLocaleString()}</h3>
                                <p className="text-xs text-green-500 mt-1">
                                    {/* You might need a backend endpoint for "up from yesterday" or calculate frontend */}
                                    <span className="font-medium">from recent inquiries</span> 
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                                <Bell className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-white rounded-lg shadow-sm mb-8">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-lg font-semibold">Recent Activities</h2>
                            <button className="text-sm text-gray-500 hover:text-gray-700">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs text-gray-500 border-b">
                                        <th className="px-6 py-3 font-medium">Activity Type</th>
                                        <th className="px-6 py-3 font-medium">Date</th>
                                        <th className="px-6 py-3 font-medium">Tags</th>
                                        <th className="px-6 py-3 font-medium">Amount</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.length > 0 ? (
                                        activities.map((activity) => (
                                            <tr key={activity.id || `${activity.type}-${activity.date}-${Math.random()}`} className="border-b last:border-b-0">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                            {activity.icon}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">{activity.type}</p>
                                                            <p className="text-xs text-gray-500">{activity.user}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm">{activity.date}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100">{activity.tags}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm">{activity.amount}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs rounded-full text-white ${activity.statusColor}`}>
                                                        {activity.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No recent activities found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Transaction Details (Bar Chart) */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-lg font-semibold">Transaction Details (Current Year)</h2>
                            <button className="text-sm text-gray-500 hover:text-gray-700">View Report</button>
                        </div>
                        <div className="p-6">
                            <div className="h-64 flex items-end">
                                <div className="flex h-full items-end space-x-2 w-full">
                                    {monthlyDonationData.map((height, index) => (
                                        <div key={index} className="flex-1 flex flex-col-reverse items-center justify-end h-full">
                                            <div className="w-10 bg-[#4B5842] rounded-t" style={{ height: `${height * 2}%` }}></div>
                                            <span className="text-xs text-gray-500 mt-2">
                                                {months[index]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard;