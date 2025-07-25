import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store';
import { toast } from 'react-toastify';
import axios from 'axios';

const GoogleSignInButton = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSuccess = async (credentialResponse) => {
        const idToken = credentialResponse.credential;

        if (!idToken) {
            toast.error('Google Sign-In failed: No ID Token received.');
            return;
        }

        try {
            const API_URL = process.env.REACT_APP_API_URL;
            
            const response = await axios.post(`${API_URL}/api/auth/google-login`, {
                token: idToken,
            });

            // --- Step 4: Update the logic to use Redux ---
            const { token, user, role } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            dispatch(loginSuccess(user));

            toast.success("Logged in successfully with Google!");

            if (role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/homepage');
            }
            // --- End of Update ---

        } catch (err) {
            console.error('Google login failed:', err);
            const errorMessage = err.response?.data?.message || 'Google login failed. Please try again.';
            toast.error(errorMessage);
        }
    };

    const handleFailure = (err) => {
        console.error('Google Login Failed:', err);
        toast.error('Google Sign-In failed. Please try again.');
    };

    return (
        <div className="w-full">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleFailure}
                useOneTap // For a smoother experience
                width="100%" // Make the button take full width of its container
            />
        </div>
    );
};

export default GoogleSignInButton;