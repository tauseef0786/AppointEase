import { createContext, useState, useContext, useEffect } from 'react';

// Define categories with their colors
export const CATEGORIES = {
  EMERGENCY: { label: 'Emergency', color: 'bg-red-500' },
  EXAMINATION: { label: 'Examination', color: 'bg-amber-300' },
  CONSULTATION: { label: 'Consultation', color: 'bg-indigo-500' },
  ROUTINE_CHECKUP: { label: 'Routine Checkup', color: 'bg-rose-500' },
  SICK_VISIT: { label: 'Sick Visit', color: 'bg-blue-400' }
};

// Sample doctors data
const initialDoctors = [
  { 
    id: '1', 
    name: 'Dr. Jonson ', 
    specialty: 'Cardiologist',
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  { 
    id: '2', 
    name: 'Dr.B.K Sing', 
    specialty: 'Pediatrician',
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  { 
    id: '3', 
    name: 'Dr. Ramesh', 
    specialty: 'Dermatologist',
    image: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  { 
    id: '4', 
    name: 'Dr. Kamil', 
    specialty: 'Orthopedic Surgeon',
    image: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];


// Generate current date
const currentDate = new Date();
const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

// Sample appointments
const initialAppointments = [
  {
    id: '1',
    name: 'Drug Test',
    category: 'EXAMINATION',
    doctorId: '1',
    date: today,
    startTime: '09:00',
    endTime: '09:45'
  },
  {
    id: '2',
    name: 'Malaria Fever',
    category: 'SICK_VISIT',
    doctorId: '2',
    date: today,
    startTime: '09:30',
    endTime: '10:15'
  },
  {
    id: '3',
    name: 'How To Get Pregnant',
    category: 'CONSULTATION',
    doctorId: '3',
    date: today,
    startTime: '10:30',
    endTime: '11:30'
  },
  {
    id: '4',
    name: 'Covid 19 Pills',
    category: 'SICK_VISIT',
    doctorId: '4',
    date: today,
    startTime: '14:00',
    endTime: '14:30'
  },
  {
    id: '5',
    name: 'Neck Cancer',
    category: 'EMERGENCY',
    doctorId: '1',
    date: tomorrow,
    startTime: '15:30',
    endTime: '16:30'
  },
  {
    id: '6',
    name: 'Sister Ayo\'s Routine Checkup',
    category: 'ROUTINE_CHECKUP',
    doctorId: '3',
    date: tomorrow,
    startTime: '16:00',
    endTime: '16:45'
  },
  {
    id: '7',
    name: 'Drug Test',
    category: 'EXAMINATION',
    doctorId: '2',
    date: dayAfterTomorrow,
    startTime: '14:30',
    endTime: '15:00'
  }
];

// Create context
const AppointmentContext = createContext();

// Create provider
export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState(() => {
    const savedAppointments = localStorage.getItem('appointments');
    return savedAppointments ? JSON.parse(savedAppointments) : initialAppointments;
  });
  
  const [doctors] = useState(initialDoctors);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [darkMode, setDarkMode] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Save appointments to localStorage when they change
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);
  
  // Add appointment
  const addAppointment = (appointment) => {
    const newAppointment = {
      ...appointment,
      id: Date.now().toString()
    };
    setAppointments([...appointments, newAppointment]);
    showNotification(`Appointment "${appointment.name}" scheduled successfully!`);
  };
  
  // Update appointment
  const updateAppointment = (id, updatedData) => {
    setAppointments(
      appointments.map(appointment => 
        appointment.id === id ? { ...appointment, ...updatedData } : appointment
      )
    );
    showNotification('Appointment updated successfully!');
  };
  
  // Delete appointment
  const deleteAppointment = (id) => {
    const appointment = appointments.find(apt => apt.id === id);
    setAppointments(appointments.filter(appointment => appointment.id !== id));
    showNotification(`Appointment "${appointment.name}" deleted.`);
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Show notification
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  // Find doctor by ID
  const findDoctor = (doctorId) => {
    return doctors.find(doctor => doctor.id === doctorId);
  };
  
  const value = {
    appointments,
    doctors,
    selectedDate,
    viewMode,
    darkMode,
    notification,
    setSelectedDate,
    setViewMode,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    toggleDarkMode,
    showNotification,
    findDoctor
  };
  
  return (
    <AppointmentContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </AppointmentContext.Provider>
  );
}

// Custom hook for using the appointment context
export function useAppointment() {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
}
