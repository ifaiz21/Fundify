// src/Pages/Layout/Header.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
//import { User } from "lucide-react";
import { useUser } from '../../context/UserContext';


export default function Header({ hideHome }) {
  //const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

const { userProfile, loadingUserContext } = useUser();
const dropdownRef = useRef(null);


  // ADDED: Default avatar logic
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
      {logoutMessage && (
        <div className="bg-[#B2C9AD] text-white text-center py-2">
          {logoutMessage}
        </div>
      )}

      <header className="flex items-center justify-between px-6 py-4 bg-transparent z-50 relative">
        {/* Left Side - Logo & Navigation */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <img
            src="/Images/logo.png"
            alt="Fundify Logo"
            className="w-12 h-12"
          />

          {/* Desktop Navigation */}
          
            <nav className="flex space-x-6">
              {!hideHome && (
                <a href="/" className="text-white hover:text-gray-300">Home</a>
              )}
              <a href="/donate" className="text-white hover:text-gray-300">Donate</a>
              <a href="/about" className="text-white hover:text-gray-300">About Us</a>
            </nav>
        </div>

            <div className="flex space-x-6 items-center">
              <a href="/create-campaign" className="text-white hover:text-gray-300">
                Create Campaign
              </a>
              <a href="/contact" className="text-white hover:text-gray-300">Contact Us</a>

              {/* User Account Icon with Login Check */}
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
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
                    <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-xl py-2 w-40 transition-opacity duration-300 ease-out z-50">
                      <a href="/user-profile" className="block px-5 py-2 text-md hover:bg-gray-100 hover:text-[#4A5D45] transition-colors duration-200">
                        My Profile
                      </a>
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
                <a href="/login" className="text-white hover:text-gray-300">
                  Login / Sign Up
                </a>
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
                onClick={() => {
                  handleLogout();
                  setShowConfirmLogout(false);
                }}
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
}
