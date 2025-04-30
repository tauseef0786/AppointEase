import React, { useState } from 'react';
import { useAppointment } from '../context/AppointmentContext';
import {
  getWeekDates,
  formatShortDayOfWeek,
  getWeekRangeString,
  isSameDay,
  generateTimeSlots
} from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import AppointmentModal from './AppointmentModal';
import AppointmentItem from './AppointmentItem';

const WeekView = () => {
  const {
    appointments,
    selectedDate,
    setSelectedDate,
    darkMode
  } = useAppointment();

  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSlotDate, setSelectedSlotDate] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const weekDates = getWeekDates(selectedDate);
  const weekRangeString = getWeekRangeString(weekDates);
  const timeSlots = generateTimeSlots();

  const goToPreviousWeek = () => {
    const prevWeek = new Date(selectedDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setSelectedDate(prevWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(selectedDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setSelectedDate(nextWeek);
  };

  const openNewAppointmentModal = (date, time) => {
    setSelectedSlotDate(date);
    setSelectedTime(time);
    setEditingAppointment(null);
    setShowAppointmentModal(true);
  };

  const openEditAppointmentModal = (appointment) => {
    setEditingAppointment(appointment);
    setSelectedSlotDate(new Date(appointment.date));
    setSelectedTime(appointment.startTime);
    setShowAppointmentModal(true);
  };

  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    setEditingAppointment(null);
  };

  const getAppointmentsForSlot = (date, timeSlot) => {
    return appointments.filter(appointment => {
      if (!isSameDay(new Date(appointment.date), date)) return false;

      const timeSlotMinutes = parseInt(timeSlot.split(':')[0]) * 60 + parseInt(timeSlot.split(':')[1]);
      const startMinutes = parseInt(appointment.startTime.split(':')[0]) * 60 + parseInt(appointment.startTime.split(':')[1]);
      const endMinutes = parseInt(appointment.endTime.split(':')[0]) * 60 + parseInt(appointment.endTime.split(':')[1]);

      return startMinutes <= timeSlotMinutes && timeSlotMinutes < endMinutes;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className={`flex-1 flex flex-col h-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      {/* Navigation */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            This week: {weekRangeString}
          </h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousWeek}
            className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNextWeek}
            className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Week Calendar */}
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[1000px] grid grid-cols-8 h-full">
          {/* Time Slots Column */}
          <div className={`border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`h-12 border-b flex items-center justify-center font-medium text-sm
              ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
              Time
            </div>
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot} className={`h-16 py-2 px-2 flex items-center justify-center text-sm
                ${darkMode ? 'border-b border-gray-700 text-gray-400' : 'border-b border-gray-200 text-gray-500'}`}>
                {timeSlot}
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDates.map((date, index) => (
            <div key={index} className={`border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {/* Header */}
              <div className={`h-12 border-b flex flex-col items-center justify-center
                ${isToday(date)
                  ? 'bg-blue-500 text-white'
                  : darkMode
                    ? 'text-gray-300 border-gray-700'
                    : 'text-gray-700 border-gray-200'}`}>
                <div className="text-sm font-medium">
                  {formatShortDayOfWeek(date)}
                </div>
                <div className={`text-sm ${isToday(date) ? 'font-bold' : ''}`}>
                  {date.getDate()}
                </div>
              </div>

              {/* Time Slot Grid */}
              {timeSlots.map((timeSlot) => {
                const slotAppointments = getAppointmentsForSlot(date, timeSlot);
                return (
                  <div
                    key={`${date}-${timeSlot}`}
                    className={`h-16 relative border-b cursor-pointer 
                      ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => openNewAppointmentModal(date, timeSlot)}
                  >
                    <div className="p-1 h-full">
                      {slotAppointments.length === 0 && (
                        <div className="flex items-center justify-center h-full opacity-0 hover:opacity-100 transition-opacity">
                          <Plus className="h-5 w-5 text-gray-400" />
                        </div>
                      )}

                      {slotAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditAppointmentModal(appointment);
                          }}
                        >
                          <AppointmentItem
                            appointment={appointment}
                            onEdit={openEditAppointmentModal}
                            compact
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <AppointmentModal
          isOpen={showAppointmentModal}
          onClose={closeAppointmentModal}
          selectedDate={selectedSlotDate}
          selectedTime={selectedTime}
          appointment={editingAppointment}
        />
      )}
    </div>
  );
};

export default WeekView;
