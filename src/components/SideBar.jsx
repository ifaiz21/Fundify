// src/components/SideBar.jsx
import React from 'react';
// Removed: import { useNavigate } from 'react-router-dom'; // This line is intentionally removed

function SideBar({ activeItem, onItemClick, handleLogout }) {
  // Removed: const navigate = useNavigate(); // This line is intentionally removed

  const menuItems = [
    { name: "Profile", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { name: "My Campaigns", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9c.78-.783 2.046-.783 2.829 0s.783 2.046 0 2.829L19 12l1.414 1.414c.783.783.783 2.046 0 2.829s-2.046.783-2.829 0l-1.414-1.414L15.536 12l-1.414-1.414-1.414-1.414 1.414-1.414 1.414-1.414z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.464 15.536a5 5 0 010-7.072m-2.828 9.9c-.78.783-2.046.783-2.829 0s-.783-2.046 0-2.829L5 12 3.586 10.586c-.783-.783-.783-2.046 0-2.829s2.046-.783 2.829 0L8.464 12l1.414 1.414 1.414 1.414-1.414 1.414-1.414 1.414z" />
        </svg>
      )
    },
    { name: "Billing", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    { name: "Notifications", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
  ];

  const handleItemNavigation = (item) => {
    // This function now ONLY calls the onItemClick prop.
    // The actual navigation will be handled by the parent component (UserProfileSettings, Billing, MyCampaigns).
    onItemClick(item);
  };

  return (
    <div className="w-64 bg-white shadow-md p-4 space-y-2 flex-shrink-0">
      {menuItems.map((item) => (
        <div
          key={item.name}
          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200
            ${activeItem === item.name ? 'bg-[#4A5D45] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => handleItemNavigation(item.name)}
        >
          {item.icon}
          <span className="font-semibold">{item.name}</span>
        </div>
      ))}
      <div className="pt-4 border-t border-gray-200">
        <div
          className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 bg-red-500 text-white hover:bg-red-600"
          onClick={handleLogout} // This is still correct, as `handleLogout` is a prop that will trigger the modal in the parent.
        >
          <svg viewBox="0 0 512 512" className="h-6 w-6 fill-current">
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
          </svg>
          <span className="font-semibold">Logout</span>
        </div>
      </div>
    </div>
  );
}

export default SideBar;