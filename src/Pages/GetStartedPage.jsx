import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Layout/HeaderLayout";
import Footer from "./Layout/FooterLayout";

export default function GetStartedPage() {
  const navigate = useNavigate();

  const stories = [
    {
      title: "Helping Kids Study",
      description:
        "Chris, a passionate student with big dreams, launched a campaign to support their education and build a small library for underprivileged kids. With determination and a clear vision, they raised Rs. 210,000. The generous support not only funded their studies but also brought books and hope to an entire community.",
      amount: "Chris raised Rs. 210,000 to help fund their study & library needs.",
      image: "/images/kids-studying.jpg",
    },
    {
      title: "Bringing Clean Water to Village",
      description:
        "Ayesha, inspired by her village’s lack of clean drinking water, started a fundraiser to install a water filtration plant. The campaign gained massive support, and she successfully raised Rs. 300,000. Now, hundreds of villagers enjoy access to safe water daily.",
      amount: "Ayesha raised Rs. 300,000 to provide clean water to her community.",
      image: "/images/clean-water.jpg", 
    },
  ];

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const handlePrev = () => {
    setCurrentStoryIndex((prevIndex) =>
      prevIndex === 0 ? stories.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentStoryIndex((prevIndex) =>
      prevIndex === stories.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentStory = stories[currentStoryIndex];

  return (
    <main>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-4 mt-12">
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
          <div className="relative">
            <video
              width="400"
              controls
              autoPlay
              muted
              loop
              className="rounded-lg shadow-lg"
            >
              <source src="/videos/A_young_entrepreneur_V1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>


        {/* Steps Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              title: "Start a fundraiser",
              steps: [
                "Set your fundraiser goal",
                "Tell your story",
                "Add a picture or video",
                "Watch a video tutorial",
              ],
            },
            {
              title: "Share with friends",
              steps: [
                "Send emails",
                "Send text messages",
                "Share on social media",
                "Watch a video tutorial",
              ],
            },
            {
              title: "Manage Donation",
              steps: ["Accept donations", "Thank donors", "Withdraw funds"],
            },
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

        {/*Join Button */}
        <div className="flex justify-center mb-16">
          <button
            onClick={() => {
              const isLoggedIn = localStorage.getItem("token"); // adjust this according to your auth logic

              if (isLoggedIn) {
                navigate("/create-campaign");
              } else {
                navigate("/login?message=Please login first to create a campaign");
              }
            }}
            className="bg-[#4A5D45] text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
          >
            Join Fundify
          </button>
        </div>

        {/* Success Story Carousel */}
        <div className="relative bg-gray-50 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8">
              <p className="text-sm text-gray-500 mb-1">Fundify Stories</p>
              <h3 className="text-2xl font-bold mb-3">{currentStory.title}</h3>
              <p className="text-gray-600 mb-6">{currentStory.description}</p>
              <p className="text-sm font-medium">{currentStory.amount}</p>
            </div>
            <div className="h-full">
              <img
                src={currentStory.image}
                alt={currentStory.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#4A5D45] text-white p-2 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#4A5D45] text-white p-2 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
      {/* Chat Button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-[#4A5D45] text-white rounded-full p-4 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>
      <Footer />
    </main>
  );
}