"use client"
import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../Layout/HeaderLayout"
import Footer from "../Layout/FooterLayout"

const CampaignCreation05 = () => {
  const location = useLocation()
  const story = location.state?.story || ""
  const formattedStory = location.state?.formattedStory || ""
  const navigate = useNavigate()
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false)
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false)

  const defaultCampaign = {
    title: "Your Story",
    content: formattedStory || story || "No story provided",
    image: "/Images/cycle.png",
  }

  // Use location.state if available, and merge with story data
  const [campaign, setCampaign] = useState(() => {
    if (location.state?.campaign) {
      return {
        ...location.state.campaign,
        content: formattedStory || story || location.state.campaign.content,
      }
    }
    return defaultCampaign
  })

  // Check if coming back from update with success
  useEffect(() => {
    if (location.state?.updateSuccess) {
      setShowUpdateSuccess(true)
      // Auto-hide the success message after 5 seconds
      const timer = setTimeout(() => {
        setShowUpdateSuccess(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [location.state])

  // Update campaign content when story changes
  useEffect(() => {
    if (formattedStory || story) {
      setCampaign((prev) => ({
        ...prev,
        content: formattedStory || story,
      }))
    }
  }, [story, formattedStory])

  const handleUpdate = () => {
    navigate("/campaign-update", { state: { campaign } })
  }

  const handleDelete = () => {
    setShowDeleteConfirmation(true)
  }

  const handleConfirmDelete = () => {
    console.log("Delete campaign confirmed")
    setShowDeleteConfirmation(false)
    navigate("/campaign-deletion")
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false)
  }

  const handleSubmit = () => {
    setShowSubmitConfirmation(true)
  }

  const handleConfirmSubmit = () => {
    console.log("Submit campaign confirmed")
    setShowSubmitConfirmation(false)
    navigate("/campaign-submission")
  }

  const handleCancelSubmit = () => {
    setShowSubmitConfirmation(false)
  }

  const handleBack = () => {
    console.log("Go back")
    navigate("/campaign-creation-04")
  }

  const handleCloseSuccessMessage = () => {
    setShowUpdateSuccess(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header hideCreate={true} />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Campaign Preview Label */}
            <div className="mb-6">
              <span className="inline-block bg-[#A9BEA2] text-[#4B5842] px-4 py-1 rounded-full text-sm font-medium">
                Campaign Preview
              </span>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Story Content - 2/3 width on desktop */}
              <div className="md:col-span-2">
                <h1 className="text-2xl font-bold mb-4">{campaign.title}</h1>
                <div className="prose max-w-none">
                  {/* Render HTML content safely */}
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: campaign.content }}
                  />
                </div>
              </div>

              {/* Campaign Image - 1/3 width on desktop */}
              <div>
                <img
                  src={campaign.image || "/placeholder.svg"}
                  alt="Campaign"
                  className="w-full h-auto rounded-md object-cover"
                  style={{ maxHeight: "250px" }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-between">
              {/* Left side buttons */}
              <div className="flex flex-wrap gap-3 mb-4 md:mb-0">
                <button
                  onClick={handleUpdate}
                  className="bg-[#4B5842] text-white py-2 px-4 rounded-md hover:bg-[#3A4433] transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-[#4B5842] text-white py-2 px-4 rounded-md hover:bg-[#3A4433] transition-colors"
                >
                  Delete
                </button>
              </div>

              {/* Right side buttons */}
              <div className="flex space-x-4 items-end">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-[#4B5842] text-white rounded-md hover:bg-[#3A4433] transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-[#4B5842] rounded-full">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete Campaign</h3>

              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete this campaign? This action cannot be undone.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 text-white bg-[#4B5842] rounded-md bg-[#4B5842] transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-[#4B5842] rounded-full">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Submit Campaign</h3>

              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to submit this campaign for review? Once submitted, it will be reviewed by our
                team.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={handleCancelSubmit}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  className="flex-1 px-4 py-2 text-white bg-[#4B5842] rounded-md hover:bg-[#3A4433] transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showUpdateSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-[#4B5842] text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-md">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium">Your campaign has been updated successfully</p>
            </div>
            <button
              onClick={handleCloseSuccessMessage}
              className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

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

export default CampaignCreation05
