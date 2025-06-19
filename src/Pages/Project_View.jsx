// src/Pages/Project_View.jsx
"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import HeaderLayout from "./Layout/HeaderLayout"
import FooterLayout from "./Layout/FooterLayout"
import axios from "axios"

function ProjectView() {
  const [activeTab, setActiveTab] = useState("campaign")
  const [campaignData, setCampaignData] = useState(null)
  const [campaignUpdates, setCampaignUpdates] = useState([])
  const [recentDonors, setRecentDonors] = useState([]) // New state for recent donors
  const [totalBackersCount, setTotalBackersCount] = useState(0) // New state for total backers count
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  const queryParams = new URLSearchParams(location.search)
  const campaignId = queryParams.get("id")

  useEffect(() => {
    if (campaignId) {
      const fetchCampaignDetails = async () => {
        try {
          setLoading(true)
          const response = await axios.get(`http://localhost:5000/api/campaigns/${campaignId}`)
          setCampaignData(response.data)
          setError(null)
        } catch (err) {
          console.error("Error fetching campaign details:", err)
          setError("Failed to load campaign details. Please try again later.")
          setCampaignData(null)
        } finally {
          setLoading(false)
        }
      }

      const fetchCampaignUpdates = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/campaigns/${campaignId}/updates`)
          setCampaignUpdates(response.data)
        } catch (err) {
          console.error("Error fetching campaign updates:", err)
          setCampaignUpdates([])
        }
      }

      // NEW: Fetch recent donors and total backers
      const fetchRecentDonors = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/donations/campaign/${campaignId}/recent?limit=3`) // Fetch top 3 recent donors
          setRecentDonors(response.data.recentDonors)
          setTotalBackersCount(response.data.totalBackers)
        } catch (err) {
          console.error("Error fetching recent donors:", err);
          setRecentDonors([]);
          setTotalBackersCount(0);
        }
      }

      fetchCampaignDetails()
      fetchCampaignUpdates()
      fetchRecentDonors() // Fetch recent donors

    } else {
      setError("No campaign ID provided in the URL.")
      setLoading(false)
    }
  }, [campaignId, location.search])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("₹", "")
  }

  const progress = campaignData ? Math.min(Math.round((campaignData.raised / campaignData.goalAmount) * 100), 100) : 0

  // DonorsSidebar component
  const DonorsSidebar = () => (
    <div className="donors-sidebar">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col items-center mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-700"
            > 
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h3 className="text-lg font-bold">{campaignData ? campaignData.name : "Organizer Name"}</h3>
          <p className="text-sm text-gray-600">Project Founder</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 text-gray-700"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          {/* Display dynamic total backers count */}
          <span className="text-sm font-medium">{totalBackersCount} people just donated</span> 
        </div>

        <div className="pt-4 space-y-4">
          {recentDonors.length > 0 ? (
            recentDonors.map((donor, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="font-medium text-lg">Rs</div>
                <div className="text-right">
                  <div className="font-medium text-lg">{formatCurrency(donor.amount)}</div>
                  <div className="text-sm text-gray-500">{donor.name}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center">No recent donations yet.</p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button 
            onClick={() => alert("Showing all donors for this project (functionality to be implemented).")} 
            className="text-center py-3 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            See all
          </button>
          <button 
            onClick={handleBackThisProject} 
            className="text-center py-3 px-4 bg-[#4B5945] rounded-md text-sm font-medium text-white hover:bg-[#3E4B3A] transition-colors">
            Back this project
          </button>
        </div>
      </div>
    </div>
  )

  const handleBackThisProject = () => {
    if (campaignData && campaignData._id) {
      navigate("/donate", { state: { campaignId: campaignData._id } });
    } else {
      alert("Campaign data not loaded yet. Cannot proceed to donation.");
    }
  };

  const handleShare = () => {
    const campaignUrl = window.location.href;
    navigator.clipboard.writeText(campaignUrl)
      .then(() => {
        alert("Campaign link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
        alert("Failed to copy link. Please try again manually.");
      });
  };

  if (loading) {
    return (
      <>
        <HeaderLayout />
        <div className="project-view container mx-auto px-4 py-6 text-center">
          <p>Loading campaign details...</p>
        </div>
        <FooterLayout />
      </>
    )
  }

  if (error) {
    return (
      <>
        <HeaderLayout />
        <div className="project-view container mx-auto px-4 py-6 text-center">
          <p className="text-red-600">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-[#4A5D45] text-white px-4 py-2 rounded-md hover:bg-[#3E4B3A]">Retry</button>
        </div>
        <FooterLayout />
      </>
    )
  }

  if (!campaignData) {
    return (
      <>
        <HeaderLayout />
        <div className="project-view container mx-auto px-4 py-6 text-center">
          <p>No campaign data available.</p>
        </div>
        <FooterLayout />
      </>
    )
  }

  return (
    <>
      <HeaderLayout />

      <div className="project-view container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{campaignData.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <img
                src={campaignData.mediaUrls && campaignData.mediaUrls.length > 0 ? `http://localhost:5000${campaignData.mediaUrls[0]}` : "/placeholder.svg"}
                alt={campaignData.title}
                className="w-full h-auto rounded-md shadow-md mb-6"
              />

              <p className="text-gray-700 mb-4">{campaignData.description}</p>

              <div className="flex items-center text-sm text-gray-600 mb-6">
                <span>Created {new Date(campaignData.createdAt).toLocaleDateString()}</span> 
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {campaignData.location}
                </span>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <div className="text-2xl font-bold">{formatCurrency(campaignData.raised)}</div>
                  <div className="text-sm text-gray-600">pledged of {formatCurrency(campaignData.goalAmount)} goal</div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-2xl font-bold">{totalBackersCount}</div> {/* Dynamic backers count */}
                    <div className="text-sm text-gray-600">backers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">--</div> {/* Placeholder for days left */}
                    <div className="text-sm text-gray-600">days to go</div>
                  </div>
                </div>

                <div className="text-right mb-4">
                  <span className="text-sm">
                    Predicted Status: <span className="font-medium text-green-600">{campaignData.status}</span>
                  </span>
                </div>

                <button 
                  onClick={handleBackThisProject} 
                  className="w-full bg-[#4B5945] hover:bg-[#3E4B3A] text-white py-3 rounded-md mb-3 transition duration-200">
                  Back this project
                </button>

                <button 
                  onClick={handleShare} 
                  className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-md transition duration-200">
                  Share
                </button>
              </div>
            </div>
          </div>

        {/* Campaign Tabs */}
        <div className="campaign-tabs bg-white rounded-md shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === "campaign"
                    ? "border-gray-800 text-gray-800"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("campaign")}
              >
                Campaign
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === "updates"
                    ? "border-gray-800 text-gray-800"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("updates")}
              >
                Updates
              </button>
            </nav>
          </div>

          <div className="py-6 px-6">
            {activeTab === "campaign" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {/* Story Section */}
                  <div className="story-section">
                    <h2 className="text-xl font-bold mb-4">Story</h2>

                    {campaignData.mediaUrls && campaignData.mediaUrls.length > 1 && (
                        <img src={`http://localhost:5000${campaignData.mediaUrls[1]}`} alt={campaignData.title} className="w-full h-auto rounded-md mb-6" />
                    )}
                    <div className="space-y-4 text-gray-700" dangerouslySetInnerHTML={{ __html: campaignData.content }}>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <DonorsSidebar />
                </div>
              </div>
            )}

            {activeTab === "updates" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-bold mb-6">Updates on the Project</h2>

                  {campaignUpdates.length > 0 ? (
                    campaignUpdates.map((update) => (
                      <div key={update._id} className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                          <h3 className="text-lg font-medium mb-3">
                            Update: {update.title}
                          </h3>

                          <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-gray-700"
                              >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium">{campaignData.name}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(update.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-b border-gray-200 py-4 my-4">
                            <div className="mb-4" dangerouslySetInnerHTML={{ __html: update.content }}></div>

                            {update.mediaUrls && update.mediaUrls.length > 0 && (
                                <img src={`http://localhost:5000${update.mediaUrls[0]}`} alt="Update Media" className="w-full h-auto rounded-md mb-4" />
                            )}

                            {update.listItems && update.listItems.length > 0 && (
                              <ul className="list-disc pl-5 space-y-1">
                                {update.listItems.map((item, index) => (
                                  <li key={index} className="text-gray-700">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-10">No updates available for this project yet.</div>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <DonorsSidebar />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <FooterLayout />
    </>
  )
}

export default ProjectView;