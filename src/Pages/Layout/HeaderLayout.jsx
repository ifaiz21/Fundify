// src/Pages/Layout/HeaderLayout.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from '../../context/UserContext';

const HeaderLayout = ({ hideCreate, hideContact, hideDonate, hideAboutUs, hideProfile }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { userProfile, loadingUserContext } = useUser();

  // ADDED: Default avatar logic
  const avatarSrc = userProfile.profilePictureUrl || "/Images/default-avatar.png";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowConfirmLogout(false);
    setLogoutMessage("Successfully logged out");
    navigate("/login");

    setTimeout(() => {
      setLogoutMessage("");
    }, 3000);
  };

  return (
    <>
      {message && (
        <div className="bg-[#4A5D45] text-white text-center py-2">
          {message}
        </div>
      )}
      {/* Logout success message */}
      {logoutMessage && (
        <div className="bg-[#B2C9AD] text-white text-center py-2">
          {logoutMessage}
        </div>
      )}

      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        {/* Left Side - Logo & Navigation */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="./images/fundify-transparent-logo.png"
              alt="Fundify Logo"
              className="w-12 h-12 mr-2"
            />
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-6 text-[#000000]">
            <Link to="/" className="hover:underline">Home</Link>
            {!hideDonate && (
              <Link to="/donate" className="hover:underline">Donate</Link>
            )}
            {!hideAboutUs && (
              <Link to="/about" className="hover:underline">About Us</Link>
            )}
          </nav>
        </div>

        {/* Right Side - Extra Links */}
        <div className="flex items-center space-x-6">
          {!hideCreate && (
            <Link to="/create-campaign" className="hover:underline">
              Create Campaign
            </Link>
          )}
          {!hideContact && (
            <Link to="/contact" className="hover:underline">Contact Us</Link>
          )}

          {/* User Account Icon with Login Check */}
          {isLoggedIn ? (
            <div className="relative">
              {/* Profile Picture Link */}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full flex items-center justify-center" // Remove hardcoded bg-gray and border for the image to show
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
                <div className="absolute right-0 mt-1 bg-gray-200 text-black rounded shadow-lg py-2 w-40 z-50">
                  {!hideProfile && (
                    <a href="/user-profile" className="block px-4 py-2 hover:bg-[#B2C9AD]">
                      My Profile
                    </a>
                  )}
                  <button
                    onClick={() => setShowConfirmLogout(true)}
                    className="w-full text-left px-4 py-2 hover:bg-red-400"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a href="/login" className="hover:underline">Login / Sign Up</a>
          )}
        </div>
      </header>
      {/* Logout Confirmation Modal */}
      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Sign Out</h2>
            <p className="mb-6">Are you sure you want to sign out?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirmLogout(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="bg-[#4A5D45] text-white px-4 py-2 rounded"
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