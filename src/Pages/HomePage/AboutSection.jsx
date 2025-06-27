import React from 'react'; // Added React import

function AboutSection() {
    // Helper function to render button text with individual spans for animation
    const renderButtonText = (text) => {
        return (
            <p className="button__text">
                {text.split('').map((char, index) => (
                    <span key={index} style={{ '--index': index }}>{char}</span>
                ))}
            </p>
        );
    };

    return (
      <div className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-inner-lg">
        {/* Top Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-medium text-gray-800 mb-4">
            Support local initiatives and national progress, all in one place.
          </h2>
  
          <h1 className="text-4xl font-bold mb-16">
            Distribute aid <span className="text-[#B2C9AD]">easily</span>,{" "}
            <span className="text-[#B2C9AD]">quickly</span>, and{" "}
            <span className="text-[#B2C9AD]">transparently</span>.
          </h1>
  
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            <div className="lg:w-1/2">
              <img
                src="/Images/funding-illustration.png"
                alt="People funding ideas"
                className="w-full max-w-md mx-auto rounded-lg shadow-xl"
              />
            </div>
  
            <div className="lg:w-1/2 text-right">
              <p className="text-lg text-gray-700 mb-4 text-justify">
                Fundify is a national crowdfunding platform built to support
                Pakistan's communities, entrepreneurs, and causes.
              </p>
              <p className="text-lg text-gray-700 mb-4 text-justify">
                We connect people with the resources they need to create
                impact empowering individuals, transforming communities, and
                driving progress across the nation. Together, we make dreams a
                reality.
              </p>
              {/* New button HTML structure */}
              <a href="/about"> {/* Keep the anchor for navigation */}
                <button className="button">
                  {renderButtonText(" ")}
                  <div className="button__circle">
                    <svg
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="button__icon"
                      width="14"
                    >
                      <path
                        d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <svg
                      viewBox="0 0 14 15"
                      fill="none"
                      width="14"
                      xmlns="http://www.w3.org/2000/svg"
                      className="button__icon button__icon--copy"
                    >
                      <path
                        d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </button>
              </a>
            </div>
          </div>
        </div>
  
        {/* Mission Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-10">Our Mission</h2>
  
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            <div className="lg:w-1/2">
              <img
                src="/Images/discussion-illustration.png"
                alt="People in discussion"
                className="w-full max-w-md mx-auto rounded-lg shadow-xl"
              />
            </div>
  
            <div className="lg:w-1/2">
              <p className="text-gray-700 mb-4 text-justify">
              Our mission with Fundify is to empower creators, innovators, 
              and entrepreneurs by providing a transparent, secure, and 
              AI-driven crowdfunding platform. We aim to bridge the gap
              between passionate project owners and potential backers, 
              ensuring that every idea gets the support and visibility it deserves. 
              </p>
              <p className="text-gray-700 mb-4 text-justify">
              By leveraging advanced AI for personalized recommendations, 
              we strive to enhance user trust, improve funding success rates, 
              and revolutionize the crowdfunding experience.
              </p>
            </div>
          </div>
        </div>

        {/* Embedded CSS for the button */}
        <style jsx>{`
          .button {
            cursor: pointer;
            border: none;
            background: #4A5D45; /* Original background color */
            color: #fff;
            width: 70px; /* Adjust width as needed */
            height: 70px; /* Adjust height as needed */
            border-radius: 100%;
            overflow: hidden;
            position: relative;
            display: grid;
            place-content: center;
            transition: background 300ms, transform 200ms;
            font-weight: 500;
          }

          .button__text {
            position: absolute;
            inset: 0;
            animation: text-rotation 8s linear infinite;
            display: flex; /* Added for proper span positioning if needed */
            justify-content: center;
            align-items: center;

          }

          .button__text > span {
            position: absolute;
            transform: rotate(calc(19deg * var(--index)));
            inset: 7px;
          }
          
          /* Corrected for direct usage without PostCSS nested rules */
          .button__circle {
            position: relative;
            width: 40px;
            height: 40px;
            overflow: hidden;
            background: #fff;
            color: #7808d0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .button__icon--copy {
            position: absolute;
            transform: translate(-150%, 150%);
          }

          .button:hover {
            background: #000;
            transform: scale(1.05);
          }

          .button:hover .button__icon {
            color: #000;
          }

          .button:hover .button__icon:first-child {
            transition: transform 0.3s ease-in-out;
            transform: translate(150%, -150%);
          }

          .button:hover .button__icon--copy {
            transition: transform 0.3s ease-in-out 0.1s;
            transform: translate(0);
          }

          @keyframes text-rotation {
            to {
              rotate: 360deg;
            }
          }
        `}</style>
      </div>
    );
  }
  
  export default AboutSection;