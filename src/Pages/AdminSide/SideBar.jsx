import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";


export default function AdminSidebar() {

    const location = useLocation(); // <-- get the current route

  return (
    <aside className="w-64 bg-white border-r min-h-screen px-4 py-6 flex flex-col">
      {/* Logo */}
      <div className="mb-6 flex items-center justify-center">
        <img src="/Images/fundify-transparent-logo.png" alt="Fundify" className="h-12" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 text-sm text-gray-700">
        <SidebarLink to="/admin-dashboard" label="Dashboard" icon="🏠" currentPath={location.pathname} />
        <SidebarLink to="/admin/users" label="Users" icon="🧑" currentPath={location.pathname} />
        <SidebarLink to="/admin/donations" label="Donations" icon="💰" currentPath={location.pathname} />
        <SidebarLink to="/admin/wallet" label="Wallet" icon="👛" currentPath={location.pathname} />
        <SidebarLink to="/admin/campaigns" label="Campaigns Created" icon="📊" currentPath={location.pathname} />
        <SidebarLink to="/admin/verifications" label="Verifications" icon="🔍" currentPath={location.pathname} />
        <SidebarLink to="/admin/feedbacks" label="Feedbacks" icon="💬" currentPath={location.pathname} />
        <SidebarLink to="/admin/settings" label="Settings" icon="⚙️" currentPath={location.pathname} />
        <SidebarLink to="/login" label="Logout" icon="⏻" currentPath={location.pathname} />
      </nav>
    </aside>
  );
}

function SidebarLink({ to, label, icon, currentPath }) {
    const isActive = currentPath === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#66745f] ${
        isActive ? "bg-[#4B5842] text-white" : "text-gray-700"
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
