// src/Pages/AdminSide/CampaignsPage.jsx
"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "./SideBar"
import { Search, ChevronLeft, ChevronRight, RefreshCw, Menu, X } from "lucide-react"

const CampaignsPage = () => {
    const [campaigns, setCampaigns] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [refreshing, setRefreshing] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar
    const itemsPerPage = 8

    const fetchCampaigns = async (showRefreshLoader = false) => {
        try {
            if (showRefreshLoader) setRefreshing(true)
            else setLoading(true)

            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication token missing. Please log in.");
                setCampaigns([]);
                return;
            }

            const response = await axios.get("https://server-fundify.up.railway.app/api/admin/campaigns", { // Changed to admin endpoint
                headers: {
                    Accept: "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                timeout: 10000,
            })

            if (typeof response.data === 'object' && response.data !== null && Array.isArray(response.data.campaigns)) {
                transformAndSetCampaigns(response.data.campaigns);
            } else {
                throw new Error("Invalid data format received from server.");
            }
            setError(null)
        } catch (err) {
            console.error("Error fetching campaigns:", err)
            setError(`Failed to load campaigns: ${err.response?.data?.message || err.message}`)
            setCampaigns([])
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const transformAndSetCampaigns = (data) => {
        const transformedCampaigns = data.map((campaign, index) => ({
            id: campaign._id || `temp-${index}`,
            name: campaign.title || "Untitled Campaign",
            campaignId: campaign.campaignId || `#${campaign._id.slice(-8).toUpperCase()}`,
            domainType: campaign.category || "Other",
            fundingGoal: `${Number(campaign.goalAmount || 0).toLocaleString()} PKR`,
            totalBackers: campaign.backers?.length || 0, // Calculate backers from the array length
            status: campaign.status || "Pending Review",
            createdAt: campaign.createdAt,
            creatorName: campaign.creator?.name || "N/A", // Get creator name from populated field
            location: campaign.location || "N/A",
        }))
        setCampaigns(transformedCampaigns)
    }

    // Remove the dependency array from useEffect to fix the infinite loop
    useEffect(() => {
        fetchCampaigns()
        // The interval was causing too many requests, it's better to use a manual refresh or sockets.
        // const interval = setInterval(() => fetchCampaigns(true), 30000) 
        // return () => clearInterval(interval)
    }, ) // Empty dependency array ensures it runs only once on mount

    const filteredCampaigns = campaigns.filter(
        (campaign) =>
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.campaignId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.domainType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.creatorName.toLowerCase().includes(searchQuery.toLowerCase())
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
        switch (status?.toLowerCase()) {
            case "active":
            case "approved":
                return "bg-green-100 text-green-800"
            case "pending review":
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "rejected":
                return "bg-red-100 text-red-800"
            case "completed":
                return "bg-blue-100 text-blue-800"
            default:
                return "bg-gray-100 text-gray-800"
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

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* --- RESPONSIVE SIDEBAR --- */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
                <Sidebar />
                <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 text-white md:hidden">
                    <X className="h-6 w-6" />
                </button>
            </div>

            <div className="flex-1 flex flex-col overflow-auto">
                {/* --- MOBILE HEADER --- */}
                <header className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center">
                        <button onClick={() => setIsSidebarOpen(true)}>
                            <Menu className="h-6 w-6 text-gray-700" />
                        </button>
                        <h1 className="text-xl font-bold ml-4">Campaigns</h1>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="p-2 text-gray-500 hover:text-[#4B5842] transition-colors disabled:opacity-50"
                        title="Refresh campaigns"
                    >
                        <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
                    </button>
                </header>

                <main className="p-4 sm:p-6 lg:p-8">
                    {/* --- DESKTOP HEADER --- */}
                    <div className="hidden md:flex justify-between items-center mb-6">
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
                        </div>
                        <div className="relative w-full max-w-xs">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search campaigns..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                            />
                        </div>
                    </div>
                    
                    {/* --- MOBILE SEARCH BAR --- */}
                    <div className="relative mb-6 md:hidden">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                        />
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}
                    
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {filteredCampaigns.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-gray-500 mb-4">
                                    {loading ? "Loading..." : "No campaigns found matching your search."}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* --- MOBILE CARD VIEW --- */}
                                <div className="md:hidden">
                                    {currentCampaigns.map(campaign => (
                                        <div key={campaign.id} className="p-4 border-b last:border-b-0 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 pr-4">
                                                    <p className="font-bold text-sm text-gray-800">{campaign.name}</p>
                                                    <p className="text-xs text-gray-500">by {campaign.creatorName}</p>
                                                    <p className="text-xs text-gray-500 font-mono mt-1">{campaign.campaignId}</p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${getStatusColor(campaign.status)}`}>
                                                    {campaign.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">Goal: <span className="font-semibold text-gray-800">{campaign.fundingGoal}</span></span>
                                                <span className="text-gray-600">Backers: <span className="font-semibold text-gray-800">{campaign.totalBackers}</span></span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* --- DESKTOP TABLE VIEW --- */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                                                <th className="px-6 py-3 font-medium">Campaign Name</th>
                                                <th className="px-6 py-3 font-medium">Campaign ID</th>
                                                <th className="px-6 py-3 font-medium">Category</th>
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
                                                            <div className="text-xs text-gray-500">by {campaign.creatorName}</div>
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
                                                        <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(campaign.status)}`}>
                                                            {campaign.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {totalPages > 1 && (
                                    <div className="px-4 sm:px-6 py-3 flex items-center justify-between border-t">
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
                                            <span className="px-3 py-1 text-sm text-gray-600 hidden sm:inline">
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
                </main>
            </div>
        </div>
    )
}

export default CampaignsPage;
