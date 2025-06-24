// src/components/ConditionalChatWrapper.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import ChatWrapper from './ChatWrapper'; // Import your actual ChatWrapper component

function ConditionalChatWrapper() {
  const location = useLocation(); // Get the current URL location

  // Define the paths where ChatWrapper should NOT be shown
  const excludedPaths = [
    '/login',
    '/sign-up',
    '/forget-password',
    '/email-verification',
    '/password-reset',
    '/success',
    '/code-verification',
    '/submitted',
    '/submit-2',
    '/set-password',
    '/admin-dashboard',
    '/admin/users',
    '/admin/donations',
    '/admin/wallet',
    '/admin/campaigns',
    '/admin/verifications',
    '/admin/feedbacks',
    '/billing' // Add billing if you want to exclude it too
  ];

  // Check if the current path is in the excluded list
  const shouldShowChat = !excludedPaths.some(path => location.pathname.startsWith(path));

  // Render ChatWrapper only if it should be shown
  return shouldShowChat ? <ChatWrapper /> : null;
}

export default ConditionalChatWrapper;