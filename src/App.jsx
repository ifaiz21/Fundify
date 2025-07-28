// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WebFont from 'webfontloader';
import { useDispatch } from 'react-redux';
//import { loadUser } from './actions/userActions';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { setAuthUser } from './features/authSlice';

// Import all your page and component files
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import ForgetPassword from "./Pages/PasswordReset/ForgetPassword";
import EmailVerification from "./Pages/PasswordReset/EmailVerification";
import PasswordReset from "./Pages/PasswordReset/PasswordReset";
import Success from "./Pages/PasswordReset/Success";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsOfUse from "./Pages/TermsOfUse";
import CookiePolicy from "./Pages/CookiePolicy";
import TrustSafety from "./Pages/TrustSafety";
import FAQs from "./Pages/FAQs";
import Home from "./Pages/Home";
import ExploreCampaigns from "./Pages/ExploreCampaigns";
import GetStartedPage from "./Pages/GetStartedPage";
import ContactUsPage from "./Pages/ContactUs/ContactUsPage";
import Submitted from "./Pages/ContactUs/Submitted";
import Submitted2 from "./Pages/Payment/Submitted2";
import DonationScreen from "./Pages/DonationScreen";
import AboutUs from "./Pages/AboutUs";
import StripePaymentScreen from './Pages/Payment/StripePaymentScreen';
import CampaignCreation01 from "./Pages/CampaignsCreation/CampCreation01";
import CampaignCreation02 from "./Pages/CampaignsCreation/CampCreation02";
import CampaignCreation03 from "./Pages/CampaignsCreation/CampCreation03";
import CampaignCreation04 from "./Pages/CampaignsCreation/CampCreation04";
import CampaignCreation05 from "./Pages/CampaignsCreation/CampCreation05";
import CampaignSubmission from "./Pages/CampaignsCreation/CampSubmission";
import CampaignDeletion from "./Pages/CampaignsCreation/CampDeletion";
import ProjectView from "./Pages/Project_View";
import UserProfileSettings from "./Pages/UserProfileSettings";
import CodeVerification from "./Pages/CodeVerification";
import SetPasswordPage from "./Pages/SetPasswordPage";
import CampaignUpdate from "./Pages/CampaignsCreation/CampUpdate";
import AdminDashboard from "./Pages/AdminSide/AdminDashboard";
import UserManagement from "./Pages/AdminSide/Users";
import DonationHistory from "./Pages/AdminSide/DonationHistory";
import WalletPage from "./Pages/AdminSide/Wallet";
import CampaignsPage from "./Pages/AdminSide/CampaignsPage";
import VerificationPage from "./Pages/AdminSide/VerificationPage";
import FeedbacksPage from "./Pages/AdminSide/Feedbacks";
//import ChatWrapper from './components/ChatWrapper';
import ConditionalChatWrapper from './components/ConditionalChatWrapper';
//import { UserProvider } from './context/UserContext';
import CampaignReviewPage from "./Pages/AdminSide/CampaignReviewPage";

//KYC
import KYCLivenessVerification from './Pages/KYC/KYCLivenessVerification'; // Already imported
import KYCFormPage from './Pages/KYC/KYCFormPage'; // NEW Import
import KYCDocumentUpload from './Pages/KYC/KYCDocumentUpload'; // NEW Import
import KYCSuccessPage from './Pages/KYC/KYCSuccessPage'; // Import the new KYCSuccessPage


