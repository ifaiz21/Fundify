// src/Pages/Home.jsx
// import Header from "./Layout/Header";
import Hero from "./Layout/Hero";
import CampaignListing from "./HomePage/CampaignListing";
import AboutSection from "./HomePage/AboutSection";
import CampaignStats from "./HomePage/CampaignStats";
import PartnersSection from "./HomePage/PartnersSection";
import FooterLayout from "./Layout/FooterLayout"; //

export default function Home() {
  return (
    <main>
      {/* <Header hideHome={true} /> */}
      <Hero />
      <CampaignListing />
      <AboutSection />
      <CampaignStats />
      <PartnersSection />

      {/* New Newsletter Subscription Section */}
      <section className=" text-white py-12 px-4">
        <div className="max-w-xl mx-auto p-8 rounded-lg shadow-xl" style={{ backgroundColor: '#4a5d45' }}> {/* Inline style for the card-like background from your image */}
          <h2 className="text-3xl font-bold mb-4 text-white">
            Subscribe to our newsletter.
          </h2>
          <p className="text-gray-200 mb-6 text-justify">
            Stay updated with Fundify's latest campaigns, success stories, and community news. Get insights into impactful projects and discover new ways to make a difference.
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
              style={{ backgroundColor: '#625d99' }} // Inline style for the button color from your image
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <FooterLayout />
    </main>
  );
}