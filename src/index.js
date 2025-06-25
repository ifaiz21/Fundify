import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

// const GOOGLE_CLIENT_ID = "656729496942-0l6989sg16pklhjupapg0pacm85jp35k.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="656729496942-0l6989sg16pklhjupapg0pacm85jp35k.apps.googleusercontent.com"> {/* <<< REPLACE THIS WITH YOUR ACTUAL CLIENT ID */}
    <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
