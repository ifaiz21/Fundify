// src/Pages/ProjectView.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, MapPin, Users, Calendar } from 'lucide-react';
import Header from "./Layout/HeaderLayout";
import Footer from "./Layout/FooterLayout";
import { useUser } from '../context/UserContext'; // Import useUser for saved campaigns
import { showSuccessMessage, showErrorMessage } from "../utils/toast" // Import toast functions directly


// --- END DUMMY COMPONENTS ---

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(amount).replace("PKR", "Rs.");
};

// --- NESTED SIDEBAR COMPONENT ---
const DonorsSidebar = ({ recentDonors, totalBackers, handleBackThisProject }) => (
    <div className="donors-sidebar space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
                <Users className="mr-3 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{totalBackers} people have backed this project</span>
            </div>
            <div className="space-y-4">
                {recentDonors.length > 0 ? (
                    recentDonors.map((donor, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="donor-avatar">👤</div>
                                <span className="text-sm text-gray-600">{donor.name}</span>
                            </div>
                            <div className="font-semibold text-gray-800">{formatCurrency(donor.amount)}</div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm text-center py-4">Be the first to donate!</p>
                )}
            </div>
        </div>
        <button onClick={handleBackThisProject} className="action-button primary w-full">
            Back this project
        </button>
    </div>
);


// --- MAIN PROJECT VIEW COMPONENT ---
function ProjectView() {
    const [activeTab, setActiveTab] = useState("campaign");
    const [campaignData, setCampaignData] = useState(null);
    const [campaignUpdates, setCampaignUpdates] = useState([]);
    const [recentDonors, setRecentDonors] = useState([]);
    const [totalBackersCount, setTotalBackersCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { userProfile, setUserProfile } = useUser();

    const queryParams = new URLSearchParams(location.search);
    const campaignId = queryParams.get("id");
    const isCampaignSaved = userProfile.savedCampaigns?.includes(campaignId);

    useEffect(() => {
        if (!campaignId) {
            setError("No campaign ID provided.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const detailsPromise = axios.get(`https://server-fundify.up.railway.app/api/campaigns/${campaignId}`);
                const updatesPromise = axios.get(`https://server-fundify.up.railway.app/api/campaigns/${campaignId}/updates`);
                const donorsPromise = axios.get(`https://server-fundify.up.railway.app/api/donations/campaign/${campaignId}/recent?limit=3`);

                const [detailsResponse, updatesResponse, donorsResponse] = await Promise.all([detailsPromise, updatesPromise, donorsPromise]);

                setCampaignData(detailsResponse.data);
                setCampaignUpdates(updatesResponse.data);
                setRecentDonors(donorsResponse.data.recentDonors);
                setTotalBackersCount(donorsResponse.data.totalBackers);
                setError(null);
            } catch (err) {
                console.error("Error fetching campaign data:", err);
                setError("Failed to load campaign. It may not exist or an error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [campaignId]);

    const handleToggleSave = async () => {
        if (!userProfile.isAuthenticated) {
            return showErrorMessage('Please log in to save campaigns.');
        }
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('https://server-fundify.up.railway.app/api/users/saved-campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ campaignId }),
            });
            if (response.ok) {
                const result = await response.json();
                showSuccessMessage(result.saved ? 'Campaign saved!' : 'Campaign unsaved.');
                setUserProfile(prev => ({
                    ...prev,
                    savedCampaigns: result.saved
                        ? [...(prev.savedCampaigns || []), campaignId]
                        : (prev.savedCampaigns || []).filter(id => id !== campaignId),
                }));
            } else {
                showErrorMessage('Failed to update saved status.');
            }
        } catch (error) {
            showErrorMessage('An error occurred.');
        }
    };

    const handleBackThisProject = () => {
        if (campaignData?._id) {
            navigate("/donate", { state: { campaignId: campaignData._id } });
        } else {
            showErrorMessage("Campaign data not loaded yet.");
        }
    };

    const handleShare = () => {
        const campaignUrl = window.location.href;
        navigator.clipboard.writeText(campaignUrl)
            .then(() => showSuccessMessage("Campaign link copied to clipboard!"))
            .catch(() => showErrorMessage("Failed to copy link."));
    };

    if (loading) {
        return (
            <div className="page-wrapper"><Header /><div className="feedback-container">Loading campaign details...</div><Footer /></div>
        );
    }

    if (error || !campaignData) {
        return (
            <div className="page-wrapper"><Header /><div className="feedback-container error">{error || "No campaign data available."}</div><Footer /></div>
        );
    }

    const progress = Math.min(Math.round((campaignData.raised / campaignData.goalAmount) * 100), 100);

    return (
        <div className="project-view-page">
            <Header />
            <main className="container mx-auto px-4 py-8 sm:py-12">
                <div className="project-header mb-8 text-center lg:text-left">
                    <p className="category-tag">{campaignData.category}</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mt-2">{campaignData.title}</h1>
                    <p className="text-lg text-gray-600 mt-3 max-w-3xl mx-auto lg:mx-0">{campaignData.description}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
                    {/* Left/Main Column */}
                    <div className="lg:col-span-2">
                        <div className="main-image-wrapper mb-6">
                            <img
                                src={campaignData.mediaUrls?.[0] ? `https://server-fundify.up.railway.app/${campaignData.mediaUrls[0]}` : "https://placehold.co/800x450/A9BEA2/4B5842?text=Fundify"}
                                alt={campaignData.title}
                                className="w-full h-auto rounded-lg shadow-lg"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x450/A9BEA2/4B5842?text=Image+Not+Found'; }}
                            />
                        </div>
                        <div className="creator-info flex items-center text-sm text-gray-600 mb-8">
                            <div className="flex items-center">
                                <Calendar className="mr-1.5 h-4 w-4" /> Created {new Date(campaignData.createdAt).toLocaleDateString()}
                            </div>
                            <span className="mx-3">•</span>
                            <div className="flex items-center">
                                <MapPin className="mr-1.5 h-4 w-4" /> {campaignData.location}
                            </div>
                        </div>
                    </div>

                    {/* Right/Sidebar Column */}
                    <div className="lg:col-span-1">
                        <div className="stats-card-wrapper lg:sticky top-24">
                            <div className="stats-card">
                                <div className="progress-bar-wrapper mb-4">
                                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                                </div>
                                <div className="mb-4">
                                    <div className="text-3xl font-bold text-fundify-green">{formatCurrency(campaignData.raised)}</div>
                                    <div className="text-sm text-gray-600">pledged of {formatCurrency(campaignData.goalAmount)} goal</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="stat-item">
                                        <div className="text-3xl font-bold">{totalBackersCount}</div>
                                        <div className="text-sm text-gray-600">backers</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="text-3xl font-bold">21</div>
                                        <div className="text-sm text-gray-600">days to go</div>
                                    </div>
                                </div>
                                <div className="action-buttons space-y-3">
                                    <button onClick={handleBackThisProject} className="action-button primary w-full">Back this project</button>
                                    <div className="flex space-x-3">
                                        <button onClick={handleToggleSave} className={`action-button secondary flex-grow ${isCampaignSaved ? 'saved' : ''}`}>
                                            <Heart className="mr-2" fill={isCampaignSaved ? 'currentColor' : 'none'} /> {isCampaignSaved ? 'Saved' : 'Save'}
                                        </button>
                                        <button onClick={handleShare} className="action-button secondary">Share</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CAMPAIGN TABS --- */}
                <div className="campaign-tabs-wrapper mt-12">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-4 sm:space-x-8" aria-label="Tabs">
                            <button onClick={() => setActiveTab("campaign")} className={`tab-button ${activeTab === 'campaign' ? 'active' : ''}`}>Campaign</button>
                            <button onClick={() => setActiveTab("updates")} className={`tab-button ${activeTab === 'updates' ? 'active' : ''}`}>Updates ({campaignUpdates.length})</button>
                        </nav>
                    </div>
                    <div className="py-8">
                        {activeTab === 'campaign' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
                                <div className="lg:col-span-2 prose max-w-none" dangerouslySetInnerHTML={{ __html: campaignData.story || "<p>No story has been added yet.</p>" }} />
                                <div className="lg:col-span-1 mt-8 lg:mt-0">
                                    <DonorsSidebar recentDonors={recentDonors} totalBackers={totalBackersCount} handleBackThisProject={handleBackThisProject} />
                                </div>
                            </div>
                        )}
                        {activeTab === 'updates' && (
                            <div className="updates-section max-w-3xl">
                                {campaignUpdates.length > 0 ? campaignUpdates.map(update => (
                                    <div key={update._id} className="update-card">
                                        <div className="update-header">
                                            <h3 className="text-lg font-semibold text-gray-800">{update.title}</h3>
                                            <p className="text-xs text-gray-500">{new Date(update.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: update.content }} />
                                    </div>
                                )) : <div className="text-gray-500 text-center py-10">No updates have been posted yet.</div>}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
            
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
                .project-view-page {
                    font-family: 'Poppins', sans-serif;
                    --fundify-green: #4B5842;
                    --fundify-light-green: #A9BEA2;
                    --shadow-color: rgba(75, 88, 66, 0.1);
                    --border-color: #e5e7eb;
                }
                .page-wrapper { display: flex; flex-direction: column; min-height: 100vh; }
                .feedback-container { flex-grow: 1; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
                .feedback-container.error { color: #dc2626; }
                
                .project-header .category-tag {
                    display: inline-block;
                    background-color: var(--fundify-light-green);
                    color: var(--fundify-green);
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.875rem;
                    font-weight: 600;
                }
                .project-header h1 { letter-spacing: -0.025em; }

                .main-image-wrapper img { border: 1px solid var(--border-color); }

                /* --- Stats Card --- */
                .stats-card {
                    background: white;
                    border-radius: 0.75rem;
                    padding: 1.5rem;
                    border: 1px solid var(--border-color);
                    box-shadow: 0 4px 15px var(--shadow-color);
                }
                .progress-bar-wrapper { background-color: #e5e7eb; border-radius: 9999px; height: 0.75rem; }
                .progress-bar { background-color: var(--fundify-green); height: 100%; border-radius: 9999px; transition: width 0.5s ease-out; }
                .stat-item { text-align: left; }
                
                /* --- Action Buttons --- */
                .action-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.875rem 1rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }
                .action-button.primary { background-color: var(--fundify-green); color: white; }
                .action-button.primary:hover { background-color: #3A4433; transform: translateY(-2px); box-shadow: 0 4px 10px var(--shadow-color); }
                .action-button.secondary { background-color: #f3f4f6; color: #374151; }
                .action-button.secondary:hover { background-color: #e5e7eb; }
                .action-button.secondary.saved { background-color: #fEE2E2; color: #ef4444; border: 1px solid #fca5a5; }

                /* --- Campaign Tabs --- */
                .tab-button {
                    padding: 0.75rem 0.25rem;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #6b7280;
                    border-bottom: 3px solid transparent;
                    transition: all 0.2s ease;
                }
                .tab-button:hover { color: var(--fundify-green); }
                .tab-button.active { color: var(--fundify-green); border-bottom-color: var(--fundify-green); }

                /* --- Prose Content (Story/Updates) --- */
                .prose { line-height: 1.75; color: #374151; }
                .prose h1, .prose h2, .prose h3 { font-weight: 700; color: #111827; }
                .prose strong { color: #111827; }
                .prose a { color: var(--fundify-green); text-decoration: underline; }
                .prose blockquote { border-left-color: var(--fundify-light-green); }

                /* --- Donors Sidebar --- */
                .donor-avatar {
                    width: 2rem; height: 2rem;
                    border-radius: 9999px;
                    background-color: #f3f4f6;
                    display: flex; align-items: center; justify-content: center;
                    margin-right: 0.75rem;
                    font-size: 0.875rem;
                }

                /* --- Updates Section --- */
                .update-card {
                    background: white;
                    border: 1px solid var(--border-color);
                    border-left: 4px solid var(--fundify-light-green);
                    padding: 1.5rem;
                    border-radius: 0.5rem;
                    margin-bottom: 1.5rem;
                }
                .update-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                    margin-bottom: 1rem;
                }
            `}</style>
        </div>
    );
}

export default ProjectView;
