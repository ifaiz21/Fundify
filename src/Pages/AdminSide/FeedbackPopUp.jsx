// src/Pages/AdminSide/FeedbackPopUp.jsx (or your modal file name)
"use client"

import { X } from "lucide-react"; // Import the X icon for consistency

const FeedbackDetailsModal = ({ feedback, onClose }) => {
    // If no feedback is provided, don't render anything
    if (!feedback) {
        return null;
    }

    const { name, type, email, remarks, message, date, status } = feedback;

    // Handle click on the dark background to close the modal
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    
    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case "new": return "bg-blue-100 text-blue-800";
            case "in progress": return "bg-yellow-100 text-yellow-800";
            case "resolved": return "bg-green-100 text-green-800";
            default: return "bg-gray-100 text-gray-800";
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Feedback Details</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
                        <X size={24} />
                    </button>
                </div>

                {/* Content Body (Scrollable) */}
                <div className="p-6 space-y-4 overflow-y-auto">
                    {/* Status and Date */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-xs font-medium text-gray-500">Status</p>
                            <p className={`text-sm font-semibold px-2 py-0.5 mt-1 inline-block rounded-full ${getStatusClass(status)}`}>{status}</p>
                        </div>
                        <div className="sm:text-right">
                            <p className="text-xs font-medium text-gray-500">Date Submitted</p>
                            <p className="text-sm text-gray-700 mt-1">{date}</p>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <p className="text-xs font-medium text-gray-500">User Name</p>
                            <p className="text-sm text-gray-800 mt-1">{name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500">User Email</p>
                            <p className="text-sm text-gray-800 mt-1">{email}</p>
                        </div>
                    </div>
                    
                    <hr/>

                    {/* Feedback Content */}
                    <div>
                        <p className="text-xs font-medium text-gray-500">Issue Type</p>
                        <p className="text-sm text-gray-800 mt-1">{type}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500">Subject / Remarks</p>
                        <p className="text-sm text-gray-800 mt-1">{remarks}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500">Full Message</p>
                        <p className="text-sm text-gray-800 mt-1 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
                            {message}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackDetailsModal;
