import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/react/24/outline';
import { fetchNotifications } from '../../features/notificationSlice';
import { logoutSuccess } from '../../features/userSlice';
import gsap from 'gsap'; // GSAP ko import karein

export default function Header({ hideHome }) {
    // States
    const [showDropdown, setShowDropdown] = useState(false);
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHeaderHovered, setIsHeaderHovered] = useState(false);

    // Hooks
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux State
    const { user, isAuthenticated, loading } = useSelector((state) => state.user);
    const { unreadCount } = useSelector((state) => state.notifications);

    // Refs
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const headerRef = useRef(null);
    const logoutModalRef = useRef(null); // Logout modal ke liye naya ref
    const mobileMenuTimeline = useRef(null); // Mobile menu animation ke liye timeline ref

    const avatarSrc = user?.profilePictureUrl ? `https://server-fundify.up.railway.app/${user.profilePictureUrl}` : "/Images/default-avatar.png";

    // --- Side Effects (useEffect) ---

    // Fetch notifications on authentication
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchNotifications());
        }
    }, [dispatch, isAuthenticated]);

    // Click outside handler for dropdowns and menus
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setShowDropdown(false);
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target.closest('.md\\:hidden'))) {
                 // Close mobile menu only if click is outside the menu and not on the toggle button
                 if (isMobileMenuOpen) {
                     // Animate out
                    if (mobileMenuTimeline.current) {
                        mobileMenuTimeline.current.reverse();
                    }
                 }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobileMenuOpen]);

    // Scroll handler for header background
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // --- GSAP Animation Effects ---

    // 1. Profile Dropdown Animation
    useEffect(() => {
        if (showDropdown) {
            gsap.fromTo(dropdownRef.current, 
                { autoAlpha: 0, y: -20 }, 
                { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }
            );
        }
    }, [showDropdown]);

    // 2. Mobile Menu Animation
    useEffect(() => {
        // Timeline ko aik baar initialize karein
        mobileMenuTimeline.current = gsap.timeline({
            paused: true,
            onReverseComplete: () => setIsMobileMenuOpen(false) // Animation reverse hone par state update karein
        })
        .fromTo(mobileMenuRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
        .fromTo('.mobile-link', 
            { autoAlpha: 0, x: -30 }, 
            { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.1, ease: 'power2.out' },
            "-=0.2" // Start this animation 0.2s before the previous one ends
        );
    }, []); // Empty dependency array ensures this runs only once

    // 3. Logout Modal Animation
    useEffect(() => {
        if (showConfirmLogout) {
            gsap.fromTo(logoutModalRef.current, 
                { autoAlpha: 0, scale: 0.9 }, 
                { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
            );
        }
    }, [showConfirmLogout]);

    // --- Handlers ---
    
    const toggleMobileMenu = () => {
        if (!isMobileMenuOpen) {
            setIsMobileMenuOpen(true);
            mobileMenuTimeline.current.play();
        } else {
            mobileMenuTimeline.current.reverse();
        }
    };

    const handleLogout = () => {
        // Animate out before logging out
        gsap.to(logoutModalRef.current, {
            autoAlpha: 0,
            scale: 0.9,
            duration: 0.2,
            onComplete: () => {
                setShowConfirmLogout(false);
                dispatch(logoutSuccess());
                navigate("/login");
                toast.success("Successfully logged out");
            }
        });
    };

    const handleLinkClick = (path, handler, requiresAuth = false) => (e) => {
        e.preventDefault();
        
        // Close menu with animation
        if (isMobileMenuOpen) {
            mobileMenuTimeline.current.reverse();
        }

        if (handler) {
            handler(e); // For complex logic like create-campaign
        } else {
            navigate(path);
        }
    };


    const handleCreateCampaignClick = (e) => {
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
    };

    const handleNotificationClick = () => {
        navigate('/user-profile', { state: { defaultTab: 'Notifications' } });
    };

    return (
        <>
            <header
                ref={headerRef}
                onMouseEnter={() => setIsHeaderHovered(true)}
                onMouseLeave={() => setIsHeaderHovered(false)}
                className={`flex items-center justify-between px-4 py-3 relative w-full z-50 transition-all duration-300
                    ${isScrolled || isHeaderHovered ? 'bg-gray-500 bg-opacity-40 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}
            >
                {/* Left Side: Logo and Desktop Nav */}
                <div className="flex items-center space-x-4 md:space-x-6">
                    <img src="/Images/logo.png" alt="Fundify Logo" className="w-10 h-10 cursor-pointer md:w-12 md:h-12" onClick={() => navigate('/')} />
                    <nav className="hidden md:flex md:space-x-2">
                        {!hideHome && <a href="/" onClick={handleLinkClick('/')} className="px-3 py-2 rounded-lg text-white font-semibold hover:bg-[#4A5D45] transition-colors duration-200">Home</a>}
                        <a href="/explore" onClick={handleLinkClick('/explore')} className="px-3 py-2 rounded-lg text-white font-semibold hover:bg-[#4A5D45] transition-colors duration-200">Donate</a>
                        <a href="/about" onClick={handleLinkClick('/about')} className="px-3 py-2 rounded-lg text-white font-semibold hover:bg-[#4A5D45] transition-colors duration-200">About Us</a>
                    </nav>
                </div>

                {/* Right Side: Actions and Profile */}
                <div className="flex items-center space-x-4 md:space-x-6">
                    <a href="/create-campaign" className="hidden px-3 py-2 rounded-lg text-white font-semibold hover:bg-[#4A5D45] transition-colors duration-200 md:block" onClick={handleLinkClick(null, handleCreateCampaignClick, true)}>Create Campaign</a>
                    <a href="/contact" className="hidden px-3 py-2 rounded-lg text-white font-semibold hover:bg-[#4A5D45] transition-colors duration-200 md:block" onClick={handleLinkClick('/contact')}>Contact Us</a>

                    {isAuthenticated ? (
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <button onClick={handleNotificationClick} className="relative text-white p-2 rounded-full hover:bg-[#4A5D45] transition-colors duration-200 focus:outline-none">
                                <BellIcon className="h-6 w-6" />
                                {unreadCount > 0 && <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 animate-ping"></span>}
                                {unreadCount > 0 && <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>}
                            </button>
                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setShowDropdown(!showDropdown)} className="w-10 h-10 rounded-full flex items-center justify-center focus:outline-none">
                                    {loading ? <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                                        : <img src={avatarSrc} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-gray-300" onError={(e) => { e.target.onerror = null; e.target.src = "/Images/default-avatar.png"; }} />}
                                </button>
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-xl py-2 w-48 z-50 opacity-0"> {/* Initial opacity-0 */}
                                        <a href="/user-profile" className="block px-5 py-2 text-md hover:bg-gray-100" onClick={(e) => { e.preventDefault(); navigate('/user-profile'); setShowDropdown(false); }}>My Profile</a>
                                        <a href="/kyc-form" className="block px-5 py-2 text-md hover:bg-gray-100" onClick={(e) => { e.preventDefault(); navigate('/kyc-form'); setShowDropdown(false); }}>KYC Verification</a>
                                        <button onClick={() => { setShowConfirmLogout(true); setShowDropdown(false); }} className="w-full text-left px-5 py-2 text-md text-red-600 hover:bg-red-50">Logout</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <a href="/login" className="hidden px-3 py-2 rounded-lg text-white font-semibold hover:bg-[#4A5D45] transition-colors duration-200 md:block" onClick={handleLinkClick('/login')}>Login / Sign Up</a>
                    )}

                    {/* Mobile Menu Toggle Button */}
                    <div className="md:hidden">
                        <button onClick={toggleMobileMenu} className="text-white p-2 rounded-lg focus:outline-none hover:bg-[#4A5D45] transition-colors duration-200">
                            {isMobileMenuOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div ref={mobileMenuRef} className="fixed inset-0 bg-black bg-opacity-90 z-40 md:hidden opacity-0"> {/* Initial opacity-0 */}
                    <div className="flex flex-col items-center pt-20 pb-8 space-y-6 text-white text-xl">
                        {!hideHome && <a href="/" className="mobile-link px-4 py-2 rounded-lg hover:bg-gray-700 w-full text-center font-semibold opacity-0" onClick={handleLinkClick('/')}>Home</a>}
                        <a href="/explore" className="mobile-link px-4 py-2 rounded-lg hover:bg-gray-700 w-full text-center font-semibold opacity-0" onClick={handleLinkClick('/explore')}>Donate</a>
                        <a href="/about" className="mobile-link px-4 py-2 rounded-lg hover:bg-gray-700 w-full text-center font-semibold opacity-0" onClick={handleLinkClick('/about')}>About Us</a>
                        <a href="/create-campaign" className="mobile-link px-4 py-2 rounded-lg hover:bg-gray-700 w-full text-center font-semibold opacity-0" onClick={handleLinkClick(null, handleCreateCampaignClick, true)}>Create Campaign</a>
                        {isAuthenticated && (
                           <a href="/kyc-form" className="mobile-link px-4 py-2 rounded-lg hover:bg-gray-700 w-full text-center font-semibold opacity-0" onClick={handleLinkClick('/kyc-form')}>KYC Verification</a>
                        )}
                        <a href="/contact" className="mobile-link px-4 py-2 rounded-lg hover:bg-gray-700 w-full text-center font-semibold opacity-0" onClick={handleLinkClick('/contact')}>Contact Us</a>
                        {!isAuthenticated && <a href="/login" className="mobile-link px-4 py-2 rounded-lg hover:bg-gray-700 w-full text-center font-semibold opacity-0" onClick={handleLinkClick('/login')}>Login / Sign Up</a>}
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {showConfirmLogout && (
                <div ref={logoutModalRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 opacity-0"> {/* Initial opacity-0 */}
                    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-sm text-center">
                        <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
                        <p className="mb-6">Are you sure you want to log out?</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => gsap.to(logoutModalRef.current, {autoAlpha: 0, scale: 0.9, duration: 0.2, onComplete: () => setShowConfirmLogout(false)})} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">Cancel</button>
                            <button onClick={handleLogout} className="bg-[#4A5D45] text-white px-4 py-2 rounded hover:bg-red-500">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}