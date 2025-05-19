"use client"

import React  from "react";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import Header from "../Layout/HeaderLayout"
import Footer from "../Layout/FooterLayout"

const CampaignCreation04 = () => {
    const navigate = useNavigate();
  const [story, setStory] = useState("")
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [textAlign, setTextAlign] = useState("left");


  const handleStoryChange = (e) => {
    setStory(e.target.value)
  }

  const handleFormatClick = (format) => {
    switch (format) {
      case "bold":
        setIsBold(!isBold)
        break
      case "italic":
        setIsItalic(!isItalic)
        break
      case "underline":
        setIsUnderline(!isUnderline)
        break
      default:
        break
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Process form submission
    console.log("Story submitted:", story)
    // Navigate to next step
    navigate("/campaign-creation-05");
  }

  const handleBack = () => {
    // Navigate back to previous step
    console.log("Going back to previous step")
    navigate("/campaign-creation-03");
  }
 
  // const handleDone = () => {
    // Mark story as complete
   // console.log("Story marked as complete")
  //}
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header hideCreate={true} /> 

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Logo */}
            <div className="flex flex-col items-center">
              <div className="w-64 h-64 mb-6">
                <img
                  src="/Images/fundify-white-bg-logo.png"
                  alt="Fundify Logo"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Right Column - Story Editor */}
            <div className="flex justify-center">
              <div className="bg-white rounded-md border border-gray-200 shadow-sm w-full max-w-md overflow-hidden">
                {/* Editor Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
                  <h2 className="font-medium">Tell Your Story</h2>
                  {/*
                  <button
                    onClick={handleDone}
                    className="text-sm text-[#4B5842] hover:text-[#3A4433] transition-colors"
                  >
                    Done
                  </button> */}
                </div>

                {/* Formatting Toolbar */}
                <div className="flex items-center border-b border-gray-200 px-2 py-1 space-x-1">
                  <button
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
                  <div className="h-4 w-px bg-gray-300 mx-1"></div> {/*}
                  <button className="p-1 rounded hover:bg-gray-100" title="Bullet List">
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
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                  </button>
                  <button className="p-1 rounded hover:bg-gray-100" title="Numbered List">
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
                      <line x1="10" y1="6" x2="21" y2="6"></line>
                      <line x1="10" y1="12" x2="21" y2="12"></line>
                      <line x1="10" y1="18" x2="21" y2="18"></line>
                      <path d="M4 6h1v4"></path>
                      <path d="M4 10h2"></path>
                      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                    </svg>
                  </button> */}
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
                      Next
                    </button>
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

export default CampaignCreation04;
