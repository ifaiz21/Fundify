import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminCampaignReviewPage = () => {
    const { id } = useParams(); // URL se campaign ID get karein
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const API_URL = process.env.REACT_APP_API_URL;
                
                // Aapke paas pehle se hi campaign details fetch karne ka endpoint hai
                const { data } = await axios.get(`${API_URL}/api/campaigns/${id}`, config);
                console.log("Backend se campaign ka data:", data);
                setCampaign(data);
            } catch (error) {
                console.error("Failed to fetch campaign details", error);
                toast.error("Failed to fetch campaign details.");
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [id]);

    const handleApprove = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const API_URL = process.env.REACT_APP_API_URL;
            
            // Aapka approve karne ka endpoint
            await axios.put(`${API_URL}/api/campaigns/${id}/approve`, {}, config);
            toast.success("Campaign has been approved!");
            navigate('/admin/verifications'); // Wapis verification page par bhej dein
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to approve campaign.");
        }
    };

    const handleReject = async () => {
        const reason = window.prompt("Please provide a reason for rejection (optional):");
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const API_URL = process.env.REACT_APP_API_URL;
            
            // Aapka reject karne ka endpoint
            await axios.put(`${API_URL}/api/campaigns/${id}/reject`, { adminComments: reason }, config);
            toast.warn("Campaign has been rejected!");
            navigate('/admin/verifications');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reject campaign.");
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><p>Loading Campaign Details...</p></div>;
    }

    if (!campaign) {
        return <div className="flex justify-center items-center h-screen"><p>Campaign not found.</p></div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                    <button onClick={() => navigate('/admin/verifications')} className="text-blue-600 hover:underline mb-4">
                        &larr; Back to Verifications
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{campaign.title}</h1>
                    <p className="text-sm text-gray-500 mb-4">Status: <span className="font-semibold text-yellow-600">{campaign.status}</span></p>

                    <img src={`https://server-fundify.up.railway.app/uploads/${campaign.imageUrl}`} alt={campaign.title} className="w-full h-64 object-cover rounded-md mb-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Goal Amount</h3>
                            <p className="text-2xl font-bold text-green-600">PKR {campaign.goalAmount.toLocaleString()}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Category</h3>
                            <p className="text-lg text-gray-800">{campaign.category}</p>
                        </div>
                         <div>
                            <h3 className="text-lg font-semibold text-gray-700">Creator</h3>
                            <p className="text-lg text-gray-800">{campaign.creator?.name || 'N/A'}</p>
                        </div>
                         <div>
                            <h3 className="text-lg font-semibold text-gray-700">End Date</h3>
                            <p className="text-lg text-gray-800">{new Date(campaign.endDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 border-b pb-2">Campaign Story</h3>
                        <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: campaign.story }} />
                    </div>

                    <div className="flex justify-end space-x-4 p-6 bg-gray-50 -m-6 mt-6">
                        <button onClick={handleReject} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200">
                            Reject
                        </button>
                        <button onClick={handleApprove} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200">
                            Approve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCampaignReviewPage;