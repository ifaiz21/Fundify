// src/Pages/Layout/HeaderLayout.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from '../../context/UserContext';
import { showSuccessMessage, showErrorMessage } from '../../utils/toast';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Import icons for hamburger menu

const HeaderLayout = ({ hideCreate, hideContact, hideDonate, hideAboutUs, hideProfile }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for HeaderLayout's mobile menu
  const navigate = useNavigate();
  const location = useLocation();

  const { userProfile, loadingUserContext } = useUser();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null); // Ref for HeaderLayout's mobile menu container

  const avatarSrc = userProfile.profilePictureUrl || "/Images/default-avatar.png";

  // Close dropdown or HeaderLayout's mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user dropdown if clicking outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      // Close HeaderLayout's mobile menu if clicking outside its container
      // Ensure the click is not on the hamburger button itself, to prevent immediate re-opening
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) &&
          !event.target.closest('.mobile-menu-toggle-button')) { // Added class to button for exclusion
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // No dependencies needed here as refs are stable

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
    showSuccessMessage("You have been logged out successfully!");
  };

  const handleDonateClick = (e) => {
    e.preventDefault();
    navigate("/explore", { state: { purpose: "select-for-donation" } });
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleCreateCampaignClick = (e) => {
    e.preventDefault();

    if (loadingUserContext) {
      showErrorMessage('Loading user data, please wait...');
      return;
    }

    const kycStatus = userProfile.kycStatus;
    console.log("HeaderLayout Create Campaign Click - KYC Status:", kycStatus);

    if (kycStatus === 'Approved') {
      navigate("/create-campaign");
    } else if (kycStatus === 'Rejected') {
      showErrorMessage('You are not a verified user by FUNDIFY. Please complete your KYC first.');
    } else if (kycStatus === 'Pending Review') {
      showErrorMessage('Please wait for verification by FUNDIFY.');
    } else {
      showErrorMessage('Please submit your KYC first.');
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 bg-white shadow-md relative md:px-6 z-50">
        {/* Left Side - Logo & Navigation */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="./Images/fundify-transparent-logo.png"
              alt="Fundify Logo"
              className="w-10 h-10 mr-1 cursor-pointer md:w-12 md:h-12 md:mr-2"
              onClick={() => navigate('/')}
            />
          </div>

          {/* Desktop Navigation - Hidden on mobile, visible on medium screens and up */}
          <nav className="hidden md:flex md:space-x-6 md:text-[#000000]">
            <Link to="/" className="hover:text-[#485842] transition duration-300">Home</Link>
            {!hideDonate && (
              <a href="/explore" onClick={handleDonateClick} className="hover:underline">Donate</a>
            )}
            {!hideAboutUs && (
              <Link to="/about" className="hover:underline">About Us</Link>
            )}
          </nav>
        </div>

        {/* Right Side - Actions & User */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Desktop "Create Campaign" and "Contact Us" - Hidden on mobile, visible on medium screens and up */}
          {!hideCreate && (
            <Link to="/create-campaign" className="hidden text-[#000000] hover:underline md:block" onClick={handleCreateCampaignClick}>
              Create Campaign
            </Link>
          )}
          {!hideContact && (
            <Link to="/contact" className="hidden text-[#000000] hover:underline md:block">Contact Us</Link>
          )}

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
                  {!hideProfile && (
                    <Link to="/user-profile" className="block px-5 py-2 text-md hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200" onClick={() => { setShowDropdown(false); setIsMobileMenuOpen(false); }}>
                      My Profile
                    </Link>
                  )}
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
            <Link to="/login" className="hidden text-[#000000] hover:underline md:block">
              Login / Sign Up
            </Link>
          )}

          {/* Hamburger Menu Button - Visible on mobile, hidden on medium screens and up */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#000000] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 mobile-menu-toggle-button" // Added class for exclusion
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-8 w-8" />
              ) : (
                <Bars3Icon className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - hidden by default, slides in from top/side */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 bg-white bg-opacity-95 z-40 md:hidden animate-fade-in-down" // Using white background for consistency with HeaderLayout
        >
          {/* Close button inside the mobile menu overlay */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsMobileMenuOpen(false)} // Explicitly close the menu
              className="text-[#000000] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              aria-label="Close main menu"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
          </div>
          <div className="flex flex-col items-center pt-20 pb-8 space-y-6 text-[#000000] text-xl">
            <Link to="/" className="hover:text-[#485842]" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            {!hideDonate && (
              <a href="/explore" onClick={handleDonateClick} className="hover:text-[#485842]">Donate</a>
            )}
            {!hideAboutUs && (
              <Link to="/about" className="hover:text-[#485842]" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            )}
            {!hideCreate && (
              <Link to="/create-campaign" onClick={handleCreateCampaignClick} className="hover:text-[#485842]">
                Create Campaign
              </Link>
            )}
            {!hideContact && (
              <Link to="/contact" className="hover:text-[#485842]" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
            )}
            {!isLoggedIn && (
              <Link to="/login" className="hover:text-[#485842]" onClick={() => setIsMobileMenuOpen(false)}>
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
