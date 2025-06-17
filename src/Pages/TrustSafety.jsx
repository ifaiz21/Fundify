import React from "react";
import HeaderLayout from "./Layout/HeaderLayout";
import FooterLayout from "./Layout/FooterLayout";

const TrustandSafety = () => {
  return (
    <>
      {/* Header */}
      <HeaderLayout />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Trust & Safety</h1>
        <h2 className="text-lg font-semibold text-gray-600 mb-2">We value your trust and are committed to your safety</h2>

        <div className="text-gray-700 space-y-4">
          <p>
            At <strong>Fundify</strong>, we are committed to creating a trusted and secure platform for both creators and supporters. Our mission is to provide a transparent, respectful, and safe environment where meaningful projects can thrive through community support.
          </p>

          <h3 className="text-lg font-semibold text-gray-700">1. User Verification</h3>
          <p>
            We require all users—whether supporters or campaign creators—to verify their email addresses during registration. Additional identity checks may be requested for large or sensitive campaigns to prevent fraud.
          </p>

          <h3 className="text-lg font-semibold text-gray-700">2. Campaign Review and Moderation</h3>
          <p>
            All fundraising campaigns are subject to review. We may remove or flag any campaign that:
            <ul className="list-disc ml-5">
              <li>Involves misleading, fraudulent, or deceptive claims</li>
              <li>Violates our terms of use or local laws</li>
              <li>Promotes hate speech, discrimination, violence, or misinformation</li>
              <li>Infringes intellectual property rights</li>
            </ul>
          </p>

          <h3 className="text-lg font-semibold text-gray-700">3. Secure Transactions</h3>
          <p>
            All financial transactions on Fundify are handled through secure, encrypted payment gateways. We do not store full payment details and monitor transactions for suspicious activity.
          </p>

          <h3 className="text-lg font-semibold text-gray-700">4. Reporting and Accountability</h3>
          <p>
            Users can report any campaign or user behavior that they believe violates our policies. We take every report seriously and investigate promptly. Reports may include:
            <ul className="list-disc ml-5">
              <li>Fraudulent fundraising</li>
              <li>Misuse of funds</li>
              <li>Abusive or harmful behavior</li>
              <li>Fake or duplicate accounts</li>
            </ul>
            Use our "Report" feature on the campaign page or email us at <strong>support@fundify.com</strong>.
          </p>

          <h3 className="text-lg font-semibold text-gray-700">5. Refund and Dispute Policy</h3>
          <p>
            Fundify is not legally responsible for the performance or fulfillment of projects. However, we encourage campaign creators to:
            <ul className="list-disc ml-5">
              <li>Be transparent about delays or failures</li>
              <li>Issue refunds where appropriate</li>
              <li>Respond promptly to backer concerns</li>
            </ul>
          </p>

          <h3 className="text-lg font-semibold text-gray-700">6. Data Privacy</h3>
          <p>
            We are committed to protecting your personal information in accordance with our Privacy Policy. We use strong security practices to safeguard your data.
          </p>

          <h3 className="text-lg font-semibold text-gray-700">7. Community Guidelines</h3>
          <p>
            We expect all users to:
            <ul className="list-disc ml-5">
              <li>Treat others respectfully and honestly</li>
              <li>Avoid harassment, spam, or abuse</li>
              <li>Follow all platform rules and local regulations</li>
            </ul>
            Violations may result in warnings, suspensions, or permanent bans.
          </p>

          <h3 className="text-lg font-semibold text-gray-700">8. Updates to This Policy</h3>
          <p>
            This Trust and Safety Policy may be updated periodically. Please check back regularly for the latest version.
          </p>

          <h3 className="text-lg font-semibold text-gray-700">9. Need Help?</h3>
          <p>
            If you have any questions, concerns, or safety issues to report, contact us at:
            <br />
            📧 <strong>support@fundify.com</strong>
          </p>
        </div>
      </main>

      {/* Chat Button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-[#4A5D45] text-white rounded-full p-4 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>

      {/* Footer */}
      <FooterLayout />
    </>
  );
};

export default TrustandSafety;