// src/context/UserContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    profilePictureUrl: null,
    isAuthenticated: false, // ADDED: Track authentication status
    id: null, // ADDED: Initialize id to null
    savedCampaigns: [], // ADDED: Initialize savedCampaigns as an empty array
  });
  const [loadingUserContext, setLoadingUserContext] = useState(true);

  // Fetch initial profile data when the app loads to populate context
  useEffect(() => {
    const fetchInitialProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadingUserContext(false);
        // Ensure savedCampaigns is reset when not authenticated
        setUserProfile(prev => ({ ...prev, isAuthenticated: false, id: null, savedCampaigns: [] }));
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(prev => ({
            ...prev,
            profilePictureUrl: data.profilePictureUrl ? `http://localhost:5000${data.profilePictureUrl}` : null,
            isAuthenticated: true, // User is authenticated
            id: data._id, // ADDED: Store the user's ID here
            // Populate saved campaigns: map to IDs for consistency with includes() checks
            savedCampaigns: data.savedCampaigns ? data.savedCampaigns.map(campaign => campaign._id) : [],
          }));
        } else {
          // If token is invalid or user not found, clear storage and mark as unauthenticated
          if (response.status === 401 || response.status === 403 || response.status === 404) {
            localStorage.removeItem('token');
            console.warn("Authentication token invalid or user profile not found.");
            // Ensure savedCampaigns is reset when unauthenticated
            setUserProfile(prev => ({ ...prev, isAuthenticated: false, id: null, savedCampaigns: [] }));
          } else {
            console.error("Failed to fetch initial user profile for context:", response.statusText);
            // Assume unauthenticated on other errors too, and ensure savedCampaigns is reset
            setUserProfile(prev => ({ ...prev, isAuthenticated: false, id: null, savedCampaigns: [] }));
          }
        }
      } catch (error) {
        console.error("Error fetching initial user profile for context:", error);
        // Assume unauthenticated on fetch error, and ensure savedCampaigns is reset
        setUserProfile(prev => ({ ...prev, isAuthenticated: false, id: null, savedCampaigns: [] }));
      } finally {
        setLoadingUserContext(false);
      }
    };

    fetchInitialProfile();
  }, []);

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile, loadingUserContext }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};