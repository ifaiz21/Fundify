// src/Pages/Layout/Header.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from '../../context/UserContext';
import { toast } from 'react-toastify';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Import icons for hamburger menu

export default function Header({ hideHome }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state for mobile menu
  const navigate = useNavigate();
  const location = useLocation();

  const { userProfile, loadingUserContext } = useUser();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null); // Ref for mobile menu container

  const avatarSrc = userProfile.profilePictureUrl || "/Images/default-avatar.png";

  // Close dropdown or mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    setIsLoggedIn(false);
    setShowConfirmLogout(false);
    navigate("/login");
    toast.success("Successfully logged out", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleDonateClick = (e) => {
    e.preventDefault();
    navigate("/explore", { state: { purpose: "select-for-donation" } });
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleCreateCampaignClick = (e) => {
    e.preventDefault();

    if (loadingUserContext) {
      toast.info('Loading user data, please wait...', {
        position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined,
      });
      return;
    }

    const kycStatus = userProfile.kycStatus;
    console.log("Header Create Campaign Click - KYC Status:", kycStatus);

    if (kycStatus === 'Approved') {
      navigate("/create-campaign");
    } else if (kycStatus === 'Rejected') {
      toast.error('You are not a verified user by FUNDIFY. Please complete your KYC first.', {
        position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined,
      });
    } else if (kycStatus === 'Pending Review') {
      toast.info('Please wait for verification by FUNDIFY.', {
        position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined,
      });
    } else {
      toast.info('Please submit your KYC first.', {
        position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined,
      });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 bg-transparent relative md:px-6"> {/* Adjusted padding for mobile */}
        {/* Left Side - Logo & Navigation */}
        <div className="flex items-center space-x-4 md:space-x-6"> {/* Adjusted space-x for mobile */}
          {/* Logo */}
          <img
            src="/Images/logo.png"
            alt="Fundify Logo"
            className="w-10 h-10 cursor-pointer md:w-12 md:h-12" // Adjusted logo size for mobile
            onClick={() => navigate('/')}
          />

          {/* Desktop Navigation - Hidden on mobile, visible on medium screens and up */}
          <nav className="hidden md:flex md:space-x-6">
            {!hideHome && (
              <a href="/" className="text-white hover:text-gray-300">Home</a>
            )}
            <a href="/explore" onClick={handleDonateClick} className="text-white hover:text-gray-300">Donate</a>
            <a href="/about" className="text-white hover:text-gray-300">About Us</a>
          </nav>
        </div>

        {/* Right Side - Actions & User */}
        <div className="flex items-center space-x-4 md:space-x-6"> {/* Adjusted space-x for mobile */}
          {/* Desktop "Create Campaign" and "Contact Us" - Hidden on mobile, visible on medium screens and up */}
          <a href="/create-campaign" className="hidden text-white hover:text-gray-300 md:block" onClick={handleCreateCampaignClick}>
            Create Campaign
          </a>
          <a href="/contact" className="hidden text-white hover:text-gray-300 md:block">Contact Us</a>

          {/* User Account Icon with Login Check */}
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300"
              >
                {loadingUserContext ? (
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                ) : (
                  <img
                    src={avatarSrc}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/Images/default-avatar.png";
                    }}
                  />
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-xl py-2 w-40 transition-opacity duration-300 ease-out z-50">
                  <a href="/user-profile" className="block px-5 py-2 text-md hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200" onClick={() => { setShowDropdown(false); setIsMobileMenuOpen(false); }}>
                    My Profile
                  </a>
                  <button
                    onClick={() => { setShowConfirmLogout(true); setShowDropdown(false); }}
                    className="w-full text-left px-5 py-2 text-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a href="/login" className="hidden text-white hover:text-gray-300 md:block"> {/* Login/Signup also hidden on mobile, part of hamburger menu */}
              Login / Sign Up
            </a>
          )}

          {/* Hamburger Menu Button - Visible on mobile, hidden on medium screens and up */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-8 w-8" /> // 'X' icon when menu is open
              ) : (
                <Bars3Icon className="h-8 w-8" /> // Hamburger icon when menu is closed
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - hidden by default, slides in from top/side */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 bg-black bg-opacity-90 z-40 md:hidden animate-fade-in-down" // Add animation class
        >
          <div className="flex flex-col items-center pt-20 pb-8 space-y-6 text-white text-xl">
            {!hideHome && (
              <a href="/" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
            )}
            <a href="/explore" onClick={handleDonateClick} className="hover:text-gray-300">Donate</a>
            <a href="/about" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>About Us</a>
            <a href="/create-campaign" onClick={handleCreateCampaignClick} className="hover:text-gray-300">
              Create Campaign
            </a>
            <a href="/contact" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</a>
            {!isLoggedIn && (
              <a href="/login" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
                Login / Sign Up
              </a>
            )}
          </div>
        </div>
      )}


      {/* Logout Confirmation Modal */}
      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-sm text-center"> {/* Adjusted width for mobile */}
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
                onClick={() => {
                  handleLogout();
                  setShowConfirmLogout(false);
                }}
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
}