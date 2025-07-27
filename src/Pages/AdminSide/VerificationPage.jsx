"use client"

import React, { useState, useEffect, useCallback } from "react"
import Sidebar from "./SideBar"
import { Search, ChevronLeft, ChevronRight, Eye, X, Check } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { showSuccessMessage, showErrorMessage } from '../../utils/toast';
import AdminKYCDetailsModal from "../../components/AdminKYCDetailsModal"; 

const VerificationPage = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("Campaign Verification");

    const [campaigns, setCampaigns] = useState([]);
    const [, setCampaignStats] = useState({ total: 0, approved: 0, rejected: 0, pending: 0 });

    const [kycApplications, setKycApplications] = useState([]);
    const [selectedKYCApplication, setSelectedKYCApplication] = useState(null);
    const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
    const [, setKycStats] = useState({ total: 0, approved: 0, rejected: 0, pending: 0 });

    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionComments, setRejectionComments] = useState('');
    const [kycToReject, setKycToReject] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMonth,] = useState("All");
    const itemsPerPage = 8;

    const fetchCampaignVerifications = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication required. Please log in as an Admin.");
                return;
            }
            const response = await axios.get("https://server-fundify.up.railway.app/api/campaigns?status=Pending Review", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCampaigns(response.data?.campaigns || []);
            setCampaignStats(response.data?.stats || { total: 0, approved: 0, rejected: 0, pending: 0 });
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load campaigns for verification.");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchKYCApplications = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication required. Please log in as an Admin.");
                return;
            }
            const response = await axios.get("https://server-fundify.up.railway.app/api/kyc?status=Pending Review", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setKycApplications(response.data?.kycApplications || []);
            setKycStats(response.data?.stats || { total: 0, approved: 0, rejected: 0, pending: 0 });
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load KYC applications.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchData = activeTab === "Campaign Verification" ? fetchCampaignVerifications : fetchKYCApplications;
        fetchData();
        const intervalId = setInterval(fetchData, 30000);
        return () => clearInterval(intervalId);
    }, [activeTab, fetchCampaignVerifications, fetchKYCApplications]);

    const handleApproveRejectCampaign = async (campaignId, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this campaign?`)) return;
        try {
            const token = localStorage.getItem('token');
            const endpoint = `https://server-fundify.up.railway.app/api/campaigns/${campaignId}/${status.toLowerCase()}`;
            // 'response' variable removed as it was unused
            await axios.put(endpoint, {}, { headers: { 'Authorization': `Bearer ${token}` } });
            showSuccessMessage(`Campaign ${status}d successfully!`);
            fetchCampaignVerifications();
        } catch (err) {
            showErrorMessage(`Failed to ${status} campaign: ${err.response?.data?.message || 'Unknown error'}`);
        }
    };
    
    const handleViewCampaign = (campaignId) => navigate(`/admin/campaign/review/${campaignId}`);

    const handleApproveRejectKYC = async (kycApplication, status, comments = '') => {
        const userId = kycApplication.userId._id;
        try {
            const token = localStorage.getItem('token');
            let payload = status === 'reject' ? { adminComments: comments } : {};
            if (status === 'reject' && !comments.trim()) {
                showErrorMessage("Admin comments are required for rejection.");
                return;
            }
            const endpoint = `https://server-fundify.up.railway.app/api/kyc/${userId}/${status.toLowerCase()}`;
            await axios.put(endpoint, payload, { headers: { 'Authorization': `Bearer ${token}` } });
            showSuccessMessage(`KYC application ${status}d successfully!`);
            fetchKYCApplications();
            setIsKYCModalOpen(false);
            setIsRejectModalOpen(false);
        } catch (err) {
            showErrorMessage(`Failed to ${status} KYC application: ${err.response?.data?.message || 'Unknown error'}`);
        }
    };

    const openRejectModal = (kycApplication) => {
        setKycToReject(kycApplication);
        setIsRejectModalOpen(true);
        setIsKYCModalOpen(false);
    };

    const handleCloseRejectModal = () => {
        setIsRejectModalOpen(false);
        setRejectionComments('');
        setKycToReject(null);
    };

    const handleViewKYCDetails = (kycApplication) => {
        setSelectedKYCApplication(kycApplication);
        setIsKYCModalOpen(true);
    };

    const handleCloseKYCModal = () => {
        setSelectedKYCApplication(null);
        setIsKYCModalOpen(false);
    };

    const getFilteredItems = (items, type) => {
        return items.filter((item) => {
            const nameField = type === 'campaign' ? (item.creator?.name || '') : (item.fullName || item.userId?.name || '');
            const titleField = type === 'campaign' ? item.title : (item.email || item.userId?.email || '');
            const matchesSearch = titleField.toLowerCase().includes(searchQuery.toLowerCase()) || nameField.toLowerCase().includes(searchQuery.toLowerCase());
            const itemDate = new Date(item.createdAt || item.submissionDate);
            const itemMonth = itemDate.toLocaleString('default', { month: 'long' });
            const matchesMonth = selectedMonth === "All" || itemMonth === selectedMonth;
            return matchesSearch && matchesMonth;
        });
    };
    
    const currentItems = activeTab === "Campaign Verification" ? getFilteredItems(campaigns, 'campaign') : getFilteredItems(kycApplications, 'kyc');
    const totalItems = currentItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const displayedItems = currentItems.slice(startIndex, endIndex);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

   // const handleMonthChange = (month) => {
    //    setSelectedMonth(months);
     //   setCurrentPage(1);
  //  }; 

    const getStatusClass = (status) => {
        switch (status) {
            case "Approved": return "bg-green-500";
            case "Pending Review": return "bg-yellow-500";
            case "Rejected": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

   // const month = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if (loading) return <div className="flex h-screen items-center justify-center"><p>Loading...</p></div>;
    if (error) return <div className="flex h-screen items-center justify-center"><p className="text-red-500">{error}</p></div>;

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <div className="p-8 max-w-full mx-auto">
                    {/* ... Header and Search ... */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Verification Center</h1>
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input type="text" placeholder={`Search ${activeTab === "Campaign Verification" ? "campaigns" : "KYC applications"}...`} value={searchQuery} onChange={handleSearch} className="pl-10 pr-4 py-2 w-full rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4B5842] shadow-sm" />
                        </div>
                    </div>

                    {/* ... Tabs ... */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <button onClick={() => setActiveTab("Campaign Verification")} className={`py-3 px-6 text-sm font-medium ${activeTab === "Campaign Verification" ? "border-b-2 border-[#4A5D45] text-[#4A5D45]" : "text-gray-600 hover:text-gray-800"}`}>Campaign Verification</button>
                        <button onClick={() => setActiveTab("KYC Verification")} className={`py-3 px-6 text-sm font-medium ${activeTab === "KYC Verification" ? "border-b-2 border-[#4A5D45] text-[#4A5D45]" : "text-gray-600 hover:text-gray-800"}`}>KYC Verification</button>
                    </div>

                    {/* Table and content based on active tab */}
                    {activeTab === "Campaign Verification" ? (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                            {/* ... Table Header ... */}
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                                        <th className="px-6 py-3 font-bold">Campaign Title</th>
                                        <th className="px-6 py-3 font-bold">Organizer</th>
                                        <th className="px-6 py-3 font-bold">Submission Date</th>
                                        <th className="px-6 py-3 font-bold">Status</th>
                                        <th className="px-10 py-3 text-center font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {displayedItems.map((campaign) => (
                                        <tr key={campaign._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{campaign.title}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{campaign.creator?.name || 'N/A'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{new Date(campaign.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4"><span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${getStatusClass(campaign.status)}`}>{campaign.status}</span></td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex space-x-2 justify-center">
                                                    <button onClick={() => handleViewCampaign(campaign._id)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"><Eye className="h-4 w-4" /></button>
                                                    <button onClick={() => handleApproveRejectCampaign(campaign._id, "approve")} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"><Check className="h-4 w-4" /></button>
                                                    <button onClick={() => handleApproveRejectCampaign(campaign._id, "reject")} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"><X className="h-4 w-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Pagination */}
                            <div className="px-6 py-4 flex items-center justify-between border-t bg-gray-50">
                                <div className="text-sm text-gray-600">Showing {startIndex + 1}-{endIndex} of {totalItems} campaigns</div>
                                <div className="flex space-x-1">
                                    <button onClick={handlePreviousPage} disabled={currentPage === 1} className="p-2 rounded-full border bg-white hover:bg-gray-100 disabled:opacity-50"><ChevronLeft className="h-5 w-5" /></button>
                                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="p-2 rounded-full border bg-white hover:bg-gray-100 disabled:opacity-50"><ChevronRight className="h-5 w-5" /></button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                            {/* KYC Table JSX */}
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                                        <th className="px-6 py-3 font-bold">User Name</th>
                                        <th className="px-6 py-3 font-bold">Submission Date</th>
                                        <th className="px-6 py-3 font-bold">Status</th>
                                        <th className="px-10 py-3 text-center font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {displayedItems.map((kyc) => (
                                        <tr key={kyc._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{kyc.fullName || kyc.userId?.name || 'N/A'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{new Date(kyc.createdAt || kyc.submissionDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4"><span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${getStatusClass(kyc.status)}`}>{kyc.status}</span></td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex space-x-2 justify-center">
                                                    <button onClick={() => handleViewKYCDetails(kyc)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"><Eye className="h-4 w-4" /></button>
                                                    <button onClick={() => handleApproveRejectKYC(kyc, "approve")} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"><Check className="h-4 w-4" /></button>
                                                    <button onClick={() => openRejectModal(kyc)} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"><X className="h-4 w-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                             {/* Pagination */}
                             <div className="px-6 py-4 flex items-center justify-between border-t bg-gray-50">
                                <div className="text-sm text-gray-600">Showing {startIndex + 1}-{endIndex} of {totalItems} applications</div>
                                <div className="flex space-x-1">
                                    <button onClick={handlePreviousPage} disabled={currentPage === 1} className="p-2 rounded-full border bg-white hover:bg-gray-100 disabled:opacity-50"><ChevronLeft className="h-5 w-5" /></button>
                                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="p-2 rounded-full border bg-white hover:bg-gray-100 disabled:opacity-50"><ChevronRight className="h-5 w-5" /></button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* KYC Details Modal */}
            {isKYCModalOpen && (
                <AdminKYCDetailsModal 
                    kycDetails={selectedKYCApplication}
                    onClose={handleCloseKYCModal}
                    onApprove={(kyc) => handleApproveRejectKYC(kyc, "approve")}
                    onReject={(kyc) => openRejectModal(kyc)}
                />
            )}

            {/* Reject Confirmation Modal */}
            {isRejectModalOpen && kycToReject && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="flex justify-between items-center p-5 border-b">
                            <h3 className="text-xl font-semibold">Reject KYC Application</h3>
                            <button onClick={handleCloseRejectModal}><X className="h-6 w-6" /></button>
                        </div>
                        <div className="p-6">
                            <p className="mb-4">Please provide comments for rejecting:</p>
                            <textarea
                                value={rejectionComments}
                                onChange={(e) => setRejectionComments(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                rows="4"
                                placeholder="Enter rejection reason..."
                            ></textarea>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button onClick={handleCloseRejectModal} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md">Cancel</button>
                                <button onClick={() => handleApproveRejectKYC(kycToReject, "reject", rejectionComments)} className="bg-red-500 text-white py-2 px-4 rounded-md" disabled={!rejectionComments.trim()}>Confirm Reject</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VerificationPage;
