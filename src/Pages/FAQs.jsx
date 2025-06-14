"use client"
import React from "react";
import { useState } from "react"
import Header from "./Layout/HeaderLayout";
import Footer from "./Layout/FooterLayout";

const FaqPage = () => {
  // State to track which FAQ item is expanded
  const [expandedIndex, setExpandedIndex] = useState()

  // FAQ data
  const faqItems = [
    {
      question: "What is Fundify?",
      answer: [
        "Fundify is a user-friendly crowdfunding platform designed to help individuals, teams, and organizations launch impactful fundraising campaigns. ",
        "• 💡 Campaign creators can easily share their ideas, set funding goals, and receive support from people who believe in their vision.",
        "• 🤝 Donors explore, support, and track campaigns through a secure and user-friendly interface, making giving simple and transparent."
      ],
    },
    {
      question: "What are the Basics?",
      answer: ["Fundify is a modern crowdfunding platform that connects campaign creators with donors who want to support meaningful causes or innovative ideas. Here's a simple breakdown of how it works:",
              <strong>👤 For Campaign Creators</strong>,
              <strong>1. Create a Campaign </strong>,
              "Start by sharing your idea, project, or cause (e.g., a tech gadget, medical need, educational goal, or social cause). ",
              <strong>2. Describe Your Story</strong>,
              "Add a title, description, images/videos, and funding goal to help people understand your mission. ",
              <strong>3. Launch & Share </strong>,
              " Once the campaign is ready, publish it and share the link on social media, emails, and with your community.",
              <strong>💳 For Donors </strong>,
              <strong>1. Explore Campaigns </strong>,
              "Browse campaigns based on category, popularity, or recommendations.",
              <strong>2. Choose & Donate </strong>,
              "Read the story, view progress, and contribute using secure online payment options.",
              <strong>3. Follow Progress </strong>,
              " Stay updated on how your donation is being used through creator updates and milestones.",
      ],
    },
    {
      question: "What can I use Fundify for?",
      answer: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
    },
    {
      question: "How can I list my campaign on Fundify?",
      answer: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
    },
  ]

  // Toggle FAQ item expansion
  const toggleItem = (index) => {
    setExpandedIndex(expandedIndex === index ? -1 : index)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl text-bold text-gray-500 mb-2">FAQ</h1>
            <h2 className="text-2xl font-bold mb-2">Any questions about Fundify?</h2>
            <p className="text-gray-600">
              Understand how Fundify works, change the way you showcase your ideas forever
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4 mb-8">
            {faqItems.map((item, index) => (
              <div key={index} className={`rounded-md ${expandedIndex === index ? "bg-[#A9BEA2]" : "bg-[#A9BEA2]/70"}`}>
                <button
                  onClick={() => toggleItem(index)}
                  className="flex items-center justify-between w-full p-4 text-left"
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-[#020202]">•</span>
                    <span className="font-medium text-[#000000]">{item.question}</span>
                  </div>
                  <span className="text-[#4B5842] text-xl">{expandedIndex === index ? "×" : "+"}</span>
                </button>

                {expandedIndex === index && (
                  <div className="px-12 pb-4 text-[#4B5842]">
                    {item.answer.map((paragraph, i) => (
                      <p key={i} className="mb-2">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="text-[#000000] text-sm font-medium hover:underline">Read more</button>
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

export default FaqPage;

