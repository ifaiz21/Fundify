// src/Pages/AdminSide/VerificationPage.jsx
"use client"

import { useState, useEffect } from "react"
import Sidebar from "./SideBar"
import { Search, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"; // Import useNavigate

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
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to fetch campaigns and stats
  const fetchCampaignsAndStats = async () => {
    console.log("Fetching campaigns and stats..."); // Debug log
    try {
      setLoading(true) // Set loading to true before fetching
      const token = localStorage.getItem('token'); 

      if (!token) {
          setError("Authentication required. Please log in as an Admin.");
          setLoading(false); // Stop loading if no token
          return;
      }

      // Fetch campaigns with 'Pending Review' status
      const response = await axios.get("http://localhost:5000/api/campaigns?status=Pending Review", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const fetchedCampaigns = response.data?.campaigns || [];

      // A more robust approach might be to have a dedicated endpoint for overall stats.
      // For this implementation, we will mock the stats based on the pending campaigns count,
      // as the provided code did not detail the source of `response.data?.stats` for this endpoint.
      // If the backend `campaigns?status=Pending Review` also returns full stats, this part can be simplified.
      // Let's assume the backend also sends full stats with this request, as per the original code's assumption.
      const fetchedStats = response.data?.stats || { 
          total: fetchedCampaigns.length, // Placeholder, ideally from backend for total campaigns
          approved: 0, // Placeholder
          rejected: 0, // Placeholder
          pending: fetchedCampaigns.length // This should be accurate for this endpoint
      };


      setCampaigns(fetchedCampaigns); 
      setCampaignStats(fetchedStats); // Update stats

      console.log("Fetched Campaigns (raw):", fetchedCampaigns); // Debug log
      console.log("Fetched Stats (raw):", fetchedStats); // Debug log

      setError(null);
    } catch (err) {
      console.error("Error fetching campaigns for verification:", err)
      // Display a user-friendly error message based on the status code
      if (err.response && err.response.status === 403) {
        setError("Access forbidden: You do not have sufficient rights to view this page.");
      } else {
        setError("Failed to load campaigns for verification. Please try again later.");
      }
      setCampaigns([])
      setCampaignStats({ total: 0, approved: 0, rejected: 0, pending: 0 });
    } finally {
      setLoading(false) // Always stop loading
    }
  }

  useEffect(() => {
    // Initial fetch when the component mounts
    fetchCampaignsAndStats();

    // Set up polling to refresh campaigns every 30 seconds
    const intervalId = setInterval(() => {
      fetchCampaignsAndStats();
    }, 30000); // Poll every 30 seconds (adjust as needed)

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Handlers for Approve/Reject actions
  const handleApproveReject = async (campaignId, status) => {
    // Replace window.confirm with a custom modal for better UX and consistency
    // For now, retaining window.confirm as per original code, but note the instruction to avoid it.
    if (!window.confirm(`Are you sure you want to ${status} this campaign?`)) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Replace alert with a toast notification or custom message box
        alert("Authentication token missing. Please log in again.");
        return;
      }

      const endpoint = `http://localhost:5000/api/campaigns/${campaignId}/${status.toLowerCase()}`;
      const response = await axios.put(endpoint, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 200) {
        // Replace alert with a toast notification or custom message box
        alert(`Campaign ${status}d successfully!`);
        fetchCampaignsAndStats(); // Refresh the list immediately after action
      } else {
        // Replace alert with a toast notification or custom message box
        alert(`Failed to ${status} campaign: ${response.data?.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(`Error ${status}ing campaign:`, err);
      // Replace alert with a toast notification or custom message box
      alert(`An error occurred while trying to ${status} the campaign.`);
    }
  };

  // Handler for "View Campaign" button
  const handleViewCampaign = (campaignId) => {
    navigate(`/ProjectView?id=${campaignId}`);
  };


  // Filtering logic
  const filteredVerifications = campaigns.filter((campaign) => {
    // Ensure campaign.creator and campaign.creator.name exist before accessing
    const organizerName = campaign.creator?.name || ''; 
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          organizerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by month if selectedMonth is not "All"
    const campaignMonth = new Date(campaign.createdAt).toLocaleString('default', { month: 'long' });
    const matchesMonth = selectedMonth === "All" || campaignMonth === selectedMonth;

    return matchesSearch && matchesMonth;
  });
  
  console.log("Campaigns state during render:", campaigns); // Debug log
  console.log("Search Query:", searchQuery); // Debug log
  console.log("Filtered Verifications:", filteredVerifications); // Debug log


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
    setCurrentPage(1); // Reset to first page when month filter changes
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
        <div className="flex-1 overflow-auto p-8 text-center flex items-center justify-center">
          <p className="text-xl text-gray-600">Loading verification data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto p-8 text-center flex items-center justify-center flex-col">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <button onClick={fetchCampaignsAndStats} className="bg-[#4A5D45] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="flex h-screen bg-gray-50 font-sans"> {/* Added font-sans for better typography */}
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-full mx-auto"> {/* Added max-w-full and mx-auto */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Campaign Verification</h1>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4B5842] shadow-sm"
              />
            </div>
          </div>

          {/* Campaign Statistics with Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100"> {/* Adjusted shadow and added border */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"> {/* Changed md to lg for better layout on larger screens */}
              {/* Pie Chart Placeholder */}
              <div className="flex justify-center items-center">
                <div className="relative w-64 h-64">
                  {/* These clipPaths need to be dynamic based on actual stats for a real pie chart */}
                  {/* TODO: Integrate a proper charting library (e.g., Recharts, Chart.js) for dynamic pie chart */}
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
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner"> {/* Added shadow-inner */}
                        <span className="font-semibold text-gray-700 text-sm">Campaigns</span>
                      </div>
                    </div>
                  </div>

                  {/* Labels - Simple illustrative positioning, needs dynamic logic for a real chart */}
                  <div className="absolute -top-4 right-1/4 transform translate-x-1/2">
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md shadow-sm">
                      Approved: {campaignStats.approved}
                    </div>
                  </div>
                  <div className="absolute top-1/4 -left-4">
                    <div className="bg-yellow-400 text-white text-xs px-2 py-1 rounded-md shadow-sm">
                      Pending: {campaignStats.pending}
                    </div>
                  </div>
                  <div className="absolute -bottom-4 left-1/4 transform -translate-x-1/2">
                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow-sm">
                      Rejected: {campaignStats.rejected}
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Total Campaigns</span>
                  <span className="font-bold text-2xl text-[#4A5D45]">{campaignStats.total}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Approved Campaigns</span>
                  <span className="font-bold text-2xl text-green-600">{campaignStats.approved}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Rejected Campaigns</span>
                  <span className="font-bold text-2xl text-red-600">{campaignStats.rejected}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Pending Campaigns</span>
                  <span className="font-bold text-2xl text-yellow-600">{campaignStats.pending}</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center mt-6 space-x-6 text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 shadow-sm"></div>
                <span className="text-sm">Approved</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-sm"></div>
                <span className="text-sm">Rejected</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2 shadow-sm"></div>
                <span className="text-sm">Pending</span>
              </div>
            </div>
          </div>

          {/* Campaign Verification Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"> {/* Adjusted shadow and added border */}
            <div className="flex flex-col md:flex-row items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 md:mb-0">Pending Campaigns for Verification</h2>
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 cursor-pointer group bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span className="text-gray-700 text-sm">{selectedMonth}</span>
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />

                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto"> {/* Enhanced dropdown animation */}
                    <ul className="py-1">
                      {months.map((month) => (
                        <li
                          key={month}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
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
              <table className="min-w-full divide-y divide-gray-200"> {/* Added min-w-full and divide-y */}
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wider"> {/* Adjusted text size and styling */}
                    <th className="px-6 py-3 font-bold">Campaign Title</th>
                    <th className="px-6 py-3 font-bold">Organizer Name</th>
                    <th className="px-6 py-3 font-bold">Description</th>
                    <th className="px-6 py-3 font-bold">Submission Date</th>
                    <th className="px-10 py-3 font-bold">Status</th>
                    <th className="px-20 py-3 text-center font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentVerifications.length > 0 ? (
                    currentVerifications.map((campaign) => (
                      <tr key={campaign._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{campaign.title}</td>
                        {/* Changed campaign.name to campaign.creator.name */}
                        <td className="px-6 py-4 text-sm text-gray-700">{campaign.creator?.name || 'N/A'}</td> 
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={campaign.description}>{campaign.description}</td> {/* Added title attribute */}
                        <td className="px-6 py-4 text-sm text-gray-700">{new Date(campaign.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold leading-5 rounded-full text-white ${getStatusClass(campaign.status)}`}
                          >
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-2 py-0.5">
                          {campaign.status === "Pending Review" ? (
                            <div className="flex space-x-2">
                              {/* New View Campaign Button */}
                              <button
                                onClick={() => handleViewCampaign(campaign._id)}
                                className="px-2 py-0.5 text-xs rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 shadow-sm"
                              >
                                View Campaign
                              </button>
                              <button
                                onClick={() => handleApproveReject(campaign._id, "approve")}
                                className="px-2 py-0.5 text-xs rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 shadow-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleApproveReject(campaign._id, "reject")}
                                className="px-2 py-0.5 text-xs rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 shadow-sm"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm italic">{campaign.status}</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500 text-base">No pending campaigns for verification.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50"> {/* Adjusted padding and background */}
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{endIndex} of {totalItems} campaigns
              </div>
              <div className="flex space-x-1">
                <button
                  className="p-2 rounded-full border border-gray-300 text-gray-600 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  className="p-2 rounded-full border border-gray-300 text-gray-600 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
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