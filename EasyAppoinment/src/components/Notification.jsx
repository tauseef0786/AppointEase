import React from 'react';
import { useAppointment } from '../context/AppointmentContext';
import { CheckCircle } from 'lucide-react';

const Notification = () => {
  const { notification, darkMode } = useAppointment();
  
  if (!notification) return null;
  
  return (
    <div className="fixed bottom-5 right-5 z-50 animate-slideInRight">
      <div className={`p-3 rounded-lg shadow-lg flex items-center space-x-2 ${
        darkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-800 border border-gray-200'
      }`}>
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span>{notification}</span>
      </div>
    </div>
  );
};

export default Notification;