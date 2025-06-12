"use client"

import React  from "react";
import { useState } from "react"
// import { Calendar } from "lucide-react"
import { AlertCircle } from "lucide-react";
import Header from "../Layout/HeaderLayout"
import Footer from "../Layout/FooterLayout"
import { useNavigate } from "react-router-dom";


const TargetLaunchDatePage = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    day: "",
    month: "",
    year: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { day, month, year } = formData;
    const dateStr = `${year}-${month}-${day}`;
    const parsedDate = new Date(dateStr);
  
    if (
      parsedDate.getFullYear() !== parseInt(year) ||
      parsedDate.getMonth() + 1 !== parseInt(month) ||
      parsedDate.getDate() !== parseInt(day)
    ) {
      alert("Invalid date. Please enter a valid day, month, and year.");
      return;
    }
    // Process form submission
    console.log("Target launch date submitted:", formData)
    // Navigate to next step
     navigate("/campaign-creation-04")
  }

  const handleBack = () => {
    // Navigate back to previous step
    console.log("Going back to previous step")
     navigate("/campaign-creation-03")
  }

  //const handleCalendarClick = () => {
    // Open calendar picker
    //console.log("Open calendar picker")
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

          {/* Right Column - Target Launch Date Form */}
          <div className="flex justify-center">
            <div className="bg-white rounded-md border border-gray-200 shadow-sm w-full max-w-lg p-8">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Campaign launch date (optional)</h2>
                <p className="text-sm text-gray-600 mb-6">
                 We’ll guide you on when to complete steps that might take a few days to process. You can update this date anytime before launching your project, which must always be done manually.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <div className="grid grid-cols-4 gap-3 mb-2">
                      <div className="text-sm font-medium text-gray-700">Day</div>
                      <div className="text-sm font-medium text-gray-700">Month</div>
                      <div className="text-sm font-medium text-gray-700">Year</div>
                      <div></div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <input
                        type="number"
                        name="day"
                        value={formData.day}
                        onChange={handleChange}
                        placeholder="DD"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842] text-center"
                        maxLength="2"
                        min="1"
                        max="31"
                        required
                      />
                      <input
                        type="number"
                        name="month"
                        value={formData.month}
                        onChange={handleChange}
                        placeholder="MM"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842] text-center"
                        maxLength="2"
                        min="1"
                        max="12"
                        required
                      />
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        placeholder="YYYY"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842] text-center"
                        maxLength="4"
                        min={new Date().getFullYear()}
                        max={new Date().getFullYear() + 10}
                        required
                      />
                      {/*
                      <button
                        type="button"
                        onClick={handleCalendarClick}
                        className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#4B5842] flex items-center justify-center"
                      >
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </button> */}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3">We'll recommend when you should:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-sm text-gray-700">
                          Confirm your identity and provide payment deatils
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-sm text-gray-700">Submit your project for review</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-start p-3 bg-blue-50 rounded-md">
                      <AlertCircle className="h-4 w-4 text-#4B5842 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm text-#4B5842">
                        Setting a target date won't automatically launch your project.
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 bg-white text-[#4B5842] py-2 px-4 rounded-md border border-[#4B5842] hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#4B5842] text-white py-2 px-4 rounded-md hover:bg-[#3A4433] transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </form>
              </div>
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

export default TargetLaunchDatePage;
