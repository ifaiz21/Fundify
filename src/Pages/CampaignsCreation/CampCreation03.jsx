"use client"
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Layout/HeaderLayout";
import Footer from "../Layout/FooterLayout";

const CampaignCreation03 = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    campaignTitle: "",
    campaignDescription: "",
    mediaFile: [],
  });

  const [previewURLs, setPreviewURLs] = useState([]);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const timestamp = Date.now();
    const filePreviews = files.map((file, i) => ({
      id: `${timestamp}-${i}`,
      file: file,
      url: URL.createObjectURL(file),
      type: file.type,
      size: (file.size / 1024).toFixed(1) + " KB",
      name: file.name,
    }));

    setFormData((prev) => ({
      ...prev,
      mediaFile: [...prev.mediaFile, ...files],
    }));

    setPreviewURLs((prev) => [...prev, ...filePreviews]);
  };

  const handleRemoveFile = (id) => {
    setPreviewURLs((prev) => prev.filter((file) => file.id !== id));
    setFormData((prev) => ({
      ...prev,
      mediaFile: prev.mediaFile.filter(
        (_, i) => previewURLs[i]?.id !== id
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    navigate("/campaign-launch-date");
  };

  const handleBack = () => {
    navigate("/campaign-creation-02");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header hideCreate={true} />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Column */}
            <div className="flex flex-col items-center">
              <div className="w-64 h-64 mb-6">
                <img
                  src="/Images/fundify-white-bg-logo.png"
                  alt="Fundify Logo"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex justify-center">
              <div className="bg-[#A9BEA2] rounded-md p-6 w-full max-w-md">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                    <div className="h-0.5 flex-1 bg-white mx-2"></div>
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                    <div className="h-0.5 flex-1 bg-white mx-2"></div>
                    <div className="h-2 w-2 rounded-full bg-[#4B5842]"></div>
                  </div>
                  <h2 className="text-center text-lg font-medium">
                    Setup your <span className="font-bold">CAMPAIGN</span>
                  </h2>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="campaignTitle" className="block text-sm font-medium text-[#4B5842] mb-1">
                        What's Your Campaign Title?
                      </label>
                      <input
                        type="text"
                        id="campaignTitle"
                        name="campaignTitle"
                        value={formData.campaignTitle}
                        onChange={handleChange}
                        maxLength={60}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                        required
                      />
                      <p className="text-xs text-gray-600 text-right">{formData.campaignTitle.length}/60</p>
                    </div>

                    <div>
                      <label htmlFor="campaignDescription" className="block text-sm font-medium text-[#4B5842] mb-1">
                        What's Your Campaign About?
                      </label>
                      <textarea
                        id="campaignDescription"
                        name="campaignDescription"
                        value={formData.campaignDescription}
                        onChange={handleChange}
                        rows="4"
                        maxLength={165}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4B5842]"
                        required
                      ></textarea>
                      <p className="text-xs text-gray-600 text-right">{formData.campaignDescription.length}/165</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#4B5842] mb-1">Add a Photo/Video</label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*,video/*"
                        multiple
                        className="hidden"
                      />
                      <div
                        onClick={() => fileInputRef.current.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className="w-full min-h-16 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[#4B5842] p-4 transition-colors"
                      >
                        {previewURLs.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
                            {previewURLs.map((fileURL) => (
                              <div key={fileURL.id} className="border rounded-md overflow-hidden relative">
                                <div className="w-full h-24">
                                  {fileURL.type.startsWith("image/") ? (
                                    <img src={fileURL.url} alt="preview" className="object-cover w-full h-full" />
                                  ) : (
                                    <video src={fileURL.url} controls className="w-full h-full object-cover" />
                                  )}
                                </div>
                                <div className="p-1 text-[11px] bg-white text-[#4B5842]">
                                  <p className="truncate">{fileURL.name}</p>
                                  <p>{fileURL.type}</p>
                                  <p>{fileURL.size}</p>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFile(fileURL.id)}
                                    className="mt-1 text-red-600 text-xs underline hover:text-red-800"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-white">
                            <p>Click or drag files here</p>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 mt-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        )}
                      </div>
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
  );
};

export default CampaignCreation03;
