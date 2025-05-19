"use client"

import { useState } from "react"
import Sidebar from "./SideBar"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

const CampaignsPage = () => {
  // Sample campaign data
  const allCampaigns = [
    {
      id: 1,
      name: "Neptune Play",
      campaignId: "#984761833",
      domainType: "Business",
      fundingGoal: "123,000 PKR",
      totalBackers: 2,
      status: "Active",
    },
    {
      id: 2,
      name: "Richie Club",
      campaignId: "#984761833",
      domainType: "Startup",
      fundingGoal: "108,000 PKR",
      totalBackers: 4,
      status: "Active",
    },
    {
      id: 3,
      name: "Neptune Play",
      campaignId: "#984761833",
      domainType: "NGO",
      fundingGoal: "476,000 PKR",
      totalBackers: 3,
      status: "Unactive",
    },
    {
      id: 4,
      name: "Richie Club",
      campaignId: "#984761833",
      domainType: "Startup",
      fundingGoal: "201,000 PKR",
      totalBackers: 2,
      status: "Active",
    },
    {
      id: 5,
      name: "Neptune Play",
      campaignId: "#984761833",
      domainType: "Business",
      fundingGoal: "387,000 PKR",
      totalBackers: 2,
      status: "Active",
    },
    {
      id: 6,
      name: "Richie Club",
      campaignId: "#984761833",
      domainType: "Startup",
      fundingGoal: "247,000 PKR",
      totalBackers: 1,
      status: "Active",
    },
    {
      id: 7,
      name: "Neptune Play",
      campaignId: "#984761833",
      domainType: "NGO",
      fundingGoal: "98,000 PKR",
      totalBackers: 2,
      status: "Active",
    },
    {
      id: 8,
      name: "Richie Club",
      campaignId: "#984761833",
      domainType: "Startup",
      fundingGoal: "156,000 PKR",
      totalBackers: 3,
      status: "Active",
    },
    {
      id: 9,
      name: "Neptune Play",
      campaignId: "#984761833",
      domainType: "Business",
      fundingGoal: "210,000 PKR",
      totalBackers: 5,
      status: "Unactive",
    },
    {
      id: 10,
      name: "Richie Club",
      campaignId: "#984761833",
      domainType: "NGO",
      fundingGoal: "175,000 PKR",
      totalBackers: 2,
      status: "Active",
    },
    // Additional campaigns for pagination
    {
      id: 11,
      name: "Neptune Play",
      campaignId: "#984761833",
      domainType: "Business",
      fundingGoal: "145,000 PKR",
      totalBackers: 3,
      status: "Active",
    },
    {
      id: 12,
      name: "Richie Club",
      campaignId: "#984761833",
      domainType: "Startup",
      fundingGoal: "198,000 PKR",
      totalBackers: 4,
      status: "Active",
    },
  ]

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  //const totalItems = 10 // Total number of campaigns

  // Filter campaigns based on search query
  const filteredCampaigns = allCampaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.campaignId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.domainType.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate pagination
  const totalItems = filteredCampaigns.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

  // Get current page campaigns (in a real app, this would be fetched from backend)
  const currentCampaigns = filteredCampaigns.slice(startIndex,endIndex)

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

  return (
    <div className="flex h-screen bg-gray-50">
    <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Campaigns</h1>
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

          {/* Campaigns Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                    <th className="px-6 py-3 font-medium">Campaign Name</th>
                    <th className="px-6 py-3 font-medium">Campaign ID</th>
                    <th className="px-6 py-3 font-medium">Domain/Type</th>
                    <th className="px-6 py-3 font-medium">Funding Goal</th>
                    <th className="px-6 py-3 font-medium">Total Backers</th>
                    <th className="px-6 py-3 font-medium">Campaign Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">{campaign.name}</td>
                      <td className="px-6 py-4 text-sm">{campaign.campaignId}</td>
                      <td className="px-6 py-4 text-sm">{campaign.domainType}</td>
                      <td className="px-6 py-4 text-sm">{campaign.fundingGoal}</td>
                      <td className="px-6 py-4 text-sm">{campaign.totalBackers}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full text-white ${
                            campaign.status === "Active" ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {campaign.status}
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

export default CampaignsPage;
