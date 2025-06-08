import React from "react";
import HeaderLayout from "./Layout/HeaderLayout";  // Adjust path if needed
import FooterLayout from "./Layout/FooterLayout";  // Adjust path if needed

const TermsOfUse = () => {
  return (
    <>
      {/* Header */}
      <HeaderLayout />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Terms of Use</h1>
        <h2 className="text-lg font-semibold text-gray-600 mb-2">You Agree to:</h2>

        <div className="text-gray-700 space-y-4">
          <p><strong>Effective Date:</strong> [08 JUN 2025]</p>

          <p>Welcome to <strong>Fundify</strong>! These Terms of Use (“Terms”) govern your access to and use of our platform, services, and content. By using Fundify, you agree to be bound by these Terms.</p>

          <h3 className="font-semibold text-gray-600">1. Eligibility</h3>
          <p>You must be at least 18 years old and capable of forming a binding contract to use Fundify.</p>

          <h3 className="font-semibold text-gray-600">2. User Accounts</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>Provide accurate and complete information.</li>
            <li>Maintain the confidentiality of your account credentials.</li>
            <li>Fundify reserves the right to suspend or terminate accounts for violations.</li>
          </ul>

          <h3 className="font-semibold text-gray-600">3. Project Creation & Contributions</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>Creators must offer transparent and lawful campaign details.</li>
            <li>Fundify does not guarantee project success or contributor refunds.</li>
          </ul>

          <h3 className="font-semibold text-gray-600">4. Fees and Payments</h3>
          <p>We may charge service fees on successful campaigns. All payments are processed securely via third-party providers and are generally non-refundable.</p>

          <h3 className="font-semibold text-gray-600">5. Prohibited Conduct</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>No unlawful or harmful activities.</li>
            <li>No impersonation or misrepresentation.</li>
            <li>No attempt to breach platform security.</li>
          </ul>

          <h3 className="font-semibold text-gray-600">6. Intellectual Property</h3>
          <p>Fundify owns the platform’s content and branding. You retain ownership of your content but allow us to display and use it for platform functionality and marketing.</p>

          <h3 className="font-semibold text-gray-600">7. Disclaimer of Warranties</h3>
          <p>Services are provided "as is." Fundify makes no guarantees about platform uptime, reliability, or accuracy of user-provided content.</p>

          <h3 className="font-semibold text-gray-600">8. Limitation of Liability</h3>
          <p>Fundify is not liable for indirect, incidental, or consequential damages. Our total liability shall not exceed the amount paid by you to us (if any).</p>

          <h3 className="font-semibold text-gray-600">9. Termination</h3>
          <p>We may terminate or suspend your access at any time for policy violations or misuse of the platform.</p>

          <h3 className="font-semibold text-gray-600">10. Changes to Terms</h3>
          <p>We may revise these Terms at any time. Continued use of the platform indicates acceptance of updated Terms.</p>

          <h3 className="font-semibold text-gray-600">11. Governing Law</h3>
          <p>These Terms are governed by the laws of <b>Islamic Republic of Pakistan</b>, without regard to conflict of law provisions.</p>

          <h3 className="font-semibold text-gray-600">12. Contact Us</h3>
          <p>If you have any questions, please contact us at: <br />
            <strong>Email:</strong> support@fundify.com<br />
            <strong>Phone:</strong> [Insert Phone Number]<br />
            <strong>Address:</strong> [Insert Office Address]
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

export default TermsOfUse;
