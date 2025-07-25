// src/Pages/CampaignsCreation/CampCreation02.jsx
"use client"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Header from "../Layout/HeaderLayout"
import Footer from "../Layout/FooterLayout"

const CampaignCreation02 = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // State to hold all campaign data from previous steps
  const [campaignDataFromPreviousSteps, setCampaignDataFromPreviousSteps] = useState({});

  const [formData, setFormData] = useState({
    goalAmount: "",
    isAdult: false,
    canVerifyID: false,
    canVerifyProject: false,
  })

  useEffect(() => {
    // Receive data passed from CampCreation01 or CampCreation03 (when going back)
    if (location.state && location.state.campaignData) {
      const incomingData = location.state.campaignData;
      setCampaignDataFromPreviousSteps(incomingData);
      console.log("Data received in 02:", incomingData);

      // Restore form data specific to CampCreation02
      setFormData(prev => ({
        ...prev,
        goalAmount: incomingData.goalAmount || "",
        isAdult: incomingData.isAdult !== undefined ? incomingData.isAdult : false,
        canVerifyID: incomingData.canVerifyID !== undefined ? incomingData.canVerifyID : false,
        canVerifyProject: incomingData.canVerifyProject !== undefined ? incomingData.canVerifyProject : false,
      }));
    }
  }, [location.state]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name === "goalAmount" && Number(value) < 0) {
        setFormData((prev) => ({
            ...prev,
            [name]: "0",
        }));
        return; 
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Combine all data from previous steps, including this step's formData
    const combinedDataForNextStep = {
      ...campaignDataFromPreviousSteps, // Data from CampCreation01
      ...formData, // Data from this step
    }

    console.log("Combined data for 03:", combinedDataForNextStep)

    // Pass the combined data to CampCreation03
    navigate("/campaign-creation-03", { state: { campaignData: combinedDataForNextStep } })
  }

  const handleBack = () => {
    // Pass previous data back to CampCreation01
    // It's crucial to pass all data received in this step back, as CampCreation01's useEffect will handle restoring it.
    navigate("/create-campaign", { state: { campaignData: campaignDataFromPreviousSteps } })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header hideCreate={true} />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Logo */}
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
                          min="5000"
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

      <Footer />
    </div>
  )
}

export default CampaignCreation02