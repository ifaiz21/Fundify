import React, { useState, useEffect, useRef } from 'react';

const Chatbot = ({ onClose }) => {
  // State to store chat messages
  // Each message object will have: { text: string, sender: 'user' | 'ai' }
  const [messages, setMessages] = useState([
    // Example initial messages (you can remove these or populate from your data)
    { text: 'My verification code has expired. Could you help me with that?', sender: 'user' },
    { text: 'Sure! Choose the "request new code" option. Then check your email or phone messages.', sender: 'ai' },
  ]);
  // State for the current message being typed by the user
  const [inputMessage, setInputMessage] = useState('');
  // Ref to automatically scroll to the bottom of the chat
  const messagesEndRef = useRef(null);

  // Scroll to the latest message whenever messages state updates
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to scroll the chat container to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to handle sending a user message
  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return; // Don't send empty messages

    const newUserMessage = { text: inputMessage, sender: 'user' };
    // Add user's message to the chat
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage(''); // Clear input field

    // --- IMPORTANT ---
    // This is where you would integrate your existing chatbot logic.
    // For example, you might call a function here that sends `newUserMessage.text`
    // to your trained model and, upon receiving a response, add it to the messages state:
    //
    // yourChatbotModel.getResponse(newUserMessage.text).then(aiResponse => {
    //   setMessages(prevMessages => [...prevMessages, { text: aiResponse, sender: 'ai' }]);
    // });
    // --- END IMPORTANT ---
  };

  // Handle Enter key press in the input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    // Main container for the chatbot, positioned prominently on the right side
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex justify-center items-center">
      {/* Adjusted width and height for a smaller box */}
      <div className="relative w-[320px] h-[480px] bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden">
        {/* Chatbot Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-2">
            {/* AI ChatBot Icon */}
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
            {/* AI ChatBot Title */}
            <h2 className="text-lg font-semibold text-gray-800">AI ChatBot</h2>
          </div>
          {/* Close button - now uses the onClose prop */}
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'ai' && (
                // AI Avatar placeholder (you can replace with an actual image)
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center mr-2 text-blue-700 font-bold flex-shrink-0">
                  AI
                </div>
              )}
              <div
                className={`max-w-[70%] p-3 rounded-xl shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-white text-gray-800 rounded-br-none' // User message styling
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-bl-none' // AI message styling
                }`}
              >
                {message.text}
              </div>
              {message.sender === 'user' && (
                // User Avatar placeholder (you can replace with an actual image)
                <img
                  src="https://placehold.co/32x32/E0E0E0/333333?text=You"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full ml-2 object-cover flex-shrink-0"
                />
              )}
            </div>
          ))}
          {/* Empty div to scroll into view */}
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
