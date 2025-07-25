// src/Pages/CampaignsCreation/CampCreation03.jsx
"use client"
import { useRef } from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { showErrorMessage } from '../../utils/toast';
import Header from "../Layout/HeaderLayout"
import Footer from "../Layout/FooterLayout"

const CampaignCreation03 = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [campaignDataFromPreviousSteps, setCampaignDataFromPreviousSteps] = useState({});
  const [formData, setFormData] = useState({
    campaignTitle: "",
    campaignDescription: "",
    mediaFile: [], // This will store actual File objects
  });
  const [previewURLs, setPreviewURLs] = useState([]); // Stores objects: { id, url (Data URL), type, size, name }
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.campaignData) {
      const incomingData = location.state.campaignData;
      setCampaignDataFromPreviousSteps(incomingData);

      setFormData(prev => ({
        ...prev,
        campaignTitle: incomingData.campaignTitle || '',
        campaignDescription: incomingData.campaignDescription || '',
        mediaFile: incomingData.actualMediaFiles || [], // Restore actual File objects if passed
      }));

      // Restore previewURLs for display if they were passed (these should now be Data URLs)
      if (incomingData.previewURLs && incomingData.previewURLs.length > 0) {
        console.log("CampaignCreation03 - Restoring previewURLs (Data URLs) from previous step:", incomingData.previewURLs);
        setPreviewURLs(incomingData.previewURLs);
      }
    }
  }, [location.state]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const newFilePreviewsPromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const fileUrl = reader.result; // This will be the Data URL (base64 string)
          console.log("CampaignCreation03 - Processing file:", file.name, "Type:", file.type, "Generated Data URL:", fileUrl.substring(0, 100) + "..."); // Log truncated URL
          resolve({
            id: `${file.name}-${file.size}-${Date.now()}`, // Unique ID
            file: file, // Keep reference to actual file object
            url: fileUrl, // The Data URL (base64)
            type: file.type,
            size: (file.size / 1024).toFixed(1) + " KB",
            name: file.name,
          });
        };
        reader.readAsDataURL(file); // Read as Data URL (base64)
      });
    });

    Promise.all(newFilePreviewsPromises).then(newPreviews => {
      setFormData((prev) => ({
        ...prev,
        mediaFile: [...prev.mediaFile, ...files], // Add actual file objects
      }));
      setPreviewURLs((prev) => [...prev, ...newPreviews]); // Add new previews (with Data URLs)
    });
  };

  const handleRemoveFile = (idToRemove) => {
    // No URL.revokeObjectURL needed for Data URLs
    console.log("CampaignCreation03 - Removing file with ID:", idToRemove);

    // Remove from previewURLs state
    setPreviewURLs((prev) => prev.filter((filePreview) => filePreview.id !== idToRemove));

    // Remove the corresponding actual File object from formData.mediaFile
    setFormData((prev) => ({
      ...prev,
      mediaFile: prev.mediaFile.filter((file) => {
        // Match by name and size (and maybe type) for robust removal of actual file object
        const correspondingPreview = previewURLs.find(p => p.id === idToRemove);
        return !(correspondingPreview && file.name === correspondingPreview.name && file.size === correspondingPreview.size && file.type === correspondingPreview.type);
      }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault()

     if (formData.mediaFile.length === 0) {
        showErrorMessage("Please upload at least one photo or video for your campaign.");
        return;
    }
    // Prepare data to send to the next page
    const combinedDataForNextStep = {
      ...campaignDataFromPreviousSteps, // Data from CampCreation01 and 02
      campaignTitle: formData.campaignTitle,
      campaignDescription: formData.campaignDescription,
      mediaFileNames: formData.mediaFile.map(file => file.name), // For backend reference (still useful for debugging/logging)
      previewURLs: previewURLs, // This array will contain the Data URLs (for frontend preview in next steps)
      actualMediaFiles: formData.mediaFile, // CRITICAL: Pass the actual File objects
    };
    console.log("CampaignCreation03 - Data sent to 04 (campaign-creation-04):", combinedDataForNextStep);

    navigate("/campaign-creation-04", { state: { campaignData: combinedDataForNextStep } })
  }

  const handleBack = () => {
    // No URL.revokeObjectURL needed here for Data URLs
    navigate("/campaign-creation-02", { state: { campaignData: campaignDataFromPreviousSteps } })
  }

  // No URL.revokeObjectURL cleanup needed for Data URLs on unmount, as they are self-contained strings.
  useEffect(() => {
    // This useEffect is now primarily for initial data loading or logging.
    // If you were using blob URLs, this would be for cleanup.
    return () => {
        // If you were to switch back to blob URLs, this is where you'd revoke them:
        // previewURLs.forEach(filePreview => {
        //   if (filePreview.url && filePreview.url.startsWith("blob:")) {
        //     URL.revokeObjectURL(filePreview.url);
        //   }
        // });
    };
  }, [previewURLs]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header hideCreate={true} />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Column */}
            <div className="flex flex-col items-center text-center">
            <div className="hidden md:block">
              <div className="w-64 h-64 mb-6">
                <img src="/Images/fundify-white-bg-logo.png" alt="Fundify Logo" className="w-full h-full" />
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

            {/* Right Column */}
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
                        maxLength={60}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                        required
                      />
                      <p className="text-xs text-gray-600 text-right">{formData.campaignTitle.length}/60</p>
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
                        maxLength={165}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                        required
                      ></textarea>
                      <p className="text-xs text-gray-600 text-right">{formData.campaignDescription.length}/165</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#4B5842] mb-1">Add a Photo/Video<span className="text-red-500">*</span></label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*,video/*"
                        multiple // Allow multiple files
                        className="hidden"
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()} // Allow drop
                        onDrop={handleDrop} // Handle dropped files
                        className="w-full min-h-16 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[#4B5842] p-4 transition-colors"
                      >
                        {previewURLs.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
                            {previewURLs.map((fileURL) => (
                              <div
                                key={fileURL.id}
                                className="border rounded-md overflow-hidden relative"
                              >
                                <div className="w-full h-24">
                                  {fileURL.type.startsWith("image/") ? (
                                    <img
                                      src={fileURL.url}
                                      alt="preview"
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <video
                                      src={fileURL.url}
                                      controls
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                <div className="p-1 text-[11px] bg-white text-[#4B5842]">
                                  <p className="truncate">{fileURL.name}</p>
                                  <p>{fileURL.type}</p>
                                  <p>{fileURL.size}</p>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent re-triggering file input click
                                      handleRemoveFile(fileURL.id);
                                    }}
                                    className="mt-1 text-red-600 text-xs underline hover:text-red-800"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center font-medium text-[#4B5842]">
                            <p>Click or drag files here</p>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 mt-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        )}
                      </div>
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

      <Footer />
    </div>
  );
};

export default CampaignCreation03;