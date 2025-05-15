"use client"

import { useState } from "react"
import HeaderLayout from "./Layout/HeaderLayout"
import FooterLayout from "./Layout/FooterLayout"

function ProjectView() {
  const [activeTab, setActiveTab] = useState("updates") // Set default to updates tab

  const projectData = {
    title: "Electric Scooter",
    image: "/images/scooter1.jpg",
    pledged: 100000,
    goal: 1000000,
    backers: 250,
    daysLeft: 36,
    status: "Success",
    organizer: "Kismat Shah",
    location: "XYZ, Lahore",
    createdDays: 7,
    description: "kismat is organizing this fundraiser to benefit society",
  }

  const recentDonors = [
    { name: "John", amount: 100 },
    { name: "Anonymous", amount: 250 },
    { name: "David", amount: 670 },
  ]

  const updates = [
    {
      id: 2,
      title: "Buying New RTX 3080 Ti",
      date: "May 15, 2023",
      content: "Thank you for your contribution and helping me buy RTX 3080 Ti.",
      listItems: ["New PCIE Expansion Slot", "New Motherboard", "New Mouse", "New Keyboard"],
    },
    {
      id: 1,
      title: "Buying New 32GB RAM",
      date: "May 1, 2023",
      content: "Thank you for your contribution and helping me buy RTX 3080 Ti.",
    },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("₹", "")
  }

  const progress = Math.min(Math.round((projectData.pledged / projectData.goal) * 100), 100)

  // Sidebar component to be reused in both tabs
  const DonorsSidebar = () => (
    <div className="donors-sidebar">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col items-center mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-700"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h3 className="text-lg font-bold">{projectData.organizer}</h3>
          <p className="text-sm text-gray-600">Project Founder</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 text-gray-700"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span className="text-sm font-medium">150 people just donated</span>
        </div>

        <div className="pt-4 space-y-4">
          {recentDonors.map((donor, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="font-medium text-lg">Rs</div>
              <div className="text-right">
                <div className="font-medium text-lg">{formatCurrency(donor.amount)}</div>
                <div className="text-sm text-gray-500">{donor.name}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button className="text-center py-3 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            See all
          </button>
<button className="text-center py-3 px-4 bg-[#4B5945] rounded-md text-sm font-medium text-white hover:bg-[#3E4B3A] transition-colors">
            Back this project
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Header */}
      <HeaderLayout />

      <div className="project-view container mx-auto px-4 py-6">
        {/* Project title only shown on Campaign tab */}
        {activeTab === "campaign" && <h1 className="text-2xl font-bold text-gray-800 mb-6">{projectData.title}</h1>}

        {/* Project title for Updates tab */}
        {activeTab === "updates" && <h1 className="text-2xl font-bold text-gray-800 mb-6">Project - Updates</h1>}

        {/* Campaign details only shown on Campaign tab */}
        {activeTab === "campaign" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <img
                src={projectData.image || "/placeholder.svg"}
                alt={projectData.title}
                className="w-full h-auto rounded-md shadow-md mb-6"
              />

              <p className="text-gray-700 mb-4">{projectData.description}</p>

              <div className="flex items-center text-sm text-gray-600 mb-6">
                <span>Created {projectData.createdDays} days ago</span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {projectData.location}
                </span>
              </div>
            </div>

            <div>
              {/* Campaign Stats Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <div className="text-2xl font-bold">{formatCurrency(projectData.pledged)}</div>
                  <div className="text-sm text-gray-600">pledged of {formatCurrency(projectData.goal)} goal</div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-2xl font-bold">{projectData.backers}</div>
                    <div className="text-sm text-gray-600">backers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{projectData.daysLeft}</div>
                    <div className="text-sm text-gray-600">days to go</div>
                  </div>
                </div>

                <div className="text-right mb-4">
                  <span className="text-sm">
                    Predicted Status: <span className="font-medium text-green-600">{projectData.status}</span>
                  </span>
                </div>

<button className="w-full bg-[#4B5945] hover:bg-[#3E4B3A] text-white py-3 rounded-md mb-3 transition duration-200">
                  Back this project
                </button>

                <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-md transition duration-200">
                  Share
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Campaign Tabs */}
        <div className="campaign-tabs bg-white rounded-md shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === "campaign"
                    ? "border-gray-800 text-gray-800"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("campaign")}
              >
                Campaign
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === "updates"
                    ? "border-gray-800 text-gray-800"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("updates")}
              >
                Updates
              </button>
            </nav>
          </div>

          <div className="py-6 px-6">
            {activeTab === "campaign" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {/* Story Section */}
                  <div className="story-section">
                    <h2 className="text-xl font-bold mb-4">Story</h2>

                    <img src="/images/scooter2.png" alt="Electric Scooter" className="w-full h-auto rounded-md mb-6" />

                    <div className="space-y-4 text-gray-700">
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse donec et nibh bibendum nec
                        proin nisi. Elementum semper neque diam eleifend, vel quis sed. Cursus ut ipsum nulla erat morbi
                        sociis. Amet, eget sed id. Ut nulla ut sit amet, nunc. Nulla facilisi nulla nunc in diam sit.
                        Odio dui elit quam tincidunt et rutrum ut. Sit aliquet ullamcorper nam libero nisi. Ante
                        vulputate sit sodales consequat. Luctus ipsum tincidunt ac tellus purus. Consectetur quis massa
                        id quis est enim. Cras accumsan risus, vulputate porttitor in turpis. Tristique eu diam
                        adipiscing eget erat turpis auctor varius. A risus ac nam imperdiet varius amet. Sapien
                        sagittis, eget viverra risus. Libero ut ac nisi, elementum cras. At interdum purus tortor dui.
                      </p>

                      <p>
                        Lorem elit viverra pellentesque integer ut nibh elementum. Sit lectus risus, dui mauris, dapibus
                        habitasse in urna. Facilisis varius enim facilisis sit faucibus morbi. Nibh cras eu, in in
                        tellus dignissim morbi dui. Massa nisi nulla aliquam interdum purus, consectetur luctus ac.
                      </p>

                      <p>
                        Sit eget mauris suspendisse eget rhoncus sit feugiat. Ultrices pharetra, massa mi a auctor
                        habitasse diam euismod egestas. Sed cursus ullamcorper nunc, id tristique suspendisse egestas.
                        Sed enim nam malesuada neque porttitor risus mauris. Vel sociis tristique tincidunt sit neque
                        gravida.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <DonorsSidebar />
                </div>
              </div>
            )}

            {activeTab === "updates" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-bold mb-6">Updates on the Project</h2>

                  {updates.map((update) => (
                    <div key={update.id} className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-6">
                        <h3 className="text-lg font-medium mb-3">
                          Update {update.id} : {update.title}
                        </h3>

                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-700"
                            >
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium">{projectData.organizer}</div>
                            <div className="text-xs text-gray-500">Project Founder</div>
                          </div>
                        </div>

                        <div className="border-t border-b border-gray-200 py-4 my-4">
                          <p className="mb-4">{update.content}</p>

                          {update.listItems && (
                            <ul className="list-disc pl-5 space-y-1">
                              {update.listItems.map((item, index) => (
                                <li key={index} className="text-gray-700">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 px-6 py-3 text-center">
                        <button className="text-gray-600 text-sm font-medium flex items-center justify-center mx-auto">
                          See More
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-1">
                  <DonorsSidebar />
                </div>
              </div>
            )}
          </div>
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

      {/* Footer */}
      <FooterLayout />
    </>
  )
}

export default ProjectView
