// src/Pages/UserProfileSettings.jsx
"use client"
import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import HeaderLayout from "./Layout/HeaderLayout" // Assuming this path is correct
import FooterLayout from "./Layout/FooterLayout" // Assuming this path is correct
import { useUser } from '../context/UserContext';
import SideBar from '../components/SideBar';

function UserProfileSettings({ showToast }) {
  const { userProfile, setUserProfile, loadingUserContext } = useUser();

  const [profileData, setProfileData] = useState({
    fullName: "",
    userId: "",
    email: "",
    contactNo: "",
    createdCampaigns: 0,
    backedCampaigns: 0,
    profilePictureUrl: "",
  })

  const [additionalEmails, setAdditionalEmails] = useState([])
  const [newEmail, setNewEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  const [isProfileEditMode, setIsProfileEditMode] = useState(false);

  const [isAddingEmail, setIsAddingEmail] = useState(false)
  const [editedProfile, setEditedProfile] = useState({ ...profileData })
  const [showConfirmLogout, setShowConfirmLogout] = useState(false)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [activeMenuItem, setActiveMenuItem] = useState("Profile");

  const navigate = useNavigate()

  useEffect(() => {
    if (!loadingUserContext) {
      if (!userProfile.isAuthenticated) {
        setError("No authentication token found or session expired. Please log in.");
        navigate("/login");
        return;
      } else {
        if (!profileData.userId) {
          const fetchUserProfileDetails = async () => {
            setLoading(true);
            setError(null);
            try {
              const token = localStorage.getItem('token');

              const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              });

              if (!response.ok) {
                if (response.status === 401 || response.status === 403 || response.status === 404) {
                    localStorage.removeItem('token');
                    setUserProfile(prev => ({ ...prev, profilePictureUrl: null, isAuthenticated: false }));
                    navigate("/login");
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch profile details');
              }

              const data = await response.json();
              console.log("Fetched initial profile data:", data);

              const fetchedProfile = {
                fullName: data.name,
                userId: data._id,
                email: data.email,
                contactNo: data.contactNo || '',
                createdCampaigns: data.createdCampaigns || 0,
                backedCampaigns: data.backedCampaigns || 0,
                profilePictureUrl: data.profilePictureUrl || '',
              };

              setProfileData(fetchedProfile);
              setEditedProfile({ ...fetchedProfile });
              setAdditionalEmails(data.additionalEmails || []);
              setProfileImagePreview(data.profilePictureUrl ? `http://localhost:5000${data.profilePictureUrl}` : null);

              if (!data.name || !data.contactNo) {
                setIsProfileEditMode(true);
              } else {
                setIsProfileEditMode(false);
              }

            } catch (err) {
              console.error("Fetch user profile details error:", err);
              setError(err.message || "Failed to load profile details.");
            } finally {
              setLoading(false);
            }
          };
          fetchUserProfileDetails();
        }
      }
    }
  }, [userProfile.isAuthenticated, loadingUserContext, navigate, profileData.userId, setUserProfile]);

  const handleProfileEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedProfileImage(null);
      setProfileImagePreview(profileData.profilePictureUrl ? `http://localhost:5000${profileData.profilePictureUrl}` : null);
    }
  };

  const handleProfilePictureSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast("No authentication token found. Please log in.", "error");
        navigate("/login");
        return;
      }

      const formDataToSend = new FormData();

      if (!selectedProfileImage) {
        showToast("Please select a new photo to save.", "info");
        setLoading(false);
        return;
      }
      formDataToSend.append('profilePicture', selectedProfileImage);

      const response = await fetch('http://localhost:5000/api/users/profile-picture', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile picture');
      }

      const updatedData = await response.json();
      console.log("Received data from backend after picture save:", updatedData);

      const updatedBackendUser = updatedData.user;
      const newPicPath = updatedBackendUser.profilePictureUrl;
      const newPicUrl = newPicPath ? `http://localhost:5000${newPicPath}` : null;

      setProfileData(prev => ({
        ...prev,
        profilePictureUrl: newPicPath || '',
      }));
      setEditedProfile(prev => ({
        ...prev,
        profilePictureUrl: newPicPath || '',
      }));
      setProfileImagePreview(newPicUrl);
      setSelectedProfileImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      setUserProfile(prev => ({ ...prev, profilePictureUrl: newPicUrl }));

      showToast("Profile picture saved successfully!", "success");
    } catch (err) {
      console.error("Save profile picture error:", err);
      setError(err.message || "Failed to save profile picture.");
      showToast(`Error saving profile picture: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast("No authentication token found. Please log in.", "error");
        navigate("/login");
        return;
      }

      const response = await fetch('http://localhost:5000/api/users/profile-picture', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove profile picture');
      }

      const updatedData = await response.json();
      console.log("Received data from backend after picture removal:", updatedData);

      const updatedBackendUser = updatedData.user;
      const newPicPath = updatedBackendUser.profilePictureUrl;
      const newPicUrl = newPicPath ? `http://localhost:5000${newPicPath}` : null;


      setProfileData(prev => ({
        ...prev,
        profilePictureUrl: newPicPath || '',
      }));
      setEditedProfile(prev => ({
        ...prev,
        profilePictureUrl: newPicPath || '',
      }));
      setProfileImagePreview(null);
      setSelectedProfileImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      setUserProfile(prev => ({ ...prev, profilePictureUrl: newPicUrl }));

      showToast("Profile picture removed successfully!", "success");
    } catch (err) {
      console.error("Remove profile picture error:", err);
      setError(err.message || "Failed to remove profile picture.");
      showToast(`Error removing profile picture: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };


  const handleProfileDetailsSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast("No authentication token found. Please log in.", "error");
        navigate("/login");
        return;
      }

      const dataToUpdate = {
        fullName: editedProfile.fullName,
        contactNo: editedProfile.contactNo,
        additionalEmails: JSON.stringify(additionalEmails),
      };

      console.log("Data to send for profile details update:", dataToUpdate);

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToUpdate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save profile details');
      }

      const updatedData = await response.json();
      console.log("Received data from backend after profile details save:", updatedData);

      const updatedBackendUser = updatedData.user;

      setProfileData(prev => ({
        ...prev,
        fullName: updatedBackendUser.name,
        contactNo: updatedBackendUser.contactNo || '',
        additionalEmails: updatedBackendUser.additionalEmails || [],
      }));

      setEditedProfile(prev => ({
        ...prev,
        fullName: updatedBackendUser.name,
        contactNo: updatedBackendUser.contactNo || '',
        additionalEmails: updatedBackendUser.additionalEmails || [],
      }));

      setAdditionalEmails(updatedBackendUser.additionalEmails || []);
      setIsProfileEditMode(false);
      setIsAddingEmail(false);

      showToast("Profile details saved successfully!", "success");
    } catch (err) {
      console.error("Save profile details error:", err);
      setError(err.message || "Failed to save profile details.");
      showToast(`Error saving profile details: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleProfileEditMode = () => {
    setIsProfileEditMode(prev => !prev);
    if (!isProfileEditMode) {
      setEditedProfile({
        ...profileData,
        additionalEmails: profileData.additionalEmails || []
      });
      setAdditionalEmails(profileData.additionalEmails || []);
    } else {
      setEditedProfile({
        ...profileData,
        fullName: profileData.fullName,
        contactNo: profileData.contactNo,
        additionalEmails: profileData.additionalEmails || []
      });
      setAdditionalEmails(profileData.additionalEmails || []);
      setNewEmail("");
      setEmailError("");
      setIsAddingEmail(false);
    }
  };

  const handleKYC = () => {
    console.log("KYC verification logic here")
    showToast("KYC verification functionality coming soon!", "info");
  }

  const handleAddEmailClick = () => {
    setIsAddingEmail(true)
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
  }

  const handleAddEmail = () => {
    if (!newEmail) {
      setEmailError("Email is required")
      return
    }

    if (!validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address")
      return
    }

    if (newEmail === profileData.email || additionalEmails.includes(newEmail)) {
      setEmailError("This email is already added")
      return
    }

    setAdditionalEmails([...additionalEmails, newEmail])
    setNewEmail("")
    setEmailError("")
    setIsAddingEmail(false)
  }

  const handleRemoveEmail = (emailToRemove) => {
    setAdditionalEmails(additionalEmails.filter((email) => email !== emailToRemove))
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setShowConfirmLogout(false)
    setUserProfile(prev => ({ ...prev, profilePictureUrl: null, isAuthenticated: false }));
    navigate("/login")
  }

  const handleMenuItemClick = (itemName) => {
    setActiveMenuItem(itemName);
    if (itemName === "Logout") {
      setShowConfirmLogout(true);
    } else if (itemName === "Profile") {
        // Already on this page, no navigation needed
    } else if (itemName === "My Campaigns") {
        navigate("/my-campaigns");
    } else if (itemName === "Billing") {
        navigate("/billing");
    } else if (itemName === "Notifications") {
        navigate("/notifications");
    }
  };

  if (loading || loadingUserContext) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error && !userProfile.isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
        <p className="text-red-600 text-xl mb-4">Error: {error}</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-[#4A5D45] text-white py-2 px-4 rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLayout hideProfile={true}/>

      <div className="flex flex-grow bg-gray-50">
        <SideBar activeItem={activeMenuItem} onItemClick={handleMenuItemClick} handleLogout={() => setShowConfirmLogout(true)} />

        <main className="flex-grow container mx-auto px-4 py-6">
          {activeMenuItem === "Profile" && (
            <>
              <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

              {/* Profile Picture Section */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
                <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
                <div className="w-40 h-40 rounded-full mx-auto overflow-hidden border-2 border-gray-300 flex items-center justify-center cursor-pointer relative group">
                  <img
                    src={profileImagePreview || "/Images/default-avatar.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/Images/default-avatar.png";
                    }}
                  />
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {profileImagePreview ? 'Change Photo' : 'Upload Photo'}
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfileImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-sm text-gray-600 mt-2">
                  {profileImagePreview ? 'Click picture to change' : 'No photo uploaded'}
                </p>

                <div className="mt-4 flex justify-center space-x-4">
                  {selectedProfileImage && (
                    <button
                      onClick={handleProfilePictureSave}
                      className="bg-[#4A5D45] text-white py-2 px-4 rounded text-sm"
                    >
                      Save Photo
                    </button>
                  )}
                  {(profileData.profilePictureUrl || selectedProfileImage) && (
                    <button
                      onClick={handleRemoveProfilePicture}
                      className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded text-sm"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>

              {/* Profile Details Section */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-semibold">Profile Details</h2>
                  <div className="space-y-2">
                    {isProfileEditMode ? (
                      <div className="flex space-x-2">
                        <button onClick={handleProfileDetailsSave} className="bg-[#4A5D45] text-white py-2 px-4 rounded text-sm">Save</button>
                        <button onClick={toggleProfileEditMode} className="bg-gray-300 text-gray-700 py-2 px-4 rounded text-sm">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={toggleProfileEditMode} className="w-full bg-[#4A5D45] text-white py-2 px-4 rounded text-sm">Edit</button>
                    )}
                    <button onClick={handleKYC} className="w-full bg-[#4A5D45] text-white py-2 px-4 rounded text-sm">KYC</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    {isProfileEditMode ? (
                      <input type="text" name="fullName" value={editedProfile.fullName} onChange={handleProfileEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500" />
                    ) : (
                      <div className="text-gray-600 font-medium">{profileData.fullName}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="text-blue-500 font-medium">{profileData.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact No</label>
                    {isProfileEditMode ? (
                      <input type="text" name="contactNo" value={editedProfile.contactNo} onChange={handleProfileEditChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500" />
                    ) : (
                      <div className="text-blue-500 font-medium">{profileData.contactNo}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                    <div className="text-gray-600 font-medium break-all">{profileData.userId}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created Campaigns</label>
                    <div className="text-gray-600 font-medium">{profileData.createdCampaigns}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Backed Campaigns</label>
                    <div className="text-gray-600 font-medium">{profileData.backedCampaigns}</div>
                  </div>
                </div>

                {/* Additional Emails section */}
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-3">Additional Emails</h3>
                  {additionalEmails.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {additionalEmails.map((email, index) => (
                        <div key={index} className="flex justify-between items-center text-blue-500 text-sm">
                          <span>{email}</span>
                          {isProfileEditMode && (
                            <button onClick={() => handleRemoveEmail(email)} className="text-red-500 hover:text-red-700 ml-2">
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm mb-4">No additional emails added.</p>
                  )}

                  {isProfileEditMode && (
                    isAddingEmail ? (
                      <div className="mt-2 flex items-center">
                        <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Enter new email" className="flex-grow border border-gray-300 rounded-l px-3 py-1 focus:ring-green-500 text-sm" />
                        <button onClick={handleAddEmail} className="bg-[#4A5D45] text-white px-3 py-1 rounded-r text-sm">Add</button>
                      </div>
                    ) : (
                      <button onClick={handleAddEmailClick} className="text-blue-500 text-sm flex items-center mt-2">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Email Address
                      </button>
                    )
                  )}
                  {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                </div>
              </div>
            </>
          )}

          {activeMenuItem === "Notifications" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold">Notifications (Coming Soon)</h2>
            </div>
          )}
        </main>
      </div>

      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Sign Out</h2>
            <p className="mb-6">Are you sure you want to sign out?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirmLogout(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="bg-[#4b5945] text-white px-4 py-2 rounded"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterLayout />
    </div>
  )
}

export default UserProfileSettings;