"use client"

import { useState } from "react"
import Sidebar from "./SideBar"
import { Search } from "lucide-react"

const DonationHistory = () => {
  // Sample data for donations
  const [donations, setDonations] = useState([
    {
      id: "#9328792374",
      type: "Deposit",
      campaign: "3D Printed Planters",
      user: "Hassan",
      amount: "10,000 PKR",
      status: "Completed",
    },
    {
      id: "#9328792374",
      type: "Withdrawal",
      campaign: "Children Study",
      user: "Hamza",
      amount: "15,000 PKR",
      status: "Pending",
    },
    {
      id: "#7328792374",
      type: "Deposit",
      campaign: "Save Rhino",
      user: "David",
      amount: "4,400 PKR",
      status: "Failed",
    },
    {
      id: "#9328792374",
      type: "Deposit",
      campaign: "Build Shelters",
      user: "Williams",
      amount: "8,000 PKR",
      status: "Pending",
    },
    {
      id: "#9328792374",
      type: "Withdrawal",
      campaign: "Earthquake Victims",
      user: "Arisu",
      amount: "9,000 PKR",
      status: "Completed",
    },
    {
      id: "#9328792374",
      type: "Deposit",
      campaign: "Rescue Stray Animals",
      user: "Usapa",
      amount: "7,700 PKR",
      status: "Pending",
    },
    {
      id: "#9328792374",
      type: "Deposit",
      campaign: "Water Powered Car",
      user: "Hassan",
      amount: "4,000 PKR",
      status: "Failed",
    },
    {
        id: "#9328792374",
        type: "Withdrawal",
        campaign: "Earthquake Victims",
        user: "Arisu",
        amount: "9,000 PKR",
        status: "Completed",
    },
    {
      id: "#9328792374",
      type: "Deposit",
      campaign: "Build Shelters",
      user: "Williams",
      amount: "8,000 PKR",
      status: "Pending",
    },
    {
      id: "#9328792374",
      type: "Deposit",
      campaign: "Build Shelters",
      user: "Williams",
      amount: "8,000 PKR",
      status: "Pending",
    },
  ])
  

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDonations = donations.filter((donation) =>
    Object.values(donation).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  

  const itemsPerPage = 8;
  const totalItems = filteredDonations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDonations = filteredDonations.slice(startIndex, endIndex);
  

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500 text-white"
      case "Pending":
        return "bg-yellow-500 text-white"
      case "Failed":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }
  

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Donation History</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4B5842] focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                    <th className="px-6 py-3 font-medium">Transaction ID</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Campaign</th>
                    <th className="px-6 py-3 font-medium">User</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                    {currentDonations.map((donation, index) => (
                    <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">{donation.id}</td>
                      <td className="px-6 py-4 text-sm">{donation.type}</td>
                      <td className="px-6 py-4 text-sm">{donation.campaign}</td>
                      <td className="px-6 py-4 text-sm">{donation.user}</td>
                      <td className="px-6 py-4 text-sm">{donation.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full ${getStatusClass(donation.status)}`}>
                          {donation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 flex items-center justify-between border-t">
              <div className="text-sm text-gray-500">showing {startIndex + 1} - {Math.min(endIndex, totalItems)} of {totalItems}</div>
              <div className="flex space-x-1">
                <button
                  className="px-3 py-1 rounded border text-sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                <button
                  className="px-3 py-1 rounded border bg-gray-100 text-sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage * itemsPerPage >= totalItems}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonationHistory;
