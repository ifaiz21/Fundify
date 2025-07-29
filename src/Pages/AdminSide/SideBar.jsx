// src/components/AdminSidebar.jsx or wherever your Sidebar component is located
"use client"

import { Link, useLocation } from "react-router-dom";
import { 
    LayoutDashboard, 
    Users, 
    HandCoins, 
    Wallet, 
    Megaphone, 
    ShieldCheck, 
    MessageSquareWarning,
    LogOut
} from "lucide-react";

// Main Sidebar Component
export default function AdminSidebar() {
    const location = useLocation(); // Get the current route to highlight the active link

    // It's better to define the links as an array of objects for easier management
    const navLinks = [
        { to: "/admin-dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { to: "/admin/users", label: "Users", icon: <Users size={20} /> },
        { to: "/admin/donations", label: "Donations", icon: <HandCoins size={20} /> },
        { to: "/admin/wallet", label: "Wallet", icon: <Wallet size={20} /> },
        { to: "/admin/campaigns", label: "Campaigns", icon: <Megaphone size={20} /> }, // Changed label for clarity
        { to: "/admin/verifications", label: "Verifications", icon: <ShieldCheck size={20} /> },
        { to: "/admin/feedbacks", label: "Feedbacks", icon: <MessageSquareWarning size={20} /> },
    ];

    return (
        // The parent div in CampaignsPage.jsx already handles the responsive show/hide.
        // This component just needs to define its own look and feel.
        <aside className="w-64 bg-white border-r min-h-screen flex flex-col justify-between">
            <div>
                {/* Logo */}
                <div className="p-4 flex items-center justify-center border-b">
                    <img src="/Images/fundify-transparent-logo.png" alt="Fundify" className="h-12" />
                </div>

                {/* Navigation */}
                <nav className="mt-4 p-2 space-y-1">
                    {navLinks.map(link => (
                        <SidebarLink 
                            key={link.to}
                            to={link.to} 
                            label={link.label} 
                            icon={link.icon} 
                            currentPath={location.pathname} 
                        />
                    ))}
                </nav>
            </div>
            
            {/* Logout button at the bottom */}
            <div className="p-2 border-t">
                 <SidebarLink 
                    to="/login" // Assuming /login handles logout and redirection
                    label="Logout" 
                    icon={<LogOut size={20} />} 
                    currentPath={location.pathname} 
                    isLogout={true}
                />
            </div>
        </aside>
    );
}

// Reusable Link Component for the Sidebar
function SidebarLink({ to, label, icon, currentPath, isLogout = false }) {
    // Check if the current path starts with the link's path for nested routes
    // e.g., /admin/users should be active even if the path is /admin/users/123
    const isActive = !isLogout && currentPath.startsWith(to);

    const baseClasses = "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors duration-200";
    const activeClasses = "bg-[#4B5842] text-white shadow-sm";
    const inactiveClasses = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
    const logoutClasses = "text-red-600 hover:bg-red-50"

    return (
        <Link
            to={to}
            className={`${baseClasses} ${isLogout ? logoutClasses : (isActive ? activeClasses : inactiveClasses)}`}
        >
            {icon}
            <span className="font-medium text-sm">{label}</span>
        </Link>
    );
}
