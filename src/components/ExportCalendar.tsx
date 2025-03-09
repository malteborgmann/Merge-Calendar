import React from 'react';
import { saveAs } from 'file-saver';
import { Calendar, CalendarEvent } from '../types/calendar';
import { Download } from 'lucide-react';

interface ExportCalendarProps {
  calendars: Calendar[];
  events: CalendarEvent[];
}

export const ExportCalendar: React.FC<ExportCalendarProps> = ({ calendars, events }) => {
  const handleExport = () => {
    const visibleEvents = events.filter((event) =>
      calendars.some((cal) => cal.id === event.calendarId && cal.visible)
    );

    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Merge Calendar//EN',
      ...visibleEvents.map((event) => [
        'BEGIN:VEVENT',
        `UID:${event.id}`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART:${event.start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTEND:${event.end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `SUMMARY:${event.title}`,
        event.description ? `DESCRIPTION:${event.description}` : '',
        event.location ? `LOCATION:${event.location}` : '',
        'END:VEVENT',
      ].filter(Boolean)),
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    saveAs(blob, 'merged-calendar.ics');
  };

  return (
    <button
      onClick={handleExport}
      className="w-full flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
    >
      <Download className="h-5 w-5 mr-2" />
      Export Calendars
    </button>
  );
};