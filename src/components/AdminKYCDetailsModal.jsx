// src/components/AdminKYCDetailsModal.jsx
"use client";
import React from 'react';
import { X, Check } from 'lucide-react';

const AdminKYCDetailsModal = ({ kycDetails, onClose, onApprove, onReject }) => {
    // Apne server ka base URL define karein
    const API_URL = "https://server-fundify.up.railway.app";

    if (!kycDetails) return null;

    // Helper function to create full URL
    const createImageUrl = (path) => {
        if (!path) return '';
        // Windows ke backslash ko forward slash mein badal de
        return `${API_URL}/${path.replace(/\\/g, '/')}`;
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-5 border-b border-gray-200 sticky top-0 bg-white">
                    <h3 className="text-xl font-semibold text-gray-800">KYC Application Details</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <h4 className="text-lg font-bold text-gray-700">Applicant Information:</h4>
                    <p><strong>Full Name:</strong> {kycDetails.fullName || 'N/A'}</p>
                    <p><strong>Email:</strong> {kycDetails.email || 'N/A'}</p>
                    <p><strong>Phone Number:</strong> {kycDetails.phoneNumber || 'N/A'}</p>
                    <p><strong>Date of Birth:</strong> {kycDetails.dateOfBirth ? new Date(kycDetails.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Address:</strong> {kycDetails.address || 'N/A'}</p>
                    <p><strong>Document Type:</strong> {kycDetails.documentType}</p>
                    <p><strong>Document Number:</strong> {kycDetails.documentNumber}</p>

                    <h4 className="text-lg font-bold text-gray-700 mt-6">Documents:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* --- YEH SAB SE AHAM CHANGE HAI --- */}
                        <div>
                            <p className="font-medium mb-1">Front of ID:</p>
                            <img 
                                src={createImageUrl(kycDetails.documentImages[0])} 
                                alt="Front of ID" 
                                className="document-image"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200?text=Not+Found"; }}
                            />
                        </div>
                        <div>
                            <p className="font-medium mb-1">Back of ID:</p>
                            <img 
                                src={createImageUrl(kycDetails.documentImages[1])} 
                                alt="Back of ID" 
                                className="document-image"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200?text=Not+Found"; }}
                            />
                        </div>
                    </div>

                    <h4 className="text-lg font-bold text-gray-700 mt-6">Liveness Verification:</h4>
                    <div>
                        <img 
                            src={createImageUrl(kycDetails.livenessImage)} 
                            alt="Liveness Verification" 
                            className="liveness-image"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x200?text=Not+Found"; }}
                        />
                    </div>
                </div>
                <div className="flex justify-end p-5 border-t border-gray-200 space-x-3 sticky bottom-0 bg-white">
                    <button onClick={() => onApprove(kycDetails)} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center space-x-1">
                        <Check className="h-4 w-4" />
                        <span>Approve</span>
                    </button>
                    <button onClick={() => onReject(kycDetails)} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors flex items-center space-x-1">
                        <X className="h-4 w-4" />
                        <span>Reject</span>
                    </button>
                    <button onClick={onClose} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors">
                        Close
                    </button>
                </div>
                <style jsx>{`
                    .document-image, .liveness-image {
                        width: 100%;
                        height: auto;
                        border-radius: 8px;
                        border: 1px solid #ddd;
                        background-color: #f9f9f9;
                    }
                    .liveness-image {
                        max-width: 200px;
                        border-radius: 50%;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default AdminKYCDetailsModal;
