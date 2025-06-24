// src/Pages/Home.jsx
import Hero from "./Layout/Hero";
import CampaignListing from "./HomePage/CampaignListing";
import AboutSection from "./HomePage/AboutSection";
import CampaignStats from "./HomePage/CampaignStats";
import PartnersSection from "./HomePage/PartnersSection";
import SubscribeBox from "./HomePage/SubscribeBox";
import FooterLayout from "./Layout/FooterLayout";

export default function Home({ showToast }) {  
  return (
    <main>
      <Hero />
      <CampaignListing />
      <AboutSection />
      <CampaignStats />
      <PartnersSection />
      <SubscribeBox showToast={showToast} /> 
      <FooterLayout />
    </main>
  );
}