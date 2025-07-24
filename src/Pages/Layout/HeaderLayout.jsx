// src/Pages/Layout/HeaderLayout.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logoutSuccess } from '../../store';
import { fetchNotifications } from '../../features/notificationSlice';
import { showSuccessMessage } from '../../utils/toast';
import { Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/react/24/outline';

const HeaderLayout = ({ hideCreate, hideContact, hideDonate, hideAboutUs, hideProfile }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isAuthenticated, loading } = useSelector((state) => state.user);
    const { unreadCount } = useSelector((state) => state.notifications);

    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const avatarSrc = user?.profilePictureUrl ? `https://server-fundify.up.railway.app/${user.profilePictureUrl}` : "/Images/default-avatar.png";

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchNotifications());
        }
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setShowDropdown(false);
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-toggle-button')) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logoutSuccess());
        setShowConfirmLogout(false);
        navigate("/login");
        showSuccessMessage("You have been logged out successfully!");
    };

    const handleDonateClick = (e) => {
        e.preventDefault();
        navigate("/explore", { state: { purpose: "select-for-donation" } });
        setIsMobileMenuOpen(false);
    };

    const handleCreateCampaignClick = (e) => {
        e.preventDefault();
        if (!isAuthenticated || !user) {
            showSuccessMessage('Please log in first to create a campaign.');
            navigate('/login');
            return;
        }
        if (loading) {
            showSuccessMessage('Loading user data, please wait...');
            return;
        }
        const kycStatus = user.kycStatus;
        if (kycStatus === 'Approved') navigate("/create-campaign");
        else if (kycStatus === 'Rejected') showSuccessMessage('You are not a verified user. Please complete your KYC first.');
        else if (kycStatus === 'Pending Review') showSuccessMessage('Please wait for your KYC verification.');
        else showSuccessMessage('Please submit your KYC first.');
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header className="flex items-center justify-between px-4 py-3 bg-white shadow-md relative md:px-6 z-50">
                <div className="flex items-center space-x-4 md:space-x-6">
                    <div className="flex items-center">
                        <img src="/Images/fundify-transparent-logo.png" alt="Fundify Logo" className="w-10 h-10 mr-1 cursor-pointer md:w-12 md:h-12 md:mr-2" onClick={() => navigate('/')} />
                    </div>
                    <nav className="hidden md:flex md:space-x-6 md:text-[#000000]">
                        {/* Home Link */}
                        <Link to="/" className="px-3 py-2 rounded-md transition-colors duration-200 hover:bg-[#4A5D45] hover:text-white">Home</Link>
                        {/* Donate Link */}
                        {!hideDonate && <a href="/explore" onClick={handleDonateClick} className="px-3 py-2 rounded-md transition-colors duration-200 hover:bg-[#4A5D45] hover:text-white">Donate</a>}
                        {/* About Us Link */}
                        {!hideAboutUs && <Link to="/about" className="px-3 py-2 rounded-md transition-colors duration-200 hover:bg-[#4A5D45] hover:text-white">About Us</Link>}
                    </nav>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
                    {/* Create Campaign Link */}
                    {!hideCreate && <Link to="/create-campaign" className="hidden px-3 py-2 rounded-md transition-colors duration-200 hover:bg-[#4A5D45] hover:text-white md:block" onClick={handleCreateCampaignClick}>Create Campaign</Link>}
                    {/* Contact Us Link */}
                    {!hideContact && <Link to="/contact" className="hidden px-3 py-2 rounded-md transition-colors duration-200 hover:bg-[#4A5D45] hover:text-white md:block">Contact Us</Link>}

                    {isAuthenticated ? (
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {/* Notification Bell Icon */}
                            <button onClick={() => navigate('/notifications')} className="relative text-gray-600 p-2 rounded-full hover:bg-gray-200 focus:outline-none">
                                <BellIcon className="h-6 w-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
                                )}
                            </button>

                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setShowDropdown(!showDropdown)} className="w-10 h-10 rounded-full flex items-center justify-center focus:outline-none">
                                    {loading ? <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                                        : <img src={avatarSrc} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-gray-300" onError={(e) => { e.target.onerror = null; e.target.src = "/Images/default-avatar.png"; }} />}
                                </button>
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-xl py-2 w-48 z-50">
                                        {!hideProfile && <Link to="/user-profile" className="block px-5 py-2 text-md hover:bg-indigo-50" onClick={() => setShowDropdown(false)}>My Profile</Link>}
                                        
                                        <Link to="/notifications" className="flex justify-between items-center px-5 py-2 text-md hover:bg-indigo-50" onClick={() => setShowDropdown(false)}>
                                            <span>Notifications</span>
                                            {unreadCount > 0 && <span className="font-bold bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{unreadCount}</span>}
                                        </Link>
                                        
                                        <button onClick={() => { setShowConfirmLogout(true); setShowDropdown(false); }} className="w-full text-left px-5 py-2 text-md text-red-600 hover:bg-red-50">Logout</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        // Login / Sign Up Link
                        <Link to="/login" className="hidden px-3 py-2 rounded-md transition-colors duration-200 hover:bg-[#4A5D45] hover:text-white md:block">Login / Sign Up</Link>
                    )}

                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[#000000] focus:outline-none mobile-menu-toggle-button">
                            {isMobileMenuOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay - hidden by default, slides in from top/side */}
            {isMobileMenuOpen && (
                <div
                    ref={mobileMenuRef}
                    className="fixed inset-0 bg-white bg-opacity-95 z-40 md:hidden animate-fade-in-down"
                >
                    {/* Close button inside the mobile menu overlay */}
                    <div className="flex justify-end p-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-[#000000] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                            aria-label="Close main menu"
                        >
                            <XMarkIcon className="h-8 w-8" />
                        </button>
                    </div>
                    <div className="flex flex-col items-center pt-20 pb-8 space-y-6 text-[#000000] text-xl">
                        {/* Mobile Menu Links - Added hover effects here too for consistency */}
                        <Link to="/" className="px-4 py-2 rounded-md hover:bg-[#4A5D45] hover:text-white transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                        {!hideDonate && (
                            <a href="/explore" onClick={handleDonateClick} className="px-4 py-2 rounded-md hover:bg-[#4A5D45] hover:text-white transition-colors duration-200">Donate</a>
                        )}
                        {!hideAboutUs && (
                            <Link to="/about" className="px-4 py-2 rounded-md hover:bg-[#4A5D45] hover:text-white transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                        )}
                        {!hideCreate && (
                            <Link to="/create-campaign" onClick={handleCreateCampaignClick} className="px-4 py-2 rounded-md hover:bg-[#4A5D45] hover:text-white transition-colors duration-200">
                                Create Campaign
                            </Link>
                        )}
                        {!hideContact && (
                            <Link to="/contact" className="px-4 py-2 rounded-md hover:bg-[#4A5D45] hover:text-white transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
                        )}
                        {!isAuthenticated && (
                            <Link to="/login" className="px-4 py-2 rounded-md hover:bg-[#4A5D45] hover:text-white transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                                Login / Sign Up
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {showConfirmLogout && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-sm text-center">
                        <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
                        <p className="mb-6">Are you sure you want to log out?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setShowConfirmLogout(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-[#4A5D45] text-white px-4 py-2 rounded hover:bg-red-500"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HeaderLayout;