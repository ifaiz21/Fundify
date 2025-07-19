// src/Pages/AdminSide/ProjectDetailsPage.jsx
"use client"

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../Layout/HeaderLayout'; // Adjust import path if needed
import Footer from '../Layout/FooterLayout'; // Adjust import path if needed

const ProjectDetailsPage = () => {
    const { campaignId } = useParams(); // Gets the ID from the URL (e.g., /project/THE_ID_HERE)
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCampaign = async () => {
            if (!campaignId) return;

            try {
                setLoading(true);
                // This endpoint fetches a SINGLE campaign by its ID
                const response = await axios.get(`https://server-fundify.up.railway.app/api/campaigns/${campaignId}`);
                setCampaign(response.data.campaign);
                setError('');
            } catch (err) {
                console.error("Failed to fetch campaign details:", err);
                setError("Could not load the campaign. It might not exist or there was a server error.");
                setCampaign(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaign();
    }, [campaignId]); // Re-run the effect if the campaignId changes

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><p>Loading Campaign...</p></div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500"><p>{error}</p></div>;
    }

    if (!campaign) {
        return <div className="flex justify-center items-center h-screen"><p>Campaign not found.</p></div>;
    }

    // Once data is loaded, display it
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-1 container mx-auto p-8">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">{campaign.title}</h1>
                    <p className="text-gray-600 mb-2">Created by: <span className="font-semibold">{campaign.creator?.name || 'N/A'}</span></p>
                    
                    {campaign.imageUrl && (
                         <img 
                            src={`https://server-fundify.up.railway.app/${campaign.imageUrl}`} 
                            alt={campaign.title} 
                            className="w-full h-96 object-cover rounded-md my-6"
                         />
                    )}

                    <div className="my-4">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Story</h2>
                        <p className="text-gray-600 whitespace-pre-wrap">{campaign.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                            <h3 className="text-xl font-semibold">Goal</h3>
                            <p className="text-2xl text-[#4A5D45]">${campaign.goalAmount.toLocaleString()}</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">Status</h3>
                            <p className={`text-xl font-bold ${campaign.status === 'Active' ? 'text-green-500' : 'text-yellow-500'}`}>
                                {campaign.status}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProjectDetailsPage;