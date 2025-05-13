"use client"

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Layout/HeaderLayout";
import Footer from "./Layout/FooterLayout";

const DonationScreen = () => {

  const navigate = useNavigate(); // Hook for navigation

  const [donationAmount, setDonationAmount] = useState(25)
  const [isCustomAmount, setIsCustomAmount] = useState(false)
  const [donationFrequency, setDonationFrequency] = useState("one-time")
  const [honorOf, setHonorOf] = useState("")

  const handleDonate = () => {
    // Add your donation processing logic here
    console.log("Processing donation:", {
      amount: donationAmount,
      frequency: donationFrequency,
      honorOf: honorOf,
    });
    // Navigate to payment page
    navigate("/payment");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-start gap-4">
            {/* Left Column - Hero Image */}
            <div className="relative rounded-lg overflow-hidden top-20 h-300 w-2/4 ml-0">
              <img
                src="./Images/donation-screen-img.jpeg"
                alt="We Can Save The Future"
                className="w-full h-full object-cover"
              />
              {/* Green Overlay */}
              <div className="absolute inset-0 bg-[#4A5D45] opacity-50"></div>
              
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center p-28">
                <h2 className="text-white text-4xl font-roman font-bold leading-tight">
                  We Can <br />
                  Save The <br />
                  Future
                </h2>
              </div>
            </div>

            {/* Right Column - Donation Form */}
            <div className="bg-white p-6 rounded-md w-2/3">
              <div className="flex items-center mb-4">
                {/* <img src="./images/fundify-transparent-logo.png" alt="Fundify" className="h-8 w-8 mr-2" /> */}
              <span className="text-[#4B5842] font-bold">Fundify</span>
              </div>

              <p className="text-gray-600 mb-6">
                Welcome to fundify, please fill out the form below, Hopefully it is blessed.
                {/*Your donation helps us fund the best ideas to address the climate crisis.*/}
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose a donation type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]">
                    <option>General donation</option>
                    <option>Project specific</option>
                    <option>Emergency relief</option>
                    <option>Education Purpose</option>
                    <option>Flood relief</option>
                    <option>Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose a donation amount</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[25, 50, 100].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setDonationAmount(amount)}
                        className={`py-2 px-4 border ${
                          donationAmount === amount
                            ? "bg-[#4B5842] text-white border-[#4B5842]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        } rounded-md focus:outline-none`}
                      >
                        ${amount}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomAmount(true);
                        setDonationAmount(""); 
                      }}
                      className={`py-2 px-4 border ${
                        isCustomAmount
                          ? "bg-[#4B5842] text-white border-[#4B5842]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      } rounded-md focus:outline-none`}
                    >
                      Other
                    </button>
                    </div>

                  {/* Custom Donation Input Field */}
                  {isCustomAmount && (
                    <input
                      type="number"
                      min="1"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(parseInt(e.target.value)  || "")}
                      className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                      placeholder="Enter your amount"
                    />
                  )}
                   
                </div>

                <div>
                  <label htmlFor="honorOf" className="block text-sm font-medium text-gray-700 mb-2">
                    Make your donation in honor of
                  </label>
                  <input
                    type="text"
                    id="honorOf"
                    value={honorOf}
                    onChange={(e) => setHonorOf(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose a donation frequency</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="frequency"
                        value="one-time"
                        checked={donationFrequency === "one-time"}
                        onChange={() => setDonationFrequency("one-time")}
                        className="mr-2"
                      />
                      <span>One time</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="frequency"
                        value="monthly"
                        checked={donationFrequency === "monthly"}
                        onChange={() => setDonationFrequency("monthly")}
                        className="mr-2"
                      />
                      <span>Monthly</span>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button onClick={() => navigate("/")}
                    className="flex-1 bg-[#A9BEA2] text-[#000000] py-2 px-4 rounded-md hover:bg-[#97AB90] transition-colors"
                  >
                    Cancel
                  </button>
                  <button onClick={handleDonate}
                  className="flex-1 bg-[#4B5842] text-white py-2 px-4 rounded-md hover:bg-[#3A4433] transition-colors">
                    Go to Checkout
                  </button>
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

export default DonationScreen;

