// src/Pages/CampaignsCreation/CampCreation01.jsx
"use client"
import { useState, useEffect } from "react" // Added useEffect
import { useNavigate, useLocation } from "react-router-dom" // Added useLocation
import Header from "../Layout/HeaderLayout"
import Footer from "../Layout/FooterLayout"

const CampaignCreation01 = () => {
  const navigate = useNavigate()
  const location = useLocation() // Initialize useLocation

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
  })

  // Add useEffect to restore data if navigating back
  useEffect(() => {
    if (location.state && location.state.campaignData) {
      const incomingData = location.state.campaignData;
      setFormData({
        name: incomingData.name || "",
        location: incomingData.location || "",
        category: incomingData.category || "",
      });
      console.log("Data restored in CampCreation01:", incomingData);
    }
  }, [location.state]); // Re-run when location state changes

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Data from CampCreation01:", formData)
    // Pass formData to the next step
    navigate("/campaign-creation-02", { state: { campaignData: formData } })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header hideCreate={true} />

      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Use lg:grid-cols-2 to stack columns on mobile and tablets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left Column - Logo */}
            {/* Center content and adjust logo size for different breakpoints */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="hidden md:block">
              <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 mb-6 lg:mb-0">
                <img 
                  src="/Images/fundify-white-bg-logo.png"
                  alt="Fundify Logo"
                  className="w-full h-full object-contain" // Use object-contain to ensure logo isn't distorted
                />
              </div>
            </div>  
              {/* Optional: Add a heading and paragraph for better context on mobile */}
              <div className="lg:hidden">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-4">Welcome to Fundify</h1>
                <p className="text-gray-600 mt-2 max-w-md">
                  Let's get you set up to start your fundraising journey. Just a few quick questions to begin.
                </p>
              </div>
            </div>

            {/* Right Column - Get Started Form */}
            <div className="flex justify-center w-full">
              {/* Adjust padding for different screen sizes */}
              <div className="bg-[#A9BEA2] rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-2 w-2 rounded-full bg-[#4B5842]"></div>
                    <div className="h-0.5 flex-1 bg-white mx-2"></div>
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                    <div className="h-0.5 flex-1 bg-white mx-2"></div>
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                  {/* Make heading larger for better visibility */}
                  <h2 className="text-center text-xl sm:text-2xl font-medium text-[#4B5842]">
                    Let's Get <span className="font-bold">STARTED</span>
                  </h2>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#4B5842] mb-1">
                        What's Your Name?
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B5842] transition-shadow"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-[#4B5842] mb-1">
                        Where do you live?
                      </label>
                      <div className="relative">
                        <select
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B5842] appearance-none bg-white transition-shadow"
                          required
                        >
                          <option value="" disabled>
                            Select your country
                          </option>
                          <option value="Pakistan">Pakistan</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="India">India</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            className="h-5 w-5 text-gray-500" // Slightly larger icon
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-[#4B5842] mb-1">
                        What are you fundraising for?
                      </label>
                      <div className="relative">
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B5842] appearance-none bg-white transition-shadow"
                          required
                        >
                          <option value="" disabled>
                            Choose a category
                          </option>
                          <option value="Art">Art</option>
                          <option value="Business">Business</option>
                          <option value="Comics">Comics</option>
                          <option value="Crafts">Crafts</option>
                          <option value="Dance">Dance</option>
                          <option value="Design">Design</option>
                          <option value="Education">Education</option>
                          <option value="Fashion">Fashion</option>
                          <option value="Film & Video">Film & Video</option>
                          <option value="Food">Food</option>
                          <option value="Games">Games</option>
                          <option value="Journalism">Journalism</option>         
                          <option value="Medical">Medical</option>
                          <option value="Music">Music</option>
                          <option value="Nonprofit">Nonprofit</option>
                          <option value="Photography">Photography</option>
                          <option value="Publishing">Publishing</option>
                          <option value="Technology">Technology</option>
                          <option value="Theater">Theater</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            className="h-5 w-5 text-gray-500" // Slightly larger icon
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-[#4B5842] text-white py-3 rounded-md hover:bg-[#3A4433] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B5842]"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CampaignCreation01