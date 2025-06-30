import React from "react";
import HeaderLayout from "./Layout/HeaderLayout";
import FooterLayout from "./Layout/FooterLayout";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderLayout />

      {/* Main Content */}
      <main className="flex-grow container mx-auto my-8 sm:my-12 px-4 sm:px-6">
        <div className="policy-card max-w-4xl mx-auto p-6 sm:p-10 bg-white shadow-lg rounded-lg">
          <div className="policy-header mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
            <p className="text-gray-500">Effective Date: June 29, 2025</p>
          </div>

          <div className="prose max-w-none">
            <p>
              At <strong>Fundify</strong>, we respect and protect the privacy of our users. This Privacy Policy explains how we collect, use, and protect your personal data in accordance with <strong>Pakistan's Prevention of Electronic Crimes Act (PECA) 2016</strong> and international best practices. By using Fundify, you agree to the practices described in this policy.
            </p>

            <h3 className="section-heading">1. Information We Collect</h3>
            <p>We collect information to provide and improve our services. This includes:</p>
            <ul>
                <li><strong>Personal Information:</strong> Your full name, email address, encrypted password, contact number, and payment details (processed securely via our third-party payment partners).</li>
                <li><strong>Non-Personal Information:</strong> Technical data such as your browser type, IP address, usage behavior on our site, and device type.</li>
            </ul>

            <h3 className="section-heading">2. How We Use Your Information</h3>
            <p>Your information is used for the following purposes:</p>
            <ul>
              <li>To provide, maintain, and secure our platform.</li>
              <li>To manage user accounts, campaigns, and contributions.</li>
              <li>To process transactions securely and prevent fraud.</li>
              <li>To improve platform performance and the overall user experience.</li>
              <li>To respond to your feedback, comments, and support requests.</li>
              <li>To send important updates and promotional materials (you can opt-out at any time).</li>
            </ul>

            <h3 className="section-heading">3. How We Share Your Information</h3>
            <p>We do not sell or rent your personal data. We may share information only with:</p>
            <ul>
              <li>Trusted payment processors to handle transactions.</li>
              <li>Third-party service providers for essential services like hosting, analytics, and email delivery.</li>
              <li>Legal authorities, if required by a valid court order under PECA or other applicable laws.</li>
            </ul>

            <h3 className="section-heading">4. Data Security</h3>
            <p>We are committed to protecting your data. We implement industry-standard security measures, including HTTPS, data encryption, and secure server infrastructure. While no system is 100% impenetrable, we take all reasonable steps to safeguard your information.</p>

            <h3 className="section-heading">5. Your Rights and Choices</h3>
            <p>You have control over your personal information. Your rights include:</p>
             <ul>
              <li>The right to access and update your account information at any time.</li>
              <li>The right to request the deletion of your account and associated personal data.</li>
              <li>The right to opt-out of our marketing and promotional communications.</li>
            </ul>

            <h3 className="section-heading">6. Children's Privacy</h3>
            <p>Fundify is not intended for use by individuals under the age of 13. We do not knowingly collect personal data from children. If we become aware that we have inadvertently collected such information, we will take steps to delete it immediately.</p>
            
            <h3 className="section-heading">7. Changes to This Policy</h3>
            <p>We may update this policy periodically. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy regularly.</p>

            <h3 className="section-heading">8. Contact Us</h3>
            <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
            <div className="contact-info">
              <p><strong>Email:</strong> <a href="mailto:support@fundify.com">support@fundify.com</a></p>
              <p><strong>Phone:</strong> +92 42 12345678</p>
              <p><strong>Address:</strong> 123 Tech Avenue, Johar Town, Lahore, Pakistan</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterLayout />

      <style jsx global>{`
        /* --- Google Font Import --- */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        /* --- General Styling & Variables --- */
        .privacy-policy-page {
            font-family: 'Poppins', sans-serif;
            --fundify-green: #4B5842;
            --fundify-light-green: #A9BEA2;
            --text-primary: #374151; /* text-gray-700 */
            --text-secondary: #6b7280; /* text-gray-500 */
        }

        .policy-card {
            border-top: 5px solid var(--fundify-green);
        }
        
        .policy-header h1 {
            color: #1f2937; /* text-gray-800 */
            letter-spacing: -0.025em;
        }

        /* --- Prose Content Styling (for the policy text itself) --- */
        .prose {
           color: var(--text-primary);
           line-height: 1.75;
        }
        
        .prose .section-heading {
            margin-top: 2rem;
            margin-bottom: 1rem;
            font-size: 1.25rem; /* text-xl */
            font-weight: 600; /* font-semibold */
            color: #111827; /* text-gray-900 */
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #e5e7eb; /* border-gray-200 */
        }

        .prose strong {
            color: var(--fundify-green);
            font-weight: 600;
        }

        .prose ul {
            list-style-type: none;
            padding-left: 0;
            margin-top: 1rem;
            margin-bottom: 1rem;
        }
        
        .prose ul li {
            position: relative;
            padding-left: 1.75rem; /* Creates space for the custom bullet */
            margin-bottom: 0.5rem;
        }

        .prose ul li::before {
            content: '✔'; /* Custom bullet point */
            position: absolute;
            left: 0;
            color: var(--fundify-green);
            font-weight: 600;
        }
        
        .prose a {
            color: var(--fundify-green);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s ease;
        }
        
        .prose a:hover {
            text-decoration: underline;
            color: #3A4433; /* Darker green */
        }
        
        .contact-info {
            margin-top: 1rem;
            padding: 1rem;
            background-color: #f9fafb; /* bg-gray-50 */
            border-left: 3px solid var(--fundify-light-green);
            border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;