function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
     const fetchUserOnLoad = async () => {
      const token = localStorage.getItem('token');
      try {
        if (token) {
          const response = await fetch('https://server-fundify.up.railway.app/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (response.ok) {
            const userData = await response.json();
            dispatch(setAuthUser(userData));
          } else {
            // Agar token invalid hai to usay remove karein aur logout karein
            localStorage.removeItem('token');
            dispatch(setAuthUser(null));
          }
        }
      } catch (error) {
        // Error par bhi logout karein
        console.error('Failed to fetch user on load:', error);
        localStorage.removeItem('token');
        dispatch(setAuthUser(null));
      } finally {
        // YEH BLOCK HAMESHA CHALEGA
        // Chahe token ho, na ho, ya error aye, check poora hone par loading band ho jayegi.
        setLoading(false);
      }
    };
    fetchUserOnLoad();
  }, [dispatch]);

    // Create a stripePromise with your publishable key
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
 
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Roboto', 'Droid Sans', 'Chilanka'],
      },
    });
  }, []);

  // Functions to show toast notifications
  const showSuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Step 3: Jab tak loading ho, loading screen dikhayein
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F0FFF0' }}>
        <h2 style={{ fontFamily: 'Poppins, sans-serif', color: '#4B5842' }}>Loading Fundify...</h2>
      </div>
    );
  }

  return (
      <Router>
       {/* Wrap the Routes with the Elements provider */}
      <Elements stripe={stripePromise}>
        <Routes>
          {/* All Route elements must be nested directly inside <Routes> */}
          {/* Pass showSuccess and showError functions as props to components that need to trigger them */}
          <Route path="/" element={<Home showSuccess={showSuccess} showError={showError} />} />
          <Route path="/homepage" element={<Home showSuccess={showSuccess} showError={showError} />} />

          {/* Login/Signup/Password Reset Pages */}
          <Route path="/login" element={<LoginPage showSuccess={showSuccess} showError={showError} />} />
          <Route path="/sign-up" element={<SignupPage showSuccess={showSuccess} showError={showError} />} />
          <Route path="/forget-password" element={<ForgetPassword showSuccess={showSuccess} showError={showError} />} />
          <Route path="/email-verification" element={<EmailVerification showSuccess={showSuccess} showError={showError} />} />
          <Route path="/password-reset" element={<PasswordReset showSuccess={showSuccess} showError={showError} />} />
          <Route path="/success" element={<Success showSuccess={showSuccess} showError={showError} />} />
          <Route path="/code-verification" element={<CodeVerification showSuccess={showSuccess} showError={showError} />} />
          <Route path="/submitted" element={<Submitted showSuccess={showSuccess} showError={showError} />} />
          <Route path="/submit-2" element={<Submitted2 showSuccess={showSuccess} showError={showError} />} />
          <Route path="/set-password" element={<SetPasswordPage showSuccess={showSuccess} showError={showError} />} />

          {/* Other general pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy showSuccess={showSuccess} showError={showError} />} />
          <Route path="/terms-of-use" element={<TermsOfUse showSuccess={showSuccess} showError={showError} />} />
          <Route path="/cookie-policy" element={<CookiePolicy showSuccess={showSuccess} showError={showError} />} />
          <Route path="/trust-safety" element={<TrustSafety showSuccess={showSuccess} showError={showError} />} />
          <Route path="/faq" element={<FAQs showSuccess={showSuccess} showError={showError} />} />
          <Route path="/explore" element={<ExploreCampaigns showSuccess={showSuccess} showError={showError} />} />
          <Route path="/how-to" element={<GetStartedPage showSuccess={showSuccess} showError={showError} />} />
          <Route path="/contact" element={<ContactUsPage showSuccess={showSuccess} showError={showError} />} />
          <Route path="/donate" element={<DonationScreen showSuccess={showSuccess} showError={showError} />} />
          <Route path="/about" element={<AboutUs showSuccess={showSuccess} showError={showError} />} />
          <Route path="/payments" element={<StripePaymentScreen showSuccess={showSuccess} showError={showError}  />}/>
          <Route path="/create-campaign" element={<CampaignCreation01 showSuccess={showSuccess} showError={showError} />} />
          <Route path="/campaign-creation-02" element={<CampaignCreation02 showSuccess={showSuccess} showError={showError} />} />
          <Route path="/campaign-creation-03" element={<CampaignCreation03 showSuccess={showSuccess} showError={showError} />} />
          <Route path="/campaign-creation-04" element={<CampaignCreation04 showSuccess={showSuccess} showError={showError} />} />
          <Route path="/campaign-creation-05" element={<CampaignCreation05 showSuccess={showSuccess} showError={showError} />} />
          <Route path="/campaign-submission" element={<CampaignSubmission showSuccess={showSuccess} showError={showError} />} />
          <Route path="/campaign-deletion" element={<CampaignDeletion showSuccess={showSuccess} showError={showError} />} />
          <Route path="/ProjectView" element={<ProjectView showSuccess={showSuccess} showError={showError} />} />
          <Route path="/campaign-update" element={<CampaignUpdate showSuccess={showSuccess} showError={showError} />} />
          <Route path="/user-profile" element={<UserProfileSettings showSuccess={showSuccess} showError={showError} />} />

          {/* NEW KYC Routes */}
          <Route path="/kyc-form" element={<KYCFormPage showSuccess={showSuccess} showError={showError} />} />
          <Route path="/kyc-document-upload" element={<KYCDocumentUpload showSuccess={showSuccess} showError={showError} />} />
          <Route path="/kyc-liveness-verification" element={<KYCLivenessVerification showSuccess={showSuccess} showError={showError} />} />
          <Route path="/kyc-success" element={<KYCSuccessPage />} />

          {/* Admin Pages */}
          <Route path="/admin-dashboard" element={<AdminDashboard showSuccess={showSuccess} showError={showError} />} />
          <Route path="/admin/users" element={<UserManagement showSuccess={showSuccess} showError={showError} />} />
          <Route path="/admin/donations" element={<DonationHistory showSuccess={showSuccess} showError={showError} />} />
          <Route path="/admin/wallet" element={<WalletPage showSuccess={showSuccess} showError={showError} />} />
          <Route path="/admin/campaigns" element={<CampaignsPage showSuccess={showSuccess} showError={showError} />} />
          <Route path="/admin/verifications" element={<VerificationPage showSuccess={showSuccess} showError={showError} />} />
          <Route path="/admin/feedbacks" element={<FeedbacksPage showSuccess={showSuccess} showError={showError} />} />          <Route path="/admin/campaign/review/:id" element={<CampaignReviewPage showSuccess={showSuccess} showError={showError} />} />

          {/* Fallback for other routes which also uses HeaderLayout. 
              Removed passing showToast here as HeaderLayout now imports it directly. */}
          <Route path="*" element={
            <div className="flex flex-col min-h-screen items-center justify-center">
              <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
              <p className="text-gray-600 mt-4">The page you are looking for does not exist.</p>
            </div>
          } />
        </Routes>
        </Elements>
        <ConditionalChatWrapper />
        <ToastContainer />
      </Router>
  );
}

export default App;