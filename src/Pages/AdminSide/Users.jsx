"use client"

import { useState, useEffect } from "react"
import Sidebar from "./SideBar"
import { Eye, Edit, Trash, Search } from "lucide-react"
import axios from 'axios';

const UserManagement = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [campaignCreators, setCampaignCreators] = useState([]);
    const [backers, setBackers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [creatorsPage, setCreatorsPage] = useState(1)
    const [backersPage, setBackersPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const itemsPerPage = 5

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("Authentication token missing. Please log in as admin.");
                }

                const response = await axios.get('http://localhost:5000/api/admin/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log("Fetched Users Data:", response.data);

                if (Array.isArray(response.data)) {
                    setAllUsers(response.data);

                    const creatorsData = [];
                    const backersData = [];

                    response.data.forEach(user => {
                        if (user.createdCampaigns && user.createdCampaigns.length > 0) {
                            creatorsData.push({
                                id: user._id,
                                name: user.name,
                                email: user.email,
                                campaignName: user.createdCampaigns.length > 1 ? `${user.createdCampaigns.length} Campaigns` : '1 Campaign',
                                fundingGoal: 'N/A', // Dynamic data ke liye mazeed API call ya backend mein pre-aggregation chahiye
                                status: user.verified ? "Verified" : "Pending",
                            });
                        }

                        if (user.backedCampaigns && user.backedCampaigns.length > 0) {
                            backersData.push({
                                id: user._id,
                                name: user.name,
                                email: user.email,
                                campaignName: user.backedCampaigns.length > 1 ? `${user.backedCampaigns.length} Backed Campaigns` : '1 Backed Campaign',
                                backedAmount: 'N/A', // Dynamic data ke liye mazeed API call ya backend mein pre-aggregation chahiye
                                status: user.verified ? "Verified" : "Pending",
                            });
                        }
                    });

                    setCampaignCreators(creatorsData);
                    setBackers(backersData);

                } else {
                    console.warn("Users API did not return an array:", response.data);
                    setAllUsers([]);
                    setCampaignCreators([]);
                    setBackers([]);
                }
            } catch (err) {
                console.error("Error fetching users:", err);
                setError(err.message || "Failed to fetch users data.");
                setAllUsers([]);
                setCampaignCreators([]);
                setBackers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredCreators = campaignCreators.filter((creator) =>
        Object.values(creator).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const filteredBackers = backers.filter((backer) =>
        Object.values(backer).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const handleView = (id, type) => {
        console.log(`View ${type} with ID: ${id}`);
    }

    const handleEdit = (id, type) => {
        console.log(`Edit ${type} with ID: ${id}`);
    }

    const handleDelete = async (id, type) => {
        if (window.confirm(`Are you sure you want to delete this ${type} with ID: ${id}?`)) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                alert(`${type} deleted successfully!`);
                setAllUsers(prevUsers => prevUsers.filter(user => user._id !== id));
                setCampaignCreators(prevCreators => prevCreators.filter(creator => creator.id !== id));
                setBackers(prevBackers => prevBackers.filter(backer => backer.id !== id));

            } catch (err) {
                console.error(`Error deleting ${type}:`, err);
                alert(`Failed to delete ${type}. Please check server logs.`);
            }
        }
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCreatorsPage(1);
        setBackersPage(1);
    }

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 overflow-auto p-8 flex justify-center items-center">
                    <p>Loading users data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 overflow-auto p-8 flex justify-center items-center text-red-600">
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    {/* Search Bar */}
                    <div className="mb-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search by name, email, campaign name or status"
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4B5842] focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Campaign Creators Section */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold mb-6">Campaign Creators</h1>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
                                            <th className="px-6 py-3 font-medium">ID</th>
                                            <th className="px-6 py-3 font-medium">Name</th>
                                            <th className="px-6 py-3 font-medium">Email</th>
                                            <th className="px-6 py-3 font-medium">Campaigns Created</th>
                                            <th className="px-6 py-3 font-medium">Funding Goal (Est.)</th>
                                            <th className="px-6 py-3 font-medium">Status</th>
                                            <th className="px-6 py-3 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCreators.length > 0 ? (
                                            filteredCreators
                                                .slice((creatorsPage - 1) * itemsPerPage, creatorsPage * itemsPerPage)
                                                .map((creator) => (
                                                    <tr key={creator.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-sm">{creator.id}</td>
                                                        <td className="px-6 py-4 text-sm">{creator.name}</td>
                                                        <td className="px-6 py-4 text-sm">{creator.email}</td>
                                                        <td className="px-6 py-4 text-sm">{creator.campaignName}</td>
                                                        <td className="px-6 py-4 text-sm">{creator.fundingGoal}</td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${creator.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                {creator.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleView(creator.id, "creator")}
                                                                    className="p-1 rounded-full hover:bg-gray-100"
                                                                    title="View"
                                                                >
                                                                    <Eye className="h-4 w-4 text-gray-500" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEdit(creator.id, "creator")}
                                                                    className="p-1 rounded-full hover:bg-gray-100"
                                                                    title="Edit"
                                                                >
                                                                    <Edit className="h-4 w-4 text-gray-500" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(creator.id, "creator")}
                                                                    className="p-1 rounded-full hover:bg-gray-100"
                                                                    title="Delete"
                                                                >
                                                                    <Trash className="h-4 w-4 text-gray-500" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No campaign creators found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-6 py-3 flex items-center justify-between border-t">
                                <div className="text-sm text-gray-500">
                                    Showing {(creatorsPage - 1) * itemsPerPage + 1}–{Math.min(creatorsPage * itemsPerPage, filteredCreators.length)} of {filteredCreators.length}
                                </div>
                                <div className="flex space-x-1">
                                    <button
                                        className="px-3 py-1 rounded border text-sm"
                                        onClick={() => setCreatorsPage(Math.max(1, creatorsPage - 1))}
                                        disabled={creatorsPage === 1}
                                    >
                                        &lt;
                                    </button>
                                    <button
                                        className="px-3 py-1 rounded border bg-gray-100 text-sm"
                                        onClick={() => setCreatorsPage(creatorsPage + 1)}
                                        disabled={creatorsPage * itemsPerPage >= filteredCreators.length}
                                    >
                                        &gt;
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Backers Section */}
                    <div>
                        <h1 className="text-2xl font-bold mb-6">Backers</h1>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
                                            <th className="px-6 py-3 font-medium">ID</th>
                                            <th className="px-6 py-3 font-medium">Name</th>
                                            <th className="px-6 py-3 font-medium">Email</th>
                                            <th className="px-6 py-3 font-medium">Backed Campaigns</th>
                                            <th className="px-6 py-3 font-medium">Backed Amount (Est.)</th>
                                            <th className="px-6 py-3 font-medium">Status</th>
                                            <th className="px-6 py-3 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBackers.length > 0 ? (
                                            filteredBackers
                                                .slice((backersPage - 1) * itemsPerPage, backersPage * itemsPerPage)
                                                .map((backer) => (
                                                    <tr key={backer.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-sm">{backer.id}</td>
                                                        <td className="px-6 py-4 text-sm">{backer.name}</td>
                                                        <td className="px-6 py-4 text-sm">{backer.email}</td>
                                                        <td className="px-6 py-4 text-sm">{backer.campaignName}</td>
                                                        <td className="px-6 py-4 text-sm">{backer.backedAmount}</td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${backer.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                {backer.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleView(backer.id, "backer")}
                                                                    className="p-1 rounded-full hover:bg-gray-100"
                                                                    title="View"
                                                                >
                                                                    <Eye className="h-4 w-4 text-gray-500" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEdit(backer.id, "backer")}
                                                                    className="p-1 rounded-full hover:bg-gray-100"
                                                                    title="Edit"
                                                                >
                                                                    <Edit className="h-4 w-4 text-gray-500" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(backer.id, "backer")}
                                                                    className="p-1 rounded-full hover:bg-gray-100"
                                                                    title="Delete"
                                                                >
                                                                    <Trash className="h-4 w-4 text-gray-500" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No backers found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-6 py-3 flex items-center justify-between border-t">
                                <div className="text-sm text-gray-500">
                                    Showing {(backersPage - 1) * itemsPerPage + 1}–{Math.min(backersPage * itemsPerPage, filteredBackers.length)} of {filteredBackers.length}
                                </div>
                                <div className="flex space-x-1">
                                    <button
                                        className="px-3 py-1 rounded border text-sm"
                                        onClick={() => setBackersPage(Math.max(1, backersPage - 1))}
                                        disabled={backersPage === 1}
                                    >
                                        &lt;
                                    </button>
                                    <button
                                        className="px-3 py-1 rounded border bg-gray-100 text-sm"
                                        onClick={() => setBackersPage(backersPage + 1)}
                                        disabled={backersPage * itemsPerPage >= filteredBackers.length}
                                    >
                                        &gt;
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UserManagement;