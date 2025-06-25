// src/Pages/AdminSide/Feedbacks.jsx
"use client"

import { useState, useEffect } from "react" // Import useEffect
import Sidebar from "./SideBar"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import FeedbackDetailsModal from "./FeedbackPopUp"
import axios from 'axios'; // Import axios
import { io } from 'socket.io-client'; // Import socket.io-client

const FeedbacksPage = () => {
  const [allFeedbacks, setAllFeedbacks] = useState([]) // State to hold fetched feedbacks
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const itemsPerPage = 7

  // Function to fetch feedbacks from backend
  const fetchFeedbacks = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        throw new Error("Authentication token missing. Please log in as admin.");
      }

      const response = await axios.get("http://localhost:5000/api/admin/feedbacks", {
        headers: {
          Authorization: `Bearer ${token}` // Include token in headers
        }
      });
      console.log("Fetched feedbacks:", response.data);

      if (Array.isArray(response.data)) {
        // Transform backend data to match frontend table structure
        const transformedData = response.data.map(feedback => ({
          id: feedback._id,
          userId: feedback._id, // Use _id as userId for now; adjust if user ID is linked
          name: feedback.name,
          type: feedback.issue, // Use 'issue' for 'type'
          email: feedback.email, // Include email for modal
          remarks: feedback.subject, // Use 'subject' for 'remarks' in table
          message: feedback.message, // Full message for modal
          date: new Date(feedback.createdAt).toLocaleDateString(), // Format date
          time: new Date(feedback.createdAt).toLocaleTimeString(), // Format time
          status: feedback.status,
        }));
        setAllFeedbacks(transformedData);
      } else {
        console.warn("Feedbacks API did not return an array:", response.data);
        setAllFeedbacks([]);
      }
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      setError(err.message || "Failed to load feedbacks.");
      setAllFeedbacks([]); // Clear feedbacks on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks(); // Initial fetch when component mounts

    // --- Socket.IO Integration for Real-time Updates ---
    const socket = io('http://localhost:5000'); // Connect to your backend Socket.IO server

    socket.on('connect', () => {
      console.log('FeedbacksPage: Connected to Socket.IO server');
    });

    // Listen for the 'newFeedbackSubmitted' event
    socket.on('newFeedbackSubmitted', (newFeedback) => {
      console.log('FeedbacksPage: New feedback submitted in real-time!', newFeedback);
      // Add the new feedback to the beginning of the list
      setAllFeedbacks(prevFeedbacks => {
        // Ensure newFeedback matches the transformed structure
        const transformedNewFeedback = {
          id: newFeedback.id,
          userId: newFeedback.userId,
          name: newFeedback.name,
          type: newFeedback.type,
          email: newFeedback.email,
          remarks: newFeedback.remarks,
          message: newFeedback.message,
          date: new Date(newFeedback.date).toLocaleDateString(),
          time: new Date(newFeedback.date).toLocaleTimeString(),
          status: newFeedback.status,
        };
        return [transformedNewFeedback, ...prevFeedbacks];
      });
      setCurrentPage(1); // Reset to the first page to see the new feedback
    });

    socket.on('disconnect', () => {
      console.log('FeedbacksPage: Disconnected from Socket.IO server');
    });

    // Clean up socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount


 // const totalItems = allFeedbacks.length; // Use the dynamically fetched feedbacks
  // Filter feedbacks based on search query
  const filteredFeedbacks = allFeedbacks.filter(
    (feedback) =>
      feedback.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.remarks.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.email.toLowerCase().includes(searchQuery.toLowerCase()) // Allow search by email
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage) // Use filteredFeedbacks.length here
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredFeedbacks.length) // Use filteredFeedbacks.length here

  // Get current page feedbacks
  const currentFeedbacks = filteredFeedbacks.slice(startIndex, endIndex)

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page on search
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

  const handleSeeMore = (id) => {
    const feedback = allFeedbacks.find((feedback) => feedback.id === id)
    setSelectedFeedback(feedback)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedFeedback(null)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto p-8 flex justify-center items-center">
          <p>Loading feedbacks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto p-8 flex justify-center items-center text-red-600">
          <p>Error: {error}</p>
          <button
            onClick={fetchFeedbacks}
            className="ml-4 px-4 py-2 bg-[#4B5842] text-white rounded-md hover:bg-[#3A4433] transition-colors"
          >
            Reload
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
            <h1 className="text-2xl font-bold">Feedbacks</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
              />
            </div>
          </div>

          {/* Feedbacks Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                    <th className="px-6 py-3 font-medium">User ID</th>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Remarks</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFeedbacks.length > 0 ? (
                    currentFeedbacks.map((feedback) => (
                      <tr key={feedback.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">{feedback.userId}</td>
                        <td className="px-6 py-4 text-sm">{feedback.name}</td>
                        <td className="px-6 py-4 text-sm">{feedback.remarks}</td>
                        <td className="px-6 py-4 text-sm">{feedback.date}</td>
                        <td className="px-6 py-4 text-sm">{feedback.type}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleSeeMore(feedback.id)}
                            className="px-3 py-1 text-xs rounded-full text-white bg-green-600 hover:bg-green-700"
                          >
                            {feedback.status}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No feedbacks found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredFeedbacks.length > 0 && ( // Only show pagination if there are feedbacks
              <div className="px-6 py-3 flex items-center justify-between border-t">
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
          </div>
        </div>
      </div>

      {/* Feedback Details Modal */}
      {showModal && selectedFeedback && <FeedbackDetailsModal feedback={selectedFeedback} onClose={closeModal} />}
    </div>
  )
}

export default FeedbacksPage;