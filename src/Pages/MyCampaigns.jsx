// src/Pages/MyCampaigns.jsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLayout from "./Layout/HeaderLayout";
import FooterLayout from "./Layout/FooterLayout";
import { useUser } from '../context/UserContext';
import SideBar from '../components/SideBar';
import axios from 'axios';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { showSuccessMessage, showErrorMessage } from "../utils/toast";

// Prediction Modal Component
const PredictionModal = ({ show, onClose, predictionData, isLoading, error }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-[#4A5D45]">Campaign Prediction</h2>

                {isLoading && (
                    <div className="py-8">
                        <p className="text-gray-600">Predicting outcome...</p>
                        <div className="mt-4 flex justify-center">
                            {/* Simple spinner */}
                            <svg className="animate-spin h-8 w-8 text-[#4A5D45]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="text-red-600 text-sm mt-4">
                        <p>Error: {error}</p>
                        <p className="text-xs text-gray-500">Could not fetch prediction. Please try again.</p>
                    </div>
                )}

                {predictionData && !isLoading && !error && (
                    <div className="mt-4">
                        <p className="text-lg mb-2 text-gray-700">Predicted Status:</p>
                        <p className={`text-3xl font-bold ${predictionData.prediction === 1 ? 'text-green-600' : 'text-red-600'} mb-4`}>
                            {predictionData.prediction === 1 ? 'SUCCESS!' : 'FAILURE'}
                        </p>
                        <p className="text-gray-800 text-xl">
                            Success Probability: <span className="font-bold">{predictionData.success_probability}%</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-4">
                            (AI-generated prediction for informational purposes. Actual outcome may vary.)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};


function MyCampaigns() {
    const { userProfile, loadingUserContext, setUserProfile } = useUser();
    const navigate = useNavigate();

    const [campaigns, setCampaigns] = useState([]);
    const [savedCampaignsData, setSavedCampaignsData] = useState([]);
    const [activeTab, setActiveTab] = useState("All campaigns");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeMenuItem, setActiveMenuItem] = useState("My Campaigns");
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);
    const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

    // NEW STATES for Prediction Modal
    const [showPredictionModal, setShowPredictionModal] = useState(false);
    const [currentPrediction, setCurrentPrediction] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [predictionError, setPredictionError] = useState(null);


    const toggleProfileSidebar = () => {
        setIsProfileSidebarOpen((prev) => !prev);
    };

    const fetchMyCampaignsAndSaved = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication required or user ID not found. Please log in.");
                navigate("/login");
                return;
            }

            // Fetch campaigns created by the user
            const myCampaignsResponse = await axios.get(`https://server-fundify.up.railway.app/api/campaigns/my-campaigns`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setCampaigns(myCampaignsResponse.data?.campaigns || []);

            // Fetch details for saved campaigns
            const fetchedSavedCampaignsDetails = [];
            if (userProfile.savedCampaigns && userProfile.savedCampaigns.length > 0) {
                for (const campaignId of userProfile.savedCampaigns) {
                    try {
                        const response = await axios.get(`https://server-fundify.up.railway.app/api/campaigns/${campaignId}`);
                        fetchedSavedCampaignsDetails.push(response.data);
                    } catch (fetchError) {
                        console.warn(`Failed to fetch saved campaign ${campaignId}:`, fetchError);
                    }
                }
            }
            setSavedCampaignsData(fetchedSavedCampaignsDetails);

            setError(null);
        } catch (err) {
            console.error("Error fetching campaigns or saved campaigns:", err);
            if (err.response) {
                if (err.response.status === 401 || err.response.status === 403) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userProfile');
                    setError("Session expired or unauthorized. Please log in again.");
                    navigate("/login");
                    showErrorMessage('Session expired, please log in again.');
                } else {
                    setError(`Failed to load your campaigns: ${err.response.data?.message || err.message}`);
                }
            } else {
                setError("Network error or server unreachable. Please try again later.");
            }
            setCampaigns([]);
            setSavedCampaignsData([]);
        } finally {
            setLoading(false);
        }
    }, [userProfile, navigate]);

    useEffect(() => {
        if (!loadingUserContext) {
            fetchMyCampaignsAndSaved();
        }
    }, [loadingUserContext, fetchMyCampaignsAndSaved]);

    const displayedCampaigns = activeTab === "All campaigns" ? campaigns : savedCampaignsData;

    const filteredCampaigns = displayedCampaigns.filter(campaign => {
        const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userProfile');
        navigate('/login');
        setShowConfirmLogout(false);
        showSuccessMessage('You have been logged out successfully!');
    };

    const handleMenuItemClick = (menuItem) => {
        setActiveMenuItem(menuItem);
        setIsProfileSidebarOpen(false);
        if (menuItem === "My Campaigns") {
            navigate("/my-campaigns");
        } else if (menuItem === "Profile") {
            navigate("/user-profile");
        } else if (menuItem === "Billing") {
            navigate("/billing");
        } else if (menuItem === "Notifications") {
            navigate("/notifications");
        }
    };

    const handleUnsaveCampaign = async (campaignIdToUnsave) => {
        if (!userProfile.isAuthenticated) {
            showErrorMessage('Please log in to unsave campaigns.');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await fetch('https://server-fundify.up.railway.app/api/users/saved-campaigns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ campaignId: campaignIdToUnsave }),
            });

            if (response.ok) {
                showSuccessMessage('Campaign unsaved.');
                const updatedSavedCampaignsIds = userProfile.savedCampaigns.filter(id => id !== campaignIdToUnsave);
                const updatedSavedCampaignsData = savedCampaignsData.filter(campaign => campaign._id !== campaignIdToUnsave);
                setUserProfile(prev => ({ ...prev, savedCampaigns: updatedSavedCampaignsIds }));
                setSavedCampaignsData(updatedSavedCampaignsData);
            } else {
                const errorData = await response.json();
                showErrorMessage(`Failed to unsave campaign: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error unsaving campaign:', error);
            showErrorMessage('An error occurred while unsaving the campaign.');
        }
    };

    const handleCreateNewCampaign = () => {
        const kycStatus = userProfile.kycStatus;
        console.log("KYC Status:", kycStatus);

        if (kycStatus === 'Approved') {
            navigate("/create-campaign");
        } else if (kycStatus === 'Rejected') {
            showErrorMessage('You are not a verified user by FUNDIFY. Please complete your KYC first.');
        } else if (kycStatus === 'Pending Review') {
            showErrorMessage('Please wait for verification by FUNDIFY.');
        } else {
            showErrorMessage('Please submit your KYC first.');
        }
    };

    // NEW: Function to handle prediction request
    const handleViewPrediction = async (campaign) => {
        setShowPredictionModal(true);
        setCurrentPrediction(null); // Clear previous prediction
        setIsPredicting(true);
        setPredictionError(null);

        try {
            // Extract features from the campaign object for the model
            // These must match the CampaignData BaseModel in your FastAPI main.py
            const dataForFastAPI = {
                category: campaign.category,
                currency: campaign.currency, // Assuming 'currency' field exists on your campaign object
                country: campaign.location, // Assuming 'location' field maps to 'country'
                goal_amount: parseFloat(campaign.goalAmount),
                duration_days: parseInt((new Date(campaign.deadline) - new Date(campaign.launched)) / (1000 * 60 * 60 * 24)), // Calculate duration
            };

            // Basic validation before sending to backend
            if (!dataForFastAPI.category || !dataForFastAPI.currency || !dataForFastAPI.country || isNaN(dataForFastAPI.goal_amount) || isNaN(dataForFastAPI.duration_days)) {
                throw new Error("Missing or invalid data for prediction. Ensure category, currency, country, goalAmount, deadline, and launched fields are available on the campaign object.");
            }

            const response = await axios.post('/api/predict-campaign', dataForFastAPI); // Call your Node.js backend endpoint

            setCurrentPrediction(response.data);
        } catch (err) {
            console.error("Error fetching prediction:", err);
            setPredictionError(err.response?.data?.error || err.response?.data?.message || err.message || "An unknown error occurred during prediction.");
            setCurrentPrediction(null);
        } finally {
            setIsPredicting(false);
        }
    };


    if (loading || loadingUserContext) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
                <p className="text-xl text-gray-600">Loading campaigns...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
                <p className="text-red-600 text-xl mb-4">Error: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-[#4A5D45] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <HeaderLayout hideProfile={true} />

            <div className="flex flex-grow flex-col md:flex-row bg-gray-50">

                {/* Desktop Profile Sidebar */}
                <div className="hidden md:block w-64 flex-shrink-0">
                    <SideBar
                        activeItem={activeMenuItem}
                        onItemClick={handleMenuItemClick}
                        handleLogout={() => setShowConfirmLogout(true)}
                        isMobileOpen={false}
                        toggleMobile={() => { }}
                    />
                </div>

                {/* Mobile Profile Sidebar Button */}
                <div className="md:hidden flex justify-start p-4 bg-gray-50">
                    <button
                        onClick={toggleProfileSidebar}
                        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 rounded"
                        aria-label="Toggle profile sidebar"
                    >
                        {isProfileSidebarOpen ? (
                            <XMarkIcon className="h-8 w-8" />
                        ) : (
                            <Bars3Icon className="h-8 w-8" />
                        )}
                    </button>
                </div>

                {/* Mobile Profile Sidebar Overlay (when open) */}
                {isProfileSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        onClick={toggleProfileSidebar}
                    ></div>
                )}

                {/* Mobile Profile Sidebar Drawer (when open) */}
                <div
                    className={`fixed top-0 left-0 h-full bg-white w-64 z-50 transform transition-transform duration-300 ease-in-out md:hidden
                        ${isProfileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <SideBar
                        activeItem={activeMenuItem}
                        onItemClick={handleMenuItemClick}
                        handleLogout={() => setShowConfirmLogout(true)}
                        isMobileOpen={isProfileSidebarOpen}
                        toggleMobile={toggleProfileSidebar}
                    />
                </div>


                {/* Main content area */}
                <main className="flex-grow container mx-auto px-4 py-6 md:ml-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">My Campaigns</h1>
                        <button
                            className="bg-[#4A5D45] text-white py-2 px-4 rounded-md text-sm whitespace-nowrap hover:bg-opacity-90 transition-colors w-full sm:w-auto"
                            onClick={handleCreateNewCampaign}
                        >
                            Create New Campaign
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
                            <button
                                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === "All campaigns" ? "border-b-2 border-[#4A5D45] text-[#4A5D45]" : "text-gray-600 hover:text-gray-900"}`}
                                onClick={() => setActiveTab("All campaigns")}
                            >
                                All campaigns
                            </button>
                            <button
                                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === "Saved Campaigns" ? "border-b-2 border-[#4A5D45] text-[#4A5D45]" : "text-gray-600 hover:text-gray-900"}`}
                                onClick={() => setActiveTab("Saved Campaigns")}
                            >
                                Saved Campaigns
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="mb-4 relative">
                            <input
                                type="text"
                                placeholder="Search campaigns"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A5D45]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>

                        {/* Campaigns Table - Made responsive with overflow-x-auto */}
                        <div className="overflow-x-auto shadow-sm rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Campaign Title
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Funds Raised
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Total Backers
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Progress
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Created Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                        {activeTab === "All campaigns" && ( // Only show prediction button for user's own campaigns
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Prediction
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCampaigns.length > 0 ? (
                                        filteredCampaigns.map((campaign) => (
                                            <tr key={campaign._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {campaign.title}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                        ${campaign.status === 'Active' || campaign.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                            campaign.status === 'Pending Review' || campaign.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'}`}>
                                                        {campaign.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    Rs. {Number(campaign.raised || 0).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {campaign.totalBackers || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {`${Math.min(((Number(campaign.raised) || 0) / (Number(campaign.goalAmount) || 1)) * 100, 100).toFixed(0)}%`}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(campaign.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center space-x-2">
                                                    <button
                                                        onClick={() => navigate(`/ProjectView?id=${campaign._id}`)}
                                                        className="text-[#4A5D45] hover:underline text-sm"
                                                    >
                                                        View
                                                    </button>
                                                    {activeTab === 'All campaigns' && campaign.status === 'Draft' && (
                                                        <button
                                                            onClick={() => navigate("/campaign-creation-05", { state: { campaignData: campaign } })}
                                                            className="text-blue-600 hover:underline text-sm"
                                                        >
                                                            Edit
                                                        </button>
                                                    )}
                                                    {activeTab === 'Saved Campaigns' && (
                                                        <button
                                                            onClick={() => handleUnsaveCampaign(campaign._id)}
                                                            className="text-red-600 hover:underline text-sm"
                                                        >
                                                            Unsave
                                                        </button>
                                                    )}
                                                </td>
                                                {activeTab === "All campaigns" && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <button
                                                            onClick={() => handleViewPrediction(campaign)}
                                                            className="bg-[#4A5D45] text-white py-1 px-3 rounded-md text-xs hover:bg-opacity-90 transition-colors"
                                                        >
                                                            View Prediction
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No campaigns found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {showConfirmLogout && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs sm:max-w-sm text-center">
                        <h2 className="text-lg font-semibold mb-4">Confirm Sign Out</h2>
                        <p className="mb-6">Are you sure you want to sign out?</p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-x-4 sm:space-y-0">
                            <button
                                onClick={() => setShowConfirmLogout(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-[#4b5945] text-white px-4 py-2 rounded hover:bg-[#B2C9AD] w-full sm:w-auto"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Prediction Modal */}
            <PredictionModal
                show={showPredictionModal}
                onClose={() => setShowPredictionModal(false)}
                predictionData={currentPrediction}
                isLoading={isPredicting}
                error={predictionError}
            />

            <FooterLayout />
        </div>
    );
}

export default MyCampaigns;