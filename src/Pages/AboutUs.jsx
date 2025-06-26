import { useState } from "react"
import Header from "./Layout/HeaderLayout"
import Footer from "./Layout/FooterLayout"

const AboutUsPage = () => {
  const [selectedMember, setSelectedMember] = useState(null)

  const teamMembers = [
    {
      id: 1,
      name: "Kamran Shahid",
      role: "Founder",
      image: "./Images/KamranShahid.jpg",
      email: "kamranch2568@gmail.com",
      bio: "Kamran is a visionary entrepreneur with a passion for leveraging technology to solve real-world problems. He specializes in startup incubation, strategic leadership, and business model innovation in the tech sector.",
    },
    {
      id: 2,
      name: "M. Faiz",
      role: "CTO",
      image: "./Images/Faiz.jpg",
      email: "mohammadfaiz1971@gmail.com",
      bio: "Faiz leads the technology team with a deep background in full-stack development, DevOps, and cloud architecture. He is responsible for shaping the technical vision of Fundify and implementing scalable solutions.",
    },
    {
      id: 3,
      name: "M. Ibraheem",
      role: "CFO",
      image: "./Images/Ibraheem.jpg",
      email: "qamaribrahim112@gmail.com",
      bio: "Ibraheem brings financial expertise with a tech twist. He integrates data analytics and automation in financial planning, ensuring that Fundify’s growth is sustainable and data-driven.",
    },
    {
      id: 4,
      name: "M. Noukhaiz",
      role: "COO",
      image: "./Images/Noukhaiz.jpg",
      email: "muhammadnaukhaiz@gmail.com",
      bio: "Noukhaiz oversees operations with a focus on optimizing workflows using AI and machine learning. He’s passionate about process automation and operational scalability.",
    },
    {
      id: 5,
      name: "Rameen Khan",
      role: "COO",
      image: "./Images/Rameen.jpeg",
      email: "f2021266046@umt.edu.pk",
      bio: "Rameen is a tech-savvy operations lead who ensures seamless user experiences and robust backend coordination. She specializes in system design and data security management.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header hideAboutUs={true} />

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
              Fundify is a crowdfunding platform that connects entrepreneurs with investors. Our mission is to democratize fundraising and make capital accessible to everyone. We believe that great ideas should not be limited by access to traditional funding sources. Through our platform, we enable entrepreneurs to showcase their ideas to a global audience and raise the funds they need to bring their visions to life. We are committed to fostering innovation, supporting dreams, and creating opportunities for growth.
            </p>

            {/* Why We Started */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div>
                <h2 className="text-2xl font-bold text-[#4B5842] mb-4">Why We Started?</h2>
                <p className="text-gray-600 mb-4 text-justify">
                  Fundify was born in 2018 from a simple idea: what if we could help entrepreneurs access funding without the traditional barriers? Our founder, Ava Patel, experienced firsthand the challenges of raising capital for her startup and recognized the need for a more inclusive approach to fundraising.
                </p>
                <p className="text-gray-600 mb-4 text-justify">
                  The journey began with a small team working out of a shared office space, fueled by a passion to democratize access to capital. We built our platform with the entrepreneur in mind, focusing on creating a user-friendly experience that would make fundraising accessible to everyone, regardless of their background or connections.
                </p>
                <p className="text-gray-600 mb-4 text-justify">
                  Today, Fundify has grown into a global community of creators, backers, and innovators. We've helped thousands of projects come to life, raising millions of dollars for entrepreneurs across various industries. Our success is measured not just by the funds raised but by the dreams realized and the impact created through our platform.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <img src="./Images/team-collaboration.png" alt="Team Collaboration" className="max-w-full h-auto" />
              </div>
            </div>

            {/* Meet Our Team */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-[#4B5842] mb-4">Meet Our Team</h2>
              <p className="text-gray-600 mb-8">Fundify is made up of a team committed to empowering others.</p>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col items-center cursor-pointer transition duration-200 hover:scale-105"
                    onClick={() => setSelectedMember(member)}
                  >
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

              {/* Bio Section with Animation */}
              {selectedMember && (
                <div
                  className="mt-10 p-6 bg-gray-100 rounded-xl shadow-md transition-all duration-500 ease-in-out animate-fade-in"
                  style={{
                    opacity: selectedMember ? 1 : 0,
                    transform: selectedMember ? "translateY(0px)" : "translateY(20px)",
                  }}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="w-20 h-20 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-xl font-bold">{selectedMember.name}</h3>
                      <p className="text-gray-600">{selectedMember.role}</p>
                      <a
                        href={`mailto:${selectedMember.email}`}
                        className="text-blue-500 text-sm hover:underline"
                      >
                        {selectedMember.email}
                      </a>
                    </div>
                  </div>
                  <p className="text-gray-700 text-justify">{selectedMember.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AboutUsPage
