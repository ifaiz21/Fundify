"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Header from "../Layout/HeaderLayout"
import Footer from "../Layout/FooterLayout"

function CampaignEditor() {
  const navigate = useNavigate()
  const location = useLocation()

  // Default campaign data
  const defaultCampaign = {
    title: "Your Story",
    content: "Hi!",
    image: "/Images/cycle.png",
  }

  // Initialize with default values
  const [campaignData, setCampaignData] = useState(defaultCampaign)

  // Check if there's campaign data in the location state
  useEffect(() => {
    console.log("Location state:", location.state)
    if (location.state && location.state.campaign) {
      setCampaignData(location.state.campaign)
    }
  }, [location.state])

  const handleTitleChange = (e) => {
    setCampaignData({
      ...campaignData,
      title: e.target.value,
    })
  }

  const handleContentChange = (e) => {
    setCampaignData({
      ...campaignData,
      content: e.target.value,
    })
  }

  const handleBack = () => {
    // Navigate back to the preview page without saving changes
    navigate("/campaign-creation-05")
  }

  const handleSave = () => {
    // Save the campaign data and navigate back to the preview page
    console.log("Saving campaign:", campaignData)
    navigate("/campaign-creation-05", { state: { campaign: campaignData } })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="page-title px-4 py-2 bg-gray-100 text-gray-500">Edit campaign</div>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center">
              <div className="logo-circle w-48 h-48 mb-4">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="90" fill="#4B5842" />
                  <circle cx="100" cy="100" r="70" fill="#A9BEA2" />
                  <path
                    d="M140,100 C140,70 110,50 80,80 L60,100 L80,120 C110,150 140,130 140,100 Z"
                    fill="#4B5842"
                    stroke="white"
                    strokeWidth="5"
                  />
                </svg>
              </div>
              <div className="logo-text text-center">
                <div className="text-5xl font-black tracking-wide">
                  <span className="text-black">FUND</span>
                  <span className="text-[#4B5842]">IFY</span>
                </div>
                <div className="text-sm font-semibold tracking-widest text-gray-800 mt-1">
                  INVEST LOCALLY, IMPACT GLOBALLY
                </div>
              </div>
            </div>

            <div className="editor-container">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                  <h2 className="text-lg font-medium">Edit Your Campaign</h2>
                  <button className="text-sm text-[#4B5842] font-medium" onClick={handleSave}>
                    Done
                  </button>
                </div>

                <div className="px-4 py-3 border-b border-gray-200">
                  <input
                    type="text"
                    className="w-full text-xl font-bold focus:outline-none"
                    value={campaignData.title}
                    onChange={handleTitleChange}
                    placeholder="Campaign Title"
                  />
                </div>

                <div className="toolbar px-2 py-2 border-b border-gray-200 flex flex-wrap">
                  <button className="p-1 mx-1 rounded hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                    </svg>
                  </button>
                  <button className="p-1 mx-1 rounded hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="19" y1="4" x2="10" y2="4"></line>
                      <line x1="14" y1="20" x2="5" y2="20"></line>
                      <line x1="15" y1="4" x2="9" y2="20"></line>
                    </svg>
                  </button>
                  <button className="p-1 mx-1 rounded hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
                      <line x1="4" y1="21" x2="20" y2="21"></line>
                    </svg>
                  </button>
                  <span className="border-r border-gray-300 mx-2"></span>
                  <button className="p-1 mx-1 rounded hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="21" y1="6" x2="3" y2="6"></line>
                      <line x1="15" y1="12" x2="3" y2="12"></line>
                      <line x1="17" y1="18" x2="3" y2="18"></line>
                    </svg>
                  </button>
                  <button className="p-1 mx-1 rounded hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="21" y1="6" x2="3" y2="6"></line>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                      <line x1="21" y1="18" x2="7" y2="18"></line>
                    </svg>
                  </button>
                  <button className="p-1 mx-1 rounded hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                  </button>
                  <span className="border-r border-gray-300 mx-2"></span>
                  <button className="p-1 mx-1 rounded hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                  </button>
                  <button className="p-1 mx-1 rounded hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <path d="M20.4 14.5L16 10 4 20"></path>
                    </svg>
                  </button>
                </div>

                <div className="editor-content p-4">
                  <textarea
                    className="w-full h-64 focus:outline-none resize-none"
                    value={campaignData.content}
                    onChange={handleContentChange}
                    placeholder="Write your campaign story here..."
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end mt-4 space-x-4">
                <button
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  className="px-6 py-2 bg-[#4B5842] text-white rounded-md hover:bg-[#3A4433] transition-colors"
                  onClick={handleSave}
                >
                  Submit
                </button>
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

export default CampaignEditor;