"use client"

import React  from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Layout/HeaderLayout"
import Footer from "../Layout/FooterLayout"

const CampaignCreation05 = () => {
    const navigate = useNavigate();
  const [campaign, setCampaign] = useState({
    title: "Your Story",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dictum ut nisl vitae dignissim. Sed ullamcorper magna quis magna aliquam ultricies. In quis velit cursus ut commodo mauris. Nullam hendrerit, ipsum in tempus fermentum, orci ante commodo urna, a volutpat enim felis vitae magna. Donec aliquet hendrerit ex rutrum, ut sit cursus arcu molestie. Phasellus sed ante magna. Donec nec elit quam. Cras pellentesque ex rutrum felis rhoncus. Nulla quis velit quis elit tempor varius quis ut lacus. Sed commodo, magna eu elementum molestie, lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.`,
    image: "/Images/cycle.png",
  })

  const handleEdit = () => {
    console.log("Edit campaign")
    // Navigate to edit page
  }

  const handleUpdate = () => {
    console.log("Update campaign")
    // Unpublish logic
  }

  const handleDelete = () => {
    console.log("Delete campaign")
    // Delete logic with confirmation
  }

  const handleBack = () => {
    console.log("Go back")
    // Navigate back
    navigate("/campaign-creation-04");
  }

  const handleSubmit = () => {
    console.log("Submit campaign")
    // Submit logic
    navigate("/campaign-submission")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Campaign Preview Label */}
            <div className="mb-6">
              <span className="inline-block bg-[#A9BEA2] text-[#4B5842] px-4 py-1 rounded-full text-sm font-medium">
                Campaign Preview
              </span>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Story Content - 2/3 width on desktop */}
              <div className="md:col-span-2">
                <h1 className="text-2xl font-bold mb-4">{campaign.title}</h1>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{campaign.content}</p>
                </div>
              </div>

              {/* Campaign Image - 1/3 width on desktop */}
              <div>
                <img
                  src={campaign.image || "/placeholder.svg"}
                  alt="Campaign"
                  className="w-full h-auto rounded-md object-cover"
                  style={{ maxHeight: "250px" }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-between">
              {/* Left side buttons */}
              <div className="flex flex-wrap gap-3 mb-4 md:mb-0">
             <button
                  onClick={handleEdit}
                  className="bg-[#4B5842] text-white py-2 px-4 rounded-md hover:bg-[#3A4433] transition-colors"
             >
                  Edit
            </button>
            <button
                  onClick={handleUpdate}
                  className="bg-[#4B5842] text-white py-2 px-4 rounded-md hover:bg-[#3A4433] transition-colors"
             >
                  Update
            </button>
            <button
                  onClick={handleDelete}
                  className="bg-[#4B5842] text-white py-2 px-4 rounded-md hover:bg-[#3A4433] transition-colors"
             >
                  Delete
             </button>
            </div>

              {/* Right side buttons */}
              <div className="flex space-x-4 items-end">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-[#4B5842] text-white rounded-md hover:bg-[#3A4433] transition-colors"
                >
                  Submit
                </button>
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

export default CampaignCreation05;
