import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/react/24/outline';
import { fetchNotifications } from '../../features/notificationSlice';
import { logoutSuccess } from '../../features/userSlice';

export default function Header({ hideHome }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // --- Change: Data ab Redux se aa raha hai, UserContext se nahin ---
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
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) setIsMobileMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logoutSuccess()); // <-- Change: Dispatch Redux action
        setShowConfirmLogout(false);
        navigate("/login");
        toast.success("Successfully logged out");
    };

    const handleDonateClick = (e) => {
        e.preventDefault();
        navigate("/explore");
        setIsMobileMenuOpen(false);
    };

    const handleCreateCampaignClick = (e) => {
        e.preventDefault();
        if (!isAuthenticated || !user) {
            toast.error('Please log in first to create a campaign.');
            navigate('/login');
            return;
        }
        if (loading) {
            toast.info('Loading user data, please wait...');
            return;
        }
        const kycStatus = user.kycStatus;
        if (kycStatus === 'Approved') navigate("/create-campaign");
        else if (kycStatus === 'Rejected') toast.error('Your KYC was rejected. Please check your profile.');
        else if (kycStatus === 'Pending Review') toast.info('Your KYC is pending review.');
        else toast.info('Please submit your KYC first to create a campaign.');
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header className="flex items-center justify-between px-4 py-3 bg-transparent relative md:px-6 z-50">
                <div className="flex items-center space-x-4 md:space-x-6">
                    <img src="/Images/logo.png" alt="Fundify Logo" className="w-10 h-10 cursor-pointer md:w-12 md:h-12" onClick={() => navigate('/')} />
                    <nav className="hidden md:flex md:space-x-6">
                        {!hideHome && <a href="/" className="text-white hover:text-gray-300">Home</a>}
                        <a href="/explore" onClick={handleDonateClick} className="text-white hover:text-gray-300">Donate</a>
                        <a href="/about" className="text-white hover:text-gray-300">About Us</a>
                    </nav>
                </div>

                <div className="flex items-center space-x-4 md:space-x-6">
                    <a href="/create-campaign" className="hidden text-white hover:text-gray-300 md:block" onClick={handleCreateCampaignClick}>Create Campaign</a>
                    <a href="/contact" className="hidden text-white hover:text-gray-300 md:block">Contact Us</a>

                    {isAuthenticated ? (
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <button onClick={() => navigate('/notifications')} className="relative text-white p-2 rounded-full hover:bg-white/20 focus:outline-none">
                                <BellIcon className="h-6 w-6" />
                                {unreadCount > 0 && <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>}
                            </button>
                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setShowDropdown(!showDropdown)} className="w-10 h-10 rounded-full flex items-center justify-center focus:outline-none">
                                    {loading ? <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                                        : <img src={avatarSrc} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-gray-300" onError={(e) => { e.target.onerror = null; e.target.src = "/Images/default-avatar.png"; }} />}
                                </button>
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-xl py-2 w-48 z-50">
                                        <a href="/user-profile" className="block px-5 py-2 text-md hover:bg-indigo-50" onClick={(e) => { e.preventDefault(); navigate('/user-profile'); setShowDropdown(false); }}>My Profile</a>
                                        <a href="/notifications" className="flex justify-between items-center px-5 py-2 text-md hover:bg-indigo-50" onClick={(e) => { e.preventDefault(); navigate('/notifications'); setShowDropdown(false); }}>
                                            <span>Notifications</span>
                                            {unreadCount > 0 && <span className="font-bold bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{unreadCount}</span>}
                                        </a>
                                        <button onClick={() => { setShowConfirmLogout(true); setShowDropdown(false); }} className="w-full text-left px-5 py-2 text-md text-red-600 hover:bg-red-50">Logout</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <a href="/login" className="hidden text-white hover:text-gray-300 md:block">Login / Sign Up</a>
                    )}

                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none">
                            {isMobileMenuOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
                        </button>
                    </div>
                </div>
            </header>

            {isMobileMenuOpen && (
                <div ref={mobileMenuRef} className="fixed inset-0 bg-black bg-opacity-90 z-40 md:hidden">
                    <div className="flex flex-col items-center pt-20 pb-8 space-y-6 text-white text-xl">
                        {!hideHome && <a href="/" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Home</a>}
                        <a href="/explore" onClick={handleDonateClick} className="hover:text-gray-300">Donate</a>
                        <a href="/about" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>About Us</a>
                        <a href="/create-campaign" onClick={handleCreateCampaignClick} className="hover:text-gray-300">Create Campaign</a>
                        <a href="/contact" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</a>
                        {!isAuthenticated && <a href="/login" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Login / Sign Up</a>}
                    </div>
                </div>
            )}

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
        </>
    );
}