// src/components/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";

const Chatbot = ({ onClose }) => {
  // State to store chat messages
  const [messages, setMessages] = useState([
    {
      text: "Hello! How can I help you with Fundify?",
      sender: "ai", // Start with a bot greeting
    },
  ]);
  // State for the current message being typed by the user
  const [inputMessage, setInputMessage] = useState("");
  // Ref to automatically scroll to the bottom of the chat
  const messagesEndRef = useRef(null);

  // Generate a unique session ID for the user's current chat session.
  const [sessionId, setSessionId] = useState(() => {
    const storedSessionId = localStorage.getItem('chatbotSessionId');
    if (storedSessionId) {
      console.log("Chatbot: Using stored session ID:", storedSessionId);
      return storedSessionId;
    }
    const newSessionId = 'session-' + Math.random().toString(36).substring(2, 15) + Date.now();
    localStorage.setItem('chatbotSessionId', newSessionId);
    console.log("Chatbot: Generated new session ID:", newSessionId);
    return newSessionId;
  });

  // Determine the backend URL dynamically based on environment variables.
  // IMPORTANT: Ensure your .env.development or .env.production file in the React app root
  // has REACT_APP_BACKEND_URL set correctly (e.g., http://localhost:5000 or https://your-railway-backend.app)
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'; // Fallback for local dev

  // Log the resolved backendUrl on component mount
  useEffect(() => {
    console.log("Chatbot Component Mounted.");
    console.log("process.env.REACT_APP_BACKEND_URL:", process.env.REACT_APP_BACKEND_URL);
    console.log("Resolved backendUrl for fetch calls:", backendUrl);
  }, [backendUrl]); // Re-run if backendUrl somehow changes (unlikely for this setup)

  // Scroll to the latest message whenever messages state updates
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to scroll the chat container to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to handle sending a user message
  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return; // Don't send empty messages

    const newUserMessage = { text: inputMessage, sender: "user" };
    // Add user's message to the chat immediately for optimistic UI update
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage(""); // Clear input field

    // Construct the full API endpoint URL
    const apiEndpoint = `${backendUrl}/api/users/chatbot`;
    console.log("Attempting to send message to API:", apiEndpoint);
    console.log("Payload:", { sessionId: sessionId, text: newUserMessage.text, languageCode: "en" });

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionId,
          text: newUserMessage.text,
          languageCode: "en",
        }),
      });

      console.log("Fetch response received. Status OK:", response.ok, "Status:", response.status);

      if (!response.ok) {
        // If the response status is not OK (e.g., 400, 500), try to get error details
        let errorDetails = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorDetails = errorData.message || JSON.stringify(errorData);
          console.error("Backend error response data:", errorData);
        } catch (jsonError) {
          console.error("Could not parse error response as JSON:", jsonError);
          // If it's not JSON, maybe it's plain text or HTML error
          const textError = await response.text();
          errorDetails = `HTTP error! status: ${response.status}. Response text: ${textError.substring(0, 100)}...`;
        }
        throw new Error(errorDetails);
      }

      const data = await response.json();
      console.log("Successful API response data:", data);

      const aiResponse = { text: data.response, sender: "ai" };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);

    } catch (error) {
      console.error("Error communicating with chatbot backend:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Oops! Something went wrong: ${error.message}. Please try again.`, sender: "ai" },
      ]);
    }
  };

  // Handle Enter key press in the input field
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex justify-center items-center">
      <div className="relative w-[320px] h-[480px] bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden">
        {/* Chatbot Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 rounded-full p-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.276-1.192A9.957 9.957 0 012 15V8a8 8 0 018-8c4.418 0 8 3.134 8 7zM2 11.929V15l-1.659 1.659a2 2 0 00.707 3.336l.707.354A2 2 0 004 20h12a2 2 0 002-2v-2.071A8 8 0 0110 18c-2.453 0-4.662-.734-6.38-2.071z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">AI ChatBot</h2>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "ai" && (
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center mr-2 text-blue-700 font-bold flex-shrink-0">
                  AI
                </div>
              )}
              <div
                className={`max-w-[70%] p-3 rounded-xl shadow-sm ${
                  message.sender === "user"
                    ? "bg-white text-gray-800 rounded-br-none"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-bl-none"
                }`}
              >
                {message.text}
              </div>
              {message.sender === "user" && (
                <img
                  src="https://placehold.co/32x32/E0E0E0/333333?text=You"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full ml-2 object-cover flex-shrink-0"
                />
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Area */}
        <div className="p-4 bg-white border-t border-gray-200 flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Send a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
          >
            <svg
              className="w-6 h-6 transform rotate-90"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 00.183 1.112c.33.29.742.427 1.154.427H15.33a1 1 0 001.154-.427 1 1 0 00.183-1.112l-7-14z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
