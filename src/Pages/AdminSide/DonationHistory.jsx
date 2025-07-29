// src/Pages/AdminSide/DonationHistory.jsx
"use client"

import { useState, useEffect } from "react"
import Sidebar from "./SideBar" // Assuming this is the correct path to your responsive sidebar
import { Search, ChevronLeft, ChevronRight, Menu, X, RefreshCw } from "lucide-react"
import axios from "axios"

const DonationHistory = () => {
    const [donations, setDonations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar

    const fetchDonations = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token');

            if (!token) {
                setError("Authentication required. Please log in.");
                setLoading(false);
                return;
            }

            // Using the admin endpoint for donations is better as it usually contains more details
            const response = await axios.get("https://server-fundify.up.railway.app/api/admin/donations", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            
            // Ensure the response is an array
            if (Array.isArray(response.data)) {
                setDonations(response.data);
            } else {
                // Handle cases where the API returns an object with a donations array
                if (response.data && Array.isArray(response.data.donations)) {
                     setDonations(response.data.donations);
                } else {
                    throw new Error("Invalid data format received from server.");
                }
            }
            setError(null)
        } catch (err) {
            console.error("Error fetching donation history:", err)
            setError("Failed to load donation history. Please try again later.")
            setDonations([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDonations()
    }, []) // Runs only once on component mount

    // Improved search filter to avoid errors with nested objects
    const filteredDonations = donations.filter((donation) => {
        const searchTerm = searchQuery.toLowerCase();
        const userName = donation.userId?.name?.toLowerCase() || (donation.honorOf || 'anonymous').toLowerCase();
        const campaignTitle = donation.campaignId?.title?.toLowerCase() || '';
        const transactionId = (donation.transactionId || donation._id)?.toLowerCase();
        const status = donation.status?.toLowerCase();
        const amount = String(donation.amount);

        return (
            userName.includes(searchTerm) ||
            campaignTitle.includes(searchTerm) ||
            transactionId.includes(searchTerm) ||
            status.includes(searchTerm) ||
            amount.includes(searchTerm)
        );
    });

    const itemsPerPage = 8;
    const totalItems = filteredDonations.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentDonations = filteredDonations.slice(startIndex, endIndex);

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "bg-green-100 text-green-800"
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "failed":
                return "bg-red-100 text-red-800"
            case "refunded":
                return "bg-blue-100 text-blue-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    }
    
    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    }


    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#4B5842]" />
                        <p className="text-gray-600">Loading donation history...</p>
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
                        <h1 className="text-xl font-bold ml-4">Donations</h1>
                    </div>
                </header>
                
                <main className="p-4 sm:p-6 lg:p-8">
                    {/* --- DESKTOP HEADER & SEARCH --- */}
                    <div className="hidden md:flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Donation History</h1>
                        <div className="relative w-full max-w-xs">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search donations..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                            />
                        </div>
                    </div>
                    
                    {/* --- MOBILE SEARCH --- */}
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
                        {filteredDonations.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <p>No donations found.</p>
                            </div>
                        ) : (
                            <>
                                {/* --- MOBILE CARD VIEW --- */}
                                <div className="md:hidden">
                                    {currentDonations.map(donation => (
                                        <div key={donation._id} className="p-4 border-b last:border-b-0 space-y-3">
                                             <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-mono text-xs text-gray-500">{donation.transactionId || donation._id}</p>
                                                    <p className="font-semibold text-sm text-gray-800 mt-1">
                                                        {donation.campaignId?.title || "General Donation"}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        by {donation.userId?.name || donation.honorOf || "Anonymous"}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${getStatusClass(donation.status)}`}>
                                                    {donation.status}
                                                </span>
                                            </div>
                                            <div className="text-right font-bold text-gray-800">
                                                PKR {donation.amount.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* --- DESKTOP TABLE VIEW --- */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                                                <th className="px-6 py-3 font-medium">Transaction ID</th>
                                                <th className="px-6 py-3 font-medium">Campaign</th>
                                                <th className="px-6 py-3 font-medium">User</th>
                                                <th className="px-6 py-3 font-medium">Amount</th>
                                                <th className="px-6 py-3 font-medium">Date</th>
                                                <th className="px-6 py-3 font-medium">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentDonations.map((donation) => (
                                                <tr key={donation._id} className="border-b last:border-b-0 hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm font-mono">{donation.transactionId || donation._id}</td>
                                                    <td className="px-6 py-4 text-sm">{donation.campaignId?.title || "General Donation"}</td>
                                                    <td className="px-6 py-4 text-sm">{donation.userId?.name || donation.honorOf || "Anonymous"}</td>
                                                    <td className="px-6 py-4 text-sm font-semibold">PKR {donation.amount.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(donation.createdAt).toLocaleDateString()}</td>
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

export default DonationHistory;
