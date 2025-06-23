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
  const { userProfile, loadingUserContext } = useUser();
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState("All campaigns");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeMenuItem, setActiveMenuItem] = useState("My Campaigns");
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  useEffect(() => {
    // Only attempt to fetch data once user context has finished loading
    if (!loadingUserContext) {
      // If user is not authenticated or user ID is missing after context loads,
      // then redirect to login. This is the condition that triggers logout.
      if (!userProfile.isAuthenticated || !userProfile.id) {
        setError("Authentication required or user ID not found. Please log in.");
        navigate("/login");
        return; // Stop execution of this effect
      }

      const fetchMyCampaigns = async () => {
        setLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem('token');
          // No longer need userId as a query parameter; backend will use req.user.id
          const response = await axios.get(`http://localhost:5000/api/campaigns/my-campaigns`, { // UPDATED URL
            headers: {
              'Authorization': `Bearer ${token}`, // Send the token in the header
            },
          });

          // Assuming the backend returns an object with a 'campaigns' array
          const fetchedCampaigns = response.data?.campaigns || [];
          setCampaigns(fetchedCampaigns);
          setError(null); // Clear any previous error
        } catch (err) {
          console.error("Error fetching my campaigns:", err);
          // Handle specific error codes from the backend
          if (err.response) {
            if (err.response.status === 401 || err.response.status === 403) {
              // If unauthorized or forbidden, clear token and redirect to login
              localStorage.removeItem('token');
              localStorage.removeItem('userProfile'); // Assuming userProfile is also stored here
              setError("Session expired or unauthorized. Please log in again.");
              navigate("/login");
              showToast('Session expired, please log in again.', 'error'); // Show a toast notification
            } else {
              setError(`Failed to load your campaigns: ${err.response.data?.message || err.message}`);
            }
          } else {
            setError("Network error or server unreachable. Please try again later.");
          }
          setCampaigns([]); // Clear campaigns on error
        } finally {
          setLoading(false);
        }
      };

      fetchMyCampaigns();
    }
  }, [userProfile.isAuthenticated, userProfile.id, loadingUserContext, navigate, showToast]); // Added showToast to dependencies

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()); // Corrected from campaign.name to campaign.title
    // Adjust the tab filtering logic if "Saved Campaigns" implies something other than created campaigns
    const matchesTab = activeTab === "All campaigns" || (activeTab === "Saved Campaigns" && campaign.status === 'Draft'); // Example: show drafts for "Saved"
    return matchesSearch && matchesTab;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile'); // Make sure this matches where you store user data
    navigate('/login');
    setShowConfirmLogout(false);
    showToast('You have been logged out successfully!', 'success');
  };

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    if (menuItem === "My Campaigns") {
      navigate("/my-campaigns");
    } else if (menuItem === "Profile") {
      navigate("/profile");
    } else if (menuItem === "Billing") {
      navigate("/billing");
    } else if (menuItem === "Help & Support") { // Assuming Help & Support maps to contactus
      navigate("/contactus");
    }
    // No explicit logout here; rely on useEffect for session checks on page load
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
            <button className="bg-[#4A5D45] text-white py-2 px-4 rounded-md text-sm whitespace-nowrap" onClick={() => navigate("/create-campaign")}>
              New campaign
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
                  Saved Campaigns (Drafts)
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bold">
                      Campaign Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bold">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bold">
                      Funds Raised
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bold">
                      Total Backers
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bold">
                      Created Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bold">
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
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                  onClick={() => navigate(`/ProjectView?id=${campaign._id}`)}
                                  className="text-[#4A5D45] hover:underline text-sm mr-2"
                              >
                                  View
                              </button>
                              {campaign.status === 'Draft' && ( // Only allow editing drafts
                                <button
                                    onClick={() => navigate("/campaign-creation-05", { state: { campaignData: campaign } })} // Pass entire campaign object for editing
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    Edit
                                </button>
                              )}
                          </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No campaigns found.</td>
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