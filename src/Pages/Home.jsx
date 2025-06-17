// import Header from "./Layout/Header";
import Hero from "./Layout/Hero";
import CampaignListing from "./HomePage/CampaignListing";
import AboutSection from "./HomePage/AboutSection";
import CampaignStats from "./HomePage/CampaignStats";
import PartnersSection from "./HomePage/PartnersSection";
import FooterLayout from "./Layout/FooterLayout";
export default function Home() {
  return (
    <main>
      {/* <Header hideHome={true} /> */}
      <Hero />
      <CampaignListing />
      <AboutSection />
      <CampaignStats />
      <PartnersSection />
      <FooterLayout />
    </main>
  );
}