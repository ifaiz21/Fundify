import React from "react";
import HeaderLayout from "./Layout/HeaderLayout"; 
import FooterLayout from "./Layout/FooterLayout"; 

const CookiePolicy = () => {
    return (
      <div className="cookie-policy-page flex flex-col min-h-screen bg-gray-50">
          {/* Header */}
          <HeaderLayout />

          {/* Main Content */}
          <main className="flex-grow container mx-auto my-8 sm:my-12 px-4 sm:px-6">
              <div className="policy-card max-w-4xl mx-auto p-6 sm:p-10 bg-white shadow-lg rounded-lg">
                  <div className="policy-header mb-8">
                      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Cookie Policy</h1>
                      <p className="text-gray-500">Last updated: June 29, 2025</p>
                  </div>

                  <div className="prose max-w-none">
                      <p>
                          This Cookie Policy explains how <strong>Fundify</strong> ("we", "us", or "our") uses cookies and similar tracking technologies when you use our platform. By using our service, you consent to the use of cookies as described in this policy.
                      </p>

                      <h3 className="section-heading">1. What Are Cookies?</h3>
                      <p>
                          Cookies are small text files stored on your device (computer, tablet, mobile phone) by your browser when you visit a website. They help us enhance your experience by remembering your preferences, recognizing you on repeat visits, and ensuring the platform functions correctly.
                      </p>

                      <h3 className="section-heading">2. Why We Use Cookies</h3>
                      <p>We use cookies for several key reasons:</p>
                      <ul>
                          <li><strong>Essential Operations:</strong> To ensure the platform functions properly, including login, session management, and security.</li>
                          <li><strong>Performance & Analytics:</strong> To analyze traffic, understand how users interact with our site, and improve performance.</li>
                          <li><strong>Functionality:</strong> To remember your preferences and settings, providing a more personalized experience.</li>
                          <li><strong>Security:</strong> To support secure fundraising, payment operations, and protect against fraudulent activity.</li>
                      </ul>

                      <h3 className="section-heading">3. Types of Cookies We Use</h3>
                      <ul>
                          <li><strong>Essential Cookies:</strong> These are strictly necessary for providing the services you request and for the website to function. They cannot be disabled.</li>
                          <li><strong>Performance Cookies:</strong> These help us collect data about site usage and performance to make improvements. All data is aggregated and anonymous.</li>
                          <li><strong>Functional Cookies:</strong> These remember choices you make (like your username or language) to provide a more tailored experience.</li>
                          <li><strong>Third-Party Cookies:</strong> These are used by integrated services we use, such as our payment processor (e.g., Stripe) and analytics provider (e.g., Google Analytics).</li>
                      </ul>

                      <h3 className="section-heading">4. Managing Your Cookies</h3>
                      <p>
                          You have the right to decide whether to accept or reject cookies. You can control or delete cookies using your browser settings. Most browsers provide options to:
                      </p>
                      <ul>
                          <li>View which cookies are currently stored on your device.</li>
                          <li>Delete cookies individually or all at once.</li>
                          <li>Block cookies from specific websites or from all websites.</li>
                      </ul>
                      <p>
                          Please note that if you choose to block or delete cookies, certain features of the Fundify platform may be affected and may not function as intended.
                      </p>

                      <h3 className="section-heading">5. Updates to This Policy</h3>
                      <p>
                          We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to revisit this page regularly to stay informed about our use of cookies.
                      </p>

                      <h3 className="section-heading">6. Contact Us</h3>
                      <p>
                          If you have any questions about our use of cookies or this Cookie Policy, please do not hesitate to contact us:
                      </p>
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
              .cookie-policy-page {
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
              
              .prose h3 {
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
              }

              .prose ul {
                  list-style-type: none;
                  padding-left: 0;
                  margin-top: 1rem;
                  space-y: 0.5rem;
              }
              
              .prose ul li {
                  position: relative;
                  padding-left: 1.75rem; /* Creates space for the custom bullet */
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
              }
          `}</style>
      </div>
  );
};

export default CookiePolicy;
