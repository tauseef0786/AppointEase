import React, { useState } from 'react';
import { useAppointment } from '../context/AppointmentContext';
import {
  getDatesInMonth,
  formatMonthYear,
  isSameDay,
} from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import AppointmentModal from './AppointmentModal';

const MonthView = () => {
  const {
    appointments,
    selectedDate,
    setSelectedDate,
    darkMode,
  } = useAppointment();

  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const datesInMonth = getDatesInMonth(currentYear, currentMonth);

  const goToPreviousMonth = () => {
    const prevMonth = new Date(selectedDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setSelectedDate(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(selectedDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setSelectedDate(nextMonth);
  };

  const openDayAppointmentsModal = (date) => {
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    setSelectedDay(normalizedDate);
    setEditingAppointment(null);
    setShowAppointmentModal(true);
  };

  const openEditAppointmentModal = (appointment) => {
    const apptDate = new Date(appointment.date);
    const normalized = new Date(apptDate.getFullYear(), apptDate.getMonth(), apptDate.getDate());
    setEditingAppointment(appointment);
    setSelectedDay(normalized);
    setShowAppointmentModal(true);
  };

  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    setEditingAppointment(null);
  };

  const getAppointmentsForDate = (date) => {
    return appointments.filter((appointment) => {
      const apptDate = new Date(appointment.date);
      return isSameDay(apptDate, date);
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

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div
      className={`flex-1 flex flex-col h-full ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white'
      }`}
    >
      {/* Month Navigation */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <h2
            className={`text-lg font-medium ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}
          >
            {formatMonthYear(selectedDate)}
          </h2>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={goToPreviousMonth}
            className={`p-1.5 rounded-full ${
              darkMode
                ? 'hover:bg-gray-800 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNextMonth}
            className={`p-1.5 rounded-full ${
              darkMode
                ? 'hover:bg-gray-800 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Month Calendar */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="overflow-x-auto">
          <div className="min-w-[700px] grid grid-cols-7 gap-2">
            {/* Days of the week headers */}
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className={`p-2 text-center font-medium text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {day}
              </div>
            ))}

            {/* Calendar dates */}
            {datesInMonth.map(({ date, isCurrentMonth }, index) => {
              const dateAppointments = getAppointmentsForDate(date);
              const hasAppointments = dateAppointments.length > 0;

              return (
                <div
                  key={index}
                  onClick={() => openDayAppointmentsModal(date)}
                  className={`p-1 h-24 overflow-hidden ${
                    isCurrentMonth
                      ? isToday(date)
                        ? 'bg-blue-500 text-white rounded-lg'
                        : darkMode
                        ? 'bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700'
                        : 'bg-white border border-gray-200 rounded-lg hover:bg-blue-50'
                      : darkMode
                      ? 'bg-gray-800 text-gray-500 opacity-50 rounded-lg border border-gray-700'
                      : 'bg-gray-100 text-gray-400 opacity-70 rounded-lg border border-gray-200'
                  } transition-colors cursor-pointer`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={`text-sm font-medium ${
                        isToday(date) ? 'text-white' : ''
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    {hasAppointments && (
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          isToday(date)
                            ? 'bg-white text-blue-500'
                            : darkMode
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {dateAppointments.length}
                      </span>
                    )}
                  </div>

                  {/* First 2 appointments */}
                  <div className="space-y-1">
                    {dateAppointments.slice(0, 2).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="text-xs truncate"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditAppointmentModal(appointment);
                        }}
                      >
                        <div
                          className={`px-1.5 py-0.5 rounded truncate font-medium ${
                            darkMode ? 'bg-opacity-70' : 'bg-opacity-90'
                          } bg-${appointment.category
                            .toLowerCase()
                            .replace('_', '-')}`}
                        >
                          {appointment.name}
                        </div>
                      </div>
                    ))}

                    {/* +more indicator */}
                    {dateAppointments.length > 2 && (
                      <div
                        className={`text-xs font-medium pl-1 ${
                          isToday(date)
                            ? 'text-white'
                            : darkMode
                            ? 'text-gray-300'
                            : 'text-gray-500'
                        }`}
                      >
                        +{dateAppointments.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && selectedDay && (
        <AppointmentModal
          isOpen={showAppointmentModal}
          onClose={closeAppointmentModal}
          selectedDate={selectedDay}
          appointment={editingAppointment}
          showDayView={!editingAppointment}
        />
      )}
    </div>
  );
};

export default MonthView;
