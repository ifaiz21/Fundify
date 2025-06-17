import { useState } from "react";
import {useNavigate} from "react-router-dom";
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
  const navigate = useNavigate();
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
          <span className="font-medium text-[#65835e]">{formatCurrency(campaign.goal)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="bg-[#65835e] h-1.5 rounded-full" style={{ width: `${Math.min(progressPercentage, 100)}%` }}></div>
        </div>

        {/* Explore and Donate Buttons */}
        <div className="flex justify-between mt-4">
          <button 
            onClick={() => alert(`Exploring ${campaign.title}`)} 
            className="bg-[#65835e] text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
            Explore
          </button>
          <button 
            onClick={() => navigate ("/donate")} 
            className="bg-[#65835e] text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
            Donate
          </button>
        </div>

      </div>
    </div>
  );
}

export default function ViewAllProjects() {
  const [visibleCampaigns, setVisibleCampaigns] = useState(3);

  const loadMore = () => {
    setVisibleCampaigns((prev) => prev + 3);
  };

  return (
    <main>
      <HeaderLayout />
      <div className="max-w-7xl mx-auto px-4 py-12 mt-2">
        <h2 className="text-4xl font-bold mb-6 mt-2 text-[#4A5D45] text-center">Explore Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 ">
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
        
      </div>
      <FooterLayout />
    </main>
  );
}