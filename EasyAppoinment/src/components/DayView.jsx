import React, { useState } from 'react';
import { useAppointment } from '../context/AppointmentContext';
import { 
  formatDate,
  formatDayOfWeek,
  generateTimeSlots,
  isSameDay
} from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import AppointmentModal from './AppointmentModal';
import AppointmentItem from './AppointmentItem';

const DayView = () => {
  const { 
    appointments, 
    selectedDate, 
    setSelectedDate,
    darkMode
  } = useAppointment();
  
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  
  const timeSlots = generateTimeSlots();

  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const openNewAppointmentModal = (time) => {
    setSelectedTime(time);
    setEditingAppointment(null);
    setShowAppointmentModal(true);
  };

  const openEditAppointmentModal = (appointment) => {
    setEditingAppointment(appointment);
    setSelectedTime(appointment.startTime);
    setShowAppointmentModal(true);
  };

  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    setEditingAppointment(null);
  };

  const dayAppointments = appointments.filter(appointment => 
    isSameDay(new Date(appointment.date), selectedDate)
  );

  const getAppointmentsForTimeSlot = (timeSlot) => {
    return dayAppointments.filter(appointment => {
      const appointmentStartTime = appointment.startTime;
      const appointmentEndTime = appointment.endTime;
      const timeSlotTime = parseInt(timeSlot.split(':')[0]) * 60 + parseInt(timeSlot.split(':')[1]);

      const startTime = parseInt(appointmentStartTime.split(':')[0]) * 60 + parseInt(appointmentStartTime.split(':')[1]);
      const endTime = parseInt(appointmentEndTime.split(':')[0]) * 60 + parseInt(appointmentEndTime.split(':')[1]);

      return startTime <= timeSlotTime && timeSlotTime < endTime;
    });
  };

  return (
    <div className={`flex-1 flex flex-col h-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      {/* Navigation */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {formatDayOfWeek(selectedDate)}, {formatDate(selectedDate)}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousDay}
            className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNextDay}
            className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Schedule */}
      <div className="flex-1 overflow-auto p-4">
        {dayAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              No appointments scheduled
            </p>
            <button
              onClick={() => openNewAppointmentModal('09:00')}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Appointment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Time slots */}
            <div className="sm:col-span-2 lg:col-span-3 space-y-2">
              {timeSlots.map((timeSlot) => {
                const slotAppointments = getAppointmentsForTimeSlot(timeSlot);
                return (
                  <div key={timeSlot}>
                    <div className="flex items-start">
                      <div className={`w-16 text-sm font-medium py-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {timeSlot}
                      </div>
                      <div className={`flex-1 min-h-16 border-l-2 pl-3
                        ${slotAppointments.length > 0
                          ? darkMode ? 'border-blue-400' : 'border-blue-500'
                          : darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                      >
                        {slotAppointments.length === 0 ? (
                          <div
                            className={`h-16 flex items-center hover:bg-opacity-50 rounded-lg px-2 cursor-pointer group
                              ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
                            onClick={() => openNewAppointmentModal(timeSlot)}
                          >
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                              <Plus className={`h-5 w-5 mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Add appointment
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="py-1 space-y-1">
                            {slotAppointments.map((appointment) => (
                              <AppointmentItem
                                key={appointment.id}
                                appointment={appointment}
                                onEdit={openEditAppointmentModal}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar summary */}
            <div className={`p-4 rounded-lg h-fit sticky top-4
              ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
              <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Today's Schedule
              </h3>
              {dayAppointments.length === 0 ? (
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No appointments scheduled
                </p>
              ) : (
                <div className="space-y-3">
                  {dayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`p-2 rounded-lg shadow-sm cursor-pointer
                        ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
                      onClick={() => openEditAppointmentModal(appointment)}
                    >
                      <div className="text-sm font-medium">{appointment.name}</div>
                      <div className="text-xs mt-1">
                        {appointment.startTime} - {appointment.endTime}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => openNewAppointmentModal('09:00')}
                className="w-full mt-4 flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span className="text-sm">Add Appointment</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <AppointmentModal
          isOpen={showAppointmentModal}
          onClose={closeAppointmentModal}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          appointment={editingAppointment}
        />
      )}
    </div>
  );
};

export default DayView;
