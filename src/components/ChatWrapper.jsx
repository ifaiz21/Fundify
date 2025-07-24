import React, { useState } from 'react';
import Chatbot from './Chatbot.jsx'; // Explicitly added .jsx extension

const ChatWrapper = () => {
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);

  const toggleChatbox = () => {
    setIsChatboxOpen(!isChatboxOpen);
  };

  return (
    <>
      {/* Conditionally render the Chatbot with animation */}
      {isChatboxOpen && (
        <div className="fixed inset-0 flex justify-end items-end p-4 z-50 animate-fadeInSlideUp">
          <Chatbot onClose={toggleChatbox} />
        </div>
      )}

      {/* Chat Button - Fixed at the bottom right, always visible */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChatbox}
          className="bg-gradient-to-br from-[#7bc3fc] to-[#2A6F6D] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-12 transition-all duration-300 ease-in-out"
        >
          {/* Show chat icon when closed, close icon when open */}
          {isChatboxOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 transition-transform duration-300"
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
          )}
        </button>
      </div>
    </>
  );
};

export default ChatWrapper;