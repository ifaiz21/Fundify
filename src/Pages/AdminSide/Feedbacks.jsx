"use client"

import { useState } from "react"
import Sidebar from "./SideBar"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import FeedbackDetailsModal from "./FeedbackPopUp"

const FeedbacksPage = () => {
  // Sample feedback data
  const allFeedbacks = [
    {
        id: 1,
        userId: "U67890",
        name: "Sara",
        type: "Suggestion",
        email: "sara@example.com",
        remarks: "Add more filters on the explore page.",
        date: "2024-11-25",
        time: "11:20",
        status: "See More",
      },
      {
        id: 2,
        userId: "U12345",
        name: "Ali",
        type: "Complaint",
        email: "ali@example.com",
        remarks: "The site is slow and buggy.",
        date: "2024-11-24",
        time: "23:45",
        status: "See More",
      },
      {
        id: 3,
        userId: "U67890",
        name: "Sara",
        type: "Suggestion",
        email: "sara@example.com",
        remarks: "Add more filters on the explore page.",
        date: "2024-11-25",
        time: "11:20",
        status: "See More",
      },
      {
        id: 4,
        userId: "U12345",
        name: "Ali",
        type: "Complaint",
        email: "ali@example.com",
        remarks: "The site is slow and buggy.",
        date: "2024-11-24",
        time: "23:45",
        status: "See More",
      },
      {
        id: 5,
        userId: "U67890",
        name: "Sara",
        type: "Suggestion",
        email: "sara@example.com",
        remarks: "Add more filters on the explore page.",
        date: "2024-11-25",
        time: "11:20",
        status: "See More",
      },
      {
        id: 6,
        userId: "U12345",
        name: "Ali",
        type: "Complaint",
        email: "ali@example.com",
        remarks: "The site is slow and buggy.",
        date: "2024-11-24",
        time: "23:45",
        status: "See More",
      },
      {
        id: 7,
        userId: "U67890",
        name: "Sara",
        type: "Suggestion",
        email: "sara@example.com",
        remarks: "Add more filters on the explore page.",
        date: "2024-11-25",
        time: "11:20",
        status: "See More",
      },
      {
        id: 8,
        userId: "U12345",
        name: "Ali",
        type: "Complaint",
        email: "ali@example.com",
        remarks: "The site is slow and buggy.",
        date: "2024-11-24",
        time: "23:45",
        status: "See More",
      },
  ]

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const itemsPerPage = 7
  const totalItems = allFeedbacks.length

  // Filter feedbacks based on search query
  const filteredFeedbacks = allFeedbacks.filter(
    (feedback) =>
      feedback.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.remarks.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

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
                  {currentFeedbacks.map((feedback, index) => (
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
                  ))}
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

      {/* Feedback Details Modal */}
      {showModal && selectedFeedback && <FeedbackDetailsModal feedback={selectedFeedback} onClose={closeModal} />}
    </div>
  )
}

export default FeedbacksPage;
