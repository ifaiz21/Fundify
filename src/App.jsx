// src/App.jsx
import React, { useState } from 'react'; // Import useState
import ToastNotification from './components/ToastNotification'; // Import ToastNotification
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import PaymentScreen from "./Pages/Payment/PaymentScreen";
import CampaignCreation01 from "./Pages/CampaignsCreation/CampCreation01";
import CampaignCreation02 from "./Pages/CampaignsCreation/CampCreation02";
import CampaignCreation03 from "./Pages/CampaignsCreation/CampCreation03";
import CampaignCreation04 from "./Pages/CampaignsCreation/CampCreation04";
import CampaignCreation05 from "./Pages/CampaignsCreation/CampCreation05";
import CampaignSubmission from "./Pages/CampaignsCreation/CampSubmission";
import CampaignDeletion from "./Pages/CampaignsCreation/CampDeletion";
import CampaignDate from "./Pages/CampaignsCreation/CampDate";


import ProjectView from "./Pages/Project_View";
import UserProfileSettings from "./Pages/UserProfileSettings";
import CodeVerification from "./Pages/CodeVerification";

import CampaignUpdate from "./Pages/CampaignsCreation/CampUpdate";
import AdminDashboard from "./Pages/AdminSide/AdminDashboard";
import UserManagement from "./Pages/AdminSide/Users";
import DonationHistory from "./Pages/AdminSide/DonationHistory";
import WalletPage from "./Pages/AdminSide/Wallet";
import CampaignsPage from "./Pages/AdminSide/CampaignsPage";
import VerificationPage from "./Pages/AdminSide/VerificationPage";
import FeedbacksPage from "./Pages/AdminSide/Feedbacks";
import HeaderLayout from "./Pages/Layout/HeaderLayout";

import { UserProvider } from './context/UserContext';

function App() {
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type, visible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false, message: '' }));
  };

  return (
    <UserProvider> {/* Wrap your entire app with UserProvider */}
      <Router>
        <Routes>
          {/* All Route elements must be nested directly inside <Routes> */}
          {/* Pass showToast function as a prop to components that need to trigger it */}
          <Route path="/" element={<Home showToast={showToast} />} />
          <Route path="/homepage" element={<Home showToast={showToast} />} />

          {/* Login/Signup/Password Reset Pages */}
          <Route path="/login" element={<LoginPage showToast={showToast} />} />
          <Route path="/sign-up" element={<SignupPage showToast={showToast} />} />
          <Route path="/forget-password" element={<ForgetPassword showToast={showToast} />} />
          <Route path="/email-verification" element={<EmailVerification showToast={showToast} />} />
          <Route path="/password-reset" element={<PasswordReset showToast={showToast} />} />
          <Route path="/success" element={<Success showToast={showToast} />} />
          <Route path="/code-verification" element={<CodeVerification showToast={showToast} />} />
          <Route path="/submitted" element={<Submitted showToast={showToast} />} />
          <Route path="/submit-2" element={<Submitted2 showToast={showToast} />} />

          {/* Other general pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy showToast={showToast} />} />
          <Route path="/terms-of-use" element={<TermsOfUse showToast={showToast} />} />
          <Route path="/cookie-policy" element={<CookiePolicy showToast={showToast} />} />
          <Route path="/trust-safety" element={<TrustSafety showToast={showToast} />} />
          <Route path="/faq" element={<FAQs showToast={showToast} />} />
          <Route path="/explore" element={<ExploreCampaigns showToast={showToast} />} />
          <Route path="/how-to" element={<GetStartedPage showToast={showToast} />} />
          <Route path="/contact" element={<ContactUsPage showToast={showToast} />} />
          <Route path="/donate" element={<DonationScreen showToast={showToast} />} />
          <Route path="/about" element={<AboutUs showToast={showToast} />} />
          <Route path="/payment" element={<PaymentScreen showToast={showToast} />} />
          <Route path="/create-campaign" element={<CampaignCreation01 showToast={showToast} />} />
          <Route path="/campaign-creation-02" element={<CampaignCreation02 showToast={showToast} />} />
          <Route path="/campaign-creation-03" element={<CampaignCreation03 showToast={showToast} />} />
          <Route path="/campaign-creation-04" element={<CampaignCreation04 showToast={showToast} />} />
          <Route path="/campaign-creation-05" element={<CampaignCreation05 showToast={showToast} />} />
          <Route path="/campaign-submission" element={<CampaignSubmission showToast={showToast} />} />
          <Route path="/campaign-deletion" element={<CampaignDeletion showToast={showToast} />} />
          <Route path="/ProjectView" element={<ProjectView showToast={showToast} />} />
          <Route path="/campaign-update" element={<CampaignUpdate showToast={showToast} />} />
          <Route path="/user-profile" element={<UserProfileSettings showToast={showToast} />} />
          <Route path="/profile-settings" element={<UserProfileSettings showToast={showToast} />} />

          {/* Admin Pages */}
          <Route path="/admin-dashboard" element={<AdminDashboard showToast={showToast} />} />
          <Route path="/admin/users" element={<UserManagement showToast={showToast} />} />
          <Route path="/admin/donations" element={<DonationHistory showToast={showToast} />} />
          <Route path="/admin/wallet" element={<WalletPage showToast={showToast} />} />
          <Route path="/admin/campaigns" element={<CampaignsPage showToast={showToast} />} />
          <Route path="/admin/verifications" element={<VerificationPage showToast={showToast} />} />
          <Route path="/admin/feedbacks" element={<FeedbacksPage showToast={showToast} />} />

          {/* Fallback for other routes */}
          <Route path="*" element={
            <div className="flex flex-col min-h-screen items-center justify-center">
              {/* HeaderLayout doesn't directly need showToast prop as it's not triggering toasts */}
              <HeaderLayout />
              <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
              <p className="text-gray-600 mt-4">The page you are looking for does not exist.</p>
            </div>
          } />
        </Routes>
      </Router>

      {/* RENDER TOAST COMPONENT HERE, controlled by toast state */}
      {toast.visible && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          duration={3000} // Set a default duration or pass from showToast if needed
        />
      )}
    </UserProvider>
  );
}

export default App;