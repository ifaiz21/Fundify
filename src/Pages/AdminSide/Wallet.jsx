"use client"

import React, { useState, useEffect, useCallback } from "react"
import Sidebar from "./SideBar"
import { X, Menu, ArrowDownLeft, ArrowUpRight } from "lucide-react"
//import axios from "axios"

const WalletPage = () => {
    // State for wallet data, loading, and errors
    const [walletStats, setWalletStats] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for UI controls
    const [timeFilter, setTimeFilter] = useState("today");
    const [searchQuery, ] = useState("");
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Fetch wallet data from the backend
    const fetchWalletData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Authentication required.");

            // Using mock data as the endpoint doesn't exist yet
            setWalletStats({
                totalBalance: 678756,
                totalBackers: 586,
                availableFunds: 428756,
                totalWithdrawals: 250000,
                pendingPayouts: 50000,
                campaignsFunded: 15,
                campaignsFailed: 3,
            });
            setTransactions([
                { id: 1, transactionId: "#9328792374", campaignId: "#125", userId: "U78945", type: "Withdraw", createdAt: new Date().toISOString(), description: "Campaign Funds Withdrawal", amount: 10000, status: "Complete" },
                { id: 2, transactionId: "#9328792375", campaignId: "#345", userId: "U12345", type: "Top-up", createdAt: new Date().toISOString(), description: "Pledged to campaign", amount: 5000, status: "In-progress" },
                { id: 3, transactionId: "#9328792376", campaignId: "#160", userId: "U34567", type: "Refund", createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), description: "Goal not met refund", amount: 2500, status: "Cancelled" },
                { id: 4, transactionId: "#9328792377", campaignId: "#11", userId: "U45678", type: "Fee", createdAt: new Date(Date.now() - 86400000 * 8).toISOString(), description: "Platform fee", amount: 500, status: "Complete" },
                { id: 5, transactionId: "#9328792378", campaignId: "#34", userId: "U56789", type: "Top-up", createdAt: new Date(Date.now() - 86400000 * 15).toISOString(), description: "Pledged to campaign", amount: 20000, status: "Complete" },
            ]);

        } catch (err) {
            setError(err.message || "Failed to load wallet data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWalletData();
    }, [fetchWalletData]);

    const filteredTransactions = transactions.filter(transaction => {
        const query = searchQuery.toLowerCase();
        return (
            transaction.transactionId.toLowerCase().includes(query) ||
            transaction.campaignId.toLowerCase().includes(query) ||
            transaction.description.toLowerCase().includes(query) ||
            transaction.type.toLowerCase().includes(query)
        );
    });

    const getStatusClass = (status) => {
        switch (status) {
            case "Complete": return "bg-green-100 text-green-800";
            case "In-progress": return "bg-yellow-100 text-yellow-800";
            case "Cancelled": return "bg-gray-100 text-gray-800";
            case "Failed": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const handleTransactionClick = (transaction) => {
        setSelectedTransaction(transaction);
        setShowModal(true);
    };

    if (loading) return <div className="flex h-screen bg-gray-50"><Sidebar /><div className="flex-1 flex items-center justify-center"><p>Loading Wallet...</p></div></div>;
    if (error) return <div className="flex h-screen bg-gray-50"><Sidebar /><div className="flex-1 flex items-center justify-center text-red-500"><p>{error}</p></div></div>;

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* --- RESPONSIVE SIDEBAR --- */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform md:relative md:translate-x-0`}>
                <Sidebar />
                <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 text-white md:hidden"><X size={24} /></button>
            </div>

            {/* --- BACKDROP FOR MOBILE --- */}
            {/* This overlay will cover the main content when the sidebar is open on mobile, allowing users to click outside to close it. */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                ></div>
            )}

            <div className="flex-1 flex flex-col overflow-auto">
                {/* The z-index of header is lowered to be below the backdrop */}
                <header className="md:hidden bg-white shadow-sm p-4 flex items-center sticky top-0 z-20">
                    <button onClick={() => setIsSidebarOpen(true)}><Menu /></button>
                    <h1 className="text-xl font-bold ml-4">Wallet</h1>
                </header>
                
                <main className="p-4 sm:p-6 lg:p-8">
                    <div className="hidden md:flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Wallet</h1>
                    </div>
                    
                    {/* Wallet Stats Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                            <div>
                                <p className="text-sm text-gray-500">Total Balance</p>
                                <h3 className="text-3xl font-bold">{walletStats.totalBalance?.toLocaleString()} PKR</h3>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Backers</p>
                                <h3 className="text-3xl font-bold">{walletStats.totalBackers?.toLocaleString()}</h3>
                            </div>
                            <button className="bg-[#4B5842] text-white px-4 py-2 rounded-md hover:bg-[#3A4433] transition-colors w-full sm:w-auto">Transfer Funds</button>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6 space-y-3 text-sm">
                            <div className="flex justify-between items-center"><p className="text-gray-500">Available Funds:</p><p className="font-medium">{walletStats.availableFunds?.toLocaleString()} PKR</p></div>
                            <div className="flex justify-between items-center"><p className="text-gray-500">Total Withdrawals:</p><p className="font-medium">{walletStats.totalWithdrawals?.toLocaleString()} PKR</p></div>
                            <div className="flex justify-between items-center"><p className="text-gray-500">Pending Payouts:</p><p className="font-medium">{walletStats.pendingPayouts?.toLocaleString()} PKR</p></div>
                            <hr/>
                            <div className="flex justify-between items-center"><p className="text-gray-500">Campaigns Funded:</p><p className="font-medium">{walletStats.campaignsFunded}</p></div>
                            <div className="flex justify-between items-center"><p className="text-gray-500">Campaigns Failed:</p><p className="font-medium">{walletStats.campaignsFailed}</p></div>
                        </div>
                    </div>

                    {/* Wallet Activity */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b gap-4">
                            <h2 className="text-lg font-semibold">Wallet Activity</h2>
                            <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
                                {["monthly", "weekly", "today"].map(filter => (
                                    <button key={filter} onClick={() => setTimeFilter(filter)} className={`px-3 py-1 text-sm rounded-md capitalize ${timeFilter === filter ? "bg-white shadow-sm text-[#4B5842]" : "text-gray-600"}`}>
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden">
                            {filteredTransactions.length > 0 ? filteredTransactions.map(tx => (
                                <div key={tx.id} onClick={() => handleTransactionClick(tx)} className="p-4 border-b last:border-b-0 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-800">{tx.description}</p>
                                            <p className="text-xs text-gray-500">{tx.transactionId} to {tx.campaignId}</p>
                                        </div>
                                        <p className="font-bold text-gray-800">{tx.amount.toLocaleString()} PKR</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusClass(tx.status)}`}>{tx.status}</span>
                                        <span className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            )) : <p className="p-4 text-center text-gray-500">No transactions found.</p>}
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50"><tr className="text-left text-xs text-gray-500"><th className="px-6 py-3 font-medium">Transaction</th><th className="px-6 py-3 font-medium">Date</th><th className="px-6 py-3 font-medium">Amount</th><th className="px-6 py-3 font-medium">Status</th></tr></thead>
                                <tbody>
                                    {filteredTransactions.map(tx => (
                                        <tr key={tx.id} onClick={() => handleTransactionClick(tx)} className="border-b hover:bg-gray-50 cursor-pointer">
                                            <td className="px-6 py-4"><div className="flex items-center gap-3"><div className={`p-1.5 rounded-full ${tx.type === 'Withdraw' || tx.type === 'Refund' || tx.type === 'Fee' ? 'bg-red-100' : 'bg-green-100'}`}>{tx.type === 'Withdraw' || tx.type === 'Refund' || tx.type === 'Fee' ? <ArrowUpRight size={16} className="text-red-600"/> : <ArrowDownLeft size={16} className="text-green-600"/>}</div><div><p className="font-medium">{tx.description}</p><p className="text-sm text-gray-500">{tx.transactionId}</p></div></div></td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-sm font-semibold">{tx.amount.toLocaleString()} PKR</td>
                                            <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(tx.status)}`}>{tx.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Transaction Details Modal */}
            {showModal && selectedTransaction && (
                <div onClick={() => setShowModal(false)} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
                        <div className="flex justify-between items-center p-4 border-b"><h3 className="text-lg font-bold">Transaction Details</h3><button onClick={() => setShowModal(false)} className="p-1 rounded-full hover:bg-gray-100"><X size={20} /></button></div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><p className="text-xs text-gray-500">Transaction ID</p><p className="font-medium">{selectedTransaction.transactionId}</p></div>
                                <div><p className="text-xs text-gray-500">Date</p><p className="font-medium">{new Date(selectedTransaction.createdAt).toLocaleString()}</p></div>
                            </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><p className="text-xs text-gray-500">User ID</p><p className="font-medium">{selectedTransaction.userId}</p></div>
                                <div><p className="text-xs text-gray-500">Campaign ID</p><p className="font-medium">{selectedTransaction.campaignId}</p></div>
                            </div>
                            <hr/>
                            <div><p className="text-xs text-gray-500">Description</p><p className="font-medium">{selectedTransaction.description}</p></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><p className="text-xs text-gray-500">Amount</p><p className="font-bold text-lg">{selectedTransaction.amount.toLocaleString()} PKR</p></div>
                                <div><p className="text-xs text-gray-500">Status</p><span className={`px-3 py-1 text-sm rounded-full ${getStatusClass(selectedTransaction.status)}`}>{selectedTransaction.status}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default WalletPage;
