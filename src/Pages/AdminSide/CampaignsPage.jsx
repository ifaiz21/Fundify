// src/Pages/AdminSide/CampaignsPage.jsx
"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "./SideBar"
import { Search, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [refreshing, setRefreshing] = useState(false)
  const itemsPerPage = 8

  // Function to fetch campaigns from backend - STRICT MODE (no fallback)
  const fetchCampaigns = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) setRefreshing(true)
      else setLoading(true)

      console.log("Fetching campaigns from API...")

      const token = localStorage.getItem('token'); // Token ko localStorage se hasil karein
      if (!token) {
        // Handle case where token is not available (e.g., redirect to login)
        setError("Authentication token missing. Please log in.");
        setCampaigns([]);
        return;
      }

      const response = await axios.get("https://server-fundify.up.railway.app/api/campaigns", {
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
          'Authorization': `Bearer ${token}`, // Token ko headers mein shamil karein
        },
        timeout: 10000,
      })

      console.log("API Response:", response.data)

      // MODIFICATION START
      // Check if response.data is an object and contains a 'campaigns' array
      if (typeof response.data === 'object' && response.data !== null && Array.isArray(response.data.campaigns)) {
        transformAndSetCampaigns(response.data.campaigns); // Pass the array from response.data.campaigns
        // Optionally, you can also set the stats if needed in this component
        // setCampaignStats(response.data.stats);
      } else {
        throw new Error("Invalid data format received from server: 'campaigns' array not found or not an array.");
      }
      // MODIFICATION END

      setError(null)
    } catch (err) {
      console.error("Error fetching campaigns:", err)
      setError(`Failed to load campaigns: ${err.response?.data?.message || err.message}`)
      setCampaigns([]) // Clear campaigns on error
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const transformAndSetCampaigns = (data) => {
    const transformedCampaigns = data.map((campaign, index) => ({
      id: campaign._id || `temp-${index}`, // MongoDB _id ko primary key ke tor par istemal karein
      name: campaign.title || "Untitled Campaign", // Backend ke `title` field ko Campaign Name ke liye use karein
      campaignId: campaign.campaignId || `#${campaign._id.slice(-8).toUpperCase()}`, // Backend se `campaignId` field use karein
      domainType: campaign.category || "Other", // Backend ke `category` field ko use karein
      fundingGoal: `${Number(campaign.goalAmount || 0).toLocaleString()} PKR`, // Backend ke `goalAmount` field ko use karein
      totalBackers: campaign.totalBackers || 0, // Agar backend se totalBackers nahi aa raha, toh 0
      status: campaign.status || "Pending Review",
      createdAt: campaign.createdAt,
      creatorName: campaign.name, // Backend ke `name` field ko Creator Name ke liye use karein
      location: campaign.location,
    }))

    setCampaigns(transformedCampaigns)
  }


  useEffect(() => {
    fetchCampaigns()
    const interval = setInterval(() => fetchCampaigns(true), 30000)
    return () => clearInterval(interval)
  }, )

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.campaignId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.domainType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalItems = filteredCampaigns.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const currentCampaigns = filteredCampaigns.slice(startIndex, endIndex)

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const handleRefresh = () => {
    fetchCampaigns(true)
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
      case "approved":
        return "bg-green-500"
      case "pending review":
      case "pending":
        return "bg-yellow-500"
      case "rejected":
      case "unactive":
      case "inactive":
        return "bg-red-500"
      case "completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading && campaigns.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#4B5842]" />
            <p className="text-gray-600">Loading campaigns...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && campaigns.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchCampaigns()}
              className="px-4 py-2 bg-[#4B5842] text-white rounded-md hover:bg-[#3A4433] transition-colors"
            >
              Try Again
            </button>
          </div>
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
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Campaigns</h1>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-500 hover:text-[#4B5842] transition-colors disabled:opacity-50"
                title="Refresh campaigns"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              </button>
              {campaigns.length > 0 && (
                <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
              )}
            </div>
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

          {error && campaigns.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {campaigns.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No campaigns found.</p>
                <p className="text-sm text-gray-400">Campaigns submitted through the creation flow will appear here.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                        <th className="px-6 py-3 font-medium">Campaign Name</th>
                        <th className="px-6 py-3 font-medium">Campaign ID</th>
                        <th className="px-6 py-3 font-medium">Category</th> {/* Changed from Domain/Type */}
                        <th className="px-6 py-3 font-medium">Funding Goal</th>
                        <th className="px-6 py-3 font-medium">Total Backers</th>
                        <th className="px-6 py-3 font-medium">Campaign Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCampaigns.map((campaign) => (
                        <tr key={campaign.id} className="border-b last:border-b-0 hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium">{campaign.name}</div>
                              {campaign.creatorName && (
                                <div className="text-xs text-gray-500">by {campaign.creatorName}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-mono">{campaign.campaignId}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {campaign.domainType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">{campaign.fundingGoal}</td>
                          <td className="px-6 py-4 text-sm">{campaign.totalBackers}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 text-xs rounded-full text-white ${getStatusColor(campaign.status)}`}
                            >
                              {campaign.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
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
                      <span className="px-3 py-1 text-sm text-gray-600">
                        {currentPage} of {totalPages}
                      </span>
                      <button
                        className="p-1 rounded border text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignsPage;