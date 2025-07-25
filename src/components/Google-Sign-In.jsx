import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // <-- Step 1: Import useDispatch
import { loginSuccess } from '../store';   // <-- Step 2: Import loginSuccess action

const GoogleSignInButton = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch(); // <-- Step 3: Initialize useDispatch
    
    // Aapki purani state management waisi hi rahegi
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const handleSuccess = async (credentialResponse) => {
        const idToken = credentialResponse.credential;

        if (!idToken) {
            setError('Google Sign-In failed: No ID Token received.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('https://server-fundify.up.railway.app/api/auth/google-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401 && data.message && data.message.includes('Email not verified')) {
                    navigate("/code-verification", { state: { email: data.email } });
                    setError(data.message);
                    return;
                }
                throw new Error(data.message || 'Failed to authenticate user with backend.');
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                setMessage('Successfully signed in!');

                // --- Step 4: UserContext ki jagah Redux istemal karein ---
                if (data.user) {
                    dispatch(loginSuccess(data.user)); // Redux store ko update karein
                }
                // --- End of Change ---
                
                navigate('/');
            } else {
                throw new Error('No token returned by backend.');
            }

        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFailure = (err) => {
        console.error('Google Login Failed:', err);
        setError('Google Sign-In failed. Please try again.');
    };

    // Aapka UI (return statement) bilkul waisa hi rahega
    return (
        <div className="flex flex-col items-center justify-center p-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded text-center">
                    {error}
                </div>
            )}
            {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 mb-4 rounded text-center">
                    {message}
                </div>
            )}
            {loading ? (
                <button
                    disabled
                    className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                >
                    <svg className="animate-spin h-5 w-5 mr-3 text-gray-500" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4z" />
                    </svg>
                    Signing In...
                </button>
            ) : (
                <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
            )}
        </div>
    );
};

export default GoogleSignInButton;