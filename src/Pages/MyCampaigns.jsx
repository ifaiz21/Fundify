// src/Pages/MyCampaigns.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLayout from "./Layout/HeaderLayout";
import FooterLayout from "./Layout/FooterLayout";
import { useUser } from '../context/UserContext';
import SideBar from '../components/SideBar';

function MyCampaigns({ showToast }) {
  const { userProfile, setUserProfile, loadingUserContext } = useUser();
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState("All campaigns");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // CORRECTED: useState(true)
  const [error, setError] = useState(null);

  const [activeMenuItem, setActiveMenuItem] = useState("My Campaigns");
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  // Dummy data for now, replace with API fetch later
  const dummyCampaigns = [
    { id: 1, name: "Summer Sale", status: "Active", fundRaise: "$500", backers: "$250", createdDate: "07/15/2023", donation: "5%" },
    { id: 2, name: "Back to School", status: "Paused", fundRaise: "$1,000", backers: "$750", createdDate: "08/01/2023", donation: "5%" },
    { id: 3, name: "Holiday Promotion", status: "Ended", fundRaise: "$2,000", backers: "$1,500", createdDate: "11/20/2023", donation: "5%" },
    { id: 4, name: "Spring Collection", status: "Active", fundRaise: "$750", backers: "$375", createdDate: "03/10/2024", donation: "5%" },
    { id: 5, name: "Winter Clearance", status: "Paused", fundRaise: "$1,250", backers: "$875", createdDate: "12/28/2023", donation: "5%" },
    { id: 6, name: "Fall Fashion", status: "Ended", fundRaise: "$2,500", backers: "$2,000", createdDate: "09/05/2023", donation: "5%" },
    { id: 7, name: "New Arrivals", status: "Active", fundRaise: "$600", backers: "$300", createdDate: "01/20/2024", donation: "5%" },
    { id: 8, name: "Clearance Sale", status: "Paused", fundRaise: "$1,100", backers: "$800", createdDate: "06/02/2023", donation: "5%" },
    { id: 9, name: "Summer Collection", status: "Ended", fundRaise: "$2,200", backers: "$1,800", createdDate: "05/15/2023", donation: "5%" },
    { id: 10, name: "Back to School Sale", status: "Active", fundRaise: "$800", backers: "$400", createdDate: "08/05/2023", donation: "5%" },
  ];

  useEffect(() => {
    if (!loadingUserContext) {
      if (!userProfile.isAuthenticated) {
        setError("No authentication token found or session expired. Please log in.");
        navigate("/login");
        return;
      } else {
        setLoading(true);
        setTimeout(() => { // Simulate API call delay
          setCampaigns(dummyCampaigns);
          setLoading(false);
        }, 500);
      }
    }
  }, [userProfile.isAuthenticated, loadingUserContext, navigate, setUserProfile]);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "All campaigns" || (activeTab === "Saved Campaigns" && true); // Placeholder
    return matchesSearch && matchesTab;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowConfirmLogout(false);
    setUserProfile(prev => ({ ...prev, profilePictureUrl: null, isAuthenticated: false }));
    navigate("/login");
  };

  const handleMenuItemClick = (itemName) => {
    setActiveMenuItem(itemName);
    if (itemName === "Logout") {
      setShowConfirmLogout(true);
    } else if (itemName === "Profile") {
        navigate("/user-profile");
    } else if (itemName === "Billing") {
        navigate("/billing");
    } else if (itemName === "Notifications") {
        navigate("/notifications");
    } else if (itemName === "My Campaigns") {
        // Already on this page, no navigation needed
    }
  };

  if (loading || loadingUserContext) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Loading campaigns...</p>
      </div>
    );
  }

  if (error && !userProfile.isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
        <p className="text-red-600 text-xl mb-4">Error: {error}</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-[#4A5D45] text-white py-2 px-4 rounded"
        >
          Go to Login
        </button>
      </div>
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
            <button className="bg-[#4A5D45] text-white py-2 px-4 rounded-md text-sm whitespace-nowrap">
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
                  {/* You might need to adjust this tab logic based on how "Saved Campaigns" are filtered */}
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bold"> {/* Added font-bold */}
                      Campaign
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bold"> {/* Added font-bold */}
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bold"> {/* Added font-bold */}
                      Fund raise
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bold"> {/* Added font-bold */}
                      Backers
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bold"> {/* Added font-bold */}
                      Created Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bold"> {/* Added font-bold */}
                      Donation %
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {campaign.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${campaign.status === 'Active' ? 'bg-green-100 text-green-800' :
                             campaign.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' :
                             'bg-red-100 text-red-800'}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.fundRaise}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.backers}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.createdDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.donation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCampaigns.length === 0 && !loading && (
                <p className="text-center text-gray-500 py-4">No campaigns found.</p>
              )}
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