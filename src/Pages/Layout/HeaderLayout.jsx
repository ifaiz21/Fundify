import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const HeaderLayout = ({ hideCreate , hideContact , hideDonate , hideAboutUS, hideProfile }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

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
      {/* Top message if not logged in */}
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
            {!hideAboutUS && (
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
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full border-2 border-gray-300 bg-gray-300 flex items-center justify-center"
              >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-700"
            >
              <circle cx="12" cy="8" r="4"></circle>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            </svg>
          </button>
          {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg py-2 w-40 z-50">
                  {!hideProfile && (
                  <a href="/user-profile" className="block px-4 py-2 hover:bg-gray-100">
                    My Profile
                  </a>
                  )}
                  <button
                    onClick={() => setShowConfirmLogout(true)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Sign Out
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
