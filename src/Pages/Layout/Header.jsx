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
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHeaderHovered, setIsHeaderHovered] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isAuthenticated, loading } = useSelector((state) => state.user);
    const { unreadCount } = useSelector((state) => state.notifications);

    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const headerRef = useRef(null); 

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

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleLogout = () => {
        dispatch(logoutSuccess());
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
    const handleNotificationClick = () => {
        navigate('/user-profile', { state: { defaultTab: 'Notifications' } });
    };

    return (
        <>
            <header
                ref={headerRef} // Assign the ref to the header
                onMouseEnter={() => setIsHeaderHovered(true)} // Handle mouse enter
                onMouseLeave={() => setIsHeaderHovered(false)} // Handle mouse leave
                className={`flex items-center justify-between px-4 py-3 relative w-full z-50 transition-all duration-300
                    ${isScrolled || isHeaderHovered ? 'bg-gray-500 bg-opacity-40 shadow-md' : 'bg-transparent'}` // Updated conditional classes
                }
            >
                <div className="flex items-center space-x-4 md:space-x-6">
                    <img src="/Images/logo.png" alt="Fundify Logo" className="w-10 h-10 cursor-pointer md:w-12 md:h-12" onClick={() => navigate('/')} />
                    <nav className="hidden md:flex md:space-x-2">
                        {!hideHome && <a href="/" className="px-3 py-2 rounded-lg text-white font-semibold hover:bg-[#4A5D45] transition-colors duration-200">Home</a>} {/* Added font-semibold */}
                        <a href="/explore" onClick={handleDonateClick} className="px-3 py-2 rounded-lg text-white font-semibold hover:bg-[#4A5D45] transition-colors duration-200">Donate</a> {/* Added font-semibold */}
                        <a href="/about" className="px-3 py-2 rounded-lg text-white font-semibold hover:bg-[#4A5D45] transition-colors duration-200">About Us</a> {/* Added font-semibold */}
                    </nav>
                </div>

                <div className="flex items-center space-x-4 md:space-x-6">
                    <a href="/create-campaign" className="hidden px-3 py-2 rounded-lg text-white font-semibold hover:bg-[#4A5D45] transition-colors duration-200 md:block" onClick={handleCreateCampaignClick}>Create Campaign</a> {/* Added font-semibold */}
                    <a href="/contact" className="hidden px-3 py-2 rounded-lg text-white font-semibold hover:bg-[#4A5D45] transition-colors duration-200 md:block">Contact Us</a> {/* Added font-semibold */}

                    {isAuthenticated ? (
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <button onClick={handleNotificationClick} className="relative text-white p-2 rounded-full hover:bg-[#4A5D45] transition-colors duration-200 focus:outline-none">
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
                                        <a href="/user-profile" className="block px-5 py-2 text-md hover:bg-gray-100" onClick={(e) => { e.preventDefault(); navigate('/user-profile'); setShowDropdown(false); }}>My Profile</a>
                                        <a href="/kyc-form" className="block px-5 py-2 text-md hover:bg-gray-100" onClick={(e) => { e.preventDefault(); navigate('/kyc-form'); setShowDropdown(false); }}>KYC Verification</a>
                                        <button onClick={() => { setShowConfirmLogout(true); setShowDropdown(false); }} className="w-full text-left px-5 py-2 text-md text-red-600 hover:bg-red-50">Logout</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <a href="/login" className="hidden px-3 py-2 rounded-lg text-white font-semibold hover:bg-[#4A5D45] transition-colors duration-200 md:block">Login / Sign Up</a> /* Added font-semibold */
                    )}

                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2 rounded-lg focus:outline-none hover:bg-[#4A5D45] transition-colors duration-200">
                            {isMobileMenuOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
                        </button>
                    </div>
                </div>
            </header>

            {isMobileMenuOpen && (
                <div ref={mobileMenuRef} className="fixed inset-0 bg-black bg-opacity-90 z-40 md:hidden">
                    <div className="flex flex-col items-center pt-20 pb-8 space-y-6 text-white text-xl">
                        {!hideHome && <a href="/" className="px-4 py-2 rounded-lg hover:bg-gray-700 w-full text-center font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Home</a>}
                        <a href="/explore" onClick={handleDonateClick} className="px-4 py-2 rounded-lg hover:bg-gray-700 w-full text-center font-semibold">Donate</a>
                        <a href="/about" className="px-4 py-2 rounded-lg hover:bg-gray-700 w-full text-center font-semibold" onClick={() => setIsMobileMenuOpen(false)}>About Us</a>
                        <a href="/create-campaign" onClick={handleCreateCampaignClick} className="px-4 py-2 rounded-lg hover:bg-gray-700 w-full text-center font-semibold">Create Campaign</a>
                        {isAuthenticated && (
                         <a href="/kyc-form" onClick={(e) => {e.preventDefault();
                                    navigate('/kyc-form');
                                    setIsMobileMenuOpen(false);
                                }}
                                className="px-4 py-2 rounded-lg hover:bg-gray-700 w-full text-center font-semibold">
                                KYC Verification
                            </a>
                        )}
                        <a href="/contact" className="px-4 py-2 rounded-lg hover:bg-gray-700 w-full text-center font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</a>
                        {!isAuthenticated && <a href="/login" className="px-4 py-2 rounded-lg hover:bg-gray-700 w-full text-center font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Login / Sign Up</a>}
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