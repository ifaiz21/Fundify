import React from "react";
import { Link } from "react-router-dom";

const FooterLayout = () => {
  return (
    <footer className="bg-[#485842] text-white py-8 rounded-t-xl">
      <div className="container mx-auto px-4 md:px-6">
        {/* Adjusted grid for responsiveness */}
        {/* On mobile (default), stack columns. On medium screens (md), make it 2 columns, on large (lg), 3 columns. */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"> {/* Changed gap and added sm: breakpoint */}

          {/* Logo Column */}
          {/* Changed flex-cols to flex and items-center for better centering on mobile */}
          <div className="flex flex-col items-center justify-center md:items-start md:justify-start w-auto text-center md:text-left">
            <Link to="/" className="mb-2">
              <div className="flex flex-col items-center">
                {/* Adjusted logo size for better responsiveness */}
                <img src="./Images/logo.png" alt="Fundify" className="h-28 w-32 mb-0 mt-4 md:h-22 md:w-36 md:mt-4" /> {/* Slightly reduced mobile size, kept original for MD+ */}
              </div>
            </Link>
            {/* Optional: Add a short tagline or mission statement here for brand context on mobile 
            <p className="text-sm text-gray-300 mt-2 px-4 md:px-0">Empowering impactful campaigns and fostering community support.</p> */}
          </div>

          {/* About & Terms Columns */}
          {/* On mobile, these will stack. On larger screens, they'll be side-by-side. */}
          <div className="flex flex-col sm:flex-row space-y-8 sm:space-y-0 sm:space-x-12 justify-center sm:justify-start"> {/* Adjusted spacing and direction for responsiveness */}
            {/* About Column */}
            <div className="flex flex-col items-center sm:items-start"> {/* Centered on mobile, left-aligned on tablet/desktop */}
              <h3 className="text-sm font-semibold mb-4 uppercase">About</h3>
              <ul className="space-y-2 text-center sm:text-left">
                <li>
                  <Link to="/about" className="text-sm text-gray-300 hover:text-white">About Us</Link>
                </li>
                <li>
                  <Link to="/faq" className="text-sm text-gray-300 hover:text-white">FAQ</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-gray-300 hover:text-white">Contact Us</Link>
                </li>
                <li>
                  <Link to="/how-to" className="text-sm text-gray-300 hover:text-white">How-to</Link>
                </li>
              </ul>
            </div>

            {/* Terms Column */}
            <div className="flex flex-col items-center sm:items-start"> {/* Centered on mobile, left-aligned on tablet/desktop */}
              <h3 className="text-sm font-semibold mb-4 uppercase">Support</h3>
              <ul className="space-y-2 text-center sm:text-left">
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
          {/* Centered on mobile, right-aligned on desktop */}
          <div className="text-center md:text-right flex flex-col items-center md:items-end"> {/* Added flex for vertical centering on mobile if needed */}
            <h3 className="text-sm font-semibold mb-4 uppercase">Our Office</h3>
            <address className="not-italic text-sm text-gray-300">
              <p>University of Management and Technology,</p>
              <p>C-II, Johar Town Lahore, Pakistan.</p>
              <p>ZIP 54782</p>
            </address>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center text-gray-400 text-sm mt-8 pt-4 border-t border-gray-700">
          <p>© 2025 Fundify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterLayout;