// src/Pages/ExploreCampaigns.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import HeaderLayout from "./Layout/HeaderLayout";
import FooterLayout from "./Layout/FooterLayout";
import axios from "axios";
import { useUser } from '../context/UserContext';
import { Heart } from 'lucide-react';
import { showSuccessMessage, showErrorMessage } from '../utils/toast'; // Import toast functions

// Define the full list of categories
const allCategories = [
  { id: "all", label: "All" },
  { id: "Art", label: "Art" },
  { id: "Business", label: "Business" },
  { id: "Comics", label: "Comics" },
  { id: "Crafts", label: "Crafts" },
  { id: "Dance", label: "Dance" },
  { id: "Design", label: "Design" },
  { id: "Education", label: "Education" },
  { id: "Fashion", label: "Fashion" },
  { id: "Film & Video", label: "Film & Video" },
  { id: "Food", label: "Food" },
  { id: "Games", label: "Games" },
  { id: "Journalism", label: "Journalism" },
  { id: "Medical", label: "Medical" },
  { id: "Music", label: "Music" },
  { id: "Nonprofit", label: "Nonprofit" },
  { id: "Photography", label: "Photography" },
  { id: "Publishing", label: "Publishing" },
  { id: "Technology", label: "Technology" },
  { id: "Theater", label: "Theater" },
  { id: "Other", label: "Other" },
];

const formatCurrency = (amount) => `Rs. ${amount.toLocaleString()}`;

