// src/Pages/AdminSide/Users.jsx
"use client"

import { useState, useEffect } from "react"
import Sidebar from "./SideBar"
import { Eye, Edit, Trash, Search, Menu, X, AlertTriangle } from "lucide-react"
import axios from 'axios';
import { io } from 'socket.io-client';

// A simple, self-contained confirmation modal
const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800">Are you sure?</h3>
                <p className="text-sm text-gray-500 mt-2">{message}</p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
);


const UserManagement = () => {
    const [campaignCreators, setCampaignCreators] = useState([]);
    const [backers, setBackers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [creatorsPage, setCreatorsPage] = useState(1);
    const [backersPage, setBackersPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const itemsPerPage = 5;

    const fetchUsersData = async () => {
        if (!campaignCreators.length && !backers.length) setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Authentication token missing.");

            const response = await axios.get('https://server-fundify.up.railway.app/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (Array.isArray(response.data)) {
                const creatorsData = [];
                const backersData = [];
                response.data.forEach(user => {
                    if (user.createdCampaigns > 0) {
                        creatorsData.push({
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            campaignsCount: user.createdCampaigns,
                            status: user.verified ? "Verified" : "Pending",
                        });
                    }
                    if (user.backedCampaigns > 0) {
                        backersData.push({
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            campaignsCount: user.backedCampaigns,
                            status: user.verified ? "Verified" : "Pending",
                        });
                    }
                });
                setCampaignCreators(creatorsData);
                setBackers(backersData);
            } else {
                throw new Error("Invalid data format from server.");
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(err.message || "Failed to fetch users data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsersData();
        const socket = io('https://server-fundify.up.railway.app/');
        socket.on('connect', () => console.log('UserManagement: Connected to Socket.IO'));
        
        // Listen for new user registration or any activity update
        socket.on('newUserRegistered', fetchUsersData);
        socket.on('userActivityUpdated', fetchUsersData);

        socket.on('disconnect', () => console.log('UserManagement: Disconnected'));
        return () => socket.disconnect();
    }, );

    const handleDeleteClick = (id, type, name) => {
        setUserToDelete({ id, type, name });
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        const { id, type } = userToDelete;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://server-fundify.up.railway.app/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsersData(); // Re-fetch data to update UI
        } catch (err) {
            console.error(`Error deleting ${type}:`, err);
            alert(`Failed to delete ${type}.`); // Simple alert for error
        } finally {
            setShowDeleteConfirm(false);
            setUserToDelete(null);
        }
    };

    const filteredCreators = campaignCreators.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredBackers = backers.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentCreators = filteredCreators.slice((creatorsPage - 1) * itemsPerPage, creatorsPage * itemsPerPage);
    const currentBackers = filteredBackers.slice((backersPage - 1) * itemsPerPage, backersPage * itemsPerPage);

    const getStatusClass = (status) => status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

    if (loading) return <div className="flex h-screen bg-gray-50"><Sidebar /><div className="flex-1 flex items-center justify-center"><p>Loading users...</p></div></div>;
    
    return (
        <div className="flex min-h-screen bg-gray-50">
            {showDeleteConfirm && (
                <ConfirmationModal
                    message={`This will permanently delete the user '${userToDelete.name}'. This action cannot be undone.`}
                    onConfirm={confirmDelete}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform md:relative md:translate-x-0`}>
                <Sidebar />
                <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 text-white md:hidden"><X size={24} /></button>
            </div>

            <div className="flex-1 flex flex-col overflow-auto">
                <header className="md:hidden bg-white shadow-sm p-4 flex items-center"><button onClick={() => setIsSidebarOpen(true)}><Menu /></button><h1 className="text-xl font-bold ml-4">User Management</h1></header>
                
                <main className="p-4 sm:p-6 lg:p-8">
                    <div className="hidden md:flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">User Management</h1></div>
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input type="text" placeholder="Search by name or email..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCreatorsPage(1); setBackersPage(1); }} className="w-full pl-10 pr-4 py-2 rounded-full bg-white border" />
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

                    {/* Campaign Creators Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4">Campaign Creators</h2>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            {/* Mobile View */}
                            <div className="md:hidden">
                                {currentCreators.length > 0 ? currentCreators.map(user => (
                                    <div key={user.id} className="p-4 border-b last:border-b-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-gray-800">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                                <p className="text-xs text-gray-500 mt-1">Campaigns: {user.campaignsCount}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(user.status)}`}>{user.status}</span>
                                        </div>
                                        <div className="flex justify-end space-x-2 mt-2">
                                            <button className="p-1.5 rounded-full hover:bg-gray-100"><Eye size={16} /></button>
                                            <button className="p-1.5 rounded-full hover:bg-gray-100"><Edit size={16} /></button>
                                            <button onClick={() => handleDeleteClick(user.id, 'creator', user.name)} className="p-1.5 rounded-full hover:bg-red-50"><Trash size={16} className="text-red-600"/></button>
                                        </div>
                                    </div>
                                )) : <p className="p-4 text-center text-gray-500">No creators found.</p>}
                            </div>
                            {/* Desktop View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50"><tr className="text-left text-xs text-gray-500"><th className="px-6 py-3 font-medium">Name</th><th className="px-6 py-3 font-medium">Email</th><th className="px-6 py-3 font-medium">Campaigns</th><th className="px-6 py-3 font-medium">Status</th><th className="px-6 py-3 font-medium">Actions</th></tr></thead>
                                    <tbody>
                                        {currentCreators.length > 0 ? currentCreators.map(user => (
                                            <tr key={user.id} className="border-b hover:bg-gray-50"><td className="px-6 py-4 text-sm font-medium">{user.name}</td><td className="px-6 py-4 text-sm">{user.email}</td><td className="px-6 py-4 text-sm">{user.campaignsCount}</td><td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(user.status)}`}>{user.status}</span></td><td className="px-6 py-4"><div className="flex space-x-2"><button className="p-1 rounded-full hover:bg-gray-200"><Eye size={16}/></button><button className="p-1 rounded-full hover:bg-gray-200"><Edit size={16}/></button><button onClick={() => handleDeleteClick(user.id, 'creator', user.name)} className="p-1 rounded-full hover:bg-red-100"><Trash size={16} className="text-red-600"/></button></div></td></tr>
                                        )) : <tr><td colSpan="5" className="text-center py-8 text-gray-500">No creators found.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination for Creators */}
                            <div className="px-6 py-3 border-t flex justify-between items-center text-sm"><p>Showing {Math.min(1 + (creatorsPage - 1) * itemsPerPage, filteredCreators.length)}-{Math.min(creatorsPage * itemsPerPage, filteredCreators.length)} of {filteredCreators.length}</p><div><button onClick={() => setCreatorsPage(creatorsPage - 1)} disabled={creatorsPage === 1} className="p-1 border rounded disabled:opacity-50">⟨</button><button onClick={() => setCreatorsPage(creatorsPage + 1)} disabled={creatorsPage * itemsPerPage >= filteredCreators.length} className="ml-1 p-1 border rounded disabled:opacity-50">⟩</button></div></div>
                        </div>
                    </div>

                    {/* Backers Section */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Backers</h2>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            {/* Mobile View */}
                            <div className="md:hidden">
                                {currentBackers.length > 0 ? currentBackers.map(user => (
                                    <div key={user.id} className="p-4 border-b last:border-b-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-gray-800">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                                <p className="text-xs text-gray-500 mt-1">Backed: {user.campaignsCount} campaigns</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(user.status)}`}>{user.status}</span>
                                        </div>
                                        <div className="flex justify-end space-x-2 mt-2">
                                            <button className="p-1.5 rounded-full hover:bg-gray-100"><Eye size={16} /></button>
                                            <button className="p-1.5 rounded-full hover:bg-gray-100"><Edit size={16} /></button>
                                            <button onClick={() => handleDeleteClick(user.id, 'backer', user.name)} className="p-1.5 rounded-full hover:bg-red-50"><Trash size={16} className="text-red-600"/></button>
                                        </div>
                                    </div>
                                )) : <p className="p-4 text-center text-gray-500">No backers found.</p>}
                            </div>
                            {/* Desktop View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50"><tr className="text-left text-xs text-gray-500"><th className="px-6 py-3 font-medium">Name</th><th className="px-6 py-3 font-medium">Email</th><th className="px-6 py-3 font-medium">Backed</th><th className="px-6 py-3 font-medium">Status</th><th className="px-6 py-3 font-medium">Actions</th></tr></thead>
                                    <tbody>
                                        {currentBackers.length > 0 ? currentBackers.map(user => (
                                            <tr key={user.id} className="border-b hover:bg-gray-50"><td className="px-6 py-4 text-sm font-medium">{user.name}</td><td className="px-6 py-4 text-sm">{user.email}</td><td className="px-6 py-4 text-sm">{user.campaignsCount}</td><td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(user.status)}`}>{user.status}</span></td><td className="px-6 py-4"><div className="flex space-x-2"><button className="p-1 rounded-full hover:bg-gray-200"><Eye size={16}/></button><button className="p-1 rounded-full hover:bg-gray-200"><Edit size={16}/></button><button onClick={() => handleDeleteClick(user.id, 'backer', user.name)} className="p-1 rounded-full hover:bg-red-100"><Trash size={16} className="text-red-600"/></button></div></td></tr>
                                        )) : <tr><td colSpan="5" className="text-center py-8 text-gray-500">No backers found.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination for Backers */}
                            <div className="px-6 py-3 border-t flex justify-between items-center text-sm"><p>Showing {Math.min(1 + (backersPage - 1) * itemsPerPage, filteredBackers.length)}-{Math.min(backersPage * itemsPerPage, filteredBackers.length)} of {filteredBackers.length}</p><div><button onClick={() => setBackersPage(backersPage - 1)} disabled={backersPage === 1} className="p-1 border rounded disabled:opacity-50">⟨</button><button onClick={() => setBackersPage(backersPage + 1)} disabled={backersPage * itemsPerPage >= filteredBackers.length} className="ml-1 p-1 border rounded disabled:opacity-50">⟩</button></div></div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
export default UserManagement;
