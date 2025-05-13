import Header from "./Layout/HeaderLayout";
import Footer from "./Layout/FooterLayout";
import { useNavigate } from "react-router-dom";

export default function GetStartedPage() {
  const navigate = useNavigate();

  return (
    <main>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-16 mt-24">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">
            How <span className="text-[#4A5D45]">FUNDIFY</span> Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fundify is the perfect platform to raise funds, whether you're an
            individual, team, or organization.
          </p>
        </div>
        
        {/* Video Illustration */}
        <div className="flex justify-center mb-16">
          <div className="relative cursor-pointer">
            <img src="/images/money-hand.png" alt="Fundraising illustration" className="w-64 h-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-black bg-opacity-60 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Steps Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { title: "Start a fundraiser", steps: ["Set your fundraiser goal", "Tell your story", "Add a picture or video", "Watch a video tutorial"] },
            { title: "Share with friends", steps: ["Send emails", "Send text messages", "Share on social media", "Watch a video tutorial"] },
            { title: "Manage Donation", steps: ["Accept donations", "Thank donors", "Withdraw funds"] },
          ].map((section, idx) => (
            <div key={idx} className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.steps.map((step, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-[#4A5D45] mr-2">•</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Join Button */}
        <div className="flex justify-center mb-16">
          <button 
            onClick={() => navigate("/donation")} 
            className="bg-[#4A5D45] text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors">
            Join Fundify
          </button>
        </div>
        
        {/* Success Story */}
        <div className="relative bg-gray-50 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8">
              <p className="text-sm text-gray-500 mb-1">Fundify Stories</p>
              <h3 className="text-2xl font-bold mb-3">Helping Kids Study</h3>
              <p className="text-gray-600 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fermentum
                lobortis eu neque egestas adipiscing sem. Ut commodo elementum
                dolor amet, pellentesque posuere risus nunc.
              </p>
              <p className="text-sm font-medium">
                Chris raised Rs. 210,000 to help fund their study & library needs.
              </p>
            </div>
            <div className="h-full">
              <img src="/images/kids-studying.jpg" alt="Kids studying" className="w-full h-full object-cover" />
            </div>
          </div>
          {/* Navigation Arrows */}
          <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#4A5D45] text-white p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#4A5D45] text-white p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
