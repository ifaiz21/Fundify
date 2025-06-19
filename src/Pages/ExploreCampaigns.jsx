// src/Pages/ExploreCampaigns.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLayout from "./Layout/HeaderLayout";
import FooterLayout from "./Layout/FooterLayout";
import axios from "axios"; // Import axios for API calls

const formatCurrency = (amount) => `Rs. ${amount.toLocaleString()}`;

function CampaignCard({ campaign }) {
  const safeRaised = Number(campaign.raised) || 0;
  const safeGoal = Number(campaign.goalAmount) || 1; // Use campaign.goalAmount, default to 1 if 0/invalid
  const progressPercentage = (safeRaised / safeGoal) * 100;
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm flex flex-col">
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
          <span className="font-medium text-[#65835e]">{formatCurrency(safeGoal)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="bg-[#65835e] h-1.5 rounded-full" style={{ width: `${Math.min(progressPercentage, 100)}%` }}></div>
        </div>

        {/* Explore and Donate Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => navigate(`/ProjectView?id=${campaign._id}`)} // FIX: Changed alert() to navigate() to ProjectView
            className="bg-[#65835e] text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
            Explore
          </button>
          <button
            onClick={() => navigate("/donate", { state: { campaignId: campaign._id } })}
            className="bg-[#65835e] text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
            Donate
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExploreCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCampaignsCount, setVisibleCampaignsCount] = useState(6);

  const categories = [
    { id: "all", label: "All" },
    { id: "disaster", label: "Disaster" },
    { id: "children", label: "Children" },
    { id: "food-crisis", label: "Food Crisis" },
    { id: "health", label: "Health" },
    { id: "education", label: "Education" },
    { id: "homeless", label: "Homeless" },
    { id: "animal", label: "Animal" },
  ];

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/campaigns");
        const activeCampaigns = response.data.filter(
          campaign => campaign.status === 'Active' || campaign.status === 'Approved'
        );
        setCampaigns(activeCampaigns);
        setError(null);
      } catch (err) {
        console.error("Error fetching campaigns for explore page:", err);
        setError("Failed to load campaigns. Please try again later.");
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
              <CampaignCard key={campaign._id} campaign={campaign} />
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