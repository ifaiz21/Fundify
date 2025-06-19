// src/Pages/DonationScreen.jsx
"use client"

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import Header from "./Layout/HeaderLayout";
import Footer from "./Layout/Footer";
import { useEffect } from "react";

const DonationScreen = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Initialize useLocation
  const [donationAmount, setDonationAmount] = useState(25);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [donationFrequency, setDonationFrequency] = useState("one-time");
  const [honorOf, setHonorOf] = useState("");
  const [donationType, setDonationType] = useState("General donation");
  const [campaignId, setCampaignId] = useState(null); // State for campaign ID
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if campaignId is passed from ExploreCampaigns
    if (location.state && location.state.campaignId) {
      setCampaignId(location.state.campaignId);
      setDonationType("Project specific"); // Set default donation type to 'Project specific'
      console.log("DonationScreen received campaign ID:", location.state.campaignId);
    }
  }, [location.state]); // Dependency on location.state to react to navigation changes

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const handleDonate = async () => {
    setIsLoading(true);
    const token = getAuthToken();

    if (!token) {
      alert("Please log in to make a donation.");
      navigate("/login");
      setIsLoading(false);
      return;
    }

    if (donationAmount <= 0 || donationAmount === "") {
        alert("Please enter a valid donation amount.");
        setIsLoading(false);
        return;
    }

    const donationData = {
      amount: Number(donationAmount),
      frequency: donationFrequency,
      honorOf: honorOf,
      donationType: donationType,
      campaignId: campaignId, // Now correctly uses the campaignId from state
    };

    console.log("Attempting to send donation:", donationData);

    try {
      const response = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(donationData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Donation initiated successfully! Redirecting to payment.");
        console.log("Donation response:", result);
        navigate("/payment", { state: { donationId: result.donation._id } });
      } else {
        const errorData = await response.json();
        alert(`Donation failed: ${errorData.message}`);
        console.error("Donation submission error:", errorData);
      }
    } catch (error) {
      alert("An error occurred during donation processing.");
      console.error("Network or unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header hideDonate={true}/>

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
              <span className="text-[#4B5842] font-bold">Fundify</span>
              </div>

              <p className="text-gray-600 mb-6">
                Welcome to fundify, please fill out the form below, Hopefully it is blessed.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose a donation type</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                    value={donationType}
                    onChange={(e) => setDonationType(e.target.value)}
                  >
                    <option value="General donation">General donation</option>
                    <option value="Project specific">Project specific</option>
                    <option value="Emergency relief">Emergency relief</option>
                    <option value="Education Purpose">Education Purpose</option>
                    <option value="Flood relief">Flood relief</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose a donation amount</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[25, 50, 100].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => {
                            setDonationAmount(amount);
                            setIsCustomAmount(false);
                        }}
                        className={`py-2 px-4 border ${
                          donationAmount === amount && !isCustomAmount
                            ? "bg-[#4B5842] text-white border-[#4B5842]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        } rounded-md focus:outline-none`}
                      >
                        PKR {amount}
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

                  {isCustomAmount && (
                    <input
                      type="number"
                      min="1"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value === "" ? "" : parseInt(e.target.value))}
                      className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                      placeholder="Enter your amount"
                      required
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
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button onClick={handleDonate}
                    className="flex-1 bg-[#4B5842] text-white py-2 px-4 rounded-md hover:bg-[#3A4433] transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Go to Checkout"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default DonationScreen;