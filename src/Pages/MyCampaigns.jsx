// src/Pages/MyCampaignsPage.jsx  (Refactored Code)
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate ko create/edit ke liye rakha hai
import axios from 'axios';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { showSuccessMessage, showErrorMessage } from "../utils/toast";

// Prediction Modal Component (Yeh jaisa tha waisa hi rahega)
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

// --- YEH AAPKA MAIN REFACTORED COMPONENT HAI ---
// Ab yeh 'user' object ko as a prop receive kar raha hai.
function MyCampaignsPage({ user }) {
    const navigate = useNavigate();

    // State variables jo is component ke liye zaroori hain
    const [campaigns, setCampaigns] = useState([]);
    const [savedCampaignsData, setSavedCampaignsData] = useState([]);
    const [activeTab, setActiveTab] = useState("All campaigns");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Prediction Modal ke liye states
    const [showPredictionModal, setShowPredictionModal] = useState(false);
    const [currentPrediction, setCurrentPrediction] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [predictionError, setPredictionError] = useState(null);

    // Data fetching logic ab 'user' prop par depend karega
    const fetchMyCampaignsAndSaved = useCallback(async () => {
        if (!user) {
            setLoading(false);
            setError("User data not available.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication token not found.");
                navigate("/login");
                return;
            }

            // User ki apni campaigns fetch karein
            const myCampaignsResponse = await axios.get(`https://server-fundify.up.railway.app/api/campaigns/my-campaigns`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setCampaigns(myCampaignsResponse.data?.campaigns || []);

            // User ki saved campaigns fetch karein
            const fetchedSavedCampaignsDetails = [];
            if (user.savedCampaigns && user.savedCampaigns.length > 0) {
                for (const campaignId of user.savedCampaigns) {
                    try {
                        const response = await axios.get(`https://server-fundify.up.railway.app/api/campaigns/${campaignId}`);
                        fetchedSavedCampaignsDetails.push(response.data);
                    } catch (fetchError) {
                        console.warn(`Failed to fetch saved campaign ${campaignId}:`, fetchError);
                    }
                }
            }
            setSavedCampaignsData(fetchedSavedCampaignsDetails);

        } catch (err) {
            console.error("Error fetching campaigns data:", err);
            setError(`Failed to load campaigns: ${err.response?.data?.message || err.message}`);
            setCampaigns([]);
            setSavedCampaignsData([]);
        } finally {
            setLoading(false);
        }
    }, [user, navigate]); // Dependency array mein 'user' hai

    useEffect(() => {
        // Jab bhi 'user' prop milega ya change hoga, data fetch hoga
        fetchMyCampaignsAndSaved();
    }, [fetchMyCampaignsAndSaved]);

    const displayedCampaigns = activeTab === "All campaigns" ? campaigns : savedCampaignsData;

    const filteredCampaigns = displayedCampaigns.filter(campaign =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 'handleUnsaveCampaign' ab 'user' prop se data lega
    const handleUnsaveCampaign = async (campaignIdToUnsave) => {
        const token = localStorage.getItem('token');
        // Is function ko parent se aane walay `updateUser` function ki zaroorat hogi
        // Filhal, hum sirf local state update kar rahe hain
        try {
            await axios.post('https://server-fundify.up.railway.app/api/users/saved-campaigns', 
                { campaignId: campaignIdToUnsave },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            showSuccessMessage('Campaign unsaved.');
            // Local state se unsaved campaign hata dein
            const updatedSavedCampaignsData = savedCampaignsData.filter(campaign => campaign._id !== campaignIdToUnsave);
            setSavedCampaignsData(updatedSavedCampaignsData);
        } catch (error) {
            console.error('Error unsaving campaign:', error);
            showErrorMessage('Failed to unsave campaign.');
        }
    };
    
    // 'handleCreateNewCampaign' ab 'user' prop se KYC status check karega
    const handleCreateNewCampaign = () => {
        const kycStatus = user?.kycStatus;
        if (kycStatus === 'Approved') {
            navigate("/create-campaign");
        } else if (kycStatus === 'Rejected') {
            showErrorMessage('You are not a verified user. Please complete your KYC first.');
        } else if (kycStatus === 'Pending Review') {
            showErrorMessage('Please wait for your KYC to be verified.');
        } else {
            showErrorMessage('Please submit your KYC first.');
        }
    };
    
    // Prediction handler (yeh jaisa tha waisa hi rahega)
    const handleViewPrediction = async (campaign) => {
        setShowPredictionModal(true);
        setCurrentPrediction(null);
        setIsPredicting(true);
        setPredictionError(null);
        try {
            const dataForFastAPI = {
                category: campaign.category,
                currency: campaign.currency,
                country: campaign.location,
                goal_amount: parseFloat(campaign.goalAmount),
                duration_days: parseInt((new Date(campaign.deadline) - new Date(campaign.launched)) / (1000 * 60 * 60 * 24)),
            };
            if (!dataForFastAPI.category || !dataForFastAPI.currency || !dataForFastAPI.country || isNaN(dataForFastAPI.goal_amount) || isNaN(dataForFastAPI.duration_days)) {
                throw new Error("Missing or invalid data for prediction.");
            }
            const response = await axios.post('/api/predict-campaign', dataForFastAPI);
            setCurrentPrediction(response.data);
        } catch (err) {
            console.error("Error fetching prediction:", err);
            setPredictionError(err.response?.data?.error || err.message || "An unknown error occurred.");
        } finally {
            setIsPredicting(false);
        }
    };

    if (loading) {
        return <p className="text-center py-10">Loading your campaigns...</p>;
    }

    if (error) {
        return <p className="text-center py-10 text-red-600">Error: {error}</p>;
    }

    return (
        // Component ka return ab sirf zaroori content par mushtamil hai
        <div>
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

                {/* Search aur Table ka baaki JSX yahan se... */}
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

                {/* Campaigns Table */}
                <div className="overflow-x-auto shadow-sm rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* Table Head */}
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Campaign Title</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Funds Raised</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total Backers</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Progress</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Created Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                {activeTab === "All campaigns" && (
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Prediction</th>
                                )}
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCampaigns.length > 0 ? (
                                filteredCampaigns.map((campaign) => (
                                    <tr key={campaign._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${campaign.status === 'Active' || campaign.status === 'Approved' ? 'bg-green-100 text-green-800' : campaign.status === 'Pending Review' || campaign.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{campaign.status}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. {Number(campaign.raised || 0).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.totalBackers || 0}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${Math.min(((Number(campaign.raised) || 0) / (Number(campaign.goalAmount) || 1)) * 100, 100).toFixed(0)}%`}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(campaign.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center space-x-2">
                                            <button onClick={() => navigate(`/ProjectView?id=${campaign._id}`)} className="text-[#4A5D45] hover:underline text-sm">View</button>
                                            {activeTab === 'All campaigns' && campaign.status === 'Draft' && (
                                                <button onClick={() => navigate("/campaign-creation-05", { state: { campaignData: campaign } })} className="text-blue-600 hover:underline text-sm">Edit</button>
                                            )}
                                            {activeTab === 'Saved Campaigns' && (
                                                <button onClick={() => handleUnsaveCampaign(campaign._id)} className="text-red-600 hover:underline text-sm">Unsave</button>
                                            )}
                                        </td>
                                        {activeTab === "All campaigns" && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button onClick={() => handleViewPrediction(campaign)} className="bg-[#4A5D45] text-white py-1 px-3 rounded-md text-xs hover:bg-opacity-90 transition-colors">View Prediction</button>
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

            {/* Prediction Modal (yeh bhi jaisa tha waisa hi rahega) */}
            <PredictionModal
                show={showPredictionModal}
                onClose={() => setShowPredictionModal(false)}
                predictionData={currentPrediction}
                isLoading={isPredicting}
                error={predictionError}
            />
        </div>
    );
}

export default MyCampaignsPage;