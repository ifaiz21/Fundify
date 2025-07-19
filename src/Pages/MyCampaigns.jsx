// src/Pages/MyCampaigns.jsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLayout from "./Layout/HeaderLayout";
import FooterLayout from "./Layout/FooterLayout";
import { useUser } from '../context/UserContext';
import SideBar from '../components/SideBar';
import axios from 'axios'; // Import axios
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Import icons for the new sidebar button
import { showSuccessMessage, showErrorMessage } from "../utils/toast";

function MyCampaigns() { // Removed showToast prop as it's not passed from App.js in this structure
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
  // NEW STATE: State to control the DEDICATED profile sidebar visibility
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

  // Function to toggle the DEDICATED profile sidebar
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
          showErrorMessage('Session expired, please log in again.'); // Use showErrorMessage
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
  }, [userProfile.isAuthenticated, userProfile.id, userProfile.savedCampaigns, navigate, setUserProfile]); // Added setUserProfile to dependencies

  useEffect(() => {
    if (!loadingUserContext) {
      fetchMyCampaignsAndSaved();
    }
  }, [loadingUserContext, fetchMyCampaignsAndSaved]);

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
    showSuccessMessage('You have been logged out successfully!'); // Use showSuccessMessage
  };

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    // Close the DEDICATED profile sidebar if an item is clicked
    setIsProfileSidebarOpen(false); // Important: Close sidebar after navigation
    if (menuItem === "My Campaigns") {
      navigate("/my-campaigns");
    } else if (menuItem === "Profile") {
      navigate("/user-profile"); // Assuming /user-profile is the correct route
    } else if (menuItem === "Billing") {
      navigate("/billing");
    } else if (menuItem === "Notifications") { // Corrected from "Help & Support"
      navigate("/notifications"); // Assuming Notifications route
    }
  };

  // Function to handle unsaving a campaign from the "Saved Campaigns" tab
  const handleUnsaveCampaign = async (campaignIdToUnsave) => {
    if (!userProfile.isAuthenticated) {
      showErrorMessage('Please log in to unsave campaigns.'); // Use showErrorMessage
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
        showSuccessMessage('Campaign unsaved.'); // Use showSuccessMessage
        // Update userProfile state to reflect the change
        const updatedSavedCampaignsIds = userProfile.savedCampaigns.filter(id => id !== campaignIdToUnsave);
        const updatedSavedCampaignsData = savedCampaignsData.filter(campaign => campaign._id !== campaignIdToUnsave);
        setUserProfile(prev => ({ ...prev, savedCampaigns: updatedSavedCampaignsIds }));
        setSavedCampaignsData(updatedSavedCampaignsData); // Also update the local state for immediate UI refresh
      } else {
        const errorData = await response.json();
        showErrorMessage(`Failed to unsave campaign: ${errorData.message}`); // Use showErrorMessage
      }
    } catch (error) {
      console.error('Error unsaving campaign:', error);
      showErrorMessage('An error occurred while unsaving the campaign.'); // Use showErrorMessage
    }
  };

  const handleCreateNewCampaign = () => {
    const kycStatus = userProfile.kycStatus;
    console.log("KYC Status:", kycStatus); // Debugging line

    if (kycStatus === 'Approved') {
      navigate("/create-campaign");
    } else if (kycStatus === 'Rejected') {
      showErrorMessage('You are not a verified user by FUNDIFY. Please complete your KYC first.');
    } else if (kycStatus === 'Pending Review') {
      showErrorMessage('Please wait for verification by FUNDIFY.');
    } else { // Covers cases like undefined, null, or any other status indicating not submitted
      showErrorMessage('Please submit your KYC first.');
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
      {/* HeaderLayout is now independent of the profile sidebar */}
      <HeaderLayout hideProfile={true} />

      {/* Main content area: Flex container for Profile Sidebar and Main content */}
      <div className="flex flex-grow flex-col md:flex-row bg-gray-50">

        {/* Desktop Profile Sidebar (visible on medium screens and up) */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <SideBar
            activeItem={activeMenuItem}
            onItemClick={handleMenuItemClick}
            handleLogout={() => setShowConfirmLogout(true)}
            // These props are for the mobile version, not used by desktop sidebar
            isMobileOpen={false}
            toggleMobile={() => {}}
          />
        </div>

        {/* Mobile Profile Sidebar Button - Visible on small screens, hidden on md and up */}
        {/* This button toggles the DEDICATED profile sidebar */}
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
            onClick={toggleProfileSidebar} // Close profile sidebar when clicking outside
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
            isMobileOpen={isProfileSidebarOpen} // Pass mobile open state
            toggleMobile={toggleProfileSidebar} // Pass toggle function for the X button
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
            <div className="flex border-b border-gray-200 mb-4 overflow-x-auto"> {/* Added overflow-x-auto for small screens */}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center space-x-2"> {/* Added flex and space-x for buttons */}
                          <button
                            onClick={() => navigate(`/ProjectView?id=${campaign._id}`)}
                            className="text-[#4A5D45] hover:underline text-sm"
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
                              className="text-red-600 hover:underline text-sm"
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

      <FooterLayout />
    </div>
  );
}

export default MyCampaigns;
