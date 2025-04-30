import React, { useState, useEffect } from 'react';
import { useAppointment } from '../context/AppointmentContext';
import { CATEGORIES } from '../context/AppointmentContext';
import { formatDate, formatDayOfWeek, formatTime } from '../utils/dateUtils';
import { X, Calendar, Clock, User, Tag } from 'lucide-react';
import AppointmentItem from './AppointmentItem';

const AppointmentModal = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  selectedTime,
  appointment,
  showDayView = false
}) => {
  const { 
    addAppointment, 
    updateAppointment, 
    deleteAppointment, 
    doctors, 
    findDoctor,
    appointments,
    darkMode
  } = useAppointment();
  
  // State for form inputs
  const [name, setName] = useState('');
  const [category, setCategory] = useState('CONSULTATION');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState(selectedTime || '09:00');
  const [endTime, setEndTime] = useState('09:30');
  
  // Initialize form with appointment data if editing
  useEffect(() => {
    if (appointment) {
      setName(appointment.name);
      setCategory(appointment.category);
      setDoctorId(appointment.doctorId);
      setDate(new Date(appointment.date));
      setStartTime(appointment.startTime);
      setEndTime(appointment.endTime);
    } else {
      // Default end time is 30 minutes after start time
      if (selectedTime) {
        const [hours, minutes] = selectedTime.split(':').map(Number);
        let newHours = hours;
        let newMinutes = minutes + 30;
        
        if (newMinutes >= 60) {
          newHours = (newHours + 1) % 24;
          newMinutes = newMinutes - 60;
        }
        
        setEndTime(`${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`);
      }
      
      // Default to first doctor if not editing
      if (doctors.length > 0 && !doctorId) {
        setDoctorId(doctors[0].id);
      }
    }
  }, [appointment, selectedTime, doctors, doctorId]);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create appointment data
    const appointmentData = {
      name,
      category,
      doctorId,
      date,
      startTime,
      endTime
    };
    
    // Update or add appointment
    if (appointment) {
      updateAppointment(appointment.id, appointmentData);
    } else {
      addAppointment(appointmentData);
    }
    
    // Close modal
    onClose();
  };
  
  // Handle appointment deletion
  const handleDelete = () => {
    deleteAppointment(appointment.id);
    onClose();
  };
  
  // Filter appointments for the selected date
  const dayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const selected = new Date(selectedDate);
    
    return (
      aptDate.getFullYear() === selected.getFullYear() &&
      aptDate.getMonth() === selected.getMonth() &&
      aptDate.getDate() === selected.getDate()
    );
  });
  
  // Generate time options in 30-minute intervals
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 17; hour++) {
      options.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 17) {
        options.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return options;
  };
  
  const timeOptions = generateTimeOptions();
  
  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        {/* Modal Container */}
        <div 
          className={`relative w-full max-w-md max-h-[90vh] overflow-auto rounded-lg shadow-lg p-6 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          } animate-fadeIn`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-1 rounded-full ${
              darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
          
          {showDayView ? (
            /* Day View */
            <>
              <h2 className="text-xl font-bold mb-4">
                {formatDayOfWeek(selectedDate)}, {formatDate(selectedDate)}
              </h2>
              
              {dayAppointments.length === 0 ? (
                <div className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p>No appointments scheduled for this day.</p>
                  <button
                    onClick={() => {
                      onClose();
                      setTimeout(() => {
                        document.getElementById('new-appointment-btn')?.click();
                      }, 100);
                    }}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg transition-colors hover:bg-blue-600"
                  >
                    Add New Appointment
                  </button>
                </div>
              ) : (
                <div className="space-y-3 mt-4">
                  {dayAppointments.map((apt) => (
                    <AppointmentItem 
                      key={apt.id} 
                      appointment={apt} 
                      onEdit={() => {
                        onClose();
                        setTimeout(() => {
                          const editBtn = document.querySelector(`[data-appointment-id="${apt.id}"]`);
                          editBtn?.click();
                        }, 100);
                      }} 
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Appointment Form */
            <>
              <h2 className="text-xl font-bold mb-4">
                {appointment ? 'Edit Appointment' : 'New Appointment'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    placeholder="Enter appointment name"
                  />
                </div>
                
                {/* Category */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Category
                  </label>
                  <div className={`relative ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg appearance-none ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    >
                      {Object.entries(CATEGORIES).map(([key, { label }]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Doctor */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Doctor
                  </label>
                  <div className={`relative ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={doctorId}
                      onChange={(e) => setDoctorId(e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg appearance-none ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    >
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} ({doctor.specialty})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Date */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Date
                  </label>
                  <div className={`relative ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      required
                      value={date.toISOString().split('T')[0]}
                      onChange={(e) => setDate(new Date(e.target.value))}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    />
                  </div>
                </div>
                
                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Start Time
                    </label>
                    <div className={`relative ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        value={startTime}
                        onChange={(e) => {
                          const newStartTime = e.target.value;
                          setStartTime(newStartTime);
                          
                          // Update end time to be at least 30 minutes after start time
                          const [hours, minutes] = newStartTime.split(':').map(Number);
                          let newHours = hours;
                          let newMinutes = minutes + 30;
                          
                          if (newMinutes >= 60) {
                            newHours = (newHours + 1) % 24;
                            newMinutes = newMinutes - 60;
                          }
                          
                          const newEndTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
                          
                          if (timeOptions.includes(newEndTime)) {
                            setEndTime(newEndTime);
                          }
                        }}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg appearance-none ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                      >
                        {timeOptions.map((time) => (
                          <option key={`start-${time}`} value={time}>
                            {formatTime(time)}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      End Time
                    </label>
                    <div className={`relative ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg appearance-none ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                      >
                        {timeOptions
                          .filter((time) => {
                            const [startHours, startMinutes] = startTime.split(':').map(Number);
                            const [endHours, endMinutes] = time.split(':').map(Number);
                            const startTotalMinutes = startHours * 60 + startMinutes;
                            const endTotalMinutes = endHours * 60 + endMinutes;
                            return endTotalMinutes > startTotalMinutes;
                          })
                          .map((time) => (
                            <option key={`end-${time}`} value={time}>
                              {formatTime(time)}
                            </option>
                          ))
                        }
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Doctor Preview */}
                {doctorId && (
                  <div className={`p-3 rounded-lg mb-6 flex items-center ${
                    darkMode ? 'bg-gray-700' : 'bg-blue-50'
                  }`}>
                    <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden mr-3">
                      <img 
                        src={findDoctor(doctorId)?.image} 
                        alt={findDoctor(doctorId)?.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {findDoctor(doctorId)?.name}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {findDoctor(doctorId)?.specialty}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Buttons */}
                <div className="flex space-x-3">
                  {appointment && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg transition-colors hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg transition-colors hover:bg-blue-600"
                  >
                    {appointment ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AppointmentModal;