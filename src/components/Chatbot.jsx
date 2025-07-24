// src/components/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";

const Chatbot = ({ onClose }) => {
  // State to store chat messages
  const [messages, setMessages] = useState([]);
  // State for the current message being typed by the user
  const [input, setInput] = useState("");
  // Ref to automatically scroll to the bottom of the chat
  const messagesEndRef = useRef(null);
  // State to control emoji picker visibility
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // State to show/hide the "Typing..." indicator
  const [isTyping, setIsTyping] = useState(false);
  // New state: controls visibility of predefined questions after first interaction
  const [hasInteracted, setHasInteracted] = useState(false);

  // Define predefined questions for the buttons
  const predefinedQuestions = [
    "What is Fundify?",
    "How do I create a campaign?",
    "How do I donate?",
    "What is KYC?",
    "How can I contact support?",
  ];

  // Common emojis for the picker
  const emojis = [
    "😊", "😂", "👍", "❤️", "🙏",
    "🎉", "💡", "🚀", "🌟", "🔥",
    "👋", "✅", "❌", "🤔", "😊"
  ];

  // Generate a unique session ID for the user's current chat session.
  const [sessionId] = useState(() => {
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
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'; // Fallback for local dev

  // Log the resolved backendUrl on component mount
  useEffect(() => {
    console.log("Chatbot Component Mounted.");
    console.log("process.env.REACT_APP_BACKEND_URL:", process.env.REACT_APP_BACKEND_URL);
    console.log("Resolved backendUrl for fetch calls:", backendUrl);
  }, [backendUrl]);

  // Scroll to the latest message whenever messages state updates
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]); // Re-scroll when typing indicator appears/disappears

  // Function to scroll the chat container to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to handle sending a user message
  const handleSendMessage = async (messageText) => {
    if (messageText.trim() === "") return;

    // Set hasInteracted to true as soon as a message is sent
    setHasInteracted(true);

    const newUserMessage = { text: messageText, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput("");
    setShowEmojiPicker(false); // Hide emoji picker after sending message

    // Show typing indicator
    setIsTyping(true);

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
        let errorDetails = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorDetails = errorData.message || JSON.stringify(errorData);
          console.error("Backend error response data:", errorData);
        } catch (jsonError) {
          console.error("Could not parse error response as JSON:", jsonError);
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
    } finally {
      // Hide typing indicator regardless of success or failure
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(input);
    }
  };

  // Function to add emoji to input field
  const addEmojiToInput = (emoji) => {
    setInput(prevInput => prevInput + emoji);
  };

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex justify-center items-center font-inter">
      {/* Increased height to h-[600px] and overall width to w-[380px] */}
      <div className="relative w-[380px] h-[600px] bg-[#222B45] rounded-3xl shadow-xl flex flex-col overflow-hidden border border-white/10">
        {/* Chatbot Header - Dark background, white text */}
        <div className="flex flex-col p-4 bg-[#111827] border-b border-[#313B5B]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Fundify Logo in a circle with active indicator */}
              <div className="relative w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src="/Images/Chatbot-Logo.jpeg"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/transparent/white?text=LOGO_ERR"; }}
                  alt="Fundify Logo"
                  className="w-full h-full object-cover rounded-full"
                />
                {/* Green active dot - Adjusted border to match header background */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111827]"></div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-white">Fundify Chatbot</h2>
                <span className="text-xs text-gray-400">Online Now</span>
              </div>
            </div>
            {/* Close button - White color */}
            <button
              className="text-white hover:text-gray-300"
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
        </div>

        {/* Chat Messages Area - Darker background for chat body and hidden scrollbar */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1f2937] scrollbar-hide">
          {/* Predefined question buttons - conditionally rendered and left-aligned */}
          {!hasInteracted && (
            <div className="flex flex-col items-start space-y-2 mb-4">
              {predefinedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(question)}
                  className="bg-[#222B45] text-white px-4 py-2 rounded-full shadow-md border-2 border-white hover:bg-[#3D527B] transition-colors duration-200 text-sm max-w-[85%]"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-xl shadow-sm ${
                  message.sender === "user"
                    ? "bg-[#3D527B] text-white rounded-br-none"
                    : "bg-[#4B5842] text-white rounded-bl-none"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[70%] p-3 rounded-xl shadow-sm bg-[#4B5842] text-white rounded-bl-none">
                Typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Area - Darker background for input with top border */}
        <div className="p-4 bg-[#111827] border-t border-white/10 flex items-center space-x-2 relative">
          {/* Input field wrapper with smiley icon */}
          <div className="flex-1 flex items-center bg-[#2C3759] text-white rounded-full border border-[#3D527B] px-3 py-2">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex-shrink-0 p-1 -ml-1 focus:outline-none"
            >
              <img
                src="/Images/smiley-icon.png"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/24x24/transparent/white?text=😊"; }}
                alt="Smiley Icon"
                className="w-5 h-5 object-contain cursor-pointer"
              />
            </button>
            <input
              type="text"
              className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none pl-2 pr-1"
              placeholder="Type something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <button
            onClick={() => handleSendMessage(input)}
            className="bg-[#3366FF] hover:bg-[#255EEF] text-white p-3 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg transition-colors duration-200"
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

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 mb-2 p-2 bg-[#2C3759] rounded-lg shadow-lg grid grid-cols-5 gap-1 z-10">
              {emojis.map((emoji, index) => (
                <span
                  key={index}
                  className="cursor-pointer text-2xl hover:bg-[#3D527B] rounded p-1"
                  onClick={() => addEmojiToInput(emoji)}
                >
                  {emoji}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;