import React from 'react';
import { useAppointment } from '../context/AppointmentContext';
import { CATEGORIES } from '../context/AppointmentContext';
import { formatTime } from '../utils/dateUtils';
import { Edit, Trash2 } from 'lucide-react';

const AppointmentItem = ({ appointment, onEdit, compact = false }) => {
  const { deleteAppointment, findDoctor } = useAppointment();
  const doctor = findDoctor(appointment.doctorId);
  const categoryInfo = CATEGORIES[appointment.category];

  // Compact view for calendar slots
  if (compact) {
    return (
      <div
        className={`${categoryInfo.color} text-black rounded-lg px-3 py-2 mb-2 text-sm font-medium flex justify-between items-center w-full sm:w-auto`}
      >
        <span className="truncate w-1/2">{appointment.name}</span>
        <span className="text-right w-1/2">{formatTime(appointment.startTime)}</span>
      </div>
    );
  }

  return (
    <div
      className={`${categoryInfo.color} text-black rounded-lg p-4 mb-4 min-w-[280px] sm:min-w-[320px] max-w-full sm:max-w-sm transition-transform hover:scale-[1.02] hover:shadow-md animate-fadeIn overflow-x-auto scrollbar-hide`}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="flex-1">
          <h3 className="font-bold text-base sm:text-lg">{appointment.name}</h3>
          <p className="text-sm mt-1">
            {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
          </p>
          <p className="text-sm mt-1">Dr. {doctor?.name?.split(' ')[1]}</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onEdit(appointment)}
            className="p-2 bg-white bg-opacity-30 rounded hover:bg-opacity-40 transition-colors"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => deleteAppointment(appointment.id)}
            className="p-2 bg-white bg-opacity-30 rounded hover:bg-opacity-40 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentItem;
