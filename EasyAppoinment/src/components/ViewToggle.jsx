import React from 'react';
import { useAppointment } from '../context/AppointmentContext';

const ViewToggle = () => {
  const { viewMode, setViewMode, darkMode } = useAppointment();

  return (
    <div className="flex bg-gray-100 rounded-lg overflow-hidden">
      <button
        className={`py-1 px-3 text-sm font-medium transition-colors duration-200 ${
          viewMode === 'day' 
            ? 'bg-red-500 text-white' 
            : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`
        }`}
        onClick={() => setViewMode('day')}
      >
        DAY
      </button>
      <button
        className={`py-1 px-3 text-sm font-medium transition-colors duration-200 ${
          viewMode === 'week' 
            ? 'bg-red-500 text-white' 
            : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`
        }`}
        onClick={() => setViewMode('week')}
      >
        WEEK
      </button>
      <button
        className={`py-1 px-3 text-sm font-medium transition-colors duration-200 ${
          viewMode === 'month' 
            ? 'bg-red-500 text-white' 
            : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`
        }`}
        onClick={() => setViewMode('month')}
      >
        MONTH
      </button>
    </div>
  );
};

export default ViewToggle;