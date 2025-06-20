function AboutSection() {
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
                src="/images/funding-illustration.png"
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
              <a
                href="/about"
                // Professional button styling applied here
                className="inline-block px-8 py-3 bg-[#4A5D45] text-white rounded-full 
                           font-medium shadow-md hover:bg-[#3E4B3A] hover:shadow-lg 
                           transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Read more About us
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
                src="/images/discussion-illustration.png"
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
      </div>
    );
  }
  
  export default AboutSection;