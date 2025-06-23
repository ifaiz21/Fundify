// src/context/UserContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // REMOVE: useNavigate from here

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    profilePictureUrl: null,
    isAuthenticated: false, // ADDED: Track authentication status
    id: null, // ADDED: Initialize id to null
  });
  const [loadingUserContext, setLoadingUserContext] = useState(true);
  // const navigate = useNavigate(); // REMOVE: Get navigate function here

  // Fetch initial profile data when the app loads to populate context
  useEffect(() => {
    const fetchInitialProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadingUserContext(false);
        setUserProfile(prev => ({ ...prev, isAuthenticated: false, id: null })); // Set authenticated to false and id to null
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
          }));
        } else {
          // If token is invalid or user not found, clear storage and mark as unauthenticated
          if (response.status === 401 || response.status === 403 || response.status === 404) {
            localStorage.removeItem('token');
            console.warn("Authentication token invalid or user profile not found.");
            setUserProfile(prev => ({ ...prev, isAuthenticated: false, id: null })); // Mark as unauthenticated and id to null
            // No direct navigate here. Components consuming context will react.
          } else {
            console.error("Failed to fetch initial user profile for context:", response.statusText);
            setUserProfile(prev => ({ ...prev, isAuthenticated: false, id: null })); // Assume unauthenticated on other errors too, and id to null
          }
        }
      } catch (error) {
        console.error("Error fetching initial user profile for context:", error);
        setUserProfile(prev => ({ ...prev, isAuthenticated: false, id: null })); // Assume unauthenticated on fetch error, and id to null
      } finally {
        setLoadingUserContext(false);
      }
    };

    fetchInitialProfile();
  }, []); // Removed navigate from dependency array as it's no longer used here

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile, loadingUserContext }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};