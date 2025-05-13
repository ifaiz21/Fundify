import React from "react";
import { Link } from "react-router-dom";

const HeaderLayout = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      
      {/* Left Side - Logo & Navigation */}
      <div className="flex items-center space-x-6"> {/* CHANGED: Wrapped logo & nav in a div */}
        {/* Logo */}
        <div className="flex items-center">
          <img src="./images/fundify-transparent-logo.png" alt="Fundify Logo" className="w-12 h-12 mr-2" />
          {/*
          <span className="font-bold text-lg text-gray-700">
            FUND<span className="text-green-600">iFY</span>
          </span> */}
        </div>
 
        {/* Left-aligned Navigation Links */}
        <nav className="flex space-x-6 text-[#000000]">  {/* CHANGED: Moved nav inside the new div */}
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/donate" className="hover:underline">Donate</Link>
          <Link to="/about" className="hover:underline">About Us</Link>
        </nav>
      </div>

      {/* Right Side - User Account & Extra Links */}
      <div className="flex items-center space-x-6">
        <Link to="/create-campaign" className="hover:underline">Create Campaign</Link>
        <Link to="/contact" className="hover:underline">Contact Us</Link>

        {/* User Account Icon */}
        <Link to="/login" className="flex items-center">
          <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4"></circle>
              <path d="M4 21v-1a7 7 0 0 1 14 0v1"></path>
            </svg>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default HeaderLayout;
