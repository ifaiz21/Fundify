// src/Pages/CampaignsCreation/CampUpdate.jsx
"use client"
import { useState, useEffect, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Header from "../Layout/HeaderLayout"
import Footer from "../Layout/FooterLayout"

const CampaignUpdate = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Get the full campaign data passed from CampCreation05.jsx
  // It should be in location.state.campaign
  const initialCampaignData = useMemo(() => {
    return location.state?.campaign || {};
  }, [location.state?.campaign]); // Dependency for useMemo: Only re-create if location.state.campaign changes

  // Initialize local state with existing campaign data
  const [title, setTitle] = useState(initialCampaignData.campaignTitle || initialCampaignData.title || "");
  const [description, setDescription] = useState(initialCampaignData.campaignDescription || initialCampaignData.description || "");
  const [story, setStory] = useState(initialCampaignData.storyContent || initialCampaignData.content || "");
  const [isBold, setIsBold] = useState(initialCampaignData.isBold || false); // Assuming formatting could be passed
  const [isItalic, setIsItalic] = useState(initialCampaignData.isItalic || false);
  const [isUnderline, setIsUnderline] = useState(initialCampaignData.isUnderline || false);
  const [textAlign, setTextAlign] = useState(initialCampaignData.textAlign || "left");

  useEffect(() => {
    // If the data changes (e.g., due to hot reload during development), update local state
    setTitle(initialCampaignData.campaignTitle || initialCampaignData.title || "");
    setDescription(initialCampaignData.campaignDescription || initialCampaignData.description || "");
    setStory(initialCampaignData.storyContent || initialCampaignData.content || "");
    setIsBold(initialCampaignData.isBold || false);
    setIsItalic(initialCampaignData.isItalic || false);
    setIsUnderline(initialCampaignData.isUnderline || false);
    setTextAlign(initialCampaignData.textAlign || "left");
  }, [initialCampaignData]);

  const handleFormatClick = (format) => {
    if (format === "bold") setIsBold(!isBold);
    if (format === "italic") setIsItalic(!isItalic);
    if (format === "underline") setIsUnderline(!isUnderline);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Construct the updated campaign object
    const updatedCampaignData = {
      ...initialCampaignData, // Start with existing data to retain other fields
      campaignTitle: title, // Update title
      campaignDescription: description, // Update description
      storyContent: story, // Update story content
      // Update formatting if you want to persist it, or remove if not needed in final data
      isBold: isBold,
      isItalic: isItalic,
      isUnderline: isUnderline,
      textAlign: textAlign,
    };

    console.log("Updated Campaign Data to send:", updatedCampaignData);

    // Call backend API to update the campaign
    // Ensure you have the campaign ID to send to the PUT endpoint
    const campaignId = initialCampaignData._id; // Assuming _id is present if it's an existing campaign
    const token = localStorage.getItem('token'); // Get auth token

    if (!token || !campaignId) {
      alert("Cannot update: Missing authentication token or Campaign ID.");
      navigate("/login"); // Or handle as appropriate
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          // Map frontend names to backend schema names
          name: updatedCampaignData.name,
          location: updatedCampaignData.location,
          category: updatedCampaignData.category,
          goalAmount: Number(updatedCampaignData.goalAmount),
          isAdultContent: updatedCampaignData.isAdult,
          isIDVerifiedRequired: updatedCampaignData.canVerifyID,
          isProjectVerifiedRequired: updatedCampaignData.canVerifyProject,
          title: updatedCampaignData.campaignTitle,
          description: updatedCampaignData.campaignDescription,
          mediaUrl: updatedCampaignData.mediaFileName, // Assuming this is the media URL or name
          content: updatedCampaignData.storyContent,
          // Do NOT include _id or userId here unless you specifically intend to update them
        }),
      });

      if (response.ok) {
        // Navigate back to CampaignCreation05 with the updated data and a success flag
        alert("Campaign updated successfully!"); // Optional: show a quick success message
        navigate("/campaign-creation-05", {
          state: {
            campaign: updatedCampaignData, // Send the updated data back
            updateSuccess: true, // Signal success to CampCreation05
          },
        });
      } else {
        const errorData = await response.json();
        alert(`Failed to update campaign: ${errorData.message}`);
        console.error("Update failed:", errorData);
      }
    } catch (error) {
      alert("An error occurred during update.");
      console.error("Update error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="bg-gray-100 py-2 px-4 text-gray-500 text-sm">Update campaign</div>

      <div className="flex flex-1 px-20 py-12 gap-12">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center w-1/2">
          <div className="w-64 h-64 mb-4">
            <img
              src="/Images/fundify-white-bg-logo.png"
              alt="FUNDIFY Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="w-full max-w-xl bg-white border border-gray-300 rounded-md shadow">
          <div className="border-b bg-gray-100 px-4 py-3 text-sm font-medium">Project Updates</div>

          <div className="px-4 py-3 border-b">
            <label className="block text-sm font-semibold mb-1">Campaign Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter campaign title"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-600"
            />
          </div>

          <div className="px-4 py-3 border-b">
            <label className="block text-sm font-semibold mb-1">Campaign Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter campaign description"
              rows="3"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-600"
            />
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 border-b px-4 py-2">
            {[
              { format: "bold", active: isBold, icon: "B", title: "Bold" },
              { format: "italic", active: isItalic, icon: "I", title: "Italic" },
              { format: "underline", active: isUnderline, icon: "U", title: "Underline" },
            ].map((btn) => (
              <button
                key={btn.format}
                type="button"
                onClick={() => handleFormatClick(btn.format)}
                title={btn.title}
                className={`px-2 py-1 text-sm border rounded ${btn.active ? "bg-gray-200" : "hover:bg-gray-100"}`}
              >
                <span
                  style={{
                    fontWeight: btn.format === "bold" ? "bold" : "normal",
                    fontStyle: btn.format === "italic" ? "italic" : "normal",
                    textDecoration: btn.format === "underline" ? "underline" : "none",
                  }}
                >
                  {btn.icon}
                </span>
              </button>
            ))}

            <div className="h-4 w-px bg-gray-300 mx-1"></div>

            {[
              { align: "left", icon: "⬅", title: "Align Left" },
              { align: "center", icon: "⬌", title: "Align Center" },
              { align: "right", icon: "➡", title: "Align Right" },
            ].map((btn) => (
              <button
                key={btn.align}
                type="button"
                onClick={() => setTextAlign(btn.align)}
                title={btn.title}
                className={`px-2 py-1 text-sm border rounded ${
                  textAlign === btn.align ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                {btn.icon}
              </button>
            ))}
          </div>

          <div className="px-4 py-3">
            <label className="block text-sm font-semibold mb-1">Campaign Story:</label>
            <textarea
              style={{ textAlign }}
              className={`w-full h-48 p-2 border border-gray-300 rounded focus:outline-none resize-none ${
                isBold ? "font-bold" : ""
              } ${isItalic ? "italic" : ""} ${isUnderline ? "underline" : ""}`}
              placeholder="Write your campaign story..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
            />
          </div>

          <div className="flex justify-end px-4 py-3">
            <button
              type="submit"
              className="px-6 py-2 bg-[#4B5842] text-white rounded-md hover:bg-[#3A4433] transition-colors"
            >
              Update Campaign
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}

export default CampaignUpdate