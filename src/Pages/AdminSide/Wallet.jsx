"use client"

import React, { useState, useEffect, useCallback } from "react"
import Sidebar from "./SideBar"
import { X, Menu, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import axios from "axios" // Axios is now used
import { io } from "socket.io-client" // Socket.IO for real-time updates

// A new modal for the Transfer Funds functionality
const TransferFundsModal = ({ isOpen, onClose, onConfirm }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        // Basic validation
        if (!amount || isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        if (!description.trim()) {
            alert("Please enter a description for the transfer.");
            return;
        }
        onConfirm({ amount: Number(amount), description });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Transfer Funds</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (PKR)</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B5842] focus:border-[#4B5842] sm:text-sm"
                            placeholder="e.g., 50000"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description / Reason</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4B5842] focus:border-[#4B5842] sm:text-sm"
                            placeholder="e.g., Payout for completed campaigns"
                        ></textarea>
                    </div>
                </div>
                <div className="mt-6 text-right">
                    <button
                        onClick={handleSubmit}
                        className="bg-[#4B5842] text-white px-4 py-2 rounded-md hover:bg-[#3A4433] transition-colors"
                    >
                        Confirm Transfer
                    </button>
                </div>
            </div>
        </div>
    );
};


const WalletPage = () => {
    const [walletStats, setWalletStats] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //const [timeFilter, setTimeFilter] = useState("today");
    const [searchQuery, ] = useState("");
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    const fetchWalletData = useCallback(async () => {
        // Only show full-page loader on initial load
        if (!Object.keys(walletStats).length) setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Authentication required.");

            const response = await axios.get("https://server-fundify.up.railway.app/api/admin/wallet", {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setWalletStats(response.data.stats);
            setTransactions(response.data.transactions || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load wallet data.");
        } finally {
            setLoading(false);
        }
    }, [walletStats]);

    useEffect(() => {
        fetchWalletData();

        const socket = io('https://server-fundify.up.railway.app/');
        socket.on('connect', () => console.log('WalletPage: Connected to Socket.IO'));

        // Listen for real-time wallet updates from the backend
        socket.on('walletUpdated', (updatedStats) => {
            console.log('Wallet data updated in real-time:', updatedStats);
            setWalletStats(updatedStats);
            // Optionally, re-fetch transactions to see the new withdrawal/deposit record
            // fetchWalletData(); 
        });

        return () => socket.disconnect();
    }, [fetchWalletData]);

    const handleTransferConfirm = async ({ amount, description }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post("https://server-fundify.up.railway.app/api/admin/wallet/transfer", 
                { amount, description },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            alert(response.data.message); // Or use a toast notification
            setWalletStats(response.data.wallet); // Update stats immediately from response
            fetchWalletData(); // Re-fetch everything to be sure
        } catch (err) {
            alert(`Error: ${err.response?.data?.message || "Transfer failed."}`);
        } finally {
            setIsTransferModalOpen(false);
        }
    };

    const filteredTransactions = transactions.filter(transaction => {
        const query = searchQuery.toLowerCase();
        return (
            (transaction.transactionId || '').toLowerCase().includes(query) ||
            (transaction.campaignId?.title || '').toLowerCase().includes(query) || // Assuming campaignId is populated
            (transaction.description || '').toLowerCase().includes(query) ||
            (transaction.type || '').toLowerCase().includes(query)
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
            <div className={`fixed inset-y-0 left-0 z-40 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform md:relative md:translate-x-0`}>
                <Sidebar />
                <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 text-white md:hidden"><X size={24} /></button>
            </div>
            {isSidebarOpen && <div className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

            <div className="flex-1 flex flex-col overflow-auto">
                <header className="md:hidden bg-white shadow-sm p-4 flex items-center sticky top-0 z-20"><button onClick={() => setIsSidebarOpen(true)}><Menu /></button><h1 className="text-xl font-bold ml-4">Wallet</h1></header>
                
                <main className="p-4 sm:p-6 lg:p-8">
                    <div className="hidden md:flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Wallet</h1></div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                            <div><p className="text-sm text-gray-500">Total Balance</p><h3 className="text-3xl font-bold">{walletStats.totalBalance?.toLocaleString()} PKR</h3></div>
                            <div><p className="text-sm text-gray-500">Available Funds</p><h3 className="text-3xl font-bold">{walletStats.availableFunds?.toLocaleString()} PKR</h3></div>
                            <button onClick={() => setIsTransferModalOpen(true)} className="bg-[#4B5842] text-white px-4 py-2 rounded-md hover:bg-[#3A4433] w-full sm:w-auto">Transfer Funds</button>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6 space-y-3 text-sm">
                            <div className="flex justify-between items-center"><p className="text-gray-500">Total Withdrawals:</p><p className="font-medium">{walletStats.totalWithdrawals?.toLocaleString()} PKR</p></div>
                            <div className="flex justify-between items-center"><p className="text-gray-500">Pending Payouts:</p><p className="font-medium">{walletStats.pendingPayouts?.toLocaleString()} PKR</p></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b gap-4">
                            <h2 className="text-lg font-semibold">Wallet Activity</h2>
                            {/* Time filter can be implemented later if needed */}
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden">
                            {filteredTransactions.length > 0 ? filteredTransactions.map(tx => (
                                <div key={tx._id} onClick={() => handleTransactionClick(tx)} className="p-4 border-b last:border-b-0 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div><p className="font-semibold">{tx.description}</p><p className="text-xs text-gray-500">{tx.transactionId}</p></div>
                                        <p className="font-bold">{tx.amount.toLocaleString()} PKR</p>
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
                                        <tr key={tx._id} onClick={() => handleTransactionClick(tx)} className="border-b hover:bg-gray-50 cursor-pointer">
                                            <td className="px-6 py-4"><div className="flex items-center gap-3"><div className={`p-1.5 rounded-full ${tx.type === 'Withdrawal' ? 'bg-red-100' : 'bg-green-100'}`}>{tx.type === 'Withdrawal' ? <ArrowUpRight size={16} className="text-red-600"/> : <ArrowDownLeft size={16} className="text-green-600"/>}</div><div><p className="font-medium">{tx.description}</p><p className="text-sm text-gray-500">{tx.transactionId}</p></div></div></td>
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

            <TransferFundsModal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} onConfirm={handleTransferConfirm} />
            
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
                                <div><p className="text-xs text-gray-500">User</p><p className="font-medium">{selectedTransaction.userId?.name || 'N/A'}</p></div>
                                <div><p className="text-xs text-gray-500">Campaign</p><p className="font-medium">{selectedTransaction.campaignId?.title || 'N/A'}</p></div>
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
