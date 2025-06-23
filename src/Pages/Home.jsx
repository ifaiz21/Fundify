// src/Pages/Home.jsx
import { useState, useEffect } from "react"; // Import useState and useEffect
import axios from 'axios'; // Import axios for API calls
import Hero from "./Layout/Hero";
import CampaignListing from "./HomePage/CampaignListing";
import AboutSection from "./HomePage/AboutSection";
import CampaignStats from "./HomePage/CampaignStats";
import PartnersSection from "./HomePage/PartnersSection";
import FooterLayout from "./Layout/FooterLayout";

export default function Home({ showToast }) { // Assuming showToast is passed as a prop from App.jsx
  const [email, setEmail] = useState('');
  const [showNewsletterForm, setShowNewsletterForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // Local message state for feedback

  // Effect to check sessionStorage on component mount
  useEffect(() => {
    if (sessionStorage.getItem('newsletterSubscribedThisSession') === 'true') {
      setShowNewsletterForm(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null); // Clear previous messages

    try {
      const response = await axios.post('http://localhost:5000/api/newsletter/subscribe', { email });
      
      if (response.status === 201) {
        setMessage({ type: 'success', text: response.data.message || 'Successfully subscribed!' });
        setShowNewsletterForm(false); // Hide the form on successful subscription
        sessionStorage.setItem('newsletterSubscribedThisSession', 'true'); // Store flag in sessionStorage
        if (showToast) showToast(response.data.message || 'Successfully subscribed!', 'success');
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      let errorMessage = 'Failed to subscribe. Please try again.';
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = error.response.data.message || 'This email is already subscribed.';
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      setMessage({ type: 'error', text: errorMessage });
      if (showToast) showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
      setEmail(''); // Clear email input
    }
  };

  return (
    <main>
      <Hero />
      <CampaignListing />
      <AboutSection />
      <CampaignStats />
      <PartnersSection />

      {/* Newsletter Subscription Section - Conditionally rendered */}
      {showNewsletterForm && (
        <section className=" text-white py-12 px-4">
          <div className="max-w-xl mx-auto p-8 rounded-lg shadow-xl" style={{ backgroundColor: '#4a5d45' }}>
            <h2 className="text-3xl font-bold mb-4 text-white">
              Subscribe to our newsletter.
            </h2>
            <p className="text-gray-200 mb-6 text-justify">
              Stay updated with Fundify's latest campaigns, success stories, and community news. Get insights into impactful projects and discover new ways to make a difference.
            </p>
            
            {message && (
              <div className={`mb-4 p-3 rounded text-center ${
                message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                style={{ backgroundColor: '#625d99' }}
                disabled={loading}
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </section>
      )}

      <FooterLayout />
    </main>
  );
}