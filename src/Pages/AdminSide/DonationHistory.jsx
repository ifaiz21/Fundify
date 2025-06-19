// src/Pages/AdminSide/DonationHistory.jsx
"use client"

import { useState, useEffect } from "react" // Added useEffect
import Sidebar from "./SideBar"
import { Search } from "lucide-react"
import axios from "axios" // Import axios

const DonationHistory = () => {
  const [donations, setDonations] = useState([]) // State to store fetched donations
  const [loading, setLoading] = useState(true) // Loading state
  const [error, setError] = useState(null) // Error state
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

        if (!token) {
            setError("Authentication required. Please log in.");
            setLoading(false);
            return;
        }

        const response = await axios.get("http://localhost:5000/api/donations", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        setDonations(response.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching donation history:", err)
        setError("Failed to load donation history. Please try again later.")
        setDonations([])
      } finally {
        setLoading(false)
      }
    }
    fetchDonations()
  }, []) // Empty dependency array means this effect runs once on mount

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
      case "completed": // Backend status is lowercase
        return "bg-green-500 text-white"
      case "pending": // Backend status is lowercase
        return "bg-yellow-500 text-white"
      case "failed": // Backend status is lowercase
        return "bg-red-500 text-white"
      case "refunded": // Added refunded status
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto p-8 text-center">
          <p className="text-xl text-gray-600">Loading donation history...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto p-8 text-center">
          <p className="text-red-600 text-xl">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#4A5D45] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
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
                    {currentDonations.length > 0 ? (
                        currentDonations.map((donation, index) => (
                        <tr key={donation._id || index} className="border-b last:border-b-0 hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium">{donation.transactionId || donation._id}</td>
                            <td className="px-6 py-4 text-sm">{donation.donationType === "General donation" ? "Deposit" : "Deposit (Project)"}</td> {/* Simplified type for now */}
                            <td className="px-6 py-4 text-sm">{donation.campaignId ? donation.campaignId.title : "N/A (General)"}</td>
                            <td className="px-6 py-4 text-sm">{donation.userId ? donation.userId.name : "Anonymous"}</td>
                            <td className="px-6 py-4 text-sm">PKR {donation.amount.toLocaleString()}</td>
                            <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs rounded-full ${getStatusClass(donation.status)}`}>
                                {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)} {/* Capitalize status */}
                            </span>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No donations found.</td>
                        </tr>
                    )}
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