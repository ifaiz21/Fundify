// src/Pages/CampaignsCreation/CampCreation05.jsx
"use client"
import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Header from "../Layout/HeaderLayout"
import Footer from "../Layout/FooterLayout"

const CampaignCreation05 = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false)
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [fullCampaignData, setFullCampaignData] = useState({
    name: '',
    location: '',
    category: '',
    goalAmount: 0,
    isAdult: false,
    canVerifyID: false,
    canVerifyProject: false,
    campaignTitle: '',
    campaignDescription: '',
    // Update state to expect an array for media file names and preview URLs
    mediaFileNames: [], 
    mediaPreviewUrls: [], 
    storyContent: '',
  });

  useEffect(() => {
    if (location.state && location.state.campaignData) {
      const incomingData = location.state.campaignData;
      setFullCampaignData(prevData => ({
        ...prevData,
        ...incomingData,
        // Ensure these are correctly pulled from the incoming data's `previewURLs` and `mediaFileNames`
        mediaPreviewUrls: incomingData.previewURLs || [],
        mediaFileNames: incomingData.mediaFileNames || [],
      }));
      console.log("CampaignCreation05 - Data received for submission:", incomingData);
    }

    if (location.state?.updateSuccess) {
      setShowUpdateSuccess(true)
      const timer = setTimeout(() => {
        setShowUpdateSuccess(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [location.state]);


  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const handleUpdate = () => {
    navigate("/campaign-update", { state: { campaign: fullCampaignData } });
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirmation(false);
    const token = getAuthToken();

    if (!token) {
      alert("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }
    
    if (!fullCampaignData._id) {
        alert("Campaign ID not found for deletion.");
        return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/campaigns/${fullCampaignData._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Campaign deleted successfully!");
        navigate("/campaign-deletion");
      } else {
        const errorData = await response.json();
        alert(`Failed to delete campaign: ${errorData.message}`);
        console.error("Delete failed:", errorData);
      }
    } catch (error) {
      alert("An error occurred during deletion.");
      console.error("Delete error:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleSubmit = () => {
    setShowSubmitConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setShowSubmitConfirmation(false);
    setIsSubmitting(true);

    const token = getAuthToken();

    if (!token) {
      alert("No authentication token found. Please log in.");
      navigate("/login");
      setIsSubmitting(false);
      return;
    }

    const campaignDataToSubmit = {
        name: fullCampaignData.name,
        location: fullCampaignData.location,
        category: fullCampaignData.category,
        goalAmount: Number(fullCampaignData.goalAmount),
        isAdultContent: fullCampaignData.isAdult,
        isIDVerifiedRequired: fullCampaignData.canVerifyID,
        isProjectVerifiedRequired: fullCampaignData.canVerifyProject,
        title: fullCampaignData.campaignTitle,
        description: fullCampaignData.campaignDescription,
        // --- CRITICAL UPDATE: Send mediaFileNames under the 'mediaUrls' key ---
        mediaUrls: fullCampaignData.mediaFileNames, // This array now matches the backend schema field name and type
        // --- END CRITICAL UPDATE ---
        content: fullCampaignData.storyContent,
        status: 'Pending Review'
    };

    console.log("CampaignCreation05 - Submitting campaign data:", campaignDataToSubmit);

    try {
      const response = await fetch('http://localhost:5000/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(campaignDataToSubmit),
      });

      if (response.ok) {
        alert("Campaign submitted successfully for verification!");
        navigate("/campaign-submission");
      } else {
        const errorData = await response.json();
        alert(`Campaign submission failed: ${errorData.message}`);
        console.error("Submission failed:", errorData);
      }
    } catch (error) {
      alert("An error occurred during submission.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSubmit = () => {
    setShowSubmitConfirmation(false);
  };

  const handleBack = () => {
    navigate("/campaign-creation-04", { state: { campaignData: fullCampaignData } });
  };

  const handleCloseSuccessMessage = () => {
    setShowUpdateSuccess(false);
  };

  // No URL.revokeObjectURL cleanup needed for Data URLs on unmount in this component.
  useEffect(() => {
    return () => {
      // If you were using blob URLs, this is where you'd revoke them:
      // fullCampaignData.mediaPreviewUrls.forEach(media => {
      //   if (media.url && media.url.startsWith("blob:")) {
      //     URL.revokeObjectURL(media.url);
      //   }
      // });
    };
  }, [fullCampaignData.mediaPreviewUrls]); // Depend on mediaPreviewUrls for effects related to it


  return (
    <div className="flex flex-col min-h-screen">
      <Header hideCreate={true} />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
            {/* Campaign Preview Label */}
            <div className="mb-6 text-center">
              <span className="inline-block bg-[#A9BEA2] text-[#4B5842] px-4 py-1 rounded-full text-lg font-semibold">
                Campaign Preview
              </span>
              <h1 className="text-3xl font-bold text-gray-800 mt-4">{fullCampaignData.campaignTitle}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left Column: Basic Info & Funding */}
              <div>
                <h2 className="text-2xl font-semibold text-[#4A5D45] mb-4 border-b pb-2">
                  Basic Information
                </h2>
                <div className="space-y-3 text-gray-700 text-base">
                  <p>
                    <strong>Your Name:</strong> {fullCampaignData.name}
                  </p>
                  <p>
                    <strong>Location:</strong> {fullCampaignData.location}
                  </p>
                  <p>
                    <strong>Category:</strong> {fullCampaignData.category}
                  </p>
                  <p>
                    <strong>Goal Amount:</strong> Rs.{" "}
                    {fullCampaignData.goalAmount
                      ? Number(fullCampaignData.goalAmount).toLocaleString()
                      : "0"}
                  </p>
                </div>

                <h2 className="text-2xl font-semibold text-[#4A5D45] mt-6 mb-4 border-b pb-2">
                  Verification & Content
                </h2>
                <div className="space-y-3 text-gray-700 text-base">
                  <p>
                    <strong>Adult Content:</strong>{" "}
                    {fullCampaignData.isAdult ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>ID Verified:</strong>{" "}
                    {fullCampaignData.canVerifyID ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Project Verified:</strong>{" "}
                    {fullCampaignData.canVerifyProject ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              {/* Right Column: Media */}
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-2xl font-semibold text-[#4A5D45] mb-4 border-b pb-2 w-full text-center">
                  Campaign Media
                </h2>
                {fullCampaignData.mediaPreviewUrls &&
                fullCampaignData.mediaPreviewUrls.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    {fullCampaignData.mediaPreviewUrls.map((media) => (
                      <div
                        key={media.id}
                        className="rounded-lg overflow-hidden shadow-lg border border-gray-200"
                      >
                        {/* Render based on media type */}
                        {media.type && media.type.startsWith("image/") ? (
                          <img
                            src={media.url} // This is now a Data URL
                            alt={`Campaign Media Preview: ${media.name}`}
                            className="w-full h-48 object-contain"
                            onError={(e) => {
                              // Fallback for broken images
                              e.target.onerror = null; // Prevent infinite loop
                              e.target.src = "/Images/placeholder-image.png"; // Provide a fallback image
                              e.target.alt = "Image not available";
                              e.target.className = "w-full h-48 object-contain p-4 bg-gray-100"; // Adjust styling for fallback
                            }}
                          />
                        ) : media.type && media.type.startsWith("video/") ? (
                          <video
                            src={media.url} // This is now a Data URL
                            controls
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-100 flex flex-col items-center justify-center text-gray-500 p-2 text-center">
                            <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <p className="text-sm">Unsupported Media Type</p>
                            <p className="text-xs text-gray-400 mt-1 truncate w-full px-2">{media.name || 'Unknown File'}</p>
                          </div>
                        )}
                        <p className="text-center text-sm p-2 bg-gray-50 truncate">
                          {media.name}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 border border-dashed border-gray-300">
                    No Media Selected
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Description */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-inner">
              <h2 className="text-2xl font-semibold text-[#4A5D45] mb-4 border-b pb-2">
                Campaign Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {fullCampaignData.campaignDescription}
              </p>
            </div>

            {/* Campaign Story */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-inner">
              <h2 className="text-2xl font-semibold text-[#4A5D45] mb-4 border-b pb-2">
                Campaign Story
              </h2>
              <div
                className="prose max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: fullCampaignData.storyContent }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-between pt-6 border-t border-gray-200">
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modals (omitted for brevity, assume they are the same as before) */}
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
                  className="flex-1 px-4 py-2 text-white rounded-md bg-[#4a5741] transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      <Footer />
    </div>
  );
};

export default CampaignCreation05;