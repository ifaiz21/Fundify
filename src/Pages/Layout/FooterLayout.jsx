import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#4B5842] text-white py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {/* Logo Column */}
          <div className="flex flex-cols items-start justify-start w-auto">
            <Link to="/" className="mb-2">
              <div className="flex flex-col items-center">
                {/*  (Line 13) Increased the logo size */}
                <img src="./images/logo.png" alt="Fundify" className="h-24 w-24 mb-0" />
              </div>
            </Link>
          </div>

          {/* About & Terms Columns - Moved to the left */}
          <div className="flex space-x-6 flex-wrap gap-16 justify-start mr-auto">
            {/* About Column */}
            <div className="flex flex-col items-start">
              <h3 className="text-sm font-semibold mb-4 uppercase">About</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-sm text-gray-300 hover:text-white">About Us</Link>
                </li>
                <li>
                  <Link to="/faq" className="text-sm text-gray-300 hover:text-white">FAQ</Link>
                </li>
                <li>
                  <Link to="/help" className="text-sm text-gray-300 hover:text-white">Help Center</Link>
                </li>
                <li>
                  <Link to="/how-to" className="text-sm text-gray-300 hover:text-white">How-to</Link>
                </li>
              </ul>
            </div>

            {/* Terms Column */}
            <div className="flex flex-col items-start">
              <h3 className="text-sm font-semibold mb-4 uppercase">Terms & Conditions</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/trust-safety" className="text-sm text-gray-300 hover:text-white">Trust and Safety</Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-sm text-gray-300 hover:text-white">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms-of-use" className="text-sm text-gray-300 hover:text-white">Terms of Use</Link>
                </li>
                <li>
                  <Link to="/cookie-policy" className="text-sm text-gray-300 hover:text-white">Cookie Policy</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Office Column */}
          <div className="text-right">
            <h3 className="text-sm font-semibold mb-4 uppercase">Our Office</h3>
            <address className="not-italic text-sm text-gray-300">
              <p>University of Management and Technology,</p>
              <p>C-II, Johar Town Lahore, Pakistan.</p>
              <p>ZIP 54782</p>
            </address>
            <p className="text-sm text-gray-300 mt-4">2025 © Fundify Platform.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
