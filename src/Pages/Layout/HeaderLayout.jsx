// src/Pages/Layout/HeaderLayout.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // useLocation ko bhi import karein
import { useUser } from '../../context/UserContext'; // ADDED: Import useUser hook

// showDashboard prop add kiya
const HeaderLayout = ({ hideCreate, showDashboard }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Current path hasil karne ke liye

  // ADDED: Get userProfile and loading state from context
  const { userProfile, loadingUserContext } = useUser(); 

  // ADDED: Default avatar logic
  const avatarSrc = userProfile.profilePictureUrl || "/Images/default-avatar.png";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]); // path change hone par login status update karein
<Link to="/profile-settings" className="flex items-center">
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
</Link>
  return (
    <>
      {message && (
        <div className="bg-[#4A5D45] text-white text-center py-2">
          {message}
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
            <Link to="/donate" className="hover:underline">Donate</Link>
            <Link to="/about" className="hover:underline">About Us</Link>
          </nav>
        </div>

        {/* Right Side - Extra Links */}
        <div className="flex items-center space-x-6">
          {!hideCreate && (
            <Link to="/create-campaign" className="hover:underline">
              Create Campaign
            </Link>
          )}
          {isLoggedIn && showDashboard && ( // Dashboard button yahan dikhayenge
            <Link to="/admin-dashboard" className="hover:underline">
              Dashboard
            </Link>
          )}
          <Link to="/contact" className="hover:underline">Contact Us</Link>

          {/* User Account Icon with Login Check - MODIFIED TO USE PROFILE PICTURE */}
          <Link
            to="/profile-settings" // Changed to Link to match new header design logic
            className="flex items-center" // Kept existing classes for styling
          >
            {loadingUserContext ? ( // ADDED: Loading skeleton while context loads
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div> 
            ) : ( // ADDED: Dynamic image or default avatar
              <img
                src={avatarSrc}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                onError={(e) => { // Fallback if image fails to load
                  e.target.onerror = null;
                  e.target.src = "/Images/default-avatar.png";
                }}
              />
            )}
          </Link>
        </div>
      </header>
    </>
  );
};

export default HeaderLayout;