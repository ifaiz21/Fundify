"use client"
import React from "react";

import { useState } from "react"
import { useNavigate } from "react-router-dom";
import Header from "../Layout/HeaderLayout"
import Footer from "../Layout/FooterLayout"

const CampaignCreation02 = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    goalAmount: "",
    isAdult: false,
    canVerifyID: false,
    canVerifyProject: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Process form submission
    console.log("Form submitted:", formData)
    // Navigate to next step
    navigate("/campaign-creation-03");
  }

  const handleBack = () => {
    // Navigate back to previous step
    console.log("Going back to previous step")
    navigate("/create-campaign");
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
                <img
                  src="/Images/fundify-white-bg-logo.png"
                  alt="Fundify Logo"
                  className="w-full h-full"
                />
              </div>
              {/*
              <h1 className="text-4xl font-bold mb-2">
                FUND<span className="text-[#7C9070]">i</span>FY
              </h1>
              <p className="text-sm uppercase tracking-wider">INVEST LOCALLY, IMPACT GLOBALLY</p>
              */}
            </div>

            {/* Right Column - Goal Setting Form */}
            <div className="flex justify-center">
              <div className="bg-[#A9BEA2] rounded-md p-6 w-full max-w-md">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                    <div className="h-0.5 flex-1 bg-white mx-2"></div>
                    <div className="h-2 w-2 rounded-full bg-[#4B5842]"></div>
                    <div className="h-0.5 flex-1 bg-white mx-2"></div>
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                  <h2 className="text-center text-lg font-medium">
                    Set your <span className="font-bold">GOAL</span>
                  </h2>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="goalAmount" className="block text-sm font-medium text-[#4B5842] mb-1">
                        How much would you like to raise?
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">Rs.</span>
                        <input
                          type="number"
                          id="goalAmount"
                          name="goalAmount"
                          value={formData.goalAmount}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                          placeholder="0"
                          required
                        />
                      </div>
                    </div>

                    <div className="text-xs text-[#4B5842] mt-2">
                      <p>
                        Agree to Fund That (crowdfundthat.net) taking a small and fixed transfer and processing fees and
                        your campaign fees will be transferred to your account after deducting these fees. Also by
                        continuing you agree to Fundify's policies.
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="isAdult"
                          checked={formData.isAdult}
                          onChange={handleChange}
                          className="mr-2 h-4 w-4"
                          required
                        />
                        <span className="text-sm text-[#4B5842]">I am at least 18 years old.</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="canVerifyID"
                          checked={formData.canVerifyID}
                          onChange={handleChange}
                          className="mr-2 h-4 w-4"
                          required
                        />
                        <span className="text-sm text-[#4B5842]">I can verify a government issued ID.</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="canVerifyProject"
                          checked={formData.canVerifyProject}
                          onChange={handleChange}
                          className="mr-2 h-4 w-4"
                          required
                        />
                        <span className="text-sm text-[#4B5842]">I can verify the legitimacy of the project.</span>
                      </label>
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

export default CampaignCreation02;
