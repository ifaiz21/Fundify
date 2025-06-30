"use client"
import React from "react";
import { useState } from "react"
import Header from "./Layout/HeaderLayout";
import Footer from "./Layout/FooterLayout";

const FaqPage = () => {
  // State to track which FAQ item is expanded
  const [expandedIndex, setExpandedIndex] = useState(null);

  // FAQ data
  const faqItems = [
      {
          question: "What is Fundify?",
          answer: [
              "Fundify is a user-friendly crowdfunding platform designed to help individuals, teams, and organizations launch impactful fundraising campaigns.",
              "Creators can easily share their ideas, set funding goals, and receive support from people who believe in their vision. Donors can explore, support, and track campaigns through a secure interface, making giving simple and transparent."
          ],
      },
      {
          question: "What are the basics of creating a campaign?",
          answer: [
              "Fundify makes it simple to connect with donors. Here’s how it works:",
              "<strong>1. Create Your Campaign:</strong> Start by sharing your idea, project, or cause. Add a compelling title, description, images, and set a clear funding goal.",
              "<strong>2. Launch & Share:</strong> Once your campaign is ready, publish it and share the link across social media, emails, and with your entire community.",
              "<strong>3. Manage & Update:</strong> Keep your backers engaged by posting regular updates on your progress and milestones."
          ],
      },
      {
          question: "What can I use Fundify for?",
          answer: [
              "You can use Fundify to raise money for a wide variety of causes, including personal emergencies, medical bills, educational goals, non-profit initiatives, creative projects (like films or albums), and business startups. As long as your campaign is lawful and adheres to our community guidelines, you can start fundraising.",
          ],
      },
      {
          question: "How do I receive the funds I've raised?",
          answer: [
              "Once your campaign starts receiving donations, you can easily withdraw your funds. We partner with secure payment processors like Stripe to transfer the money directly to your linked bank account. A small platform fee and standard payment processing fees apply to each transaction.",
          ],
      },
  ];

  // Toggle FAQ item expansion
  const toggleItem = (index) => {
      setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
      <div className="faq-page flex flex-col min-h-screen bg-gray-50">
          <Header />

          <main className="flex-1 py-12 sm:py-16">
              <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                  <div className="text-center mb-10 sm:mb-12">
                      <h1 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">FAQ</h1>
                      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
                      <p className="text-gray-600 max-w-2xl mx-auto">
                          Find answers to common questions about how Fundify works.
                      </p>
                  </div>

                  {/* FAQ Accordion */}
                  <div className="faq-accordion space-y-4 mb-8">
                      {faqItems.map((item, index) => (
                          <div key={index} className={`faq-item rounded-lg shadow-sm ${expandedIndex === index ? "is-expanded" : ""}`}>
                              <button
                                  onClick={() => toggleItem(index)}
                                  className=" bg-[#A9BEA2] faq-question flex items-center justify-between w-full p-5 text-left"
                                  aria-expanded={expandedIndex === index}
                              >
                                  <span className="font-medium text-gray-800 text-lg">{item.question}</span>
                                  <span className="faq-icon-wrapper flex-shrink-0 ml-4">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                  </span>
                              </button>
                              <div className=" faq-answer-wrapper">
                                  <div className="faq-answer px-5 pb-1 text-gray-600">
                                      {item.answer.map((paragraph, i) => (
                                          <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: paragraph }} />
                                      ))}
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>

                  <div className="text-center mt-12">
                      <a href="/contact" className="contact-button font-medium">
                          Still have questions? <strong>Contact Us</strong>
                      </a>
                  </div>
              </div>
          </main>

          <Footer />
          
          <style jsx global>{`
              /* --- Google Font Import --- */
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

              /* --- General Styling & Variables --- */
              .faq-page {
                  font-family: 'Poppins', sans-serif;
                  --fundify-green: #4B5842;
                  --fundify-light-green: #A9BEA2;
                  --shadow-color: rgba(75, 88, 66, 0.1);
                  --border-color: #e5e7eb;
              }
              
              .faq-page h2 {
                  letter-spacing: -0.02em;
              }
              
              /* --- FAQ Accordion Styling --- */
              .faq-item {
                  background-color: white;
                  border: 1px solid var(--border-color);
                  transition: all 0.3s ease-in-out;
              }

              .faq-item:hover {
                  border-color: var(--fundify-light-green);
                  box-shadow: 0 4px 15px var(--shadow-color);
              }

              .faq-item.is-expanded {
                  background-color: #f9fafb; /* bg-gray-50 */
                  border-color: var(--fundify-green);
              }
              
              .faq-question {
                 cursor: pointer;
              }
              
              .faq-icon-wrapper svg {
                 color: var(--fundify-green);
              }
              
              .faq-item.is-expanded .faq-icon-wrapper svg {
                 transform: rotate(180deg);
              }
              
              .faq-answer-wrapper {
                 display: grid;
                 grid-template-rows: 0fr;
                 transition: grid-template-rows 0.4s ease-out;
              }
              
              .faq-item.is-expanded .faq-answer-wrapper {
                 grid-template-rows: 1fr;
              }
              
              .faq-answer {
                 overflow: hidden;
                 line-height: 1.7;
              }
              
              .faq-answer p:last-child {
                 margin-bottom: 0;
              }
              
              .faq-answer strong {
                 font-weight: 600;
                 color: var(--fundify-green);
                 display: block;
                 margin-top: 0.75rem;
              }
              
              /* --- Contact Button --- */
              .contact-button {
                 display: inline-block;
                 padding: 0.75rem 1.5rem;
                 background-color: #f3f4f6; /* bg-gray-200 */
                 color: #374151; /* text-gray-700 */
                 border-radius: 9999px;
                 transition: all 0.3s ease;
              }
              .contact-button:hover {
                 background-color: var(--fundify-light-green);
                 color: var(--fundify-green);
                 transform: translateY(-2px);
                 box-shadow: 0 4px 12px var(--shadow-color);
              }
              .contact-button strong {
                 font-weight: 600;
                 color: var(--fundify-green);
              }
               .contact-button:hover strong {
                 color: white;
              }
          `}</style>
      </div>
  )
}

export default FaqPage;

