import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Header from "./Layout/HeaderLayout";
import Footer from "./Layout/FooterLayout";

export default function GetStartedPage() {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.user);

  const stories = [
    {
      title: "Helping Kids Study",
      description:
        "Chris, a passionate student with big dreams, launched a campaign to support their education and build a small library for underprivileged kids. With determination and a clear vision, they raised Rs. 210,000. The generous support not only funded their studies but also brought books and hope to an entire community.",
      amount: "Chris raised Rs. 210,000 to help fund their study & library needs.",
      image: "/Images/kids-studying.jpg",
    },
    {
      title: "Bringing Clean Water to Village",
      description:
        "Ayesha, inspired by her village’s lack of clean drinking water, started a fundraiser to install a water filtration plant. The campaign gained massive support, and she successfully raised Rs. 300,000. Now, hundreds of villagers enjoy access to safe water daily.",
      amount: "Ayesha raised Rs. 300,000 to provide clean water to her community.",
      image: "/Images/clean-water.jpg", 
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

   const handleJoinClick = () => {
        // Pehle check karein ke user login hai ya nahin
        if (!isAuthenticated) {
            toast.error("Please log in first to create a campaign");
            navigate("/login");
            return;
        }

        // Ab KYC status check karein
        if (user && user.kycStatus === 'Approved') {
            navigate("/create-campaign");
        } else {
            toast.info("Please complete your KYC verification first to create a campaign.");
            navigate("/kyc-form"); // Agar KYC approved nahin hai to KYC page par bhej dein
        }
    };


  const currentStory = stories[currentStoryIndex];

  return (
    <main>
      <Header />
      <div className="how-it-works-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mt-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
            How <span className="text-fundify-green">FUNDIFY</span> Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Fundify is the perfect platform to raise funds, whether you're an
            individual, team, or organization.
          </p>
        </div>

        {/* Video Illustration */}
        <div className="flex justify-center mb-12 sm:mb-16">
          <div className="relative w-full max-w-2xl">
            <video
              controls
              autoPlay
              muted
              loop
              className="video-player rounded-lg shadow-lg w-full h-auto"
            >
              <source src="/videos/A_young_entrepreneur_V1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Steps Section */}
        <div className="steps-container grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {[
            {
              title: "1. Start a fundraiser",
              steps: [
                "Set your fundraiser goal",
                "Tell your story",
                "Add a picture or video",
                "Watch a video tutorial",
              ],
            },
            {
              title: "2. Share with friends",
              steps: [
                "Send emails",
                "Send text messages",
                "Share on social media",
                "Watch a video tutorial",
              ],
            },
            {
              title: "3. Manage Donations",
              steps: ["Accept donations", "Thank donors", "Withdraw funds"],
            },
          ].map((section, idx) => (
            <div key={idx} className="step-card text-center md:text-left p-4 rounded-lg">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">{section.title}</h3>
              <ul className="space-y-2 text-gray-600">
                {section.steps.map((step, index) => (
                  <li key={index} className="flex items-center justify-center md:justify-start">
                    <span className="text-fundify-green mr-3 text-xl font-bold">•</span>
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
              onClick={handleJoinClick}
              className="join-button bg-[#4A5D45] text-white px-8 py-3 rounded-lg text-lg font-semibold"
          >
              Join Fundify
          </button>
        </div>

        {/* Success Story Carousel */}
        <div className="story-carousel relative bg-gray-50 rounded-lg overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 sm:p-8 order-2 md:order-1 flex flex-col justify-center">
              <p className="text-sm text-gray-500 mb-1">Fundify Stories</p>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3">{currentStory.title}</h3>
              <p className="text-gray-600 mb-6">{currentStory.description}</p>
              <p className="text-lg font-bold text-fundify-green">{currentStory.amount}</p>
            </div>
            <div className="h-64 md:h-full order-1 md:order-2">
              <img
                src={currentStory.image}
                alt={currentStory.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <button
            onClick={handlePrev}
            className="carousel-arrow left-arrow absolute left-2 sm:left-1/2 top-1/2 -translate-y-1/2 bg-[#4A5D45] text-white p-2 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="carousel-arrow right-arrow absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-[#4A5D45] text-white p-2 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <style jsx global>{`
        /* --- Google Font Import --- */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        /* --- General Styling & Variables --- */
        .how-it-works-page {
          font-family: 'Poppins', sans-serif;
          --fundify-green: #4A5D45;
          --fundify-light-green: #B2C9AD;
          --shadow-color: rgba(74, 93, 69, 0.1);
        }

        .text-fundify-green {
          color: var(--fundify-green);
        }
        
        h2, h3 {
           letter-spacing: -0.02em;
        }

        .video-player {
          border: 4px solid white;
          box-shadow: 0 10px 25px -5px var(--shadow-color), 0 8px 10px -6px var(--shadow-color);
        }
        
        /* --- Steps Section Timeline Connector --- */
        .steps-container {
          position: relative;
        }

        .step-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid #e5e7eb;
          background-color: white;
        }

        .step-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px -3px var(--shadow-color);
        }


        /* --- Join Button Styling --- */
        .join-button {
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px var(--shadow-color);
          border: 1px solid transparent;
        }

        .join-button:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 15px -3px var(--shadow-color);
          background-color: #3A4433; /* Darker green */
        }
        
        .join-button:active {
           transform: scale(1.02);
        }

        /* --- Success Story Carousel --- */
        .story-carousel {
          border: 1px solid #e5e7eb;
        }
        
        .story-carousel img {
            transition: transform 0.4s ease-out;
        }

        .story-carousel:hover img {
            transform: scale(1.03);
        }
        
        .carousel-arrow {
            background-color: rgba(74, 93, 69, 0.7);
            backdrop-filter: blur(2px);
            transition: all 0.3s ease;
        }
        
        .carousel-arrow:hover {
            background-color: var(--fundify-green);
            transform: translateY(-50%) scale(1.1);
        }
      `}</style> 
      <Footer />
    </main>
  );
}