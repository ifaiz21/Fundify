import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import store from './store'; // Make sure this path points to your Redux store configuration file


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="656729496942-0l6989sg16pklhjupapg0pacm85jp35k.apps.googleusercontent.com"> {/* <<< REPLACE THIS WITH YOUR ACTUAL CLIENT ID */}
     {/* This Provider is what gives your components access to the Redux store */}
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
