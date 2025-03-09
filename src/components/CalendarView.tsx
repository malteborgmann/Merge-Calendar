import React from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { CalendarEvent, CalendarView as ViewType, Calendar } from '../types/calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarViewProps {
  events: CalendarEvent[];
  calendars: Calendar[];
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  calendars,
  view,
  onViewChange,
  onSelectEvent,
}) => {
  const visibleEvents = events.filter((event) => {
    const calendar = calendars.find((cal) => cal.id === event.calendarId);
    return calendar?.visible;
  }).map((event) => {
    const calendar = calendars.find((cal) => cal.id === event.calendarId);
    if (!calendar) return event;

    let title = event.title;
    if (calendar.displayMode === 'busy') {
      title = 'Busy';
    } else if (calendar.displayMode === 'custom' && calendar.customText) {
      title = calendar.customText;
    }

    return {
      ...event,
      title,
      color: calendar.color,
    };
  });

  return (
    <div className="h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <BigCalendar
        localizer={localizer}
        events={visibleEvents}
        view={view}
        onView={(newView) => onViewChange(newView as ViewType)}
        onSelectEvent={onSelectEvent}
        eventPropGetter={(event: any) => ({
          style: {
            backgroundColor: event.color,
          },
        })}
      />
    </div>
  );
};