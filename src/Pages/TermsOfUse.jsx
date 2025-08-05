import React, { useEffect, useRef } from "react";
// GSAP aur ScrollTrigger ko import karein
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import HeaderLayout from "./Layout/HeaderLayout";
import FooterLayout from "./Layout/FooterLayout";

// ScrollTrigger plugin ko GSAP ke saath register karein
gsap.registerPlugin(ScrollTrigger);

const TermsOfUse = () => {
  // Aik ref banayein jo poore main content area ko point karega. 
  // Hum is ref ko animation context ke liye istemal kareinge.
  const mainContentRef = useRef(null);

  // useEffect hook animation logic ke liye
  useEffect(() => {
    // gsap.context() istemal karna behtreen practice hai.
    // Ye animations ko scope karta hai aur cleanup aasan banata hai.
    const ctx = gsap.context(() => {
      
      // Animation 1: Poora policy card load par animate ho
      gsap.from('.policy-card', {
        duration: 0.8,
        opacity: 0,
        y: 50, // 50px neechay se ooper aaye ga
        ease: 'power3.out',
        delay: 0.2
      });

      // Animation 2: Har section heading scroll par animate ho
      const headings = gsap.utils.toArray('.section-heading');
      headings.forEach(heading => {
        gsap.from(heading, {
          duration: 0.6,
          opacity: 0,
          x: -30, // Left se aayega
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%', // Jab heading ka top viewport ke 85% hissay tak pohanchay
            end: 'bottom 20%',
            toggleActions: 'play none none none', // Sirf aik baar play ho
          },
        });
      });

    }, mainContentRef); // Context ko main content ref se scope karein

    // Cleanup function: Jab component unmount ho, to saari animations ko revert kar dein.
    // Is se memory leaks se bacha ja sakta hai.
    return () => ctx.revert(); 
    
  }, []); // Khali array [] ka matlab ye effect sirf aik baar component mount hone par chalega.

  return (
    <div className="terms-of-use-page flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderLayout />

      {/* Main Content - Yahan ref ko attach karein */}
      <main ref={mainContentRef} className="flex-grow container mx-auto my-8 sm:my-12 px-4 sm:px-6">
        <div className="policy-card max-w-4xl mx-auto p-6 sm:p-10 bg-white shadow-lg rounded-lg">
          <div className="policy-header mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Terms of Use</h1>
            <p className="text-gray-500">Effective Date: June 29, 2025</p>
          </div>

          <div className="prose max-w-none">
            <p>
              Welcome to <strong>Fundify</strong>! These Terms of Use (“Terms”) govern your access to and use of our platform, services, and content. By accessing or using Fundify, you agree to be bound by these Terms and our Privacy Policy.
            </p>

            {/* In sab headings par animation apply hogi */}
            <h3 className="section-heading">1. Eligibility</h3>
            <p>You must be at least 18 years old and legally capable of forming a binding contract to create an account and use our services. If you are using Fundify on behalf of an organization, you represent that you have the authority to bind that entity to these Terms.</p>

            <h3 className="section-heading">2. User Accounts</h3>
            <p>To access certain features, you must create an account. You agree to:</p>
            <ul>
              <li>Provide accurate, current, and complete information during registration.</li>
              <li>Maintain the security and confidentiality of your account password.</li>
              <li>Accept full responsibility for all activities that occur under your account.</li>
              <li>Notify us immediately of any unauthorized use of your account.</li>
            </ul>

            <h3 className="section-heading">3. Project Creation & Contributions</h3>
              <ul>
                <li><strong>For Creators:</strong> You are responsible for providing transparent, accurate, and lawful details about your campaign. You are obligated to fulfill any promises or rewards offered to your backers.</li>
                <li><strong>For Backers:</strong> You understand that contributing to a campaign does not guarantee its success or the delivery of a reward. Fundify does not offer refunds; any disputes are between the creator and the backer.</li>
              </ul>


            <h3 className="section-heading">4. Fees and Payments</h3>
            <p>Creating an account on Fundify is free. However, we charge a service fee on funds raised by successful campaigns. All payments are processed securely via trusted third-party providers. You agree that all transactions are final and generally non-refundable.</p>

            <h3 className="section-heading">5. Prohibited Conduct</h3>
            <p>You agree not to engage in any of the following prohibited activities:</p>
            <ul>
              <li>Using the platform for any unlawful or fraudulent purpose.</li>
              <li>Impersonating any person or entity or misrepresenting your affiliation.</li>
              <li>Posting content that is hateful, defamatory, obscene, or discriminatory.</li>
              <li>Attempting to breach the platform's security measures, including introducing viruses or spam.</li>
            </ul>

            <h3 className="section-heading">6. Intellectual Property</h3>
            <p>Fundify owns all rights to the platform’s content and branding, including our logo, design, and software. You retain ownership of the content you create and post, but you grant us a worldwide, non-exclusive, royalty-free license to display and use it for platform functionality and marketing purposes.</p>

            <h3 className="section-heading">7. Disclaimer of Warranties</h3>
            <p>The Fundify platform is provided on an "as is" and "as available" basis. We make no guarantees regarding platform uptime, reliability, or the accuracy of user-provided content. We disclaim all warranties, express or implied.</p>
            
            <h3 className="section-heading">8. Limitation of Liability</h3>
            <p>To the fullest extent permitted by law, Fundify shall not be liable for any indirect, incidental, or consequential damages from your use of the platform. Our total liability to you for any claims shall not exceed the amount of fees paid by you to us in the 12 months prior to the claim, if any.</p>
            
            <h3 className="section-heading">9. Governing Law</h3>
            <p>These Terms are governed by and construed in accordance with the laws of the <strong>Islamic Republic of Pakistan</strong>, without regard to its conflict of law provisions.</p>

            <h3 className="section-heading">10. Contact Us</h3>
            <p>If you have any questions about these Terms, please contact us:</p>
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
        .terms-of-use-page {
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

export default TermsOfUse;