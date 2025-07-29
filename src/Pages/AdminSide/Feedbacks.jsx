// src/Pages/AdminSide/Feedbacks.jsx
"use client"

import { useState, useEffect } from "react"
import Sidebar from "./SideBar"
import { Search, ChevronLeft, ChevronRight, Menu, X, Eye } from "lucide-react"
import FeedbackDetailsModal from "./FeedbackPopUp" // Assuming this modal component exists and is responsive
import axios from 'axios';
import { io } from 'socket.io-client';

const FeedbacksPage = () => {
    const [allFeedbacks, setAllFeedbacks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [selectedFeedback, setSelectedFeedback] = useState(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar
    const itemsPerPage = 8;

    const fetchFeedbacks = async () => {
        // Don't set loading to true if it's just a background refresh
        if (!allFeedbacks.length) setLoading(true); 
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Authentication token missing.");
            }

            const response = await axios.get("https://server-fundify.up.railway.app/api/admin/feedbacks", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (Array.isArray(response.data)) {
                const transformedData = response.data.map(feedback => ({
                    id: feedback._id,
                    userId: feedback.user?._id || feedback._id, // Prefer populated user ID
                    name: feedback.user?.name || feedback.name, // Prefer populated user name
                    type: feedback.issue,
                    email: feedback.user?.email || feedback.email,
                    remarks: feedback.subject,
                    message: feedback.message,
                    date: new Date(feedback.createdAt).toLocaleDateString(),
                    status: feedback.status,
                })).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by most recent
                setAllFeedbacks(transformedData);
            } else {
                throw new Error("Invalid data format received.");
            }
        } catch (err) {
            console.error("Error fetching feedbacks:", err);
            setError(err.message || "Failed to load feedbacks.");
            setAllFeedbacks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();

        const socket = io('https://server-fundify.up.railway.app/');
        socket.on('connect', () => console.log('FeedbacksPage: Connected to Socket.IO'));
        
        // Re-fetch the entire list on new feedback for data consistency
        socket.on('newFeedbackSubmitted', () => {
            console.log('New feedback received, refreshing list...');
            fetchFeedbacks();
        });

        socket.on('disconnect', () => console.log('FeedbacksPage: Disconnected from Socket.IO'));

        return () => socket.disconnect();
    }, );

    const filteredFeedbacks = allFeedbacks.filter(
        (feedback) =>
        feedback.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.remarks.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, filteredFeedbacks.length)
    const currentFeedbacks = filteredFeedbacks.slice(startIndex, endIndex)

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

    const handleViewDetails = (id) => {
        const feedback = allFeedbacks.find((f) => f.id === id)
        setSelectedFeedback(feedback)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedFeedback(null)
    }
    
    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case "new": return "bg-blue-100 text-blue-800";
            case "in progress": return "bg-yellow-100 text-yellow-800";
            case "resolved": return "bg-green-100 text-green-800";
            default: return "bg-gray-100 text-gray-800";
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center"><p>Loading feedbacks...</p></div>
            </div>
        );
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
                        <h1 className="text-xl font-bold ml-4">Feedbacks</h1>
                    </div>
                </header>

                <main className="p-4 sm:p-6 lg:p-8">
                    {/* --- DESKTOP HEADER & SEARCH --- */}
                    <div className="hidden md:flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">User Feedbacks</h1>
                        <div className="relative w-full max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search feedbacks..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                            />
                        </div>
                    </div>
                    
                    {/* --- MOBILE SEARCH --- */}
                    <div className="relative mb-6 md:hidden">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2 rounded-full bg-white border"
                        />
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {filteredFeedbacks.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No feedbacks found.</div>
                        ) : (
                            <>
                                {/* --- MOBILE CARD VIEW --- */}
                                <div className="md:hidden">
                                    {currentFeedbacks.map(feedback => (
                                        <div key={feedback.id} className="p-4 border-b last:border-b-0 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-sm text-gray-800">{feedback.remarks}</p>
                                                    <p className="text-xs text-gray-600">from {feedback.name}</p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${getStatusClass(feedback.status)}`}>
                                                    {feedback.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-xs text-gray-500">{feedback.date}</p>
                                                <button
                                                    onClick={() => handleViewDetails(feedback.id)}
                                                    className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                                                >
                                                    <Eye size={14} /> View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* --- DESKTOP TABLE VIEW --- */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                                                <th className="px-6 py-3 font-medium">Subject / Remarks</th>
                                                <th className="px-6 py-3 font-medium">User</th>
                                                <th className="px-6 py-3 font-medium">Date</th>
                                                <th className="px-6 py-3 font-medium">Type</th>
                                                <th className="px-6 py-3 font-medium">Status</th>
                                                <th className="px-6 py-3 font-medium">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentFeedbacks.map((feedback) => (
                                                <tr key={feedback.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{feedback.remarks}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{feedback.name}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{feedback.date}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{feedback.type}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(feedback.status)}`}>
                                                            {feedback.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => handleViewDetails(feedback.id)}
                                                            className="p-1.5 rounded-full hover:bg-gray-200"
                                                            title="View Details"
                                                        >
                                                            <Eye className="h-4 w-4 text-gray-600" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {totalPages > 1 && (
                                    <div className="px-4 sm:px-6 py-3 flex items-center justify-between border-t">
                                        <div className="text-sm text-gray-500">
                                            Showing {startIndex + 1}-{endIndex} of {filteredFeedbacks.length}
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
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>

            {/* Feedback Details Modal */}
            {showModal && selectedFeedback && <FeedbackDetailsModal feedback={selectedFeedback} onClose={closeModal} />}
        </div>
    )
}

export default FeedbacksPage;
