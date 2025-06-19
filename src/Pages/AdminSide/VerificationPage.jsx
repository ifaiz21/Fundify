// src/Pages/AdminSide/VerificationPage.jsx
"use client"

import { useState, useEffect } from "react"
import Sidebar from "./SideBar"
import { Search, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import axios from "axios"

const VerificationPage = () => {
  const [campaigns, setCampaigns] = useState([]) // State for fetched campaigns (pending)
  const [campaignStats, setCampaignStats] = useState({ // State for dynamic campaign statistics
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  })
  const [loading, setLoading] = useState(true) // Loading state
  const [error, setError] = useState(null) // Error state
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMonth, setSelectedMonth] = useState("All")
  const itemsPerPage = 8

  // Function to fetch campaigns and stats
  const fetchCampaignsAndStats = async () => {
    console.log("Fetching campaigns and stats..."); // Debug log
    try {
      setLoading(true)
      const token = localStorage.getItem('token'); 

      if (!token) {
          setError("Authentication required. Please log in as an Admin.");
          setLoading(false);
          return;
      }

      const response = await axios.get("http://localhost:5000/api/campaigns?status=Pending Review", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const fetchedCampaigns = response.data?.campaigns || [];
      const fetchedStats = response.data?.stats || { total: 0, approved: 0, rejected: 0, pending: 0 };

      setCampaigns(fetchedCampaigns); 
      setCampaignStats(fetchedStats);
      
      console.log("Fetched Campaigns (raw):", fetchedCampaigns); // Debug log
      console.log("Fetched Stats (raw):", fetchedStats); // Debug log

      setError(null);
    } catch (err) {
      console.error("Error fetching campaigns for verification:", err)
      setError("Failed to load campaigns for verification. Please try again later.")
      setCampaigns([])
      setCampaignStats({ total: 0, approved: 0, rejected: 0, pending: 0 });
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaignsAndStats()
  }, [])

  // Handlers for Approve/Reject actions
  const handleApproveReject = async (campaignId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this campaign?`)) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Authentication token missing. Please log in again.");
        return;
      }

      const endpoint = `http://localhost:5000/api/campaigns/${campaignId}/${status.toLowerCase()}`;
      const response = await axios.put(endpoint, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 200) {
        alert(`Campaign ${status}d successfully!`);
        fetchCampaignsAndStats(); // Refresh the list after action
      } else {
        alert(`Failed to ${status} campaign: ${response.data?.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(`Error ${status}ing campaign:`, err);
      alert(`An error occurred while trying to ${status} the campaign.`);
    }
  };


  // MODIFIED FOR DEBUGGING: Simplified filter to directly use fetched campaigns
  // This will show if campaigns array is actually populated
  const filteredVerifications = campaigns; 
  console.log("Campaigns state during render:", campaigns); // Debug log
  console.log("Search Query:", searchQuery); // Debug log


  const totalItems = filteredVerifications.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const currentVerifications = filteredVerifications.slice(startIndex, endIndex);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleMonthChange = (month) => {
    setSelectedMonth(month)
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-500"
      case "Pending Review":
        return "bg-yellow-500"
      case "Rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const months = [
    "All",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto p-8 text-center">
          <p className="text-xl text-gray-600">Loading verification data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto p-8 text-center">
          <p className="text-red-600 text-xl">{error}</p>
          <button onClick={fetchCampaignsAndStats} className="mt-4 bg-[#4A5D45] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Campaign Verification</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
              />
            </div>
          </div>

          {/* Campaign Statistics with Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pie Chart - Simplified representation, will need actual chart library for complex visuals */}
              <div className="flex justify-center items-center">
                <div className="relative w-64 h-64">
                  {/* These clipPaths need to be dynamic based on actual stats for a real pie chart */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      {/* Placeholder for dynamic pie chart segments */}
                      {/* You would calculate angles/clipPaths based on campaignStats.approved, .pending, .rejected */}
                      <div
                        className="absolute w-48 h-48 rounded-full bg-blue-500"
                        style={{ clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)` }}
                      ></div>
                      <div
                        className="absolute w-48 h-48 rounded-full bg-yellow-400"
                        style={{ clipPath: `polygon(50% 50%, 0% 0%, 50% 0%)` }}
                      ></div>
                      <div
                        className="absolute w-48 h-48 rounded-full bg-red-500"
                        style={{ clipPath: `polygon(50% 50%, 0% 0%, 0% 100%, 50% 100%)` }}
                      ></div>
                      {/* Center circle */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center">
                        <span className="font-semibold">Campaigns</span>
                      </div>
                    </div>
                  </div>

                  {/* Labels - Position needs careful adjustment for real chart */}
                  <div className="absolute top-0 right-0">
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Approved
                      <br />
                      {campaignStats.approved}
                    </div>
                  </div>
                  <div className="absolute top-0 left-0">
                    <div className="bg-yellow-400 text-white text-xs px-2 py-1 rounded">
                      Pending
                      <br />
                      {campaignStats.pending}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0">
                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Rejected
                      <br />
                      {campaignStats.rejected}
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Campaigns</span>
                  <span className="font-bold text-xl">{campaignStats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Approved Campaigns</span>
                  <span className="font-bold text-xl">{campaignStats.approved}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Rejected Campaigns</span>
                  <span className="font-bold text-xl">{campaignStats.rejected}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Pending Campaigns</span>
                  <span className="font-bold text-xl">{campaignStats.pending}</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center mt-6 space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm">Approved</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm">Rejected</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <span className="text-sm">Pending</span>
              </div>
            </div>
          </div>

          {/* Campaign Verification Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Pending Campaigns for Verification</h2>
              <div className="relative">
                <div className="flex items-center border rounded-md px-3 py-2 cursor-pointer group">
                  <span>{selectedMonth}</span>
                  <ChevronDown className="ml-2 h-4 w-4" />

                  <div className="absolute right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-10 hidden group-hover:block">
                    <ul className="py-1">
                      {months.map((month) => (
                        <li
                          key={month}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleMonthChange(month)}
                        >
                          {month}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                    <th className="px-6 py-3 font-medium">Campaign Title</th>
                    <th className="px-6 py-3 font-medium">Organizer Name</th>
                    <th className="px-6 py-3 font-medium">Description</th>
                    <th className="px-6 py-3 font-medium">Submission Date</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVerifications.length > 0 ? (
                    currentVerifications.map((campaign) => (
                      <tr key={campaign._id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium">{campaign.title}</td>
                        <td className="px-6 py-4 text-sm">{campaign.name}</td>
                        <td className="px-6 py-4 text-sm max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{campaign.description}</td>
                        <td className="px-6 py-4 text-sm">{new Date(campaign.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 text-xs rounded-full text-white ${getStatusClass(campaign.status)}`}
                          >
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {campaign.status === "Pending Review" ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApproveReject(campaign._id, "Approved")}
                                className="px-3 py-1 text-xs rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleApproveReject(campaign._id, "Rejected")}
                                className="px-3 py-1 text-xs rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-xs">{campaign.status}</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No pending campaigns for verification.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 flex items-center justify-between border-t">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}-{endIndex} of {totalItems}
              </div>
              <div className="flex space-x-1">
                <button
                  className="p-1 rounded border text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  className="p-1 rounded border text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerificationPage;