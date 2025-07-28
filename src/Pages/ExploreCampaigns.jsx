"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// Redux hooks import karein
import { useSelector, useDispatch } from 'react-redux';

// Layout, UI components aur utilities
import Header from "./Layout/HeaderLayout";
import Footer from "./Layout/FooterLayout";
import { Heart } from 'lucide-react';
import { showErrorMessage } from '../utils/toast';

// Redux Thunks (Actions) import karein
import { fetchCampaigns } from "../features/campaignsSlice";
import { toggleSaveCampaign } from "../features/authSlice";


// --- CATEGORIES ---
const allCategories = [
  { id: "all", label: "All" }, { id: "Creative Art", label: "Creative Art" }, { id: "Business & Entrepreneurship", label: "Business & Entrepreneurship" },
  { id: "Education & Publishing", label: "Education & Publishing" }, { id: "Lifestyle", label: "Lifestyle" },
  { id: "Media & Entertainment", label: "Media & Entertainment" },{ id: "Medical", label: "Medical" },
  { id: "Non profit", label: "Non profit" }, { id: "Technology & Innovation", label: "Technology & Innovation" },
];

const formatCurrency = (amount) => `Rs. ${amount.toLocaleString()}`;

// --- CAMPAIGN CARD COMPONENT ---
function CampaignCard({ campaign, onSelectForDonation }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, userProfile } = useSelector(state => state.auth);
    const isCampaignSaved = userProfile?.savedCampaigns?.includes(campaign._id);
    const safeRaised = Number(campaign.raised) || 0;
    const safeGoal = Number(campaign.goalAmount) || 1;
    const progressPercentage = Math.min((safeRaised / safeGoal) * 100, 100);
   // const { userProfile, setUserProfile } = useUser();

    // THIS IS THE CORRECTED FUNCTION
   const handleToggleSave = (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            showErrorMessage('Please log in to save campaigns.');
            return;
        }
        // Poora API logic ab Redux Thunk mein hai, yahan sirf dispatch call hoga
        dispatch(toggleSaveCampaign(campaign._id));
    };

    const handleCardClick = () => {
        if (onSelectForDonation) {
            onSelectForDonation(campaign._id);
        } else {
            navigate(`/ProjectView?id=${campaign._id}`);
        }
    };
    
    return (
        <div className="campaign-card flex flex-col cursor-pointer" onClick={handleCardClick}>
            <div className="card-image-wrapper">
                <img
                    src={campaign.mediaUrls && campaign.mediaUrls.length > 0 ? `https://server-fundify.up.railway.app${campaign.mediaUrls[0]}` : "https://placehold.co/600x400/a9bea2/4B5842?text=Fundify"}
                    alt={campaign.title}
                    className="card-image w-full h-48 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/a9bea2/4B5842?text=Fundify" }}
                />
                <div className="card-category-badge">{campaign.category}</div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="card-title text-lg font-bold text-gray-800 mb-2">{campaign.title}</h3>
                <p className="card-description text-sm text-gray-600 mb-4 flex-grow">
                    {campaign.description}
                </p>
                <div className="mt-auto">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-fundify-green">{formatCurrency(safeRaised)}</span>
                        <span className="font-medium text-gray-500">{progressPercentage.toFixed(0)}% Funded</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="progress-bar h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <div className="card-actions flex justify-between items-center mt-4">
                        {onSelectForDonation ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); onSelectForDonation(campaign._id); }}
                                className="action-button select-button w-full"
                            >
                                Select to Donate
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate(`/ProjectView?id=${campaign._id}`); }}
                                    className="action-button explore-button">
                                    Explore
                                </button>
                                <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate("/donate", { state: { campaignId: campaign._id } }); }}
                                    className="action-button donate-button">
                                    Donate
                                </button>
                                <button
                                    onClick={handleToggleSave}
                                    className={`save-button ${isCampaignSaved ? 'saved' : ''}`}
                                    title={isCampaignSaved ? 'Unsave Campaign' : 'Save Campaign'}
                                >
                                    <Heart className="h-5 w-5" fill={isCampaignSaved ? 'currentColor' : 'none'} />
                                </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- EXPLORE CAMPAIGNS PAGE ---
export default function ExploreCampaigns() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { allCampaigns, status, error } = useSelector((state) => state.campaigns);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCampaignsCount, setVisibleCampaignsCount] = useState(9);
    const isSelectForDonationMode = location.state?.purpose === "select-for-donation";
    //const categories = allCategories;

    useEffect(() => {
        // Yeh check karega ke agar data pehle se nahi hai to hi fetch kare
        if (status === 'idle') {
            dispatch(fetchCampaigns());
        }
    }, [status, dispatch]);

    const filteredCampaigns = allCampaigns.filter((campaign) => {
        // Pehle campaign status check kar lein
        const isActive = campaign.status === 'Active' || campaign.status === 'Approved';
        if (!isActive) return false;

        const matchesCategory = selectedCategory === "all" || campaign.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const loadMore = () => setVisibleCampaignsCount((prev) => prev + 6);
    const handleSelectForDonation = (campaignId) => navigate("/donate", { state: { campaignId } });

    return (
        <div className="explore-campaigns-page">
            <Header />
            
            {/* --- HERO SECTION --- */}
            <div className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-content container mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">Discover & Support</h1>
                    <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto">
                        Explore innovative projects and heartfelt causes from creators around the world. Your next great inspiration is just a click away.
                    </p>
                </div>
            </div>

            <main className="container mx-auto px-4 py-12">
                {isSelectForDonationMode && (
                    <div className="selection-notice" role="alert">
                        <p className="font-bold">Please select the campaign you wish to support.</p>
                        <p className="text-sm">Click on any campaign card to proceed to the donation page.</p>
                    </div>
                )}

                {/* --- SEARCH & FILTER --- */}
                <div className="filter-controls">
                    <div className="search-bar relative max-w-xl mx-auto mb-8">
                        <input
                            type="text"
                            placeholder="Find campaigns by title..."
                            className="w-full px-5 py-3 rounded-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                         <svg className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <div className="category-filters flex flex-wrap justify-center gap-2 mb-10">
                        {allCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`category-button ${selectedCategory === category.id ? "active" : ""}`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- CAMPAIGNS GRID --- */}
                {status === 'loading' ? (
                    <div className="text-center py-20"><p className="text-xl text-gray-600">Loading Campaigns...</p></div>
                ) : status === 'failed' ? (
                    <div className="text-center py-20">
                        <p className="text-red-600 text-xl">{error}</p>
                        <button onClick={() => dispatch(fetchCampaigns())} className="retry-button">Retry</button>
                    </div>
                ) : filteredCampaigns.length === 0 ? (
                    <div className="text-center py-20"><p className="text-gray-500 text-lg">No campaigns found matching your criteria.</p></div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {filteredCampaigns.slice(0, visibleCampaignsCount).map((campaign) => (
                                <CampaignCard
                                    key={campaign._id}
                                    campaign={campaign}
                                    onSelectForDonation={isSelectForDonationMode ? handleSelectForDonation : null}
                                />
                            ))}
                        </div>
                        {visibleCampaignsCount < filteredCampaigns.length && (
                            <div className="flex justify-center">
                                <button onClick={loadMore} className="load-more-button">Load More</button>
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />
            
            <style jsx global>{`
                /* --- Google Font & Variables --- */
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
                .explore-campaigns-page {
                    font-family: 'Poppins', sans-serif;
                    --fundify-green: #4B5842;
                    --fundify-light-green: #A9BEA2;
                    --shadow-color: rgba(75, 88, 66, 0.1);
                    --border-color: #e5e7eb;
                }

                /* --- Hero Section --- */
                .hero-section {
                    position: relative;
                    height: 50vh;
                    min-height: 300px;
                    background: url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?fit=crop&w=1600&h=800&q=80') center center/cover no-repeat;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3));
                }
                .hero-content {
                    position: relative;
                    z-index: 10;
                    padding: 1rem;
                }
                .hero-content h1 {
                    text-shadow: 2px 2px 8px rgba(0,0,0,0.6);
                }

                /* --- Search and Filter --- */
                .search-bar input {
                    border: 1px solid var(--border-color);
                    box-shadow: 0 2px 8px var(--shadow-color);
                    transition: all 0.3s ease;
                }
                .search-bar input:focus {
                    outline: none;
                    border-color: var(--fundify-green);
                    box-shadow: 0 0 0 3px rgba(75, 88, 66, 0.2), 0 4px 12px var(--shadow-color);
                }
                .category-button {
                    border-radius: 9999px;
                    border: 1px solid var(--border-color);
                    background-color: white;
                    color: #4b5563;
                    font-weight: 500;
                    font-size: 0.875rem;
                    padding: 0.5rem 1rem;
                    transition: all 0.2s ease;
                }
                .category-button:hover {
                    background-color: #f9fafb;
                    border-color: var(--fundify-light-green);
                }
                .category-button.active {
                    background-color: var(--fundify-green);
                    color: white;
                    border-color: var(--fundify-green);
                }

                /* --- Campaign Card --- */
                .campaign-card {
                    background-color: white;
                    border-radius: 0.75rem;
                    overflow: hidden;
                    box-shadow: 0 4px 12px var(--shadow-color);
                    border: 1px solid var(--border-color);
                    transition: all 0.3s ease-in-out;
                }
                .campaign-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(75, 88, 66, 0.15);
                }
                .card-image-wrapper {
                    position: relative;
                }
                .card-image {
                    transition: transform 0.4s ease;
                }
                .campaign-card:hover .card-image {
                    transform: scale(1.05);
                }
                .card-category-badge {
                    position: absolute;
                    top: 0.75rem;
                    left: 0.75rem;
                    background-color: rgba(0,0,0,0.6);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 500;
                }
                .card-title { letter-spacing: -0.01em; }
                .card-description {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;  
                    overflow: hidden;
                }
                .progress-bar {
                    background-color: var(--fundify-green);
                }
                .action-button {
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }
                .explore-button {
                    background-color: #f3f4f6;
                    color: #374151;
                }
                .explore-button:hover {
                    background-color: #e5e7eb;
                }
                .donate-button, .select-button {
                    background-color: var(--fundify-green);
                    color: white;
                }
                .donate-button:hover, .select-button:hover {
                    background-color: #3A4433;
                }
                .save-button {
                    padding: 0.5rem;
                    border-radius: 9999px;
                    background-color: #e5e7eb;
                    color: #4b5563;
                }
                .save-button:hover {
                    background-color: #fca5a5; /* red-300 */
                    color: white;
                }
                .save-button.saved {
                    background-color: #ef4444; /* red-500 */
                    color: white;
                }

                /* --- Load More & Utility --- */
                .load-more-button, .retry-button {
                    background-color: var(--fundify-green);
                    color: white;
                    padding: 0.75rem 2rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                .load-more-button:hover, .retry-button:hover {
                    background-color: #3A4433;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px var(--shadow-color);
                }
                .selection-notice {
                    background-color: #fefce8; /* yellow-50 */
                    border-left: 4px solid #facc15; /* yellow-400 */
                    color: #ca8a04; /* yellow-600 */
                    padding: 1rem;
                    margin-bottom: 2rem;
                    border-radius: 0.375rem;
                }

            `}</style>
        </div>
    );
}
