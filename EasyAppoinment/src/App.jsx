import { useState } from 'react';
import { AppointmentProvider } from './context/AppointmentContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import MonthView from './components/MonthView';
import ViewToggle from './components/ViewToggle';
import CalendarLegend from './components/CalendarLegend';
import Notification from './components/Notification';
import AppointmentModal from './components/AppointmentModal';
import { Plus } from 'lucide-react';

function App() {
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);

  return (
    <AppointmentProvider>
      {({ viewMode, darkMode }) => (
        <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <Header />
            
            {/* Calendar View Controls */}
            <div className={`px-6 py-3 flex items-center justify-between border-b ${
              darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Appointments
              </h1>
              
              <div className="flex items-center space-x-4">
                <ViewToggle />
                <button
                  id="new-appointment-btn"
                  onClick={() => setShowNewAppointmentModal(true)}
                  className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg transition-colors hover:bg-blue-600"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  <span className="text-sm font-medium">New Appointment</span>
                </button>
              </div>
            </div>
            
            {/* Calendar View */}
            <div className="flex-1 overflow-hidden">
              {viewMode === 'week' && <WeekView />}
              {viewMode === 'day' && <DayView />}
              {viewMode === 'month' && <MonthView />}
            </div>
            
            {/* Calendar Legend */}
            <CalendarLegend />
          </div>
          
          {/* New Appointment Modal */}
          {showNewAppointmentModal && (
            <AppointmentModal
              isOpen={showNewAppointmentModal}
              onClose={() => setShowNewAppointmentModal(false)}
              selectedDate={new Date()}
              selectedTime="09:00"
            />
          )}
          
          {/* Notification */}
          <Notification />
        </div>
      )}
    </AppointmentProvider>
  );
}

export default App;
