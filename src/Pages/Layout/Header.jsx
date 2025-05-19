import { useState } from "react";

export default function Header( {hideHome}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
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
            {/* Left Navigation Group */}
            <div className="flex space-x-8">
              {!hideHome && <a href="/" className="text-white hover:text-gray-300">
                Home
              </a> }
              <a href="/donate" className="text-white hover:text-gray-300">
                Donate
              </a>
              <a href="/about" className="text-white hover:text-gray-300">
                About Us
              </a>
            </div>

            {/* Right Navigation Group */}
            <div className="flex space-x-8">
              <a href="/create-campaign" className="text-white hover:text-gray-300">
                Create Campaign
              </a>
              <a href="/login" className="text-white hover:text-gray-300">
                Login/Sign Up
              </a>
              <a href="/contact" className="text-white hover:text-gray-300">
                Contact Us
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 bg-black/90 rounded-lg p-4">
            <div className="flex flex-col space-y-4">
              <a href="/" className="text-white hover:text-gray-300">
                Home
              </a>
              <a href="/donate" className="text-white hover:text-gray-300">
                Donate
              </a>
              <a href="/about" className="text-white hover:text-gray-300">
                About Us
              </a>
              <a href="/create" className="text-white hover:text-gray-300">
                Create Campaign
              </a>
              <a href="/login" className="text-white hover:text-gray-300">
                Login/Sign Up
              </a>
              <a href="/contact" className="text-white hover:text-gray-300">
                Contact Us
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}