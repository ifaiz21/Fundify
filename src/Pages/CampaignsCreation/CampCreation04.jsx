// src/Pages/CampaignsCreation/CampCreation04.jsx
"use client"
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Layout/HeaderLayout";
import Footer from "../Layout/FooterLayout";
import { showErrorMessage } from "../../utils/toast";


const CampaignCreation04 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [story, setStory] = useState("");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState("left");
   
  const [duration, setDuration] = useState("");
  const [campaignDataFromPreviousSteps, setCampaignDataFromPreviousSteps] = useState({});

  useEffect(() => {
    if (location.state && location.state.campaignData) {
      setCampaignDataFromPreviousSteps(location.state.campaignData);
      console.log("CampaignCreation04 - Data received from 03:", location.state.campaignData);
      if (location.state.campaignData.storyContent) {
        setStory(location.state.campaignData.storyContent);
      }
      if (location.state.campaignData.duration) {
        setDuration(location.state.campaignData.duration);
      }
    }
  }, [location.state]);

  const handleStoryChange = (e) => {
    setStory(e.target.value);
  };

  const handleFormatClick = (format) => {
    switch (format) {
      case "bold":
        setIsBold(!isBold);
        break;
      case "italic":
        setIsItalic(!isItalic);
        break;
      case "underline":
        setIsUnderline(!isUnderline);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

     if (!story || story.trim().length < 50) {
            showErrorMessage("Please write a story of at least 50 characters to continue.");
            return; 
    }
    const durationNum = parseInt(duration, 10);
    if (!duration || isNaN(durationNum) || durationNum <= 0) {
        showErrorMessage("Please enter a valid campaign duration (a number greater than 0).");
        return;
    }
    console.log("Story submitted from 04:", story);
    console.log("Duration submitted from 04:", duration);

    const combinedDataForNextStep = {
      ...campaignDataFromPreviousSteps, // This now correctly contains 'previewURLs' (Data URLs) from 03
      storyContent: story,
      duration: durationNum,
    };
    console.log("CampaignCreation04 - Data sent to 05:", combinedDataForNextStep);

    navigate("/campaign-creation-05", { state: { campaignData: combinedDataForNextStep } });
  };

  const handleBack = () => {
    const currentData = {
        ...campaignDataFromPreviousSteps,
        storyContent: story,
        duration: duration,
    };

    navigate("/campaign-creation-03", { state: { campaignData: currentData } });
  };
 
  return (
    <div className="flex flex-col min-h-screen">
      <Header hideCreate={true} /> 

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Logo */}
            <div className="flex flex-col items-center text-center">
              <div className= "hidden md:block">
              <div className="w-64 h-64 mb-6">
                <img
                  src="/Images/fundify-white-bg-logo.png"
                  alt="Fundify Logo"
                  className="w-full h-full"
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

            {/* Right Column - Story Editor */}
            <div className="flex justify-center">
              <div className="bg-white rounded-md border border-gray-200 shadow-sm w-full max-w-md overflow-hidden">
                {/* Editor Header */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-[#A9BEA2] px-4 py-2">
                  <h2 className="font-medium">Tell Your Story</h2>
                </div>

                {/* Formatting Toolbar */}
                <div className="flex items-center border-b border-gray-200 px-2 py-1 space-x-1">
                  <button
                    type="button"
                    onClick={() => handleFormatClick("bold")}
                    className={`p-1 rounded ${isBold ? "bg-gray-200" : "hover:bg-gray-100"}`}
                    title="Bold"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
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
                  <button
                    type="button"
                    onClick={() => handleFormatClick("italic")}
                    className={`p-1 rounded ${isItalic ? "bg-gray-200" : "hover:bg-gray-100"}`}
                    title="Italic"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
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
                  <button
                    type="button"
                    onClick={() => handleFormatClick("underline")}
                    className={`p-1 rounded ${isUnderline ? "bg-gray-200" : "hover:bg-gray-100"}`}
                    title="Underline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
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
                  <div className="h-4 w-px bg-gray-300 mx-1"></div>
                  <button className={`p-1 rounded ${textAlign === "left" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                          title="Align Left"
                          onClick={() => setTextAlign("left")}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="17" y1="10" x2="3" y2="10"></line>
                      <line x1="21" y1="6" x2="3" y2="6"></line>
                      <line x1="21" y1="14" x2="3" y2="14"></line>
                      <line x1="17" y1="18" x2="3" y2="18"></line>
                    </svg>
                  </button>
                  <button  className={`p-1 rounded ${textAlign === "center" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                           title="Align Center"
                           onClick={() => setTextAlign("center")}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="10" x2="6" y2="10"></line>
                      <line x1="21" y1="6" x2="3" y2="6"></line>
                      <line x1="21" y1="14" x2="3" y2="14"></line>
                      <line x1="18" y1="18" x2="6" y2="18"></line>
                    </svg>
                  </button>
                  <button  className={`p-1 rounded ${textAlign === "right" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                           title="Align Right"
                           onClick={() => setTextAlign("right")}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="21" y1="10" x2="7" y2="10"></line>
                      <line x1="21" y1="6" x2="3" y2="6"></line>
                      <line x1="21" y1="14" x2="3" y2="14"></line>
                      <line x1="21" y1="18" x2="7" y2="18"></line>
                    </svg>
                  </button>
                  <div className="h-4 w-px bg-gray-300 mx-1"></div>
                </div>

                {/* Text Area */}
                <form onSubmit={handleSubmit}>
                  <textarea
                    value={story}
                    onChange={handleStoryChange}
                    className="w-full px-4 py-3 focus:outline-none"
                    rows="8"
                    placeholder="Ex: I am a student working on projects."
                    style={{
                      fontWeight: isBold ? "bold" : "normal",
                      fontStyle: isItalic ? "italic" : "normal",
                      textDecoration: isUnderline ? "underline" : "none",
                      textAlign: textAlign,
                    }}
                  ></textarea>
                  {/* ADDED: Campaign Duration Input */}
                  <div className="p-4 border-t border-gray-200">
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                          Campaign Duration (in days)
                      </label>
                      <input
                          type="number"
                          id="duration"
                          name="duration"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                          placeholder="e.g., 30"
                          min="1"
                      />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 py-2 text-center text-[#4B5842] hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <div className="w-px bg-gray-200"></div>
                    <button
                      type="submit"
                      className="flex-1 py-2 text-center bg-[#4B5842] text-white hover:bg-[#3A4433] transition-colors"
                    >
                      Review
                    </button>
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

export default CampaignCreation04;