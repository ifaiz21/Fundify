"use client"

import { useState } from "react"
import Sidebar from "./SideBar"
import { Search, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"

const VerificationPage = () => {
  // Campaign statistics
  const campaignStats = {
    total: 350,
    approved: 297,
    rejected: 43,
    pending: 69,
  }

  // Sample verification data
  const allVerifications = [
    {
      id: 1,
      name: "John Francisco",
      identityCard: "xxxxx xxxxxxx x",
      documents: "Verified",
      submissionDate: "12.09.2019 - 12:53 PM",
      status: "Approved",
      action: "Like",
    },
    {
      id: 2,
      name: "Lord Sayi",
      identityCard: "xxxxx xxxxxxx x",
      documents: "Verified",
      submissionDate: "12.09.2019 - 12:53 PM",
      status: "Pending",
      action: "Wait",
    },
    {
      id: 3,
      name: "Baldwin",
      identityCard: "xxxxx xxxxxxx x",
      documents: "Not Verified",
      submissionDate: "12.09.2019 - 12:53 PM",
      status: "Rejected",
      action: "Discard",
    },
    // Additional entries for pagination
    {
      id: 4,
      name: "Maria Johnson",
      identityCard: "xxxxx xxxxxxx x",
      documents: "Verified",
      submissionDate: "11.09.2019 - 10:30 AM",
      status: "Approved",
      action: "Like",
    },
    {
      id: 5,
      name: "Ahmed Hassan",
      identityCard: "xxxxx xxxxxxx x",
      documents: "Verified",
      submissionDate: "11.09.2019 - 09:15 AM",
      status: "Pending",
      action: "Wait",
    },
    {
        id: 6,
        name: "Lord Sayi",
        identityCard: "xxxxx xxxxxxx x",
        documents: "Verified",
        submissionDate: "12.09.2019 - 12:53 PM",
        status: "Pending",
        action: "Wait",
      },
      {
        id: 7,
        name: "Lord Sayi",
        identityCard: "xxxxx xxxxxxx x",
        documents: "Verified",
        submissionDate: "12.09.2019 - 12:53 PM",
        status: "Pending",
        action: "Wait",
      },
      {
        id: 8,
        name: "Lord Sayi",
        identityCard: "xxxxx xxxxxxx x",
        documents: "Verified",
        submissionDate: "12.09.2019 - 12:53 PM",
        status: "Pending",
        action: "Wait",
      },
      {
        id: 9,
        name: "Maria Johnson",
        identityCard: "xxxxx xxxxxxx x",
        documents: "Verified",
        submissionDate: "11.09.2019 - 10:30 AM",
        status: "Approved",
        action: "Like",
      },
  ]

  // State for search, pagination, and month filter
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMonth, setSelectedMonth] = useState("October")
  const itemsPerPage = 8
 

  // Filter verifications based on search query
  const filteredVerifications = allVerifications.filter(
    (verification) =>
      verification.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      verification.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate pagination
  const totalItems = filteredVerifications.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

  // Get current page verifications (in a real app, this would be fetched from backend)
  const currentVerifications = filteredVerifications.slice(startIndex, endIndex);

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

  const handleMonthChange = (month) => {
    setSelectedMonth(month)
    // In a real app, you would fetch data for the selected month
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-500"
      case "Pending":
        return "bg-yellow-500"
      case "Rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getActionClass = (action) => {
    switch (action) {
      case "Like":
        return "bg-green-500"
      case "Wait":
        return "bg-blue-500"
      case "Discard":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Available months for dropdown
  const months = [
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Verification</h1>
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

          {/* Campaign Statistics with Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <div className="flex justify-center items-center">
                <div className="relative w-64 h-64">
                  {/* This is a simplified pie chart representation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      {/* Blue segment (Approved) */}
                      <div
                        className="absolute w-48 h-48 rounded-full bg-blue-500"
                        style={{ clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)" }}
                      ></div>
                      {/* Yellow segment (Pending) */}
                      <div
                        className="absolute w-48 h-48 rounded-full bg-yellow-400"
                        style={{ clipPath: "polygon(50% 50%, 0% 0%, 50% 0%)" }}
                      ></div>
                      {/* Green segment (Rejected) */}
                      <div
                        className="absolute w-48 h-48 rounded-full bg-red-500"
                        style={{ clipPath: "polygon(50% 50%, 0% 0%, 0% 100%, 50% 100%)" }}
                      ></div>
                      {/* Center circle */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center">
                        <span className="font-semibold">Campaigns</span>
                      </div>
                    </div>
                  </div>

                  {/* Labels */}
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

          {/* Verification Status Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Verification Status</h2>
              <div className="relative">
                <div className="flex items-center border rounded-md px-3 py-2 cursor-pointer group">
                  <span>{selectedMonth}</span>
                  <ChevronDown className="ml-2 h-4 w-4" />

                  {/* Dropdown menu */}
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
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Identity Card</th>
                    <th className="px-6 py-3 font-medium">Documents</th>
                    <th className="px-6 py-3 font-medium">Submission Date</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVerifications.map((verification, index) => (
                    <tr key={verification.id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">{verification.name}</td>
                      <td className="px-6 py-4 text-sm">{verification.identityCard}</td>
                      <td className="px-6 py-4 text-sm">{verification.documents}</td>
                      <td className="px-6 py-4 text-sm">{verification.submissionDate}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full text-white ${getStatusClass(verification.status)}`}
                        >
                          {verification.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full text-white ${getActionClass(verification.action)}`}
                        >
                          {verification.action}
                        </span>
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
    </div>
  )
}

export default VerificationPage;
