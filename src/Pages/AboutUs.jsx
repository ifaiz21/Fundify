import { useState } from "react"
import Header from "./Layout/HeaderLayout"
import Footer from "./Layout/FooterLayout"

const AboutUsPage = () => {
  const [selectedMember, setSelectedMember] = useState(null)

  const teamMembers = [
    {
      id: 1,
      name: "Kamran Shahid",
      role: "Founder & CEO",
      image: "./Images/KamranShahid.jpg",
      email: "kamranch2568@gmail.com",
      bio: "Kamran is a visionary entrepreneur with a passion for leveraging technology to solve real-world problems. He specializes in startup incubation, strategic leadership, and business model innovation in the tech sector.",
    },
    {
      id: 2,
      name: "M. Faiz",
      role: "Chief Technology Officer",
      image: "./Images/Faiz.jpg",
      email: "mohammadfaiz1971@gmail.com",
      bio: "Faiz leads the technology team with a deep background in full-stack development, DevOps, and cloud architecture. He is responsible for shaping the technical vision of Fundify and implementing scalable solutions.",
    },
    {
      id: 3,
      name: "M. Ibraheem",
      role: "Chief Financial Officer",
      image: "/Images/Ibraheem.jpg",
      email: "qamaribrahim112@gmail.com",
      bio: "Ibraheem brings financial expertise with a tech twist. He integrates data analytics and automation in financial planning, ensuring that Fundify’s growth is sustainable and data-driven.",
    },
    {
      id: 4,
      name: "M. Noukhaiz",
      role: "Chief Operating Officer",
      image: "./Images/Noukhaiz.jpg",
      email: "muhammadnaukhaiz@gmail.com",
      bio: "Noukhaiz oversees operations with a focus on optimizing workflows using AI and machine learning. He’s passionate about process automation and operational scalability.",
    },
    {
      id: 5,
      name: "Rameen Khan",
      role: "Head of Product",
      image: "./Images/Rameen.jpeg",
      email: "f2021266046@umt.edu.pk",
      bio: "Rameen is a tech-savvy operations lead who ensures seamless user experiences and robust backend coordination. She specializes in system design and data security management.",
    },
  ]

  return (
    <div className="about-us-page flex flex-col min-h-screen bg-gray-50">
      <Header hideAboutUs={true} />

      <main className="flex-1">
                {/* Hero Banner */}
                <div className="hero-banner relative h-64 sm:h-80">
                    <img
                        src="./Images/crowd.jpeg"
                        alt="Crowdfunding"
                        className="w-full h-full object-cover brightness-50"
                    />
                    <div className="overlay absolute inset-0"></div>
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center sm:items-start sm:text-left px-4 sm:px-8 md:px-16">
                        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                            CROWDFUND
                            <br />
                            YOUR
                            <br />
                            BUSINESS
                        </h1>
                        <p className="text-white text-md sm:text-lg mt-2 tracking-wide">HELP THEM HELP YOU</p>
                    </div>
                </div>

                {/* About Us Content */}
                <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
                    <div className="max-w-4xl mx-auto">
                        <p className="intro-text text-gray-600 mb-8 sm:mb-12 text-justify text-base sm:text-lg">
                            Fundify is a crowdfunding platform that connects entrepreneurs with investors. Our mission is to democratize fundraising and make capital accessible to everyone. We believe that great ideas should not be limited by access to traditional funding sources. Through our platform, we enable entrepreneurs to showcase their ideas to a global audience and raise the funds they need to bring their visions to life. We are committed to fostering innovation, supporting dreams, and creating opportunities for growth.
                        </p>

                        {/* Why We Started */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16 items-center">
                            <div className="prose">
                                <h2 className="section-title text-2xl sm:text-3xl font-bold text-[#4B5842] mb-4">Why We Started?</h2>
                                <p>
                                    Fundify was born in 2018 from a simple idea: what if we could help entrepreneurs access funding without the traditional barriers? Our founder, Ava Patel, experienced firsthand the challenges of raising capital for her startup and recognized the need for a more inclusive approach to fundraising.
                                </p>
                                <p>
                                    The journey began with a small team working out of a shared office space, fueled by a passion to democratize access to capital. We built our platform with the entrepreneur in mind, focusing on creating a user-friendly experience that would make fundraising accessible to everyone, regardless of their background or connections.
                                </p>
                            </div>
                            <div className="flex items-center justify-center">
                                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEzfHx0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwwfHx8fDE2ODQyNTUwMzA&ixlib=rb-4.0.3&q=80&w=1080" alt="Team Collaboration" className="max-w-full h-auto rounded-lg shadow-lg" />
                            </div>
                        </div>

                        {/* Meet Our Team */}
                        <div className="mb-12 sm:mb-16">
                            <h2 className="section-title text-2xl sm:text-3xl font-bold text-center text-[#4B5842] mb-4">Meet Our Team</h2>
                            <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">Fundify is made up of a team committed to empowering others.</p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {teamMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className={`team-member-card flex flex-col items-center cursor-pointer group transition duration-300 p-2 rounded-lg ${selectedMember?.id === member.id ? 'active' : ''}`}
                                        onClick={() => setSelectedMember(member)}
                                    >
                                        <div className="team-member-image-wrapper relative w-24 h-24 sm:w-28 sm:h-28 rounded-full mb-3 overflow-hidden shadow-lg transform transition-transform duration-300">
                                            <img
                                                src={member.image || "/placeholder.svg"}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null
                                                    e.target.src = "https://placehold.co/150x150/e2e8f0/e2e8f0"
                                                }}
                                            />
                                        </div>
                                        <h3 className="font-semibold text-center text-gray-800">{member.name}</h3>
                                        <p className="text-sm text-gray-500 text-center">{member.role}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Bio Section with Animation */}
                            {selectedMember && (
                                <div
                                    className="bio-card mt-10 p-6 bg-white rounded-xl shadow-lg transition-all duration-500 ease-in-out"
                                    key={selectedMember.id} // Add key to re-trigger animation on change
                                >
                                    <div className="flex flex-col sm:flex-row items-center text-center sm:text-left mb-4">
                                        <img
                                            src={selectedMember.image}
                                            alt={selectedMember.name}
                                            className="w-20 h-20 rounded-full object-cover mr-0 sm:mr-4 mb-4 sm:mb-0 flex-shrink-0 border-4 border-white shadow-md"
                                        />
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{selectedMember.name}</h3>
                                            <p className="text-gray-600">{selectedMember.role}</p>
                                            <a
                                                href={`mailto:${selectedMember.email}`}
                                                className="contact-link text-sm"
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
      <style jsx global>{`
                /* --- Google Font Import --- */
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

                /* --- General Styling & Variables --- */
                .about-us-page {
                    font-family: 'Poppins', sans-serif;
                    --fundify-green: #4B5842;
                    --fundify-light-green: #A9BEA2;
                    --shadow-color: rgba(75, 88, 66, 0.1);
                }
                
                /* --- Hero Section Styling --- */
                .hero-banner .overlay {
                    background: linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2));
                }
                .hero-banner h1 {
                    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
                }

                /* --- Content Section Styling --- */
                .intro-text {
                    line-height: 1.75;
                }

                .section-title {
                    position: relative;
                    padding-bottom: 0.5rem;
                }
                .section-title::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 50px;
                    height: 3px;
                    background-color: var(--fundify-light-green);
                    border-radius: 2px;
                }
                .text-center.section-title::after {
                    left: 50%;
                    transform: translateX(-50%);
                }
                .prose p {
                  margin-bottom: 1rem;
                  line-height: 1.7;
                  color: #4b5563; /* text-gray-600 */
                }


                /* --- Team Member Styling --- */
                .team-member-card {
                   position: relative;
                }
                
                .team-member-image-wrapper {
                    border: 3px solid transparent;
                    transition: all 0.3s ease-in-out;
                }
                
                .team-member-card:hover .team-member-image-wrapper {
                   transform: scale(1.1);
                   border-color: var(--fundify-light-green);
                }

                .team-member-card.active .team-member-image-wrapper {
                    border-color: var(--fundify-green);
                    transform: scale(1.1);
                }
                
                .team-member-card:hover h3 {
                   color: var(--fundify-green);
                }

                /* --- Bio Card Styling --- */
                .bio-card {
                   border: 1px solid #e5e7eb;
                   background: linear-gradient(to bottom right, #ffffff, #f9fafb);
                   animation: fade-in 0.5s ease-in-out forwards;
                }

                .contact-link {
                    display: inline-block;
                    margin-top: 4px;
                    padding: 4px 12px;
                    background-color: var(--fundify-light-green);
                    color: var(--fundify-green);
                    border-radius: 9999px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .contact-link:hover {
                    background-color: var(--fundify-green);
                    color: white;
                    text-decoration: none;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 10px var(--shadow-color);
                }

                /* --- Keyframe Animation --- */
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
    </div>
  )
}

export default AboutUsPage
