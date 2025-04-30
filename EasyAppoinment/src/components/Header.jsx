import React, { useState } from 'react';
import { useAppointment } from '../context/AppointmentContext';
import { Search, Bell, Sun, Moon } from 'lucide-react';

const Header = () => {
  const { darkMode, toggleDarkMode } = useAppointment();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header
      className={`w-full px-4 py-3 border-b ${
        darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Search Bar */}
        <div className="w-full md:max-w-2xl">
          <div className={`relative rounded-md ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`block w-full pl-10 pr-3 py-2 rounded-md text-sm focus:outline-none ${
                darkMode
                  ? 'bg-gray-800 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Search pathology results"
              aria-label="Search pathology results"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-4">
          {/* Notification Button */}
          <button
            className={`p-2 rounded-full transition ${
              darkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-700'
            }`}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition ${
              darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'
            }`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* User Info */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
              <img
                src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                alt="User profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Aman Kumar</p>
              <p className="text-xs text-blue-500">PATIENT</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
