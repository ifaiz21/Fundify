import React from "react";
import { Link } from "react-router-dom";

const FooterLayout = () => {
  return (
    // Background adjusted to be very slightly lighter: #4B5945
    <footer className="bg-[#4B5945] text-white py-12 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-4 items-start"> {/* Adjusted grid-cols for centering */}

          {/* Logo Column - Centered on mobile, left-aligned on desktop */}
          {/* On larger screens, this column might naturally align due to other content */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-0">
            <Link to="/" className="mb-4">
              <div className="flex flex-col items-center md:items-start">
                {/* Logo made a little bigger in length (width) */}
                <img src="./Images/logo.png" alt="Fundify" className="h-35 w-40 md:h-32 md:w-30" />
              </div>
            </Link>
          </div>

          {/* Navigation Columns - Now centered using auto margins and flex properties */}
          {/* md:col-span-2 ensures it takes 2 columns in the 3-column grid for md screens */}
          {/* lg:col-start-2 lg:col-span-2 on large screens centers it between other elements */}
          <div className="flex flex-col sm:flex-row justify-center sm:justify-around gap-10 sm:gap-16 md:col-span-2 lg:col-start-2 lg:col-span-2">

            {/* About Column - Centered content */}
            <div className="flex flex-col items-center"> {/* Changed to items-center to center content within its column */}
              {/* Heading color changed to white, keeping bold, removed ml-2 for better centering */}
              <h3 className="text-lg font-bold mb-5 uppercase tracking-wider text-white">About</h3>
              <ul className="space-y-3 text-center"> {/* Changed to text-center to align list items */}
                <li>
                  {/* For centering, links need to be inline-block or have specific width if they are block */}
                  <Link to="/about" className="underline inline-block px-3 py-1 rounded-md text-base text-white hover:bg-gray-700 transition-colors duration-200">About Us</Link>
                </li>
                <li>
                  <Link to="/faq" className="underline inline-block px-3 py-1 rounded-md text-base text-white hover:bg-gray-700 transition-colors duration-200">FAQ</Link>
                </li>
                <li>
                  <Link to="/contact" className="underline inline-block px-3 py-1 rounded-md text-base text-white hover:bg-gray-700 transition-colors duration-200">Contact Us</Link>
                </li>
                <li>
                  <Link to="/how-to" className="underline inline-block px-3 py-1 rounded-md text-base text-white hover:bg-gray-700 transition-colors duration-200">How-to</Link>
                </li>
              </ul>
            </div>

            {/* Support Column - Centered content */}
            <div className="flex flex-col items-center"> {/* Changed to items-center to center content within its column */}
              {/* Heading color changed to white, keeping bold, removed ml-2 for better centering */}
              <h3 className="text-lg font-bold mb-5 uppercase tracking-wider text-white">Support</h3>
              <ul className="space-y-3 text-center"> {/* Changed to text-center to align list items */}
                <li>
                  <Link to="/trust-safety" className="underline inline-block px-3 py-1 rounded-md text-base text-white hover:bg-gray-700 transition-colors duration-200">Trust and Safety</Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="underline inline-block px-3 py-1 rounded-md text-base text-white hover:bg-gray-700 transition-colors duration-200">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms-of-use" className="underline inline-block px-3 py-1 rounded-md text-base text-white hover:bg-gray-700 transition-colors duration-200">Terms of Use</Link>
                </li>
                <li>
                  <Link to="/cookie-policy" className="underline inline-block px-3 py-1 rounded-md text-base text-white hover:bg-gray-700 transition-colors duration-200">Cookie Policy</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Office Column - Centered on mobile, right-aligned on desktop */}
          {/* This column might naturally align due to other content */}
          <div className="text-center md:text-right flex flex-col items-center md:items-end">
            <h3 className="text-lg font-bold mb-5 uppercase tracking-wider text-[#B2C9AD]">Our Office</h3>
            <address className="not-italic text-base text-white space-y-1">
              <p>University of Management and Technology,</p>
              <p>C-II, Johar Town Lahore, Pakistan.</p>
              <p>ZIP 54782</p>
            </address>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center text-gray-300 text-sm mt-12 pt-6 border-t border-gray-600">
          <p>© {new Date().getFullYear()} Fundify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterLayout;