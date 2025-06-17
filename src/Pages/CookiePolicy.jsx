import React from "react";
import HeaderLayout from "./Layout/HeaderLayout"; 
import FooterLayout from "./Layout/FooterLayout"; 

const CookiePolicy = () => {
  return (
    <>
      {/* Header */}
      <HeaderLayout />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Cookie Policy</h1>

        <div className="text-gray-700 space-y-4">
          <p>
            This Cookie Policy explains how <strong>Fundify</strong> ("we", "us", or "our") uses cookies and similar tracking technologies when you use our platform.
          </p>

          <h3 className="text-lg font-semibold">1. What Are Cookies?</h3>
          <p>
            Cookies are small text files stored on your device by your browser. They help us enhance your experience by remembering your preferences and recognizing you on repeat visits.
          </p>

          <h3 className="text-lg font-semibold">2. Why We Use Cookies</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Ensure the platform functions properly</li>
            <li>Improve performance and user experience</li>
            <li>Analyze traffic and usage behavior</li>
            <li>Enable login, session management, and user settings</li>
            <li>Support secure fundraising and payment operations</li>
          </ul>

          <h3 className="text-lg font-semibold">3. Types of Cookies We Use</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Essential Cookies:</strong> Required for core site functionality</li>
            <li><strong>Performance Cookies:</strong> Help us analyze site usage and performance</li>
            <li><strong>Functional Cookies:</strong> Remember user preferences and settings</li>
            <li><strong>Analytics Cookies:</strong> Provide insights for improvement</li>
            <li><strong>Third-Party Cookies:</strong> Used by integrated services (e.g., Stripe, Google Analytics)</li>
          </ul>

          <h3 className="text-lg font-semibold">4. Managing Cookies</h3>
          <p>
            You can control or delete cookies using your browser settings. Most browsers allow you to:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>View which cookies are stored</li>
            <li>Delete cookies</li>
            <li>Block cookies from specific sites or all sites</li>
          </ul>
          <p>
            Please note that disabling cookies may affect certain features of Fundify.
          </p>

          <h3 className="text-lg font-semibold">5. Third-Party Cookies</h3>
          <p>
            Some cookies are placed by third-party services that appear on our pages, such as payment processors and analytics providers. We do not control these cookies and recommend checking their policies directly.
          </p>

          <h3 className="text-lg font-semibold">6. Updates to This Policy</h3>
          <p>
            We may update this Cookie Policy from time to time. Please revisit this page regularly to stay informed.
          </p>

          <h3 className="text-lg font-semibold">7. Contact Us</h3>
          <p>
            If you have any questions about our Cookie Policy, contact us at:
          </p>
          <p><strong>Email:</strong> support@fundify.com<br /><strong>Phone:</strong> [Insert Number]<br /><strong>Address:</strong> 📍 Lahore, Pakistan</p>
        </div>
      </main>

      {/* Footer */}
      <FooterLayout />
    </>
  );
};

export default CookiePolicy;