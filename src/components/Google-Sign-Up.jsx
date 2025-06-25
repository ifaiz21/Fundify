import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleSignUpButton = ({ onGoogleSuccess, buttonText = "Sign up with Google" }) => {

  const [, setLoadingGoogleAuth] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoadingGoogleAuth(false); // Google OAuth flow is complete
    setError(null); // Clear any previous errors

    // Log the full response from Google for debugging purposes.
    console.log('--- Google OAuth Client-Side Response (from <GoogleLogin> component) ---');
    console.log('Full response object from Google:', credentialResponse);
    console.log('Expected ID Token (credentialResponse.credential):', credentialResponse?.credential);
    console.log('------------------------------------------------------------------');

    const idToken = credentialResponse.credential; // Extract the Google ID Token (JWT).

    // Critical check: Ensure an ID token was actually received from Google.
    if (!idToken) {
      console.error('CRITICAL ERROR: Google ID Token (credentialResponse.credential) is undefined or null. This typically indicates a misconfiguration in Google Cloud Console or GoogleOAuthProvider clientId.');
      setError('Google Sign-Up failed: Could not obtain an ID token from Google. Please verify your Google Cloud Console setup (Client ID, Authorized JavaScript origins).');
      return; // Stop execution if no token is available.
    }

    // If a valid ID token is obtained, call the provided onGoogleSuccess callback.
    // The parent component (e.g., SignupPage) will then handle the backend API call.
    if (onGoogleSuccess) {
      onGoogleSuccess(idToken, credentialResponse); // Pass the ID token and full response to the parent.
    }
  };

  // Callback function executed if Google authentication fails.
  const handleGoogleFailure = (errorResponse) => {
    setLoadingGoogleAuth(false); // Google OAuth flow is complete (with an error).
    console.error('Google Sign-Up failed. Full error response from Google:', errorResponse);

    let errorMessage = 'Google Sign-Up failed. Please try again.';
    if (errorResponse.error) {
      switch (errorResponse.error) {
        case 'popup_closed_by_user':
          errorMessage = 'Google Sign-Up window was closed by the user.';
          break;
        case 'access_denied':
          errorMessage = 'Access denied by the user during consent.';
          break;
        default:
          errorMessage = `Google Sign-Up failed: ${errorResponse.error_description || errorResponse.error}`;
      }
    }
    setError(errorMessage); // Display the error message to the user.
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Display any Google OAuth client-side errors */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center" role="alert">
          <span className="block">{error}</span>
        </div>
      )}
      {/* The GoogleLogin component renders its own button by default. */}
      {/* You can customize its appearance via props, but it manages the click. */}
      <GoogleLogin
        onSuccess={handleGoogleSuccess} // Assign the success handler
        onError={handleGoogleFailure}   // Assign the error handler
        // No explicit 'scope' prop needed for <GoogleLogin> if you just need ID token
        // and basic profile/email. It's implicitly handled.
        // For custom text, you might need to use the 'render' prop
        // or accept its default button and style the container.
      />
      {/* If you need a custom button, you would use useGoogleLogin hook again,
          but then you'd need to handle the authorization code exchange on the backend
          to get the ID token, as the hook's onSuccess doesn't directly provide it.
          For client-side ID token, <GoogleLogin> component is the intended way.
      */}
    </div>
  );
};

export default GoogleSignUpButton;
