import React, { useState, useEffect } from 'react';
import { useAppointment } from '../context/AppointmentContext';
import { BarChart, LineChart } from 'lucide-react';  

const OverviewPage = () => {
  const { darkMode } = useAppointment();
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [stats, setStats] = useState({ totalAppointments: 0, upcomingAppointments: 0, appointmentsToday: 0 });

  // Fetch or simulate data for appointments
  useEffect(() => {
    // Simulating fetched data (replace with actual data fetch logic)
    const fetchedAppointments = [
      { date: '2025-04-01', status: 'completed' },
      { date: '2025-04-02', status: 'upcoming' },
      { date: '2025-04-03', status: 'upcoming' },
      { date: '2025-04-04', status: 'completed' },
    ];
    setAppointmentsData(fetchedAppointments);

    // Update stats based on the fetched data
    const totalAppointments = fetchedAppointments.length;
    const upcomingAppointments = fetchedAppointments.filter(app => app.status === 'upcoming').length;
    const appointmentsToday = fetchedAppointments.filter(app => new Date(app.date).toLocaleDateString() === new Date().toLocaleDateString()).length;

    setStats({ totalAppointments, upcomingAppointments, appointmentsToday });
  }, []);

  return (
    <div
      className={`min-h-screen p-4 md:px-8 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      {/* Page Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Welcome back, Aman Kumar</h1>
        <p className="text-sm text-gray-500">Patient</p>
      </header>

      {/* Stats Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="p-6 rounded-lg shadow-md bg-gray-100 dark:bg-gray-800">
          <h3 className="text-lg font-medium">Total Appointments</h3>
          <p className="text-2xl font-bold">{stats.totalAppointments}</p>
        </div>
        <div className="p-6 rounded-lg shadow-md bg-gray-100 dark:bg-gray-800">
          <h3 className="text-lg font-medium">Upcoming Appointments</h3>
          <p className="text-2xl font-bold">{stats.upcomingAppointments}</p>
        </div>
        <div className="p-6 rounded-lg shadow-md bg-gray-100 dark:bg-gray-800">
          <h3 className="text-lg font-medium">Appointments Today</h3>
          <p className="text-2xl font-bold">{stats.appointmentsToday}</p>
        </div>
      </section>

      {/* Graph/Chart (optional) */}
      <section className="mb-6">
        <h3 className="text-xl font-medium mb-4">Appointments Overview</h3>
        <div className="p-6 rounded-lg shadow-md bg-gray-100 dark:bg-gray-800">
          <LineChart className="w-full h-64" /> {/* Or use a BarChart/other depending on library */}
          {/* The graph would typically be dynamic based on your data */}
        </div>
      </section>

      {/* Appointments List (optional) */}
      <section>
        <h3 className="text-xl font-medium mb-4">Your Appointments</h3>
        <div className="space-y-4">
          {appointmentsData.map((appointment, index) => (
            <div key={index} className="p-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-800">
              <p className="text-sm text-gray-600">Date: {appointment.date}</p>
              <p className={`text-sm ${appointment.status === 'upcoming' ? 'text-blue-500' : 'text-gray-500'}`}>
                Status: {appointment.status}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OverviewPage;
