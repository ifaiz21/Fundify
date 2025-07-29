"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from "../utils/toast";

// YEH AAPKA MAIN REFACTORED COMPONENT HAI
function MyCampaignsPage({ user }) {
    const navigate = useNavigate();

    // State variables
    const [campaigns, setCampaigns] = useState([]);
    const [savedCampaignsData, setSavedCampaignsData] = useState([]);
    const [activeTab, setActiveTab] = useState("All campaigns");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
    }, [user, navigate]);

    useEffect(() => {
        fetchMyCampaignsAndSaved();
    }, [fetchMyCampaignsAndSaved]);

    const displayedCampaigns = activeTab === "All campaigns" ? campaigns : savedCampaignsData;

    const filteredCampaigns = displayedCampaigns.filter(campaign =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUnsaveCampaign = async (campaignIdToUnsave) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('https://server-fundify.up.railway.app/api/users/saved-campaigns', 
                { campaignId: campaignIdToUnsave },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            showSuccessMessage('Campaign unsaved.');
            const updatedSavedCampaignsData = savedCampaignsData.filter(campaign => campaign._id !== campaignIdToUnsave);
            setSavedCampaignsData(updatedSavedCampaignsData);
        } catch (error) {
            console.error('Error unsaving campaign:', error);
            showErrorMessage('Failed to unsave campaign.');
        }
    };
    
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
    
    if (loading) {
        return <p className="text-center py-10">Loading your campaigns...</p>;
    }

    if (error) {
        return <p className="text-center py-10 text-red-600">Error: {error}</p>;
    }

    return (
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
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No campaigns found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default MyCampaignsPage;