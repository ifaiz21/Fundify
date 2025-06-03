import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react"; // Optional: lucide-react icons

export default function Header({ hideHome }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    <header className="absolute top-0 left-0 right-0 z-50">
      {/* Logout success message */}
      {logoutMessage && (
        <div className="bg-[#B2C9AD] text-white text-center py-2">
          {logoutMessage}
        </div>
      )}

      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src="/Images/logo.png"
              alt="Fundify Logo"
              className="h-14 w-14"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between flex-1 max-w-4xl mx-auto px-8">
            <div className="flex space-x-8">
              {!hideHome && (
                <a href="/" className="text-white hover:text-gray-300">Home</a>
              )}
              <a href="/donate" className="text-white hover:text-gray-300">Donate</a>
              <a href="/about" className="text-white hover:text-gray-300">About Us</a>
            </div>

            <div className="flex space-x-8 items-center">
              <a href="/create-campaign" className="text-white hover:text-gray-300">
                Create Campaign
              </a>

              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center text-white hover:text-gray-300"
                  >
                    <User className="w-5 h-5 mr-1" />
                    Profile
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg py-2 w-40">
                      <a href="/admin-dashboard" className="block px-4 py-2 hover:bg-gray-100">
                        Dashboard
                      </a>
                      <a href="/user-profile" className="block px-4 py-2 hover:bg-gray-100">
                        My Profile
                      </a>
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
                <a href="/login" className="text-white hover:text-gray-300">
                  Login / Sign Up
                </a>
              )}

              <a href="/contact" className="text-white hover:text-gray-300">Contact Us</a>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 bg-black/90 rounded-lg p-4">
            <div className="flex flex-col space-y-4">
              <a href="/" className="text-white hover:text-gray-300">Home</a>
              <a href="/donate" className="text-white hover:text-gray-300">Donate</a>
              <a href="/about" className="text-white hover:text-gray-300">About Us</a>
              <a href="/create-campaign" className="text-white hover:text-gray-300">Create Campaign</a>

              {isLoggedIn ? (
                <>
                  <a href="/admin-dashboard" className="text-white hover:text-gray-300">Dashboard</a>
                  <a href="/user-profile" className="text-white hover:text-gray-300">My Profile</a>
                  <button
                    onClick={() => setShowConfirmLogout(true)}
                    className="text-left text-white hover:text-gray-300"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <a href="/login" className="text-white hover:text-gray-300">Login / Sign Up</a>
              )}

              <a href="/contact" className="text-white hover:text-gray-300">Contact Us</a>
            </div>
          </div>
        )}
      </nav>

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
                onClick={() => {
                  handleLogout();
                  setShowConfirmLogout(false);
                }}
                className="bg-[#4A5D45] bg-[#4A5D45] text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}