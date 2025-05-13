import { useState } from "react";

const categories = [
  { id: "all", label: "All" },
  { id: "disaster", label: "Disaster" },
  { id: "children", label: "Children" },
  { id: "food-crisis", label: "Food Crisis" },
  { id: "health", label: "Health" },
  { id: "education", label: "Education" },
  { id: "homeless", label: "Homeless" },
  { id: "animal", label: "Animal" },
];

const campaigns = [
  {
    id: 1,
    title: "Rescue Stray Animals in Lahore",
    description:
      "Help rescue, feed, and rehabilitate stray animals in Lahore. Your donations will fund veterinary care programs.",
    image: "/images/stray-animals.jpg",
    date: "June 27, 2021",
    category: "animal",
  },
  {
    id: 2,
    title: "Sponsor a Child's Education in Skardu",
    description:
      "Empower a young student in Skardu by providing books, tuition, and transportation to continue their education.",
    image: "/images/education.jpg",
    date: "June 27, 2021",
    category: "education",
  },
  {
    id: 3,
    title: "Rebuild Swat Valley",
    description:
      "Swat Valley has faced devastating floods, destroying infrastructure and displacing thousands. Help us rebuild homes, roads, and schools.",
    image: "/images/flood.jpg",
    date: "June 27, 2023",
    category: "disaster",
  },
  {
    id: 4,
    title: "Renewable Energy Revolution",
    description:
      "Join us in funding solar power projects in remote villages to combat energy shortages and provide sustainable electricity.",
    image: "/images/solar.jpg",
    date: "June 27, 2021",
    category: "disaster",
  },
  {
    id: 5,
    title: "Support Local Craftsmen",
    description:
      "Young artisans in Multan are reviving traditional craftsmanship but need funds for materials and marketing.",
    image: "/images/crafts.jpg",
    date: "June 27, 2021",
    category: "education",
  },
  {
    id: 6,
    title: "Help a Female Entrepreneur",
    description:
      "A talented chef in Karachi dreams of starting her own food truck. Your contributions can help her purchase equipment.",
    image: "/images/food.jpg",
    date: "June 27, 2021",
    category: "food-crisis",
  },
];

export default function CampaignListing() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(2);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesCategory =
      selectedCategory === "all" || campaign.category === selectedCategory;
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Headings */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-gray-800 mb-2">
          Compassion Unites!
        </h1>
        <h2 className="text-2xl text-gray-600">
          Choose a Cause, Change a Life!
        </h2>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Find donations..."
          className="w-full px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <svg
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === category.id
                ? "bg-[#4A5D45] text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {filteredCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white rounded-lg overflow-hidden shadow-md"
          >
            <img
              src={campaign.image || "/placeholder.svg"}
              alt={campaign.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <p className="text-gray-500 text-sm mb-2">{campaign.date}</p>
              <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
              <p className="text-gray-600 mb-4">{campaign.description}</p>
              <button className="w-full px-4 py-2 border-2 border-[#B2C9AD] text-[#4A5D45] rounded-full hover:bg-[#B2C9AD] hover:text-white transition-colors">
                Donate now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        {[1, 2, 3, "...", 19, 20].map((page, index) => (
          <button
            key={index}
            className={`w-8 h-8 rounded-lg ${
              currentPage === page
                ? "bg-[#4A5D45] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}