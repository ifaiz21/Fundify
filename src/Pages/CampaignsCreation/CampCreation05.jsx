"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Layout/HeaderLayout";
import Footer from "../Layout/FooterLayout";

const CampaignCreation05 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [campaign, setCampaign] = useState({
    title: "Your Story",
    content: "Default content goes here...",
    image: "/Images/cycle.png",
  });

  useEffect(() => {
    if (location.state?.campaign) {
      setCampaign(location.state.campaign);
    }
  }, [location.state]);

  const handleEdit = () => {
    navigate("/campaign-editor", { state: { campaign } });
  };

  const handleUpdate = () => {
    navigate("/campaign-update", { state: { campaign } });
  };

  const handleDelete = () => {
    navigate("/campaign-deletion");
  };

  const handleBack = () => {
    navigate("/campaign-creation-04");
  };

  const handleSubmit = () => {
    navigate("/campaign-submission");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header hideCreate={true} />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <span className="inline-block bg-[#A9BEA2] text-[#4B5842] px-4 py-1 rounded-full text-sm font-medium">
                Campaign Preview
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <h1 className="text-2xl font-bold mb-4">{campaign.title}</h1>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{campaign.content}</p>
                </div>
              </div>

              <div>
                <img
                  src={campaign.image || "/placeholder.svg"}
                  alt="Campaign"
                  className="w-full h-auto rounded-md object-cover"
                  style={{ maxHeight: "250px" }}
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-between">
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

      <div className="fixed bottom-8 right-8">
        <button className="bg-[#4A5D45] text-white rounded-full p-4 shadow-lg">
          💬
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default CampaignCreation05;
