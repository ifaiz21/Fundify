// src/Pages/Layout/HeaderLayout.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from '../../context/UserContext';
import { showSuccessMessage, showErrorMessage } from '../../utils/toast'; // ADDED: Direct import of toast functions

const HeaderLayout = ({ hideCreate, hideContact, hideDonate, hideAboutUs, hideProfile }) => { // REMOVED: showToast from props
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  // REMOVED: logoutMessage state as showToast will handle it
  // const [logoutMessage, setLogoutMessage] = useState("");
  // REMOVED: message state as showToast will handle it
  // const [message, ] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { userProfile, loadingUserContext } = useUser();
  const dropdownRef = useRef(null);

  // Default avatar logic
  const avatarSrc = userProfile.profilePictureUrl || "/Images/default-avatar.png";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
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
    localStorage.removeItem("userProfile"); // Ensure userProfile is also cleared
    setIsLoggedIn(false);
    setShowConfirmLogout(false);
    navigate("/login");
    // UPDATED: Use showSuccessMessage for logout
    showSuccessMessage("You have been logged out successfully!");
  };

  // New handler for the Donate button
  const handleDonateClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    navigate("/explore", { state: { purpose: "select-for-donation" } });
  };

  // ADDED: New handler for "Create Campaign" button with KYC logic
  const handleCreateCampaignClick = (e) => {
    e.preventDefault(); // Prevent default link behavior for Link component

    if (loadingUserContext) {
      showErrorMessage('Loading user data, please wait...'); // Use showErrorMessage
      return;
    }

    const kycStatus = userProfile.kycStatus;
    console.log("HeaderLayout Create Campaign Click - KYC Status:", kycStatus); // Debugging

    if (kycStatus === 'Approved') {
      navigate("/create-campaign");
    } else if (kycStatus === 'Rejected') {
      showErrorMessage('You are not a verified user by FUNDIFY. Please complete your KYC first.'); // Use showErrorMessage
    } else if (kycStatus === 'Pending Review') {
      showErrorMessage('Please wait for verification by FUNDIFY.'); // Use showErrorMessage
    } else { // Covers cases like undefined, null, or any other status indicating not submitted
      showErrorMessage('Please submit your KYC first.'); // Use showErrorMessage
    }
  };

  return (
    <>
      {/* REMOVED: Local message and logoutMessage display JSX */}
      {/* {message && (
        <div className="bg-[#4A5D45] text-white text-center py-2">
          {message}
        </div>
      )}
      {logoutMessage && (
        <div className="bg-[#B2C9AD] text-white text-center py-2">
          {logoutMessage}
        </div>
      )} */}

      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        {/* Left Side - Logo & Navigation */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="./Images/fundify-transparent-logo.png"
              alt="Fundify Logo"
              className="w-12 h-12 mr-2 cursor-pointer"
              onClick={() => navigate('/')} // Navigate to homepage on logo click
            />
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-6 text-[#000000]">
            <Link to="/" className="hover:text-[#485842] transition duration-300">Home</Link>
            {!hideDonate && (
              // Modified Donate Link to use onClick handler
              <a href="/explore" onClick={handleDonateClick} className="hover:underline">Donate</a>
            )}
            {!hideAboutUs && (
              <Link to="/about" className="hover:underline">About Us</Link>
            )}
          </nav>
        </div>

        {/* Right Side - Extra Links */}
        <div className="flex items-center space-x-6">
          {!hideCreate && (
            <Link to="/create-campaign" className="hover:underline" onClick={handleCreateCampaignClick}> {/* MODIFIED: Use new handler */}
              Create Campaign
            </Link>
          )}
          {!hideContact && (
            <Link to="/contact" className="hover:underline">Contact Us</Link>
          )}

          {/* User Account Icon with Login Check */}
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Picture Link */}
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
                    <Link to="/user-profile" className="block px-5 py-2 text-md hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200" onClick={() => setShowDropdown(false)}>
                      My Profile
                    </Link>
                  )}
                  <button
                    onClick={() => setShowConfirmLogout(true)}
                    className="w-full text-left px-5 py-2 text-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:underline">Login / Sign Up</Link>
          )}
        </div>
      </header>
      {/* Logout Confirmation Modal */}
      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
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