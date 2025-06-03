import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const HeaderLayout = ({ hideCreate }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      navigate("/user-profile");
    } else {
      setMessage("Please login first!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <>
      {/* Top message if not logged in */}
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
          <Link to="/contact" className="hover:underline">Contact Us</Link>

          {/* User Account Icon with Login Check */}
          <button
            onClick={handleUserIconClick}
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
        </div>
      </header>
    </>
  );
};

export default HeaderLayout;
