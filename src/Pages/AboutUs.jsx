import Header from "./Layout/HeaderLayout"
import Footer from "./Layout/FooterLayout"

const AboutUsPage = () => {
  // Team members data
  const teamMembers = [
    { id: 1, name: "Kamran Shahid", role: "Founder", image: "./Images/KamranShahid.jpg" },
    { id: 2, name: "M. Faiz", role: "CTO", image: "./Images/Faiz.jpg" },
    { id: 3, name: "M. Ibraheem", role: "CFO", image: "./Images/Ibraheem.jpg" },
    { id: 4, name: "M. Noukhaiz", role: "COO", image: "./Images/Noukhaiz.jpg" },
    { id: 5, name: "Rameen khan", role: "CMO", image: "./Images/Rameen.jpeg" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Banner */}
        <div className="relative h-80">
          <img
            src="./Images/crowd.jpeg"
            alt="Crowdfunding"
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
            <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight">
              CROWDFUND
              <br />
              YOUR
              <br />
              BUSINESS
            </h1>
            <p className="text-white text-lg mt-2">HELP THEM HELP YOU</p>
          </div>
        </div>

        {/* About Us Content */}
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-600 mb-8 text-justify">
              Fundify is a crowdfunding platform that connects entrepreneurs with investors. Our mission is to
              democratize fundraising and make capital accessible to everyone. We believe that great ideas should not be
              limited by access to traditional funding sources. Through our platform, we enable entrepreneurs to
              showcase their ideas to a global audience and raise the funds they need to bring their visions to life. We
              are committed to fostering innovation, supporting dreams, and creating opportunities for growth.
            </p>

            {/* Why We Started Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div>
                <h2 className="text-2xl font-bold text-[#4B5842] mb-4">Why We Started?</h2>
                <p className="text-gray-600 mb-4 text-justify">
                  Fundify was born in 2018 from a simple idea: what if we could help entrepreneurs access funding
                  without the traditional barriers? Our founder, Ava Patel, experienced firsthand the challenges of
                  raising capital for her startup and recognized the need for a more inclusive approach to fundraising.
                </p>
                <p className="text-gray-600 mb-4 text-justify">
                  The journey began with a small team working out of a shared office space, fueled by a passion to
                  democratize access to capital. We built our platform with the entrepreneur in mind, focusing on
                  creating a user-friendly experience that would make fundraising accessible to everyone, regardless of
                  their background or connections.
                </p>
                <p className="text-gray-600 mb-4 text-justify">
                  Today, Fundify has grown into a global community of creators, backers, and innovators. We've helped
                  thousands of projects come to life, raising millions of dollars for entrepreneurs across various
                  industries. Our success is measured not just by the funds raised but by the dreams realized and the
                  impact created through our platform.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <img src="./Images/team-collaboration.png" alt="Team Collaboration" className="max-w-full h-auto" />
              </div>
            </div>

            {/* Meet Our Team Section */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-[#4B5842] mb-4">Meet Our Team</h2>
              <p className="text-gray-600 mb-8">Fundify is made up of a team committed to empowering others.</p>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gray-300 mb-3 overflow-hidden">
                      <img
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "https://via.placeholder.com/150"
                        }}
                      />
                    </div>
                    <h3 className="font-medium text-center">{member.name}</h3>
                    <p className="text-sm text-gray-500 text-center">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

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
    </div>
  )
}

export default AboutUsPage;

