"use client"
import React from "react";
import { useState } from "react"
import Header from "./Layout/HeaderLayout";
import Footer from "./Layout/FooterLayout";

const FaqPage = () => {
  // State to track which FAQ item is expanded
  const [expandedIndex, setExpandedIndex] = useState(0)

  // FAQ data
  const faqItems = [
    {
      question: "What smart features does Fundify offer?",
      answer: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      ],
    },
    {
      question: "Is Fundify free?",
      answer: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
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
            <p className="text-sm text-gray-500 mb-2">FAQ</p>
            <h1 className="text-2xl font-bold mb-2">Any questions about Fundify?</h1>
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

