// src/Pages/UserProfileSettings.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '../actions/userActions';
import { logoutSuccess } from '../store';
import HeaderLayout from "./Layout/HeaderLayout";
import FooterLayout from "./Layout/FooterLayout";
import SideBar from "../components/SideBar";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { showSuccessMessage, showErrorMessage } from "../utils/toast";
import axios from 'axios';

function UserProfileSettings() {
    // --- Step 1: Get user data from Redux store ---
    const { user, loading: userLoading } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // --- Local state for UI and forms ---
    const [editedProfile, setEditedProfile] = useState({});
    const [isProfileEditMode, setIsProfileEditMode] = useState(false);
    const [selectedProfileImage, setSelectedProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [activeMenuItem, setActiveMenuItem] = useState("Profile");
    const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false); // For loading state during updates
    const fileInputRef = useRef(null);

    // --- Step 2: Populate form state when user data loads from Redux ---
    useEffect(() => {
        if (user) {
            setEditedProfile({
                fullName: user.name || '',
                contactNo: user.contactNo || '',
                // Other fields can be populated here
            });
            setProfileImagePreview(user.profilePictureUrl ? `https://server-fundify.up.railway.app/${user.profilePictureUrl}` : "/Images/default-avatar.png");
        }
    }, [user]);

    const handleProfileEditChange = (e) => {
        setEditedProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedProfileImage(file);
            setProfileImagePreview(URL.createObjectURL(file));
        }
    };

    // --- Step 3: Update API call functions to use Axios and dispatch actions ---
    const handleProfileDetailsSave = async () => {
        setIsSaving(true);
        const token = localStorage.getItem('token');
        const API_URL = process.env.REACT_APP_API_URL;
        try {
            const dataToUpdate = {
                name: editedProfile.fullName, // Backend expects 'name'
                contactNo: editedProfile.contactNo,
            };
            await axios.put(`${API_URL}/api/users/profile`, dataToUpdate, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            showSuccessMessage("Profile updated successfully!");
            dispatch(loadUser()); // Refresh user data across the app
            setIsProfileEditMode(false);
        } catch (error) {
            showErrorMessage(error.response?.data?.message || "Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleProfilePictureSave = async () => {
        if (!selectedProfileImage) return;
        setIsSaving(true);
        const token = localStorage.getItem('token');
        const API_URL = process.env.REACT_APP_API_URL;
        const formData = new FormData();
        formData.append('profilePicture', selectedProfileImage);
        try {
            await axios.put(`${API_URL}/api/users/profile-picture`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            showSuccessMessage("Profile picture updated!");
            dispatch(loadUser()); // Refresh user data
            setSelectedProfileImage(null);
        } catch (error) {
            showErrorMessage(error.response?.data?.message || "Failed to upload picture.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        dispatch(logoutSuccess());
        navigate("/login");
        showSuccessMessage("Successfully logged out");
    };

    const handleMenuItemClick = (itemName) => {
        setActiveMenuItem(itemName);
        setIsProfileSidebarOpen(false);
        if (itemName === "Logout") {
            setShowConfirmLogout(true);
        } else if (itemName === "My Campaigns") {
            navigate("/my-campaigns");
        } else if (itemName === "Billing"){
            navigate("/billing");
        } else if (itemName === "Notifications") {
            navigate("/notifications");
        }
    };
    
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);

    if (userLoading) {
        return <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50"><p>Loading profile...</p></div>;
    }
    
    // Agar user logged in nahin hai to login page par redirect karein
    if (!user) {
        // navigate('/login');
        return null; // Return null to prevent rendering anything else
    }

    return (
        <div className="flex flex-col min-h-screen">
            <HeaderLayout />
            <div className="flex flex-grow flex-col md:flex-row bg-gray-50">
                {/* Desktop Sidebar */}
                <div className="hidden md:block w-64 flex-shrink-0">
                    <SideBar activeItem={activeMenuItem} onItemClick={handleMenuItemClick} handleLogout={() => setShowConfirmLogout(true)} />
                </div>

                {/* Mobile Sidebar Button */}
                <div className="md:hidden flex justify-start p-4 bg-gray-50">
                    <button onClick={() => setIsProfileSidebarOpen(prev => !prev)} aria-label="Toggle profile sidebar">
                        {isProfileSidebarOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
                    </button>
                </div>

                {/* Mobile Sidebar */}
                <div className={`fixed top-0 left-0 h-full bg-white w-64 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isProfileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <SideBar activeItem={activeMenuItem} onItemClick={handleMenuItemClick} handleLogout={() => setShowConfirmLogout(true)} />
                </div>
                
                <main className="flex-grow container mx-auto px-4 py-6">
                    {activeMenuItem === "Profile" && (
                        <>
                            <h1 className="text-xl sm:text-2xl font-bold mb-6">Profile Settings</h1>
                            
                            {/* Profile Picture Section */}
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col sm:flex-row items-center justify-between">
                                <div className="text-center sm:text-left flex-grow mb-4 sm:mb-0 sm:mr-6 order-2 sm:order-1">
                                    <h2 className="text-xl font-semibold mb-2">Profile Picture</h2>
                                    <p className="text-sm text-gray-600 mb-4">Click on the picture to upload or change it.</p>
                                    <input type="file" ref={fileInputRef} onChange={handleProfileImageChange} accept="image/*" className="hidden" />
                                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                        {selectedProfileImage && (
                                            <button onClick={handleProfilePictureSave} disabled={isSaving} className="bg-[#4A5D45] text-white py-2 px-4 rounded text-sm hover:bg-[#3d4f3a]">
                                                {isSaving ? 'Saving...' : 'Save Photo'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer group relative flex-shrink-0 order-1 sm:order-2 mb-4 sm:mb-0" onClick={() => fileInputRef.current.click()}>
                                    <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.target.src = "/Images/default-avatar.png"; }} />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                        Change
                                    </div>
                                </div>
                            </div>
                            
                            {/* Profile Details Section */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">Profile Details</h2>
                                    <button onClick={() => setIsProfileEditMode(prev => !prev)} className="bg-[#4A5D45] text-white py-2 px-4 rounded text-sm">
                                        {isProfileEditMode ? 'Cancel' : 'Edit Profile'}
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                        {isProfileEditMode ? (
                                            <input type="text" name="fullName" value={editedProfile.fullName || ''} onChange={handleProfileEditChange} className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                                        ) : (
                                            <p className="text-gray-800 font-medium">{user.name}</p>
                                        )}
                                    </div>
                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <p className="text-gray-800 font-medium">{user.email}</p>
                                    </div>
                                    {/* Contact No */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Contact No</label>
                                        {isProfileEditMode ? (
                                            <input type="text" name="contactNo" value={editedProfile.contactNo || ''} onChange={handleProfileEditChange} className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                                        ) : (
                                            <p className="text-gray-800 font-medium">{user.contactNo || 'Not provided'}</p>
                                        )}
                                    </div>
                                    {/* User ID */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">User ID</label>
                                        <p className="text-gray-600 text-sm break-all">{user._id}</p>
                                    </div>
                                    {/* KYC Status */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">KYC Status</label>
                                        <div className="flex items-center space-x-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.kycStatus === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{user.kycStatus}</span>
                                            {user.kycStatus !== 'Approved' && (
                                                <button onClick={() => navigate('/kyc-form')} className="text-sm text-green-600 hover:underline">
                                                    {user.kycStatus === 'Rejected' ? 'Apply Again' : 'Complete KYC'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {isProfileEditMode && (
                                    <div className="mt-6 text-right">
                                        <button onClick={handleProfileDetailsSave} disabled={isSaving} className="bg-[#4A5D45] text-white py-2 px-6 rounded text-sm hover:bg-[#3d4f3a]">
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
            {/* Logout Modal */}
            {showConfirmLogout && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-sm text-center">
                        <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
                        <p className="mb-6">Are you sure you want to log out?</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => setShowConfirmLogout(false)} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">Cancel</button>
                            <button onClick={handleLogout} className="bg-[#4A5D45] text-white px-4 py-2 rounded hover:bg-red-500">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
            <FooterLayout />
        </div>
    );
}

export default UserProfileSettings;
