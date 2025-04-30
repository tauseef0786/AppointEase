import React from 'react';
import { useAppointment } from '../context/AppointmentContext';
import { CATEGORIES } from '../context/AppointmentContext';

const CalendarLegend = () => {
  const { darkMode } = useAppointment();
  
  return (
    <div className={`flex flex-wrap gap-3 p-4 border-t ${
      darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'
    }`}>
      {Object.entries(CATEGORIES).map(([key, { label, color }]) => (
        <div key={key} className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-1.5 ${color}`}></div>
          <span className="text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default CalendarLegend;