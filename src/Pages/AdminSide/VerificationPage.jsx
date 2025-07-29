"use client"

import React, { useState, useEffect, useCallback } from "react"
import Sidebar from "./SideBar"
import { Search, ChevronLeft, ChevronRight, Eye, X, Check, Menu, AlertTriangle } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { showSuccessMessage, showErrorMessage } from '../../utils/toast'; // Assuming you have a toast utility
import AdminKYCDetailsModal from "../../components/AdminKYCDetailsModal"; // Assuming this component exists and is responsive

// A reusable confirmation modal for actions
const ActionConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <p className="text-sm text-gray-500 mt-2">{message}</p>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">Confirm</button>
                </div>
            </div>
        </div>
    );
};

const VerificationPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Campaign Verification");
    const [campaigns, setCampaigns] = useState([]);
    const [kycApplications, setKycApplications] = useState([]);
    const [selectedKYCApplication, setSelectedKYCApplication] = useState(null);
    const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionComments, setRejectionComments] = useState('');
    const [itemToProcess, setItemToProcess] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const itemsPerPage = 8;

    const fetchData = useCallback(async () => {
        const isCampaignTab = activeTab === "Campaign Verification";
        const endpoint = isCampaignTab ? "https://server-fundify.up.railway.app/api/campaigns?status=Pending Review" : "https://server-fundify.up.railway.app/api/kyc?status=Pending Review";
        const dataSetter = isCampaignTab ? setCampaigns : setKycApplications;
        const dataKey = isCampaignTab ? 'campaigns' : 'kycApplications';
        
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Authentication required.");
            
            const response = await axios.get(endpoint, { headers: { 'Authorization': `Bearer ${token}` } });
            dataSetter(response.data?.[dataKey] || []);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || `Failed to load ${isCampaignTab ? 'campaigns' : 'KYC applications'}.`);
            dataSetter([]);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleActionConfirm = (item, status) => {
        setItemToProcess({ ...item, status });
        setIsConfirmModalOpen(true);
    };

    const executeCampaignAction = async () => {
        const { _id, status } = itemToProcess;
        try {
            const token = localStorage.getItem('token');
            const endpoint = `https://server-fundify.up.railway.app/api/campaigns/${_id}/${status.toLowerCase()}`;
            await axios.put(endpoint, {}, { headers: { 'Authorization': `Bearer ${token}` } });
            showSuccessMessage(`Campaign ${status}d successfully!`);
            fetchData();
        } catch (err) {
            showErrorMessage(`Failed to ${status} campaign: ${err.response?.data?.message || 'Unknown error'}`);
        } finally {
            setIsConfirmModalOpen(false);
            setItemToProcess(null);
        }
    };
    
    const handleViewCampaign = (campaignId) => navigate(`/admin/campaign/review/${campaignId}`);

    const handleApproveKYC = async (kyc) => {
        const userId = kyc.userId._id;
        try {
            const token = localStorage.getItem('token');
            const endpoint = `https://server-fundify.up.railway.app/api/kyc/${userId}/approve`;
            await axios.put(endpoint, {}, { headers: { 'Authorization': `Bearer ${token}` } });
            showSuccessMessage(`KYC application approved successfully!`);
            fetchData();
            setIsKYCModalOpen(false);
        } catch (err) {
            showErrorMessage(`Failed to approve KYC: ${err.response?.data?.message || 'Unknown error'}`);
        }
    };

    const handleRejectKYC = async () => {
        const userId = itemToProcess.userId._id;
        if (!rejectionComments.trim()) {
            showErrorMessage("Admin comments are required for rejection.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const endpoint = `https://server-fundify.up.railway.app/api/kyc/${userId}/reject`;
            await axios.put(endpoint, { adminComments: rejectionComments }, { headers: { 'Authorization': `Bearer ${token}` } });
            showSuccessMessage(`KYC application rejected successfully!`);
            fetchData();
        } catch (err) {
            showErrorMessage(`Failed to reject KYC: ${err.response?.data?.message || 'Unknown error'}`);
        } finally {
            setIsRejectModalOpen(false);
            setRejectionComments('');
            setItemToProcess(null);
        }
    };

    const openRejectModal = (kycApplication) => {
        setItemToProcess(kycApplication);
        setIsRejectModalOpen(true);
        setIsKYCModalOpen(false);
    };

    const handleViewKYCDetails = (kycApplication) => {
        setSelectedKYCApplication(kycApplication);
        setIsKYCModalOpen(true);
    };

    const filteredItems = (activeTab === "Campaign Verification" ? campaigns : kycApplications).filter(item => {
        const name = activeTab === 'Campaign Verification' ? (item.creator?.name || '') : (item.fullName || item.userId?.name || '');
        const title = activeTab === 'Campaign Verification' ? item.title : (item.email || item.userId?.email || '');
        return name.toLowerCase().includes(searchQuery.toLowerCase()) || title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // *** FIX STARTS HERE ***
    // Define all pagination variables before the return statement
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const displayedItems = filteredItems.slice(startIndex, endIndex);
    // *** FIX ENDS HERE ***

    if (loading) return <div className="flex h-screen items-center justify-center"><p>Loading...</p></div>;

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <div className={`fixed inset-y-0 left-0 z-40 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform md:relative md:translate-x-0`}>
                <Sidebar />
                <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 text-white md:hidden"><X size={24} /></button>
            </div>

            <div className="flex-1 flex flex-col overflow-auto">
                <header className="md:hidden bg-white shadow-sm p-4 flex items-center sticky top-0 z-30"><button onClick={() => setIsSidebarOpen(true)}><Menu /></button><h1 className="text-xl font-bold ml-4">Verification Center</h1></header>
                
                <main className="p-4 sm:p-6 lg:p-8">
                    <div className="hidden md:flex justify-between items-center mb-6"><h1 className="text-2xl font-bold text-gray-800">Verification Center</h1></div>
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input type="text" placeholder={`Search ${activeTab === "Campaign Verification" ? "campaigns" : "KYC"}...`} value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} className="w-full pl-10 pr-4 py-2 rounded-full bg-white border" />
                    </div>

                    <div className="flex border-b border-gray-200 mb-6">
                        <button onClick={() => {setActiveTab("Campaign Verification"); setCurrentPage(1);}} className={`py-3 px-4 sm:px-6 text-sm font-medium ${activeTab === "Campaign Verification" ? "border-b-2 border-[#4A5D45] text-[#4A5D45]" : "text-gray-600"}`}>Campaigns</button>
                        <button onClick={() => {setActiveTab("KYC Verification"); setCurrentPage(1);}} className={`py-3 px-4 sm:px-6 text-sm font-medium ${activeTab === "KYC Verification" ? "border-b-2 border-[#4A5D45] text-[#4A5D45]" : "text-gray-600"}`}>KYC</button>
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}
                    
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Mobile View */}
                        <div className="md:hidden">
                            {displayedItems.length > 0 ? displayedItems.map(item => (
                                <div key={item._id} className="p-4 border-b last:border-b-0 space-y-3">
                                    {activeTab === 'Campaign Verification' ? (
                                        <>
                                            <p className="font-bold text-gray-800">{item.title}</p>
                                            <p className="text-sm text-gray-500">by {item.creator?.name || 'N/A'}</p>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">{item.status}</span>
                                            </div>
                                            <div className="flex justify-end space-x-2 pt-2">
                                                <button onClick={() => handleViewCampaign(item._id)} className="p-2 rounded-full bg-blue-100 text-blue-600"><Eye size={16} /></button>
                                                <button onClick={() => handleActionConfirm(item, 'approve')} className="p-2 rounded-full bg-green-100 text-green-600"><Check size={16} /></button>
                                                <button onClick={() => handleActionConfirm(item, 'reject')} className="p-2 rounded-full bg-red-100 text-red-600"><X size={16} /></button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-bold text-gray-800">{item.fullName || item.userId?.name || 'N/A'}</p>
                                            <p className="text-sm text-gray-500">{item.userId?.email || 'N/A'}</p>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>{new Date(item.createdAt || item.submissionDate).toLocaleDateString()}</span>
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">{item.status}</span>
                                            </div>
                                            <div className="flex justify-end space-x-2 pt-2">
                                                <button onClick={() => handleViewKYCDetails(item)} className="p-2 rounded-full bg-blue-100 text-blue-600"><Eye size={16} /></button>
                                                <button onClick={() => handleApproveKYC(item)} className="p-2 rounded-full bg-green-100 text-green-600"><Check size={16} /></button>
                                                <button onClick={() => openRejectModal(item)} className="p-2 rounded-full bg-red-100 text-red-600"><X size={16} /></button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )) : <p className="p-4 text-center text-gray-500">No pending items found.</p>}
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr className="text-left text-xs text-gray-500 uppercase">
                                        {activeTab === 'Campaign Verification' ? (
                                            <>
                                                <th className="px-6 py-3 font-bold">Campaign Title</th>
                                                <th className="px-6 py-3 font-bold">Organizer</th>
                                                <th className="px-6 py-3 font-bold">Date</th>
                                                <th className="px-6 py-3 font-bold">Status</th>
                                                <th className="px-10 py-3 text-center font-bold">Actions</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="px-6 py-3 font-bold">User Name</th>
                                                <th className="px-6 py-3 font-bold">Date</th>
                                                <th className="px-6 py-3 font-bold">Status</th>
                                                <th className="px-10 py-3 text-center font-bold">Actions</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {displayedItems.length > 0 ? displayedItems.map(item => (
                                        <tr key={item._id} className="hover:bg-gray-50">
                                            {activeTab === 'Campaign Verification' ? (
                                                <>
                                                    <td className="px-6 py-4 text-sm font-medium">{item.title}</td>
                                                    <td className="px-6 py-4 text-sm">{item.creator?.name || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm">{new Date(item.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">{item.status}</span></td>
                                                    <td className="px-6 py-4"><div className="flex space-x-2 justify-center"><button onClick={() => handleViewCampaign(item._id)} className="p-2 rounded-full bg-blue-100 hover:bg-blue-200"><Eye size={16} className="text-blue-600"/></button><button onClick={() => handleActionConfirm(item, 'approve')} className="p-2 rounded-full bg-green-100 hover:bg-green-200"><Check size={16} className="text-green-600"/></button><button onClick={() => handleActionConfirm(item, 'reject')} className="p-2 rounded-full bg-red-100 hover:bg-red-200"><X size={16} className="text-red-600"/></button></div></td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4 text-sm font-medium">{item.fullName || item.userId?.name || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm">{new Date(item.createdAt || item.submissionDate).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">{item.status}</span></td>
                                                    <td className="px-6 py-4"><div className="flex space-x-2 justify-center"><button onClick={() => handleViewKYCDetails(item)} className="p-2 rounded-full bg-blue-100 hover:bg-blue-200"><Eye size={16} className="text-blue-600"/></button><button onClick={() => handleApproveKYC(item)} className="p-2 rounded-full bg-green-100 hover:bg-green-200"><Check size={16} className="text-green-600"/></button><button onClick={() => openRejectModal(item)} className="p-2 rounded-full bg-red-100 hover:bg-red-200"><X size={16} className="text-red-600"/></button></div></td>
                                                </>
                                            )}
                                        </tr>
                                    )) : <tr><td colSpan="5" className="text-center py-8 text-gray-500">No pending items found.</td></tr>}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-4 sm:px-6 py-3 flex items-center justify-between border-t bg-gray-50">
                                <div className="text-sm text-gray-600">Showing {startIndex + 1}-{endIndex} of {totalItems}</div>
                                <div className="flex space-x-1">
                                    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-full border bg-white hover:bg-gray-100 disabled:opacity-50"><ChevronLeft size={20} /></button>
                                    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-full border bg-white hover:bg-gray-100 disabled:opacity-50"><ChevronRight size={20} /></button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Modals */}
            {isKYCModalOpen && <AdminKYCDetailsModal kycDetails={selectedKYCApplication} onClose={() => setIsKYCModalOpen(false)} onApprove={handleApproveKYC} onReject={openRejectModal} />}
            {isRejectModalOpen && <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl max-w-md w-full"><div className="p-5 border-b flex justify-between items-center"><h3 className="text-xl font-semibold">Reject KYC</h3><button onClick={() => setIsRejectModalOpen(false)}><X/></button></div><div className="p-6"><p className="mb-4">Please provide comments for rejection:</p><textarea value={rejectionComments} onChange={(e) => setRejectionComments(e.target.value)} className="w-full p-2 border rounded-md" rows="4" placeholder="Enter rejection reason..."></textarea><div className="flex justify-end space-x-3 mt-6"><button onClick={() => setIsRejectModalOpen(false)} className="bg-gray-300 py-2 px-4 rounded-md">Cancel</button><button onClick={handleRejectKYC} className="bg-red-500 text-white py-2 px-4 rounded-md" disabled={!rejectionComments.trim()}>Confirm Reject</button></div></div></div></div>}
            <ActionConfirmModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={executeCampaignAction} title={`Confirm ${itemToProcess?.status}`} message={`Are you sure you want to ${itemToProcess?.status} this campaign?`} />
        </div>
    );
}

export default VerificationPage;
