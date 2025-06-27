// src/context/UserContext.jsx
"use client";
import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    profilePictureUrl: null,
    isAuthenticated: false,
    id: null,
    savedCampaigns: [],
    kycStatus: null, // ADDED: Initialize kycStatus
  });
  const [loadingUserContext, setLoadingUserContext] = useState(true);

  useEffect(() => {
    const fetchInitialProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadingUserContext(false);
        setUserProfile(prev => ({ ...prev, isAuthenticated: false, id: null, savedCampaigns: [], kycStatus: null })); // Reset kycStatus
        return;
      }

      try {
        const response = await fetch('https://server-fundify.up.railway.app/api/users/profile', {
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
            profilePictureUrl: data.profilePictureUrl ? `https://server-fundify.up.railway.app${data.profilePictureUrl}` : null,
            isAuthenticated: true, // User is authenticated
            id: data._id, // ADDED: Store the user's ID here
            // Populate saved campaigns: map to IDs for consistency with includes() checks
            savedCampaigns: data.savedCampaigns ? data.savedCampaigns.map(campaign => campaign._id) : [],
            kycStatus: data.kycStatus || 'Not Submitted', // ADDED: Retrieve kycStatus from backend data
          }));
        } else {
          if (response.status === 401 || response.status === 403 || response.status === 404) {
            localStorage.removeItem('token');
            console.warn("Authentication token invalid or user profile not found.");
            setUserProfile(prev => ({ ...prev, isAuthenticated: false, id: null, savedCampaigns: [], kycStatus: null })); // Reset kycStatus
          } else {
            console.error("Failed to fetch initial user profile for context:", response.statusText);
            setUserProfile(prev => ({ ...prev, isAuthenticated: false, id: null, savedCampaigns: [], kycStatus: null })); // Reset kycStatus
          }
        }
      } catch (error) {
        console.error("Error fetching initial user profile for context:", error);
        setUserProfile(prev => ({ ...prev, isAuthenticated: false, id: null, savedCampaigns: [], kycStatus: null })); // Reset kycStatus
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