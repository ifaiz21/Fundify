// src/Pages/KYC/KYCLivenessVerification.jsx
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccessMessage, showErrorMessage } from '../../utils/toast';

function KYCLivenessVerification() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const startCamera = async () => {
    setCapturedImage(null); // Clear any previous image
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      showErrorMessage("Failed to access camera. Please ensure camera permissions are granted.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/jpeg'); // Capture as JPEG
      setCapturedImage(imageDataUrl);
      stopCamera(); // Stop camera after capturing
    }
  };

  const retakeImage = () => {
    setCapturedImage(null);
    startCamera(); // Restart camera for retake
  };

  const handleSubmitForVerification = async () => {
    if (!capturedImage) {
      showErrorMessage("Please activate the camera and capture an image first.");
      return;
    }

    setLoading(true);

    // --- START OF CHANGES ---
    const token = localStorage.getItem('token'); // Retrieve the authentication token
    if (!token) {
      showErrorMessage("Authentication required. Please log in.");
      navigate("/login"); // Redirect to login if no token is found
      setLoading(false);
      return;
    }
    // --- END OF CHANGES ---

    try {
      const blob = await fetch(capturedImage).then(res => res.blob());
      const formData = new FormData();
      formData.append('livenessImage', blob, 'liveness.jpeg');
      // The backend uses req.user.id from the token, so you don't need to append userId here.
      // If your backend specifically expects a userId field on formData, you would get it from a user context or similar.
      // formData.append('userId', 'USER_ID_HERE');

      const response = await fetch('http://localhost:5000/api/users/kyc/submit-liveness', {
        method: 'POST',
        // --- START OF CHANGES ---
        headers: {
          'Authorization': `Bearer ${token}`, // Add the Authorization header
        },
        // --- END OF CHANGES ---
        body: formData,
      });

      if (response.ok) {
        showSuccessMessage("Liveness image submitted for verification!");
        navigate('/user-profile'); // Navigate to user profile or a success page
      } else {
        const errorData = await response.json();
        showErrorMessage(`Verification failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Error submitting for verification:", err);
      showErrorMessage("An error occurred during submission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Stop camera stream when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, );

  return (
    <div className="flex flex-col min-h-screen">
      {/* <HeaderLayout hideProfile={true} /> Removed */}

      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Liveness Image Verification</h1>
          <p className="text-gray-600 text-sm mb-6 text-center max-w-2xl mx-auto">
            Please capture a real-time image of yourself using your front camera to verify your presence during the KYC process.
            Ensure the image meets the required quality standards: good lighting, clear visibility of the face, and no obstructions.
          </p>

          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-full max-w-sm aspect-square bg-gray-100 rounded-full overflow-hidden border-4 border-[#A9BEA2] flex items-center justify-center">
              {capturedImage ? (
                <img src={capturedImage} alt="Captured Liveness" className="w-full h-full object-cover rounded-full" />
              ) : (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-full"></video>
              )}
              {!isCameraActive && !capturedImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                  <p>Camera not active</p>
                  <button
                    onClick={startCamera}
                    className="mt-2 bg-[#4A5D45] text-white py-2 px-4 rounded-md hover:bg-[#3A4433] transition-colors"
                  >
                    Activate Camera
                  </button>
                </div>
              )}
              {isCameraActive && !capturedImage && (
                <button
                  onClick={captureImage}
                  className="absolute bottom-4 bg-[#4A5D45] text-white py-2 px-6 rounded-full hover:bg-[#3A4433] transition-colors shadow-lg"
                >
                  Capture Image
                </button>
              )}
              <canvas ref={canvasRef} style={{ display: 'none' }}></canvas> {/* Hidden canvas for image capture */}
            </div>

            <div className="flex space-x-4">
              {capturedImage && (
                <button
                  onClick={retakeImage}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Retake
                </button>
              )}
              <button
                onClick={handleSubmitForVerification}
                disabled={!capturedImage || loading}
                className={`bg-[#4A5D45] text-white py-2 px-4 rounded-md transition-colors ${
                  (!capturedImage || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#3A4433]'
                }`}
              >
                {loading ? 'Submitting...' : 'Submit for Verification'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* <FooterLayout /> Removed */}
    </div>
  );
}

export default KYCLivenessVerification;