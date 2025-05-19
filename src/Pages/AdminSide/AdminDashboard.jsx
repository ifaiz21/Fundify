"use client"

import { useState } from "react"
import Sidebar from "./SideBar"
import { Users, DollarSign, Flag, Bell, Upload, Download } from "lucide-react"

const AdminDashboard = () => {
  // Sample data for recent activities
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "Deposit",
      icon: <Upload className="h-4 w-4" />,
      user: "Kareem Goda",
      date: "12/09/2023 - 12:00 PM",
      tags: "Deposit",
      amount: "4,500 PKR",
      status: "Completed",
      statusColor: "bg-green-500",
    },
    {
      id: 2,
      type: "Sale",
      icon: <Download className="h-4 w-4" />,
      user: "Zain",
      date: "12/08/2023 - 11:30 PM",
      tags: "Sale",
      amount: "4,500 PKR",
      status: "Pending",
      statusColor: "bg-yellow-500",
    },
    {
      id: 3,
      type: "Deposit",
      icon: <Upload className="h-4 w-4" />,
      user: "Ali Haider",
      date: "12/08/2023 - 11:00 PM",
      tags: "Deposit",
      amount: "4,500 PKR",
      status: "Cancelled",
      statusColor: "bg-red-500",
    },
  ])

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
                <h3 className="text-2xl font-bold">689</h3>
                <p className="text-xs text-green-500 mt-1">
                  <span className="font-medium">+10%</span> from last month
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
                <h3 className="text-2xl font-bold">10,231</h3>
                <p className="text-xs text-green-500 mt-1">
                  <span className="font-medium">+15.5%</span> from past week
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
                <h3 className="text-2xl font-bold">267</h3>
                <p className="text-xs text-green-500 mt-1">
                  <span className="font-medium">+2.5%</span> from yesterday
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Flag className="h-6 w-6 text-green-600" />
              </div>
            </div>

            {/* Notifications Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Notifications</p>
                <h3 className="text-2xl font-bold">69</h3>
                <p className="text-xs text-green-500 mt-1">
                  <span className="font-medium">+18</span> up from yesterday
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
                  {activities.map((activity) => (
                    <tr key={activity.id} className="border-b last:border-b-0">
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Transaction Details</h2>
              <button className="text-sm text-gray-500 hover:text-gray-700">View Report</button>
            </div>
            <div className="p-6">
              {/* Bar Chart */}
              <div className="h-64">
                <div className="flex h-full items-end space-x-2">
                  {[65, 40, 30, 50, 35, 25, 30, 35, 60, 15, 45, 40].map((height, index) => (
                    <div key={index} className="flex-1 flex flex-col-reverse items-center h-full">
                      <div className="w-10 bg-[#4B5842] rounded-t" style={{ height: `${height * 2}%` }}></div>
                      <span className="text-xs text-gray-500 mb-2">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index]}
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
