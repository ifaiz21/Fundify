import React from "react";
import HeaderLayout from "./Layout/HeaderLayout";  // Adjust path if needed
import FooterLayout from "./Layout/FooterLayout";  // Adjust path if needed

const PrivacyPolicy = () => {
  return (
    <>
      {/* Header */}
      <HeaderLayout />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Privacy Policy</h1>
        <h2 className="text-lg font-semibold text-gray-600 mb-2">We value your privacy</h2>

        <div className="text-gray-700 space-y-4">
          <p><strong>Effective Date:</strong> [08 JUN 2025] </p>

          <p>
            At <strong>Fundify</strong>, we respect and protect the privacy of our users. This Privacy Policy explains how Fundify collects, uses, and protects your personal data in accordance with <strong>Pakistan's PECA 2016 and international best practices.</strong> By using Fundify, you agree to the practices described in this policy.
          </p>

          <h3 className="text-lg font-semibold text-gray-700">1. Information We Collect</h3>
          <p><strong>Personal Information:</strong> Full name, email, encrypted password, contact number, and payment details (via third-party processors).</p>
          <p><strong>Non-Personal Information:</strong> Browser, IP address, usage behavior, device type, etc.</p>

          <h3 className="text-lg font-semibold text-gray-700">2. How We Use Your Information</h3>
          <ul className="list-disc pl-6">
            <li>To provide and maintain the platform</li>
            <li>Manage user accounts and projects</li>
            <li>Process transactions securely</li>
            <li>Improve performance and experience</li>
            <li>Respond to feedback and support requests</li>
            <li>Send updates and promotional materials (opt-out available)</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-700">3. How We Share Your Information</h3>
          <p>We do not sell or rent your data. We may share information with:</p>
          <ul className="list-disc pl-6">
            <li>Trusted payment processors</li>
            <li>Third-party service providers (hosting, analytics, email)</li>
            <li>Authorities, if required by law enforcement under PECA or other legal orders.</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-700">4. Cookies and Tracking Technologies</h3>
          <p>We use cookies to enhance your experience and collect analytics. You can disable cookies in your browser settings.</p>

          <h3 className="text-lg font-semibold text-gray-700">5. Data Security</h3>
          <p>We use HTTPS, encryption, and secure storage. No system is 100% secure, but we strive to protect your data at all times.</p>

          <h3 className="text-lg font-semibold text-gray-700">6. Your Rights and Choices</h3>
          <ul className="list-disc pl-6">
            <li>Access and update your information</li>
            <li>Request deletion of your account</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-700">7. Third-Party Links</h3>
          <p>We are not responsible for the privacy practices of other websites linked from our platform. Please review their policies separately.</p>

          <h3 className="text-lg font-semibold text-gray-700">8. Children's Privacy</h3>
          <p>Fundify is not intended for users under 13. We do not knowingly collect data from children. If we learn we have, we will delete it immediately.</p>

          <h3 className="text-lg font-semibold text-gray-700">9. Changes to This Policy</h3>
          <p>We may update this policy. Changes will be posted on this page with an updated effective date.</p>

          <h3 className="text-lg font-semibold text-gray-700">10. Contact Us</h3>
          <p>If you have any questions or concerns, contact us at:</p>
          <p><strong>Email:</strong> support@fundify.com<br /><strong>Phone:</strong> [Insert Number]<br /><strong>Address:</strong> 📍 Lahore, Pakistan</p>
        </div>
      </main>

      {/* Footer */}
      <FooterLayout />
    </>
  );
};

export default PrivacyPolicy;