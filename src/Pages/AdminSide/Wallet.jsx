"use client"

import { useState, useEffect } from "react"
import Sidebar from "./SideBar"
import { Search, X } from "lucide-react"

const WalletPage = () => {
  // Wallet statistics
  const walletStats = {
    totalBalance: "678,756 PKR",
    totalBackers: "586",
    availableFunds: "428,756 PKR",
    totalWithdrawals: "250,000 PKR",
    pendingPayouts: "50,000 PKR",
    campaignsFunded: "15",
    campaignsFailed: "3",
  }

  // Sample transaction data
  const allTransactions = [
    {
      id: 1,
      transactionId: "#9328792374",
      campaignId: "#125",
      userId: "U78945",
      campaignFullId: "#9470812471",
      type: "Withdraw",
      time: "6:45 AM",
      date: "24-11-2024",
      fullTime: "23:65",
      description: "Campaign Funds Withdrawal",
      amount: "10,000 Pkr",
      status: "Complete",
    },
    {
      id: 2,
      transactionId: "#9328792375",
      campaignId: "#345",
      userId: "U12345",
      campaignFullId: "#9470812472",
      type: "Top-up",
      time: "6:44 AM",
      date: "24-11-2024",
      fullTime: "23:44",
      description: "Pledged to campaign",
      amount: "10,000 Pkr",
      status: "In-progress",
    },
    {
      id: 3,
      transactionId: "#9328792376",
      campaignId: "#125",
      userId: "U23456",
      campaignFullId: "#9470812473",
      type: "Top-up",
      time: "6:43 AM",
      date: "24-11-2024",
      fullTime: "23:43",
      description: "Pledged to campaign",
      amount: "10,000 Pkr",
      status: "In-progress",
    },
    {
      id: 4,
      transactionId: "#9328792377",
      campaignId: "#160",
      userId: "U34567",
      campaignFullId: "#9470812474",
      type: "Refund",
      time: "6:42 AM",
      date: "24-11-2024",
      fullTime: "23:42",
      description: "Goal didn't reach + campaign",
      amount: "10,000 Pkr",
      status: "Cancelled",
    },
    {
      id: 5,
      transactionId: "#9328792378",
      campaignId: "#11",
      userId: "U45678",
      campaignFullId: "#9470812475",
      type: "Refund",
      time: "6:40 AM",
      date: "24-11-2024",
      fullTime: "23:40",
      description: "Goal didn't reach + campaign",
      amount: "10,000 Pkr",
      status: "Failed",
    },
    {
      id: 6,
      transactionId: "#9328792379",
      campaignId: "#34",
      userId: "U56789",
      campaignFullId: "#9470812476",
      type: "Top-up",
      time: "6:45 AM",
      date: "24-11-2024",
      fullTime: "23:45",
      description: "Pledged to campaign",
      amount: "10,000 Pkr",
      status: "In-progress",
    },
    {
      id: 7,
      transactionId: "#9328792380",
      campaignId: "#26",
      userId: "U67890",
      campaignFullId: "#9470812477",
      type: "Withdraw",
      time: "6:45 AM",
      date: "24-11-2024",
      fullTime: "23:45",
      description: "Campaign Funds Withdrawal",
      amount: "10,000 Pkr",
      status: "Complete",
    },
  ]

  // State for transactions and filters
  const [transactions, setTransactions] = useState(allTransactions)
  const [timeFilter, setTimeFilter] = useState("today")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Filter transactions based on time period and search query
  useEffect(() => {
    let filtered = [...allTransactions]

    // Apply time filter (in a real app, you would filter based on actual dates)
    if (timeFilter === "monthly") {
      // Filter for monthly transactions
      filtered = allTransactions.filter((_, index) => index < 5) // Just for demo
    } else if (timeFilter === "weekly") {
      // Filter for weekly transactions
      filtered = allTransactions.filter((_, index) => index < 6) // Just for demo
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.campaignId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setTransactions(filtered)
  }, [timeFilter, searchQuery])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Complete":
        return "bg-green-100 text-green-800"
      case "In-progress":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      case "Failed":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedTransaction(null)
  }

  // Close modal when clicking outside
  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Wallet</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4B5842] focus:border-transparent"
              />
            </div>
          </div>

          {/* Wallet Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Left Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Total Balance</p>
                <h3 className="text-3xl font-bold">{walletStats.totalBalance}</h3>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Total Backers</p>
                <h3 className="text-3xl font-bold">{walletStats.totalBackers}</h3>
              </div>
              <button className="bg-[#4B5842] text-white px-4 py-2 rounded-md hover:bg-[#3A4433] transition-colors">
                Transfer Funds
              </button>
            </div>

            {/* Right Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Available Funds:</p>
                  <p className="font-medium">{walletStats.availableFunds}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Total Withdrawals:</p>
                  <p className="font-medium">{walletStats.totalWithdrawals}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Pending Payouts:</p>
                  <p className="font-medium">{walletStats.pendingPayouts}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Campaigns Funded:</p>
                  <p className="font-medium">{walletStats.campaignsFunded}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Campaigns Failed:</p>
                  <p className="font-medium">{walletStats.campaignsFailed}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Activity */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Wallet Activity</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTimeFilter("monthly")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    timeFilter === "monthly" ? "bg-[#4B5842] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setTimeFilter("weekly")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    timeFilter === "weekly" ? "bg-[#4B5842] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeFilter("today")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    timeFilter === "today" ? "bg-[#4B5842] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Today
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 bg-gray-100">
                    <th className="px-6 py-3 font-medium">Transaction #</th>
                    <th className="px-6 py-3 font-medium">Campaign ID</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Time</th>
                    <th className="px-6 py-3 font-medium">Description</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleTransactionClick(transaction)}
                    >
                      <td className="px-6 py-4 text-sm">{transaction.id}</td>
                      <td className="px-6 py-4 text-sm">{transaction.campaignId}</td>
                      <td className="px-6 py-4 text-sm">{transaction.type}</td>
                      <td className="px-6 py-4 text-sm">{transaction.time}</td>
                      <td className="px-6 py-4 text-sm">{transaction.description}</td>
                      <td className="px-6 py-4 text-sm">{transaction.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {showModal && selectedTransaction && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={handleModalBackdropClick}
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Transaction Details</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                  <p className="font-medium">{selectedTransaction.transactionId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date / Time</p>
                  <p className="font-medium">
                    {selectedTransaction.date} / {selectedTransaction.fullTime}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">From</p>
                  <div className="flex items-center">
                    <p className="font-medium mr-2">User ID</p>
                    <input type="checkbox" className="h-4 w-4" checked readOnly />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">To</p>
                  <div className="flex items-center">
                    <p className="font-medium mr-2">Campaign</p>
                    <input type="checkbox" className="h-4 w-4" checked readOnly />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Amount</p>
                  <p className="font-medium">{selectedTransaction.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Campaign ID</p>
                  <p className="font-medium">{selectedTransaction.campaignFullId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Type</p>
                  <p className="font-medium">{selectedTransaction.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <div className="mt-1">
                    <span className={`px-3 py-1 text-xs rounded-full ${getStatusClass(selectedTransaction.status)}`}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WalletPage;
