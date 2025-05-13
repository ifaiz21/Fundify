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
      </Routes>
    </Router>
  );
}

export default App;
