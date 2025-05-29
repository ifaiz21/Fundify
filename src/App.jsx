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
import DonationScreen from "./Pages/DonationScreen";
import AboutUs from "./Pages/AboutUs";
import PaymentScreen from "./Pages/PaymentScreen";
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

import CampaignUpdate from "./Pages/CampaignsCreation/CampUpdate";
import AdminDashboard from "./Pages/AdminSide/AdminDashboard";
import UserManagement from "./Pages/AdminSide/Users";
import DonationHistory from "./Pages/AdminSide/DonationHistory";
import WalletPage from "./Pages/AdminSide/Wallet";
import CampaignsPage from "./Pages/AdminSide/CampaignsPage";
import VerificationPage from "./Pages/AdminSide/VerificationPage";
import FeedbacksPage from "./Pages/AdminSide/Feedbacks";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/success" element={<Success />} />
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/trust-safety" element={<TrustSafety />} />
        <Route path="/faq" element={<FAQs />} />
        <Route path="/homepage" element={<Home />} />
        <Route path="/explore" element={<ExploreCampaigns />} />
        <Route path="/how-to" element={<GetStartedPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/submitted" element={<Submitted />} />
        <Route path="/donate" element={<DonationScreen />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/create-campaign" element={<CampaignCreation01 />} />
        <Route path="/campaign-creation-02" element={<CampaignCreation02 />} />
        <Route path="/campaign-creation-03" element={<CampaignCreation03 />} />
        <Route path="/campaign-creation-04" element={<CampaignCreation04 />} />
        <Route path="/campaign-creation-05" element={<CampaignCreation05 />} />
        <Route path="/campaign-submission" element={<CampaignSubmission />} />
        <Route path="/campaign-deletion" element={<CampaignDeletion />} />

        <Route path="/ProjectView" element={<ProjectView />} />
        <Route path="/campaign-update" element={<CampaignUpdate />} />
        <Route path="/user-profile" element={< UserProfileSettings/>} />
        <Route path="/code-verification" element={<CodeVerification />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/donations" element={<DonationHistory />} />
        <Route path="/admin/wallet" element={<WalletPage />} />
        <Route path="/admin/campaigns" element={<CampaignsPage />} />
        <Route path="/admin/verifications" element={<VerificationPage />} />
        <Route path="/admin/feedbacks" element={<FeedbacksPage />} />


      </Routes>
    </Router>
  );
}

export default App;
