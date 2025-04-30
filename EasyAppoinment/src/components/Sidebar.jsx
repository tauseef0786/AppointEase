import React, { useState } from 'react';
import { useAppointment } from '../context/AppointmentContext';
import { ClipboardList, Users, FileText, MessageCircle, Settings, LogOut, Shield, Menu, X } from 'lucide-react';
import Overview from './Overview'; // Import the Overview component

const Sidebar = () => {
  const { darkMode } = useAppointment();
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to control sidebar open/close on mobile
  const [activeView, setActiveView] = useState('appointments'); // State to track the active view

  const menuItems = [
    { name: 'Overview', icon: <ClipboardList size={20} />, view: 'overview' }, // Add a view key for Overview
    { name: 'Appointments', icon: <ClipboardList size={20} />, active: true, view: 'appointments' },
    { name: 'Doctors', icon: <Users size={20} /> },
    { name: 'Pathology Results', icon: <FileText size={20} /> },
    { name: 'Chats', icon: <MessageCircle size={20} />, notification: 10 }
  ];

  const accountItems = [
    { name: 'Settings', icon: <Settings size={20} /> },
    { name: 'Logout', icon: <LogOut size={20} />, danger: true }
  ];

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <Overview />; // Render the Overview component
      case 'appointments':
        return <div>Appointments Content</div>; // Placeholder for Appointments
      default:
        return <div>Select a section to view</div>;
    }
  };

  return (
    <div className={`relative flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'} md:w-64 h-full ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-r transition-all duration-300`}>

      {/* Mobile Hamburger Menu Icon */}
      <div className="md:hidden p-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - Logo */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center`}>
        <div className="h-10 w-10 flex items-center justify-center bg-indigo-600 rounded-md text-white">
          <Shield size={24} />
        </div>
        <span className={`ml-2 font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'} ${!sidebarOpen && 'hidden md:block'}`}>
          easyappo<sup>™</sup>
        </span>
      </div>

      {/* Menu */}
      <div className={`flex-1 overflow-y-auto py-4 ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <a 
                  href="#" 
                  className={`
                    flex items-center px-4 py-3 text-sm 
                    ${item.active 
                      ? `${darkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-700'}`
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`
                    }
                  `}
                  onClick={() => setActiveView(item.view)} // Set active view on click
                >
                  <span className={`${item.active && 'text-blue-500'}`}>
                    {item.icon}
                  </span>
                  <span className={`ml-3 ${item.active && (darkMode ? 'font-medium' : 'font-medium')}`}>
                    {item.name}
                  </span>
                  {item.notification && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {item.notification}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Account (hidden on mobile) */}
      <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} py-2 ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
        <h3 className={`px-4 py-2 text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
          Account
        </h3>
        <nav>
          <ul>
            {accountItems.map((item) => (
              <li key={item.name}>
                <a 
                  href="#" 
                  className={`
                    flex items-center px-4 py-3 text-sm 
                    ${item.danger 
                      ? 'text-red-500 hover:bg-red-50' 
                      : darkMode 
                        ? 'text-gray-300 hover:bg-gray-800' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <span>{item.icon}</span>
                  <span className="ml-3">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Emergency Hotlines (hidden on mobile) */}
      <div className={`p-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-900'} text-xs ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
        <div className="flex items-center text-red-500 font-semibold mb-1">
          <span className="h-4 w-4 bg-red-500 text-white flex items-center justify-center rounded-full mr-2">
            <span className="text-xs">!</span>
          </span>
          Emergency Hotlines:
        </div>
        <div className="ml-6">1800 345 567, 108</div>
      </div>

      {/* Overlay Content When Sidebar is Open */}
      <div className={`fixed inset-0 bg-black opacity-50 z-10 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>

    </div>
  );
};

export default Sidebar;
