"use client"

import { useState } from "react"
import Sidebar from "./SideBar"
import { Eye, Edit, Trash } from "lucide-react"

const UserManagement = () => {
  // Sample data for campaign creators
  const [creators, setCreators] = useState([
    {
      id: "123",
      name: "Kareem Goda",
      campaignName: "Fitness App",
      fundingGoal: "8,000 PKR",
      status: "Active",
    },
    {
      id: "124",
      name: "Ali Hassan",
      campaignName: "AI Project",
      fundingGoal: "12,000 PKR",
      status: "Active",
    },
    {
      id: "125",
      name: "Sara Wilson",
      campaignName: "Green Energy",
      fundingGoal: "15,000 PKR",
      status: "Active",
    },
    {
      id: "126",
      name: "Michael Lee",
      campaignName: "Education App",
      fundingGoal: "7,500 PKR",
      status: "Active",
    },
    {
      id: "127",
      name: "Sophia Khan",
      campaignName: "Healthcare IoT",
      fundingGoal: "20,000 PKR",
      status: "Active",
    },
    {
      id: "128",
      name: "Ahmed Ali",
      campaignName: "Food App",
      fundingGoal: "5,000 PKR",
      status: "Active",
    },
  ])

  // Sample data for backers
  const [backers, setBackers] = useState([
    {
      id: "156",
      name: "Kareem Goda",
      campaignName: "Fitness App",
      backedAmount: "1,500 PKR",
      status: "Active",
    },
    {
      id: "157",
      name: "Ali Hassan",
      campaignName: "AI Project",
      backedAmount: "500 PKR",
      status: "Active",
    },
    {
      id: "158",
      name: "Sara Wilson",
      campaignName: "Green Energy",
      backedAmount: "2,000 PKR",
      status: "Active",
    },
    {
      id: "159",
      name: "Michael Lee",
      campaignName: "Education App",
      backedAmount: "1,000 PKR",
      status: "Active",
    },
    {
      id: "160",
      name: "Sophia Khan",
      campaignName: "Healthcare IoT",
      backedAmount: "3,000 PKR",
      status: "Active",
    },
    {
      id: "161",
      name: "Ahmed Ali",
      campaignName: "Food App",
      backedAmount: "500 PKR",
      status: "Active",
    },
  ])

  // Pagination state
  const [creatorsPage, setCreatorsPage] = useState(1)
  const [backersPage, setBackersPage] = useState(1)
  const itemsPerPage = 6

  const handleView = (id, type) => {
    console.log(`View ${type} with ID: ${id}`)
  }

  const handleEdit = (id, type) => {
    console.log(`Edit ${type} with ID: ${id}`)
  }

  const handleDelete = (id, type) => {
    console.log(`Delete ${type} with ID: ${id}`)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Campaign Creators Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-6">Campaign Creators</h1>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
                      <th className="px-6 py-3 font-medium">ID</th>
                      <th className="px-6 py-3 font-medium">Name</th>
                      <th className="px-6 py-3 font-medium">Campaign Name</th>
                      <th className="px-6 py-3 font-medium">Funding Goal</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creators.map((creator) => (
                      <tr key={creator.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">{creator.id}</td>
                        <td className="px-6 py-4 text-sm">{creator.name}</td>
                        <td className="px-6 py-4 text-sm">{creator.campaignName}</td>
                        <td className="px-6 py-4 text-sm">{creator.fundingGoal}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {creator.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleView(creator.id, "creator")}
                              className="p-1 rounded-full hover:bg-gray-100"
                              title="View"
                            >
                              <Eye className="h-4 w-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => handleEdit(creator.id, "creator")}
                              className="p-1 rounded-full hover:bg-gray-100"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => handleDelete(creator.id, "creator")}
                              className="p-1 rounded-full hover:bg-gray-100"
                              title="Delete"
                            >
                              <Trash className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-3 flex items-center justify-between border-t">
                <div className="text-sm text-gray-500">
                  Showing 1-{Math.min(itemsPerPage, creators.length)} of {creators.length}
                </div>
                <div className="flex space-x-1">
                  <button
                    className="px-3 py-1 rounded border text-sm"
                    onClick={() => setCreatorsPage(Math.max(1, creatorsPage - 1))}
                    disabled={creatorsPage === 1}
                  >
                    &lt;
                  </button>
                  <button
                    className="px-3 py-1 rounded border bg-gray-100 text-sm"
                    onClick={() => setCreatorsPage(creatorsPage + 1)}
                    disabled={creatorsPage * itemsPerPage >= creators.length}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Backers Section */}
          <div>
            <h1 className="text-2xl font-bold mb-6">Backers</h1>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
                      <th className="px-6 py-3 font-medium">ID</th>
                      <th className="px-6 py-3 font-medium">Name</th>
                      <th className="px-6 py-3 font-medium">Campaign Name</th>
                      <th className="px-6 py-3 font-medium">Backed Amount</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backers.map((backer) => (
                      <tr key={backer.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">{backer.id}</td>
                        <td className="px-6 py-4 text-sm">{backer.name}</td>
                        <td className="px-6 py-4 text-sm">{backer.campaignName}</td>
                        <td className="px-6 py-4 text-sm">{backer.backedAmount}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {backer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleView(backer.id, "backer")}
                              className="p-1 rounded-full hover:bg-gray-100"
                              title="View"
                            >
                              <Eye className="h-4 w-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => handleEdit(backer.id, "backer")}
                              className="p-1 rounded-full hover:bg-gray-100"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => handleDelete(backer.id, "backer")}
                              className="p-1 rounded-full hover:bg-gray-100"
                              title="Delete"
                            >
                              <Trash className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-3 flex items-center justify-between border-t">
                <div className="text-sm text-gray-500">
                  Showing 1-{Math.min(itemsPerPage, backers.length)} of {backers.length}
                </div>
                <div className="flex space-x-1">
                  <button
                    className="px-3 py-1 rounded border text-sm"
                    onClick={() => setBackersPage(Math.max(1, backersPage - 1))}
                    disabled={backersPage === 1}
                  >
                    &lt;
                  </button>
                  <button
                    className="px-3 py-1 rounded border bg-gray-100 text-sm"
                    onClick={() => setBackersPage(backersPage + 1)}
                    disabled={backersPage * itemsPerPage >= backers.length}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManagement;
