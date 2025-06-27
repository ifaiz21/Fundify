import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure axios is imported

// Removed the categories array as per request

export default function CampaignListing() {
  // Removed selectedCategory state as per request
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Pagination constants
  const campaignsPerPage = 6; // Display 6 campaigns per page

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        // Fetch from backend
        const response = await axios.get('https://server-fundify.up.railway.app/api/campaigns'); 

        // Ensure campaigns array is accessed correctly as backend returns an object { campaigns: [], stats: {} }
        const fetchedCampaigns = response.data.campaigns || []; 
        
        // Filter campaigns that are 'Active' or 'Approved' for display on the homepage
        const activeCampaigns = fetchedCampaigns.filter(
          campaign => campaign.status === 'Active' || campaign.status === 'Approved'
        );
        setCampaigns(activeCampaigns);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
        setError("Failed to load campaigns. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Filtered campaigns logic updated to only use searchQuery
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.location.toLowerCase().includes(searchQuery.toLowerCase());
      // Removed category search as category buttons are removed
    return matchesSearch;
  });

  // Get current campaigns for the page
  const indexOfLastCampaign = currentPage * campaignsPerPage;
  const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
  const currentCampaigns = filteredCampaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);

  const totalPages = Math.ceil(filteredCampaigns.length / campaignsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPaginationButtons = () => {
    const pageButtons = [];
    const maxFixedPages = 6; // Show pages 1 to 6 directly

    if (totalPages <= maxFixedPages) {
      // If total pages are 6 or less, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(i);
      }
    } else {
      // Show pages 1 to 6, then ellipsis, then the last page
      for (let i = 1; i <= maxFixedPages; i++) {
        pageButtons.push(i);
      }
      if (totalPages > maxFixedPages) {
        pageButtons.push("..."); // Ellipsis
        pageButtons.push(totalPages); // Last page
      }
    }

    return pageButtons.map((number, index) => (
      <button
        key={index}
        onClick={() => typeof number === 'number' && handlePageChange(number)}
        className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-300 shadow-sm
          ${currentPage === number
            ? "bg-[#4A5D45] text-white shadow-md"
            : "text-gray-700 hover:bg-gray-100"
          }
          ${number === "..." ? "cursor-default bg-transparent hover:bg-transparent shadow-none" : ""}`
        }
        disabled={number === "..."}
      >
        {number}
      </button>
    ));
  };


  if (loading) {
    return <div className="text-center py-16 text-gray-700">Loading campaigns...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 to-gray-50 rounded-xl shadow-lg bg-[#F0FFF0]">
      {/* Headings */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-[#4A5D45] mb-2 drop-shadow-md">
          Compassion Unites!
        </h1>
        <h2 className="text-2xl text-[#4A5D45] drop-shadow-sm">
          Choose a Cause, Change a Life!
        </h2>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Find campaigns..."
          className="w-full px-6 py-3 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B2C9AD] focus:border-transparent transition-all duration-300 shadow-md hover:shadow-lg"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
        <svg
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
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

      {/* Removed Categories Section */}

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {currentCampaigns.length > 0 ? (
          currentCampaigns.map((campaign) => (
            <div
              key={campaign._id || campaign.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-[450px] transform hover:scale-103" // Added hover:scale-103
            >
              <img
                src={campaign.mediaUrls && campaign.mediaUrls.length > 0 ? `https://server-fundify.up.railway.app/${campaign.mediaUrls[0]}` : "/placeholder.svg"}
                alt={campaign.title}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-6 flex flex-col flex-grow justify-between bg-[#ffffff]">
                <p className="text-gray-500 text-sm mb-2">{new Date(campaign.createdAt).toLocaleDateString()}</p>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{campaign.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3 h-20">
                  {campaign.description}
                </p>
                <div className="mt-auto">
                <button
                  onClick={() => navigate(`/ProjectView?id=${campaign._id}`)}
                  className="w-full px-4 py-2 bg-[#4A5D45] text-white rounded-full shadow-md hover:bg-[#B2C9AD] transition-colors duration-300 mt-auto">
                  Explore Campaign
                </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600 py-10">No campaigns found for the selected criteria.</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && ( // Only show pagination if there's more than one page
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            className="p-3 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {renderPaginationButtons()}

          <button
            className="p-3 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
      </div>
  );
}