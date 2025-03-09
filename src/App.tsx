import React, { useState, useEffect } from 'react';
import { Calendar, CalendarEvent, CalendarView, EventDisplayMode } from './types/calendar';
import { AddCalendarForm } from './components/AddCalendarForm';
import { CalendarList } from './components/CalendarList';
import { CalendarView as CalendarViewComponent } from './components/CalendarView';
import { ExportCalendar } from './components/ExportCalendar';
import { loadState, saveState } from './utils/storage';
import { parseICalURL } from './utils/ical';
import { Moon, Sun, Merge } from 'lucide-react';

function App() {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      setCalendars(savedState.calendars);
      setEvents(savedState.events);
      setCurrentView(savedState.currentView);
      setDarkMode(savedState.darkMode ?? false);
    }
  }, []);

  useEffect(() => {
    saveState({
      calendars,
      events,
      currentView,
      darkMode,
    });
  }, [calendars, events, currentView, darkMode]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAddCalendar = async (calendar: Calendar) => {
    try {
      setError(null);
      const newEvents = await parseICalURL(calendar);
      
      if (newEvents.length === 0) {
        throw new Error('No events found in the calendar. Please check the URL and try again.');
      }
      
      setCalendars((prev) => [...prev, calendar]);
      setEvents((prev) => [...prev, ...newEvents]);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to add calendar. Please check the URL and try again.';
      setError(errorMessage);
      console.error('Error adding calendar:', err);
    }
  };

  const handleToggleVisibility = (id: string) => {
    setCalendars((prev) =>
      prev.map((cal) =>
        cal.id === id ? { ...cal, visible: !cal.visible } : cal
      )
    );
  };

  const handleChangeDisplayMode = (id: string, mode: EventDisplayMode) => {
    setCalendars((prev) =>
      prev.map((cal) =>
        cal.id === id ? { ...cal, displayMode: mode } : cal
      )
    );
  };

  const handleUpdateCustomText = (id: string, text: string) => {
    setCalendars((prev) =>
      prev.map((cal) =>
        cal.id === id ? { ...cal, customText: text } : cal
      )
    );
  };

  const handleDeleteCalendar = (id: string) => {
    setCalendars((prev) => prev.filter((cal) => cal.id !== id));
    setEvents((prev) => prev.filter((event) => event.calendarId !== id));
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    console.log('Selected event:', event);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-4">
            <Merge className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Merge Calendar</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <Sun className="h-6 w-6 text-yellow-500" />
            ) : (
              <Moon className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add Calendar</h2>
              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}
              <AddCalendarForm onAdd={handleAddCalendar} />
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Calendars</h2>
              <div className="space-y-2 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Active Calendars: {calendars.filter(cal => cal.visible).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Total Events: {events.length}
                </p>
              </div>
              <CalendarList
                calendars={calendars}
                onToggleVisibility={handleToggleVisibility}
                onChangeDisplayMode={handleChangeDisplayMode}
                onUpdateCustomText={handleUpdateCustomText}
                onDelete={handleDeleteCalendar}
              />
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <ExportCalendar calendars={calendars} events={events} />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <CalendarViewComponent
                events={events}
                calendars={calendars}
                view={currentView}
                onViewChange={setCurrentView}
                onSelectEvent={handleSelectEvent}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;