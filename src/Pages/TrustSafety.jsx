import React from "react";
import HeaderLayout from "./Layout/HeaderLayout";
import FooterLayout from "./Layout/FooterLayout";

const TrustandSafety = () => {
  return (
    <div className="trust-and-safety-page flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderLayout />

      {/* Main Content */}
      <main className="flex-grow container mx-auto my-8 sm:my-12 px-4 sm:px-6">
        <div className="policy-card max-w-4xl mx-auto p-6 sm:p-10 bg-white shadow-lg rounded-lg">
          <div className="policy-header mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Trust & Safety</h1>
            <p className="text-gray-500">Last updated: June 29, 2025</p>
          </div>

          <div className="prose max-w-none">
            <p>
              At <strong>Fundify</strong>, we are committed to creating a trusted and secure platform for both creators and supporters. Our mission is to provide a transparent, respectful, and safe environment where meaningful projects can thrive through community support.
            </p>

            <h3 className="section-heading">1. User Verification</h3>
            <p>
              To foster a secure environment, we require all users—whether they are supporters or campaign creators—to verify their email addresses during registration. For large or sensitive campaigns, we may request additional identity checks to prevent fraudulent activity and protect our community.
            </p>

            <h3 className="section-heading">2. Campaign Review and Moderation</h3>
            <p>
              Every fundraising campaign submitted to Fundify is subject to a thorough review by our team. We reserve the right to remove, suspend, or flag any campaign that:
            </p>
            <ul>
              <li>Involves misleading, fraudulent, or deceptive claims.</li>
              <li>Violates our Terms of Use or any local, national, or international laws.</li>
              <li>Promotes hate speech, discrimination, violence, or harmful misinformation.</li>
              <li>Infringes on the intellectual property rights of others.</li>
            </ul>

            <h3 className="section-heading">3. Secure Transactions</h3>
            <p>
              Your financial security is paramount. All monetary transactions on Fundify are handled through secure, PCI-compliant, and encrypted payment gateways. We do not store your full credit card or bank details on our servers, and we continuously monitor transactions for suspicious activity.
            </p>

            <h3 className="section-heading">4. Reporting and Accountability</h3>
            <p>
              A strong community is a safe community. We empower our users to report any campaign or user behavior that they believe violates our policies. We take every report seriously and investigate promptly. You can report:
            </p>
            <ul>
              <li>Fraudulent or dishonest fundraising campaigns.</li>
              <li>Suspected misuse of raised funds.</li>
              <li>Abusive, harassing, or harmful behavior from any user.</li>
              <li>Fake or duplicate accounts.</li>
            </ul>
            <p>To make a report, please use the "Report" feature located on every campaign page or email our support team directly.</p>


            <h3 className="section-heading">5. Data Privacy</h3>
            <p>
              We are deeply committed to protecting your personal information in accordance with our Privacy Policy. We employ robust security practices and technologies to safeguard your data against unauthorized access or disclosure.
            </p>

            <h3 className="section-heading">6. Community Guidelines</h3>
            <p>
              To ensure Fundify remains a positive and collaborative space, we expect all users to adhere to our community guidelines. This includes:
            </p>
            <ul>
              <li>Treating others with respect, honesty, and empathy.</li>
              <li>Avoiding harassment, spam, or any form of abuse.</li>
              <li>Following all platform rules and applicable local regulations.</li>
            </ul>
            <p>Violations of these guidelines may result in warnings, account suspension, or permanent removal from the platform.</p>

            <h3 className="section-heading">7. Need Help?</h3>
            <p>
              If you have any questions, concerns, or safety issues to report, our team is here to help. Please reach out to us:
            </p>
            <div className="contact-info">
                <p><strong>Email:</strong> <a href="mailto:support@fundify.com">support@fundify.com</a></p>
                <p><strong>Phone:</strong> +92 42 12345678</p>
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
        .trust-and-safety-page {
            font-family: 'Poppins', sans-serif;
            --fundify-green: #4B5842;
            --fundify-light-green: #A9BEA2;
            --text-primary: #374151; /* text-gray-700 */
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

export default TrustandSafety;
