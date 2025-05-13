import { useState } from "react";
import HeaderLayout from "./Layout/HeaderLayout";
import FooterLayout from "./Layout/FooterLayout";

// Campaign data
const campaignsData = [
  { id: 1, title: "Clean Peshawar", location: "Peshawar", description: "Lorem ipsum dolor sit amet...", image: "/images/clean-peshawar.png", raised: 10000, goal: 50000 },
  { id: 2, title: "Accident Victim", location: "Nasiri Valley", description: "Lorem ipsum dolor sit amet...", image: "/images/accident-victim.jpg", raised: 100000, goal: 1000000 },
  { id: 3, title: "Build a Shelter", location: "Karachi", description: "Lorem ipsum dolor sit amet...", image: "/images/build-shelter.jpg", raised: 100000, goal: 10000000 },
  { id: 4, title: "Earthquake Victim", location: "Jhelum", description: "Lorem ipsum dolor sit amet...", image: "/images/earthquake-victim.jpg", raised: 10000, goal: 2000000 },
  { id: 5, title: "Help Kids Study", location: "Sheikhupura", description: "Lorem ipsum dolor sit amet...", image: "/images/help-kids.jpg", raised: 500000, goal: 2000000 },
  { id: 6, title: "Save Rhino", location: "Lahore", description: "Lorem ipsum dolor sit amet...", image: "/images/save-rhino.jpg", raised: 100000, goal: 4000000 },
];

const formatCurrency = (amount) => `Rs. ${amount.toLocaleString()}`;

function CampaignCard({ campaign }) {
  const progressPercentage = (campaign.raised / campaign.goal) * 100;
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <img src={campaign.image || "/placeholder.svg"} alt={campaign.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold">{campaign.title}</h3>
          <span className="text-sm text-gray-600">{campaign.location}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">{campaign.description}</p>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">{formatCurrency(campaign.raised)}</span>
          <span className="font-medium text-green-700">{formatCurrency(campaign.goal)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${Math.min(progressPercentage, 100)}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default function ViewAllProjects() {
  const [visibleCampaigns, setVisibleCampaigns] = useState(6);

  const loadMore = () => {
    setVisibleCampaigns((prev) => prev + 3);
  };

  return (
    <main>
      <HeaderLayout />
      <div className="max-w-7xl mx-auto px-4 py-12 mt-10">
        <h2 className="text-2xl font-bold mb-8">Explore</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {campaignsData.slice(0, visibleCampaigns).map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
        {visibleCampaigns < campaignsData.length && (
          <div className="flex justify-center">
            <button onClick={loadMore} className="bg-[#4A5D45] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors">
              Load More
            </button>
          </div>
        )}
        {/* Chat Button */}
        <div className="fixed bottom-8 right-8">
          <button className="bg-[#4A5D45] text-white rounded-full p-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>
      <FooterLayout />
    </main>
  );
}