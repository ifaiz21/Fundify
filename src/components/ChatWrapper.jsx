import React, { useState } from 'react';
import Chatbot from './Chatbot.jsx'; // Explicitly added .jsx extension

const ChatWrapper = () => {
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);

  const toggleChatbox = () => {
    setIsChatboxOpen(!isChatboxOpen);
  };

  return (
    <>
      {/* Conditionally render the Chatbot */}
      {isChatboxOpen && <Chatbot onClose={toggleChatbox} />}

      {/* Chat Button - Fixed at the bottom right */}
      {!isChatboxOpen && (
      <div className="fixed bottom-8 right-8 z-50"> {/* Increased z-index to ensure it's on top */}
        <button
          onClick={toggleChatbox}
          className="bg-[#4B5842] text-white rounded-full p-3 shadow-lg">💬 Chat Support</button>
          {/* Chat icon 
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
        </button> */}
      </div>
      )}
    </>
  );
};

export default ChatWrapper;
