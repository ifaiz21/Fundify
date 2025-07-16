// src/Pages/MyCampaigns.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLayout from "./Layout/HeaderLayout";
import FooterLayout from "./Layout/FooterLayout";
import { useUser } from '../context/UserContext';
import SideBar from '../components/SideBar';
import axios from 'axios'; // Import axios

function MyCampaigns({ showToast }) {
  // Corrected: Destructure setUserProfile from useUser()
  const { userProfile, loadingUserContext, setUserProfile } = useUser();
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]); // All campaigns created by user
  const [savedCampaignsData, setSavedCampaignsData] = useState([]); // Full data for saved campaigns
  const [activeTab, setActiveTab] = useState("All campaigns");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeMenuItem, setActiveMenuItem] = useState("My Campaigns");
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  useEffect(() => {
    if (!loadingUserContext) {
      if (!userProfile.isAuthenticated || !userProfile.id) {
        setError("Authentication required or user ID not found. Please log in.");
        navigate("/login");
        return;
      }

      const fetchMyCampaignsAndSaved = async () => {
        setLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem('token');

          // Fetch campaigns created by the user
          const myCampaignsResponse = await axios.get(`https://fundify-server.vercel.app/api/campaigns/my-campaigns`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          setCampaigns(myCampaignsResponse.data?.campaigns || []);

          // Fetch details for saved campaigns
          const fetchedSavedCampaignsDetails = [];
          if (userProfile.savedCampaigns && userProfile.savedCampaigns.length > 0) {
            // Fetch each saved campaign's details individually
            // OPTIMIZATION: Ideally, the backend should provide a single endpoint
            // to fetch multiple campaigns by their IDs to reduce API calls.
            for (const campaignId of userProfile.savedCampaigns) {
              try {
                const response = await axios.get(`https://fundify-server.vercel.app/api/campaigns/${campaignId}`);
                fetchedSavedCampaignsDetails.push(response.data);
              } catch (fetchError) {
                console.warn(`Failed to fetch saved campaign ${campaignId}:`, fetchError);
                // Continue even if one saved campaign fails to fetch
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
              showToast('Session expired, please log in again.', 'error');
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
      };

      fetchMyCampaignsAndSaved();
    }
  }, [userProfile.isAuthenticated, userProfile.id, userProfile.savedCampaigns, loadingUserContext, navigate, showToast]);

  // Determine which campaigns to display based on the active tab
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
    showToast('You have been logged out successfully!', 'success');
  };

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    if (menuItem === "My Campaigns") {
      navigate("/my-campaigns");
    } else if (menuItem === "Profile") {
      navigate("/user-profile"); // Assuming /user-profile is the correct route
    } else if (menuItem === "Billing") {
      navigate("/billing");
    } else if (menuItem === "Help & Support") {
      navigate("/contactus"); // Assuming Help & Support maps to contactus
    }
  };

  // Function to handle unsaving a campaign from the "Saved Campaigns" tab
  const handleUnsaveCampaign = async (campaignIdToUnsave) => {
    if (!userProfile.isAuthenticated) {
      showToast('Please log in to unsave campaigns.', 'info');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://fundify-server.vercel.app/api/users/saved-campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ campaignId: campaignIdToUnsave }),
      });

      if (response.ok) {
        showToast('Campaign unsaved.', 'info');
        // Update userProfile state to reflect the change
        const updatedSavedCampaignsIds = userProfile.savedCampaigns.filter(id => id !== campaignIdToUnsave);
        const updatedSavedCampaignsData = savedCampaignsData.filter(campaign => campaign._id !== campaignIdToUnsave);
        setUserProfile(prev => ({ ...prev, savedCampaigns: updatedSavedCampaignsIds }));
        setSavedCampaignsData(updatedSavedCampaignsData); // Also update the local state for immediate UI refresh
      } else {
        const errorData = await response.json();
        showToast(`Failed to unsave campaign: ${errorData.message}`, 'error');
      }
    } catch (error) {
      console.error('Error unsaving campaign:', error);
      showToast('An error occurred while unsaving the campaign.', 'error');
    }
  };

  const handleCreateNewCampaign = () => {
    const kycStatus = userProfile.kycStatus;
    console.log("KYC Status:", kycStatus); // Debugging line

    if (kycStatus === 'Approved') {
      navigate("/create-campaign");
    } else if (kycStatus === 'Rejected') {
      showToast('You are not a verified user by FUNDIFY. Please complete your KYC first.', 'error');
    } else if (kycStatus === 'Pending Review') {
      showToast('Please wait for verification by FUNDIFY.', 'info');
    } else { // Covers cases like undefined, null, or any other status indicating not submitted
      showToast('Please submit your KYC first.', 'info');
    }
  };

  if (loading || loadingUserContext) {
    return (
      <HeaderLayout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-600">Loading campaigns...</p>
        </div>
      </HeaderLayout>
    );
  }

  if (error) {
    return (
      <HeaderLayout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#4A5D45] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Retry
          </button>
        </div>
      </HeaderLayout>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLayout hideProfile={true}/>

      <div className="flex flex-grow bg-gray-50">
        <SideBar activeItem={activeMenuItem} onItemClick={handleMenuItemClick} handleLogout={() => setShowConfirmLogout(true)} />

        <main className="flex-grow container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Campaigns</h1>
            <button
              className="bg-[#4A5D45] text-white py-2 px-4 rounded-md text-sm whitespace-nowrap"
              onClick={handleCreateNewCampaign} // This line needs to be updated
            >
              Create New Campaign
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === "All campaigns" ? "border-b-2 border-[#4A5D45] text-[#4A5D45]" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => setActiveTab("All campaigns")}
              >
                All campaigns
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === "Saved Campaigns" ? "border-b-2 border-[#4A5D45] text-[#4A5D45]" : "text-gray-600 hover:text-gray-900"}`}
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
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider font-bold">
                      Campaign Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider font-bold">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider font-bold">
                      Funds Raised
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider font-bold">
                      Total Backers
                    </th>
                    {/* New header for Progress */}
                    <th scope="col" className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider font-bold">
                      Progress
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider font-bold">
                      Created Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider font-bold">
                      Actions
                    </th>
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
                        {/* Display percentage funded */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {`${Math.min(((Number(campaign.raised) || 0) / (Number(campaign.goalAmount) || 1)) * 100, 100).toFixed(0)}%`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => navigate(`/ProjectView?id=${campaign._id}`)}
                            className="text-[#4A5D45] hover:underline text-sm mr-2"
                          >
                            View
                          </button>
                          {/* Show Edit button only for 'All campaigns' tab and 'Draft' status */}
                          {activeTab === 'All campaigns' && campaign.status === 'Draft' && (
                            <button
                              onClick={() => navigate("/campaign-creation-05", { state: { campaignData: campaign } })}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Edit
                            </button>
                          )}
                          {/* Show Unsave button only for 'Saved Campaigns' tab */}
                          {activeTab === 'Saved Campaigns' && (
                            <button
                              onClick={() => handleUnsaveCampaign(campaign._id)}
                              className="text-red-600 hover:underline text-sm ml-2"
                            >
                              Unsave
                            </button>
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
        </main>
      </div>

      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Sign Out</h2>
            <p className="mb-6">Are you sure you want to sign out?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirmLogout(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="bg-[#4b5945] text-white px-4 py-2 rounded"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterLayout />
    </div>
  );
}

export default MyCampaigns;