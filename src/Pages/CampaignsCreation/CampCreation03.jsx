// src/Pages/CampaignsCreation/CampCreation03.jsx
"use client"
import { useRef } from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Header from "../Layout/HeaderLayout"
import Footer from "../Layout/FooterLayout"

const CampaignCreation03 = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [campaignDataFromPreviousSteps, setCampaignDataFromPreviousSteps] = useState({});

  useEffect(() => {
    if (location.state && location.state.campaignData) {
      setCampaignDataFromPreviousSteps(location.state.campaignData);
      // Optional: pre-fill form data if user navigates back
      setFormData(prev => ({
        ...prev,
        campaignTitle: location.state.campaignData.campaignTitle || '',
        campaignDescription: location.state.campaignData.campaignDescription || '',
        // mediaFile cannot be directly re-set from URL, but mediaPreviewUrl can
        // If you want to show existing preview on back, load mediaPreviewUrl
        // For actual file object, user would have to re-select
      }));
    }
  }, [location.state]);


  const [formData, setFormData] = useState({
    campaignTitle: "",
    campaignDescription: "",
    mediaFile: null,
    mediaPreviewUrl: null, // Add new state to store Data URL for preview
  })
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Create a FileReader to read the file as a Data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          mediaFile: file,
          mediaPreviewUrl: reader.result, // Store the Data URL
        }));
      };
      reader.readAsDataURL(file); // Read the file as a Data URL

    } else {
      setFormData((prev) => ({
        ...prev,
        mediaFile: null,
        mediaPreviewUrl: null, // Clear preview if no file selected
      }));
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const { mediaFile, ...rest } = formData
    const combinedDataForNextStep = {
      ...campaignDataFromPreviousSteps, // Data from CampCreation01 and 02
      ...rest, // Includes campaignTitle, campaignDescription, and mediaPreviewUrl
      mediaFileName: mediaFile ? mediaFile.name : null, // Pass filename for backend (if needed)
    }
    console.log("Combined data for 04:", combinedDataForNextStep)

    navigate("/campaign-creation-04", { state: { campaignData: combinedDataForNextStep } })
  }

  const handleBack = () => {
    navigate("/campaign-creation-02", { state: { campaignData: campaignDataFromPreviousSteps } })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header hideCreate={true} />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Logo */}
            <div className="flex flex-col items-center">
              <div className="w-64 h-64 mb-6">
                <img src="/Images/fundify-white-bg-logo.png" alt="Fundify Logo" className="w-full h-full" />
              </div>
            </div>

            {/* Right Column - Campaign Setup Form */}
            <div className="flex justify-center">
              <div className="bg-[#A9BEA2] rounded-md p-6 w-full max-w-md">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                    <div className="h-0.5 flex-1 bg-white mx-2"></div>
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                    <div className="h-0.5 flex-1 bg-white mx-2"></div>
                    <div className="h-2 w-2 rounded-full bg-[#4B5842]"></div>
                  </div>
                  <h2 className="text-center text-lg font-medium">
                    Setup your <span className="font-bold">CAMPAIGN</span>
                  </h2>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="campaignTitle" className="block text-sm font-medium text-[#4B5842] mb-1">
                        What's Your Campaign Title?
                      </label>
                      <input
                        type="text"
                        id="campaignTitle"
                        name="campaignTitle"
                        value={formData.campaignTitle}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="campaignDescription" className="block text-sm font-medium text-[#4B5842] mb-1">
                        What's Your Campaign About?
                      </label>
                      <textarea
                        id="campaignDescription"
                        name="campaignDescription"
                        value={formData.campaignDescription}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#4B5842] mb-1">Add a Photo/Video</label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*,video/*"
                        className="hidden"
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-16 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-[#4B5842] transition-colors"
                      >
                        {formData.mediaFile ? (
                          <span className="text-sm text-[#4B5842]">{formData.mediaFile.name}</span>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </div>
                      {/* Optional: Show a small preview image right below the input */}
                      {formData.mediaPreviewUrl && (
                        <div className="mt-2 text-center">
                          <img src={formData.mediaPreviewUrl} alt="Media Preview" className="max-h-24 mx-auto rounded" />
                        </div>
                      )}
                    </div>

                    <div className="pt-4 flex space-x-4">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex-1 bg-white text-[#4B5842] py-2 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-[#4B5842] text-white py-2 rounded-md hover:bg-[#3A4433] transition-colors"
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

      {/* Chat Button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-[#4A5D45] text-white rounded-full p-4 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>

      <Footer />
    </div>
  )
}

export default CampaignCreation03