// src/Pages/KYC/KYCLivenessVerification.jsx
"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
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

  // Memoize stopCamera
  const stopCamera = useCallback(() => {
    if (stream) {
      console.log("Stopping camera stream.");
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  }, [stream]); // stopCamera depends on 'stream'

  const startCamera = async () => {
        setCapturedImage(null);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                setStream(mediaStream);
                videoRef.current.oncanplay = () => {
                    setIsCameraActive(true);
                    videoRef.current.oncanplay = null;
                };
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            showErrorMessage("Failed to access camera. Please ensure permissions are granted.");
            setIsCameraActive(false);
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageDataUrl = canvas.toDataURL('image/jpeg');
            setCapturedImage(imageDataUrl);
            stopCamera();
        }
    };

    const retakeImage = () => {
        setCapturedImage(null);
        startCamera();
    };

    const handleSubmitForVerification = async () => {
        if (!capturedImage) {
            showErrorMessage("Please capture an image first.");
            return;
        }
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            showErrorMessage("Authentication required. Please log in.");
            navigate("/login");
            setLoading(false);
            return;
        }
        try {
            const blob = await fetch(capturedImage).then(res => res.blob());
            const formData = new FormData();
            formData.append('livenessImage', blob, 'liveness.jpeg');
            const response = await fetch('https://fundify-server.vercel.app/api/users/kyc/submit-liveness', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });
            if (response.ok) {
                showSuccessMessage("Liveness image submitted for verification!");
                navigate('/kyc-success');
            } else {
                const errorData = await response.json();
                showErrorMessage(`Verification failed: ${errorData.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error("Error submitting for verification:", err);
            showErrorMessage("An error occurred during submission.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, [stopCamera]);

    return (
        <div className="kyc-liveness-page flex flex-col min-h-screen bg-gray-50">
            {/* The HeaderLayout component would go here */}
            <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 flex items-center justify-center">
                <div className="kyc-card bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-lg">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Liveness Verification</h1>
                        <p className="text-gray-600 text-sm max-w-md mx-auto">
                            Center your face in the frame. Ensure good lighting and remove any obstructions like glasses or hats.
                        </p>
                    </div>

                    <div className="flex flex-col items-center space-y-6">
                        <div className={`camera-view-wrapper relative w-full max-w-xs aspect-square bg-gray-200 rounded-full overflow-hidden border-4 flex items-center justify-center ${isCameraActive && !capturedImage ? 'active' : ''}`}>
                            <div className="camera-view-inner">
                                {capturedImage ? (
                                    <img src={capturedImage} alt="Captured Liveness" className="w-full h-full object-cover" />
                                ) : (
                                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
                                )}
                            </div>
                            {!isCameraActive && !capturedImage && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-200/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    <p className="font-medium">Camera Inactive</p>
                                </div>
                            )}
                        </div>
                        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

                        <div className="action-buttons-container flex flex-col sm:flex-row items-center gap-4 w-full max-w-xs">
                            {!isCameraActive && !capturedImage ? (
                                <button onClick={startCamera} className="action-button primary w-full">Activate Camera</button>
                            ) : capturedImage ? (
                                <>
                                    <button onClick={retakeImage} className="action-button secondary w-full">Retake</button>
                                    <button onClick={handleSubmitForVerification} disabled={loading} className="action-button primary w-full">
                                        {loading ? <span className="loading-spinner"></span> : 'Submit'}
                                    </button>
                                </>
                            ) : (
                                <button onClick={captureImage} className="action-button capture w-full">Capture Image</button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            {/* The FooterLayout component would go here */}

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
                .kyc-liveness-page {
                    font-family: 'Poppins', sans-serif;
                    --fundify-green: #4B5842;
                    --fundify-light-green: #A9BEA2;
                    --shadow-color: rgba(75, 88, 66, 0.1);
                    --border-color: #e5e7eb;
                }

                .kyc-card {
                    border: 1px solid var(--border-color);
                    box-shadow: 0 10px 25px -5px var(--shadow-color), 0 8px 10px -6px var(--shadow-color);
                }

                .camera-view-wrapper {
                    border-color: var(--fundify-light-green);
                    box-shadow: 0 0 0 4px white, 0 0 0 8px var(--fundify-light-green);
                    position: relative;
                }

                .camera-view-wrapper.active::before {
                    content: '';
                    position: absolute;
                    inset: -12px;
                    border-radius: 9999px;
                    border: 2px solid var(--fundify-green);
                    animation: pulse 2s infinite;
                    z-index: -1;
                }

                .camera-view-inner {
                    width: 100%;
                    height: 100%;
                    border-radius: 9999px;
                    overflow: hidden;
                }
                
                .camera-view-inner video {
                    transform: scaleX(-1); /* Mirror the camera */
                }

                @keyframes pulse {
                    0% { transform: scale(0.95); opacity: 0.7; }
                    70% { transform: scale(1.1); opacity: 0; }
                    100% { transform: scale(0.95); opacity: 0; }
                }

                .action-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 52px;
                    padding: 0.75rem 1.5rem;
                    border-radius: 9999px;
                    font-size: 1rem;
                    font-weight: 600;
                    border: 2px solid transparent;
                    transition: all 0.3s ease;
                }
                .action-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .action-button.primary {
                    background-color: var(--fundify-green);
                    color: white;
                }
                .action-button.primary:hover:not(:disabled) {
                    background-color: #3A4433;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px var(--shadow-color);
                }

                .action-button.secondary {
                    background-color: #e5e7eb;
                    color: #374151;
                }
                .action-button.secondary:hover:not(:disabled) {
                    background-color: #d1d5db;
                }
                
                .action-button.capture {
                    background-color: white;
                    color: var(--fundify-green);
                    border-color: var(--fundify-green);
                }
                .action-button.capture:hover:not(:disabled) {
                    background-color: var(--fundify-green);
                    color: white;
                }
                
                .loading-spinner {
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}

export default KYCLivenessVerification;
