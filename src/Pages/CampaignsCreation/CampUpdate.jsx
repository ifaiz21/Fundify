"use client";

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Layout/HeaderLayout";
import Footer from "../Layout/FooterLayout";

const CampaignUpdate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialData = location.state?.campaign || {
    title: "",
    content: "",
  };

  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState("left");

  const handleFormatClick = (format) => {
    if (format === "bold") setIsBold(!isBold);
    if (format === "italic") setIsItalic(!isItalic);
    if (format === "underline") setIsUnderline(!isUnderline);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedCampaign = { ...initialData, title, content };
    navigate("/campaign-creation-05", { state: { campaign: updatedCampaign } });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="bg-gray-100 py-2 px-4 text-gray-500 text-sm">
        Update campaign
      </div>

      <div className="flex flex-1 px-20 py-12 gap-12">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center w-1/2">
          <div className="w-64 h-64 mb-4">
            <img
              src="/Images/fundify-transparent-logo.png"
              alt="FUNDIFY Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleUpdate}
          className="w-full max-w-xl bg-white border border-gray-300 rounded-md shadow"
        >
          <div className="border-b bg-gray-100 px-4 py-3 text-sm font-medium">
            Project Updates
          </div>

          <div className="px-4 py-3 border-b">
            <label className="block text-sm font-semibold mb-1">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Thank you for..."
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-600"
            />
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 border-b px-4 py-2">
            {[{ icon: "🖼" }, { icon: "🎥" }].map((btn, idx) => (
              <button
                key={idx}
                type="button"
                className="flex items-center px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
              >
                {btn.icon}
              </button>
            ))}

            {[{ format: "bold", active: isBold, icon: "𝗕" },
              { format: "italic", active: isItalic, icon: "𝘐" },
              { format: "underline", active: isUnderline, icon: "U̲" },
            ].map((btn) => (
              <button
                key={btn.format}
                type="button"
                onClick={() => handleFormatClick(btn.format)}
                className={`px-2 py-1 text-sm border rounded ${
                  btn.active ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                {btn.icon}
              </button>
            ))}

            {[
              { align: "left", icon: "⬅" },
              { align: "center", icon: "🔲" },
              { align: "right", icon: "➡" },
            ].map((btn) => (
              <button
                key={btn.align}
                type="button"
                onClick={() => setTextAlign(btn.align)}
                className={`px-2 py-1 text-sm border rounded ${
                  textAlign === btn.align ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                {btn.icon}
              </button>
            ))}

            {[{ icon: "🔗" }, { icon: "🔢" }].map((btn, idx) => (
              <button
                key={idx}
                type="button"
                className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
              >
                {btn.icon}
              </button>
            ))}
          </div>

          <div className="px-4 py-3">
            <textarea
              style={{ textAlign }}
              className={`w-full h-48 p-2 border border-gray-300 rounded focus:outline-none resize-none ${
                isBold ? "font-bold" : ""
              } ${isItalic ? "italic" : ""} ${isUnderline ? "underline" : ""}`}
              placeholder="Write your update..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex justify-end px-4 py-3">
            <button
              type="submit"
              className="px-6 py-2 bg-[#4B5842] text-white rounded-md hover:bg-[#3A4433] transition-colors"
            >
              Update
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default CampaignUpdate;