"use client"

import React, { useState, useEffect, useCallback } from "react"
import Sidebar from "./SideBar"
import { Search, ChevronLeft, ChevronRight, ChevronDown, Eye, X, Check } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { showSuccessMessage, showErrorMessage } from '../../utils/toast';

const VerificationPage = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("Campaign Verification");

    const [campaigns, setCampaigns] = useState([]);
    const [campaignStats, setCampaignStats] = useState({
        total: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
    });

    const [kycApplications, setKycApplications] = useState([]);
    const [selectedKYCApplication, setSelectedKYCApplication] = useState(null);
    const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
    const [kycStats, setKycStats] = useState({
        total: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
    });

    // New state for rejection comments and modal
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionComments, setRejectionComments] = useState('');
    const [kycToReject, setKycToReject] = useState(null); // Stores the KYC application object to be rejected

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMonth, setSelectedMonth] = useState("All");
    const itemsPerPage = 8;

    const fetchCampaignVerifications = useCallback(async () => {
        console.log("Fetching campaign verifications...");
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                setError("Authentication required. Please log in as an Admin.");
                setLoading(false);
                return;
            }

            const response = await axios.get("http://localhost:5000/api/campaigns?status=Pending Review", {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const fetchedCampaigns = response.data?.campaigns || [];
            const fetchedStats = response.data?.stats || {
                total: fetchedCampaigns.length,
                approved: 0,
                rejected: 0,
                pending: fetchedCampaigns.length
            };

            setCampaigns(fetchedCampaigns);
            setCampaignStats(fetchedStats);
            setError(null);
        } catch (err) {
            console.error("Error fetching campaigns for verification:", err);
            if (err.response && err.response.status === 403) {
                setError("Access forbidden: You do not have sufficient rights to view this page.");
            } else {
                setError("Failed to load campaigns for verification. Please try again later.");
            }
            setCampaigns([]);
            setCampaignStats({ total: 0, approved: 0, rejected: 0, pending: 0 });
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchKYCApplications = useCallback(async () => {
        console.log("Fetching KYC applications...");
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                setError("Authentication required. Please log in as an Admin.");
                setLoading(false);
                return;
            }

            const response = await axios.get("http://localhost:5000/api/kyc?status=Pending Review", {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const fetchedKYCApplications = response.data?.kycApplications || [];
            const fetchedStats = response.data?.stats || {
                total: fetchedKYCApplications.length,
                approved: 0,
                rejected: 0,
                pending: fetchedKYCApplications.length
            };

            setKycApplications(fetchedKYCApplications);
            setKycStats(fetchedStats);
            setError(null);
        } catch (err) {
            console.error("Error fetching KYC applications:", err);
            if (err.response && err.response.status === 403) {
                setError("Access forbidden: You do not have sufficient rights to view this page.");
            } else {
                setError("Failed to load KYC applications. Please try again later.");
            }
            setKycApplications([]);
            setKycStats({ total: 0, approved: 0, rejected: 0, pending: 0 });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === "Campaign Verification") {
            fetchCampaignVerifications();
        } else {
            fetchKYCApplications();
        }

        const intervalId = setInterval(() => {
            if (activeTab === "Campaign Verification") {
                fetchCampaignVerifications();
            } else {
                fetchKYCApplications();
            }
        }, 30000);

        return () => clearInterval(intervalId);
    }, [activeTab, fetchCampaignVerifications, fetchKYCApplications]);

    const handleApproveRejectCampaign = async (campaignId, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this campaign?`)) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showErrorMessage("Authentication token missing. Please log in again.");
                return;
            }

            const endpoint = `http://localhost:5000/api/campaigns/${campaignId}/${status.toLowerCase()}`;
            const response = await axios.put(endpoint, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 200) {
                showSuccessMessage(`Campaign ${status}d successfully!`);
                fetchCampaignVerifications();
            } else {
                showErrorMessage(`Failed to ${status} campaign: ${response.data?.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error(`Error ${status}ing campaign:`, err);
            showErrorMessage(`An error occurred while trying to ${status} the campaign.`);
        }
    };

    const handleViewCampaign = (campaignId) => {
        navigate(`/project/${campaignId}`);
    };

    // MODIFIED: handleApproveRejectKYC now accepts optional comments
    const handleApproveRejectKYC = async (kycApplication, status, comments = '') => {
        const userId = kycApplication.userId._id; // Get userId from the populated user object
        // No confirm dialog here, it's handled by reject modal if status is 'reject'

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showErrorMessage("Authentication token missing. Please log in again.");
                return;
            }

            let payload = {};
            if (status === 'reject') {
                payload = { adminComments: comments };
                if (!comments || comments.trim() === '') {
                    showErrorMessage("Admin comments are required for rejection.");
                    return;
                }
            }

            const endpoint = `http://localhost:5000/api/kyc/${userId}/${status.toLowerCase()}`;
            const response = await axios.put(endpoint, payload, { // Pass payload here
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 200) {
                showSuccessMessage(`KYC application ${status}d successfully!`);
                fetchKYCApplications();
                setIsKYCModalOpen(false); // Close main KYC modal
                setIsRejectModalOpen(false); // Close reject comments modal
                setRejectionComments(''); // Clear comments
                setKycToReject(null); // Clear kyc to reject
            } else {
                showErrorMessage(`Failed to ${status} KYC application: ${response.data?.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error(`Error ${status}ing KYC application:`, err);
            showErrorMessage(`An error occurred while trying to ${status} the KYC application.`);
        }
    };

    // Helper to open the reject comments modal
    const openRejectModal = (kycApplication) => {
        setKycToReject(kycApplication);
        setIsRejectModalOpen(true);
        setIsKYCModalOpen(false); // Close the view details modal if open
    };

    const handleCloseKYCModal = () => {
        setSelectedKYCApplication(null);
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

    const getFilteredItems = (items, type) => {
        return items.filter((item) => {
            const nameField = type === 'campaign' ? (item.creator?.name || '') : (item.fullName || item.userId?.name || ''); // Use userId.name for KYC
            const titleField = type === 'campaign' ? item.title : (item.email || item.userId?.email || ''); // Use userId.email for KYC
            const descriptionField = type === 'campaign' ? item.description : '';

            const matchesSearch = titleField.toLowerCase().includes(searchQuery.toLowerCase()) ||
                nameField.toLowerCase().includes(searchQuery.toLowerCase()) ||
                descriptionField.toLowerCase().includes(searchQuery.toLowerCase());

            const itemDate = new Date(item.createdAt || item.submissionDate);
            const itemMonth = itemDate.toLocaleString('default', { month: 'long' });
            const matchesMonth = selectedMonth === "All" || itemMonth === selectedMonth;

            return matchesSearch && matchesMonth;
        });
    };

    const currentItems = activeTab === "Campaign Verification"
        ? getFilteredItems(campaigns, 'campaign')
        : getFilteredItems(kycApplications, 'kyc');

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
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleMonthChange = (month) => {
        setSelectedMonth(month);
        setCurrentPage(1);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Approved":
            case "Verified":
                return "bg-green-500";
            case "Pending Review":
            case "Pending":
                return "bg-yellow-500";
            case "Rejected":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    const months = [
        "All", "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 overflow-auto p-8 text-center flex items-center justify-center">
                    <p className="text-xl text-gray-600">Loading verification data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 overflow-auto p-8 text-center flex items-center justify-center flex-col">
                    <p className="text-red-600 text-xl mb-4">{error}</p>
                    <button onClick={activeTab === "Campaign Verification" ? fetchCampaignVerifications : fetchKYCApplications} className="bg-[#4A5D45] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />

            <div className="flex-1 overflow-auto">
                <div className="p-8 max-w-full mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Verification Center</h1>
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab === "Campaign Verification" ? "campaigns" : "KYC applications"}...`}
                                value={searchQuery}
                                onChange={handleSearch}
                                className="pl-10 pr-4 py-2 w-full rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4B5842] shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Tabs for Verification Types */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            onClick={() => setActiveTab("Campaign Verification")}
                            className={`py-3 px-6 text-sm font-medium focus:outline-none transition-colors duration-200 ${
                                activeTab === "Campaign Verification"
                                    ? "border-b-2 border-[#4A5D45] text-[#4A5D45]"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            Campaign Verification
                        </button>
                        <button
                            onClick={() => setActiveTab("KYC Verification")}
                            className={`py-3 px-6 text-sm font-medium focus:outline-none transition-colors duration-200 ${
                                activeTab === "KYC Verification"
                                    ? "border-b-2 border-[#4A5D45] text-[#4A5D45]"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            KYC Verification
                        </button>
                    </div>

                    {/* Content based on activeTab */}
                    {activeTab === "Campaign Verification" ? (
                        <>
                            {/* Campaign Statistics with Pie Chart */}
                            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                    <div className="flex justify-center items-center">
                                        <div className="relative w-64 h-64">
                                            {/* TODO: Integrate a proper charting library (e.g., Recharts, Chart.js) for dynamic pie chart */}
                                            {/* Note: The clipPath styles are illustrative and would need to be dynamically calculated */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="relative w-48 h-48">
                                                    <div
                                                        className="absolute w-48 h-48 rounded-full bg-blue-500"
                                                        style={{ clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)` }}
                                                    ></div>
                                                    <div
                                                        className="absolute w-48 h-48 rounded-full bg-yellow-400"
                                                        style={{ clipPath: `polygon(50% 50%, 0% 0%, 50% 0%)` }}
                                                    ></div>
                                                    <div
                                                        className="absolute w-48 h-48 rounded-full bg-red-500"
                                                        style={{ clipPath: `polygon(50% 50%, 0% 0%, 0% 100%, 50% 100%)` }}
                                                    ></div>
                                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner">
                                                        <span className="font-semibold text-gray-700 text-sm">Campaigns</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="absolute -top-4 right-1/4 transform translate-x-1/2">
                                                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md shadow-sm">
                                                    Approved: {campaignStats.approved}
                                                </div>
                                            </div>
                                            <div className="absolute top-1/4 -left-4">
                                                <div className="bg-yellow-400 text-white text-xs px-2 py-1 rounded-md shadow-sm">
                                                    Pending: {campaignStats.pending}
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-4 left-1/4 transform -translate-x-1/2">
                                                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow-sm">
                                                    Rejected: {campaignStats.rejected}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center space-y-4">
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                            <span className="font-medium text-gray-700">Total Campaigns</span>
                                            <span className="font-bold text-2xl text-[#4A5D45]">{campaignStats.total}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                            <span className="font-medium text-gray-700">Approved Campaigns</span>
                                            <span className="font-bold text-2xl text-green-600">{campaignStats.approved}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                            <span className="font-medium text-gray-700">Rejected Campaigns</span>
                                            <span className="font-bold text-2xl text-red-600">{campaignStats.rejected}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-700">Pending Campaigns</span>
                                            <span className="font-bold text-2xl text-yellow-600">{campaignStats.pending}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center mt-6 space-x-6 text-gray-600">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 shadow-sm"></div>
                                        <span className="text-sm">Approved</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-sm"></div>
                                        <span className="text-sm">Rejected</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2 shadow-sm"></div>
                                        <span className="text-sm">Pending</span>
                                    </div>
                                </div>
                            </div>

                            {/* Campaign Verification Table */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                                <div className="flex flex-col md:flex-row items-center justify-between p-6 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-3 md:mb-0">Pending Campaigns for Verification</h2>
                                    <div className="relative">
                                        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 cursor-pointer group bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <span className="text-gray-700 text-sm">{selectedMonth}</span>
                                            <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />

                                            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                                                <ul className="py-1">
                                                    {months.map((month) => (
                                                        <li
                                                            key={month}
                                                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
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
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                                                <th className="px-6 py-3 font-bold">Campaign Title</th>
                                                <th className="px-6 py-3 font-bold">Organizer Name</th>
                                                <th className="px-6 py-3 font-bold">Description</th>
                                                <th className="px-6 py-3 font-bold">Submission Date</th>
                                                <th className="px-10 py-3 font-bold">Status</th>
                                                <th className="px-20 py-3 text-center font-bold">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {displayedItems.length > 0 ? (
                                                displayedItems.map((campaign) => (
                                                    <tr key={campaign._id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{campaign.title}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">{campaign.creator?.name || 'N/A'}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={campaign.description}>{campaign.description}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">{new Date(campaign.createdAt).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4">
                                                            <span
                                                                className={`inline-flex px-3 py-1 text-xs font-semibold leading-5 rounded-full text-white ${getStatusClass(campaign.status)}`}
                                                            >
                                                                {campaign.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-2 py-0.5">
                                                            {campaign.status === "Pending Review" ? (
                                                                <div className="flex space-x-2">
                                                                    <button
                                                                        onClick={() => handleViewCampaign(campaign._id)}
                                                                        className="px-2 py-0.5 text-xs rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 shadow-sm"
                                                                    >
                                                                        View Campaign
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleApproveRejectCampaign(campaign._id, "approve")}
                                                                        className="px-2 py-0.5 text-xs rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 shadow-sm"
                                                                    >
                                                                        Approve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleApproveRejectCampaign(campaign._id, "reject")}
                                                                        className="px-2 py-0.5 text-xs rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 shadow-sm"
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-500 text-sm italic">{campaign.status}</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500 text-base">No pending campaigns for verification.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50">
                                    <div className="text-sm text-gray-600">
                                        Showing {startIndex + 1}-{endIndex} of {totalItems} campaigns
                                    </div>
                                    <div className="flex space-x-1">
                                        <button
                                            className="p-2 rounded-full border border-gray-300 text-gray-600 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                            onClick={handlePreviousPage}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button
                                            className="p-2 rounded-full border border-gray-300 text-gray-600 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* KYC Statistics with Pie Chart (using kycStats) */}
                            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                    <div className="flex justify-center items-center">
                                        <div className="relative w-64 h-64">
                                            {/* TODO: Integrate a proper charting library for dynamic pie chart using kycStats */}
                                            {/* Note: The clipPath styles are illustrative and would need to be dynamically calculated */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="relative w-48 h-48">
                                                    {/* Placeholder for dynamic pie chart segments for KYC */}
                                                    <div
                                                        className="absolute w-48 h-48 rounded-full bg-green-500"
                                                        style={{ clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)` }}
                                                    ></div>
                                                    <div
                                                        className="absolute w-48 h-48 rounded-full bg-yellow-400"
                                                        style={{ clipPath: `polygon(50% 50%, 0% 0%, 50% 0%)` }}
                                                    ></div>
                                                    <div
                                                        className="absolute w-48 h-48 rounded-full bg-red-500"
                                                        style={{ clipPath: `polygon(50% 50%, 0% 0%, 0% 100%, 50% 100%)` }}
                                                    ></div>
                                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner">
                                                        <span className="font-semibold text-gray-700 text-sm">KYC</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="absolute -top-4 right-1/4 transform translate-x-1/2">
                                                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-md shadow-sm">
                                                    Approved: {kycStats.approved}
                                                </div>
                                            </div>
                                            <div className="absolute top-1/4 -left-4">
                                                <div className="bg-yellow-400 text-white text-xs px-2 py-1 rounded-md shadow-sm">
                                                    Pending: {kycStats.pending}
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-4 left-1/4 transform -translate-x-1/2">
                                                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow-sm">
                                                    Rejected: {kycStats.rejected}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center space-y-4">
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                            <span className="font-medium text-gray-700">Total KYC Applications</span>
                                            <span className="font-bold text-2xl text-[#4A5D45]">{kycStats.total}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                            <span className="font-medium text-gray-700">Approved KYC</span>
                                            <span className="font-bold text-2xl text-green-600">{kycStats.approved}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                            <span className="font-medium text-gray-700">Rejected KYC</span>
                                            <span className="font-bold text-2xl text-red-600">{kycStats.rejected}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-700">Pending KYC</span>
                                            <span className="font-bold text-2xl text-yellow-600">{kycStats.pending}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center mt-6 space-x-6 text-gray-600">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2 shadow-sm"></div>
                                        <span className="text-sm">Approved</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-sm"></div>
                                        <span className="text-sm">Rejected</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2 shadow-sm"></div>
                                        <span className="text-sm">Pending</span>
                                    </div>
                                </div>
                            </div>

                            {/* KYC Verification Table */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                                <div className="flex flex-col md:flex-row items-center justify-between p-6 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-3 md:mb-0">Pending KYC Applications for Verification</h2>
                                    <div className="relative">
                                        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 cursor-pointer group bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <span className="text-gray-700 text-sm">{selectedMonth}</span>
                                            <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />

                                            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                                                <ul className="py-1">
                                                    {months.map((month) => (
                                                        <li
                                                            key={month}
                                                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
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
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                                                <th className="px-6 py-3 font-bold">User Name</th>
                                                <th className="px-6 py-3 font-bold">Submission Date</th>
                                                <th className="px-6 py-3 font-bold">Status</th>
                                                <th className="px-20 py-3 text-center font-bold">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {displayedItems.length > 0 ? (
                                                displayedItems.map((kyc) => (
                                                    <tr key={kyc._id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{kyc.fullName || kyc.userId?.name || 'N/A'}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">{new Date(kyc.createdAt || kyc.submissionDate).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4">
                                                            <span
                                                                className={`inline-flex px-3 py-1 text-xs font-semibold leading-5 rounded-full text-white ${getStatusClass(kyc.status)}`}
                                                            >
                                                                {kyc.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-2 py-0.5">
                                                            {kyc.status === "Pending Review" ? (
                                                                <div className="flex space-x-2 justify-center">
                                                                    <button
                                                                        onClick={() => handleViewKYCDetails(kyc)}
                                                                        className="p-2 text-xs rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 shadow-sm"
                                                                        title="View KYC Details"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleApproveRejectKYC(kyc, "approve")}
                                                                        className="p-2 text-xs rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 shadow-sm"
                                                                        title="Approve KYC"
                                                                    >
                                                                        <Check className="h-4 w-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => openRejectModal(kyc)} // Open the new reject modal
                                                                        className="p-2 text-xs rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 shadow-sm"
                                                                        title="Reject KYC"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-500 text-sm italic">{kyc.status}</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500 text-base">No pending KYC applications for verification.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination for KYC */}
                                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50">
                                    <div className="text-sm text-gray-600">
                                        Showing {startIndex + 1}-{endIndex} of {totalItems} KYC applications
                                    </div>
                                    <div className="flex space-x-1">
                                        <button
                                            className="p-2 rounded-full border border-gray-300 text-gray-600 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                            onClick={handlePreviousPage}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button
                                            className="p-2 rounded-full border border-gray-300 text-gray-600 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* KYC Details Modal */}
            {isKYCModalOpen && selectedKYCApplication && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-5 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800">KYC Application Details</h3>
                            <button onClick={handleCloseKYCModal} className="text-gray-500 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <h4 className="text-lg font-bold text-gray-700">Applicant Information:</h4>
                            <p className="text-gray-600"><strong>Full Name:</strong> {selectedKYCApplication.fullName || 'N/A'}</p>
                            <p className="text-gray-600"><strong>Email:</strong> {selectedKYCApplication.email || 'N/A'}</p>
                            <p className="text-gray-600"><strong>Phone Number:</strong> {selectedKYCApplication.phoneNumber || 'N/A'}</p>
                            <p className="text-gray-600"><strong>Date of Birth:</strong> {selectedKYCApplication.dateOfBirth ? new Date(selectedKYCApplication.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                            <p className="text-gray-600"><strong>Address:</strong> {selectedKYCApplication.address || 'N/A'}</p>

                            <h4 className="text-lg font-bold text-gray-700 mt-6">Document Upload:</h4>
                            {selectedKYCApplication.documentType && selectedKYCApplication.documentNumber && (
                                <>
                                    <p className="text-gray-600"><strong>Document Type:</strong> {selectedKYCApplication.documentType}</p>
                                    <p className="text-gray-600"><strong>Document Number:</strong> {selectedKYCApplication.documentNumber}</p>
                                </>
                            )}
                            {selectedKYCApplication.documentFrontUrl && (
                                <div className="mt-2">
                                    <p className="text-gray-600 mb-1"><strong>Document Front:</strong></p>
                                    <img
                                        src={`http://localhost:5000${selectedKYCApplication.documentFrontUrl}`} // Prepend base URL
                                        alt="Document Front"
                                        className="max-w-full h-auto rounded-md shadow-md border border-gray-200 object-contain"
                                        style={{ maxHeight: '200px' }} // Limit height
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x150/e0e0e0/000000?text=Image+Not+Available"; }}
                                    />
                                    <a href={`http://localhost:5000${selectedKYCApplication.documentFrontUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline">View Full Size</a>
                                </div>
                            )}
                            {selectedKYCApplication.documentBackUrl && (
                                <div className="mt-2">
                                    <p className="text-gray-600 mb-1"><strong>Document Back:</strong></p>
                                    <img
                                        src={`http://localhost:5000${selectedKYCApplication.documentBackUrl}`} // Prepend base URL
                                        alt="Document Back"
                                        className="max-w-full h-auto rounded-md shadow-md border border-gray-200 object-contain"
                                        style={{ maxHeight: '200px' }}
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x150/e0e0e0/000000?text=Image+Not+Available"; }}
                                    />
                                    <a href={`http://localhost:5000${selectedKYCApplication.documentBackUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline">View Full Size</a>
                                </div>
                            )}

                            <h4 className="text-lg font-bold text-gray-700 mt-6">Liveness Verification:</h4>
                            {selectedKYCApplication.livenessImageUrl && (
                                <div className="mt-2">
                                    <p className="text-gray-600 mb-1"><strong>Liveness Image:</strong></p>
                                    <img
                                        src={`http://localhost:5000${selectedKYCApplication.livenessImageUrl}`} // Prepend base URL
                                        alt="Liveness"
                                        className="max-w-full h-auto rounded-md shadow-md border border-gray-200 object-contain"
                                        style={{ maxHeight: '200px' }}
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x150/e0e0e0/000000?text=Image+Not+Available"; }}
                                    />
                                    <a href={`http://localhost:5000${selectedKYCApplication.livenessImageUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline">View Full Size</a>
                                </div>
                            )}
                            {!selectedKYCApplication.livenessImageUrl && <p className="text-gray-600">No liveness image provided.</p>}
                        </div>
                        <div className="flex justify-end p-5 border-t border-gray-200 space-x-3">
                            <button
                                onClick={() => handleApproveRejectKYC(selectedKYCApplication, "approve")}
                                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center space-x-1"
                            >
                                <Check className="h-4 w-4" />
                                <span>Approve</span>
                            </button>
                            <button
                                onClick={() => openRejectModal(selectedKYCApplication)} // Use new openRejectModal
                                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors flex items-center space-x-1"
                            >
                                <X className="h-4 w-4" />
                                <span>Reject</span>
                            </button>
                            <button
                                onClick={handleCloseKYCModal}
                                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Confirmation with Comments Modal */}
            {isRejectModalOpen && kycToReject && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="flex justify-between items-center p-5 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800">Reject KYC Application</h3>
                            <button onClick={handleCloseRejectModal} className="text-gray-500 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="mb-4 text-gray-700">
                                Please provide comments for rejecting the KYC application for:
                                <br />
                                <span className="font-semibold">{kycToReject.fullName || kycToReject.userId?.name || 'N/A'}</span>
                            </p>
                            <textarea
                                value={rejectionComments}
                                onChange={(e) => setRejectionComments(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                                rows="4"
                                placeholder="Enter rejection reason..."
                            ></textarea>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={handleCloseRejectModal}
                                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleApproveRejectKYC(kycToReject, "reject", rejectionComments)}
                                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors flex items-center space-x-1"
                                    disabled={!rejectionComments.trim()} // Disable if comments are empty
                                >
                                    <X className="h-4 w-4" />
                                    <span>Confirm Reject</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VerificationPage;