// CampaignCard now accepts onSelectForDonation as props
function CampaignCard({ campaign, onSelectForDonation }) { // Removed showToast prop
  const safeRaised = Number(campaign.raised) || 0;
  const safeGoal = Number(campaign.goalAmount) || 1;
  const progressPercentage = (safeRaised / safeGoal) * 100;
  const navigate = useNavigate();
  const { userProfile, setUserProfile } = useUser();
  const isCampaignSaved = userProfile.savedCampaigns?.includes(campaign._id);

  const handleToggleSave = async (e) => {
    e.stopPropagation();
    if (!userProfile.isAuthenticated) {
      showErrorMessage('Please log in to save campaigns.'); // Replaced showToast
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/users/saved-campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ campaignId: campaign._id }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.saved) {
          showSuccessMessage('Campaign saved successfully!'); // Replaced showToast
          setUserProfile(prev => ({ ...prev, savedCampaigns: [...(prev.savedCampaigns || []), campaign._id] }));
        } else {
          showSuccessMessage('Campaign unsaved.'); // Replaced showToast
          setUserProfile(prev => ({ ...prev, savedCampaigns: (prev.savedCampaigns || []).filter(id => id !== campaign._id) }));
        }
      } else {
        const errorData = await response.json();
        showErrorMessage(`Failed to save/unsave campaign: ${errorData.message}`); // Replaced showToast
      }
    } catch (error) {
      console.error('Error toggling saved campaign:', error);
      showErrorMessage('An error occurred while saving/unsaving the campaign.'); // Replaced showToast
    }
  };

  const handleCardClick = () => {
    if (onSelectForDonation) {
      onSelectForDonation(campaign._id);
    } else {
      navigate(`/ProjectView?id=${campaign._id}`);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm flex flex-col cursor-pointer" onClick={handleCardClick}>
      <img
        src={campaign.mediaUrls && campaign.mediaUrls.length > 0 ? `http://localhost:5000${campaign.mediaUrls[0]}` : "/placeholder.svg"}
        alt={campaign.title}
        className="w-full h-48 object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src="/placeholder.svg" }}
      />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold">{campaign.title}</h3>
          <span className="text-sm text-gray-600">{campaign.location}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4 h-20 overflow-hidden">
          {campaign.description}
        </p>
        <div className="flex justify-between text-sm mb-2 mt-auto">
          <span className="font-medium text-gray-700">{formatCurrency(safeRaised)}</span>
          <span className="font-medium text-[#65835e]">{Math.min(progressPercentage, 100).toFixed(0)}% Funded</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="bg-[#65835e] h-1.5 rounded-full" style={{ width: `${Math.min(progressPercentage, 100)}%` }}></div>
        </div>

        {/* Buttons - Conditional rendering based on onSelectForDonation prop */}
        <div className="flex justify-between mt-4">
          {onSelectForDonation ? (
            <button
              onClick={(e) => { e.stopPropagation(); onSelectForDonation(campaign._id); }}
              className="w-full bg-[#4A5D45] text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Select to Donate
            </button>
          ) : (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/ProjectView?id=${campaign._id}`); }}
                className="bg-[#65835e] text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
                Explore
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigate("/donate", { state: { campaignId: campaign._id } }); }}
                className="bg-[#65835e] text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
                Donate
              </button>
              <button
                onClick={handleToggleSave}
                className={`ml-2 p-2 rounded-full ${isCampaignSaved ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'} hover:bg-red-600 hover:text-white transition-colors`}
                title={isCampaignSaved ? 'Unsave Campaign' : 'Save Campaign'}
              >
                <Heart className="h-5 w-5" fill={isCampaignSaved ? 'currentColor' : 'none'} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ExploreCampaigns now does NOT accept showToast as a prop
export default function ExploreCampaigns() { // Removed showToast prop
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCampaignsCount, setVisibleCampaignsCount] = useState(6);
  const navigate = useNavigate(); // Get navigate from react-router-dom
  const location = useLocation(); // Get location from react-router-dom

  // Check if we are in "select for donation" mode
  const isSelectForDonationMode = location.state?.purpose === "select-for-donation";

  const categories = allCategories;

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/campaigns");

        const fetchedCampaigns = response.data.campaigns || [];

        const activeCampaigns = fetchedCampaigns.filter(
          campaign => campaign.status === 'Active' || campaign.status === 'Approved'
        );
        setCampaigns(activeCampaigns);
        setError(null);
      } catch (err) {
        console.error("Error fetching campaigns for explore page:", err);
        if (err.response && err.response.status === 403) {
            showErrorMessage("Access denied. You may need to log in as an admin to view certain campaigns."); // Replaced alert
            setError("Access denied. You may need to log in as an admin to view certain campaigns.");
        } else {
            showErrorMessage("Failed to load campaigns. Please try again later."); // Replaced alert
            setError("Failed to load campaigns. Please try again later.");
        }
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesCategory =
      selectedCategory === "all" || campaign.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const loadMore = () => {
    setVisibleCampaignsCount((prev) => prev + 3);
  };

  // Function to handle campaign selection when in donation mode
  const handleSelectForDonation = (campaignId) => {
    navigate("/donate", { state: { campaignId: campaignId } });
  };

  if (loading) {
    return (
      <main>
        <HeaderLayout />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-xl text-gray-600">Loading campaigns...</p>
        </div>
        <FooterLayout />
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <HeaderLayout />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-red-600 text-xl">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#4A5D45] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Retry
          </button>
        </div>
        <FooterLayout />
      </main>
    );
  }

  return (
    <main>
      <HeaderLayout />
      <div className="max-w-7xl mx-auto px-4 py-12 mt-2">
        <h2 className="text-4xl font-bold mb-6 mt-2 text-[#4A5D45] text-center">Explore Campaigns</h2>

        {/* Message for donation selection mode */}
        {isSelectForDonationMode && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
            <p className="font-bold">Please select the campaign first where you want to donate.</p>
            <p className="text-sm">Click on any campaign card to proceed to donation.</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Find campaigns..."
            className="w-full px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === category.id
                  ? "bg-[#4A5D45] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No campaigns found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 ">
            {filteredCampaigns.slice(0, visibleCampaignsCount).map((campaign) => (
              <CampaignCard
                key={campaign._id}
                campaign={campaign}
                // Pass onSelectForDonation prop only when in selection mode
                onSelectForDonation={isSelectForDonationMode ? handleSelectForDonation : null}
              />
            ))}
          </div>
        )}

        {visibleCampaignsCount < filteredCampaigns.length && (
          <div className="flex justify-center">
            <button onClick={loadMore} className="bg-[#4A5D45] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors">
              Load More
            </button>
          </div>
        )}
      </div>
      <FooterLayout />
    </main>
  );
}