// src/components/ToastNotification.jsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const ToastNotification = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          onClose();
        }
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message, duration, onClose]);

  if (!isVisible) return null;

  // Determine styling based on type (success, error, info, etc.)
  let bgColor = 'bg-green-500'; // Default to success, will be overridden below

  // MODIFIED: Use Tailwind's arbitrary value syntax for custom color for success
  if (type === 'success') bgColor = 'bg-[#4A5D45]'; // Changed default green to #4A5D45
  else if (type === 'error') bgColor = 'bg-red-500';
  else if (type === 'info') bgColor = 'bg-blue-500';


  // Using ReactDOM.createPortal to render the toast outside the normal DOM hierarchy
  // This helps with z-index and ensures it's truly centered on top of everything.
  return ReactDOM.createPortal(
    <div
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4 rounded-lg shadow-xl text-white text-center min-w-[280px] transition-all duration-300 ease-in-out ${bgColor} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      role="alert"
      aria-live="assertive"
    >
      <p className="font-semibold text-lg">{message}</p>
      {/* Optional: Add a close button if you want immediate dismissal */}
      {/* <button onClick={() => setIsVisible(false)} className="absolute top-1 right-2 text-white text-lg font-bold">&times;</button> */}
    </div>,
    document.body // Render into the body element
  );
};

export default ToastNotification;