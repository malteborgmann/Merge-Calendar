export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

export type EventDisplayMode = 'original' | 'busy' | 'custom';

export interface Calendar {
  id: string;
  name: string;
  url: string;
  color: string;
  visible: boolean;
  displayMode: EventDisplayMode;
  customText?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  calendarId: string;
  description?: string;
  location?: string;
  allDay?: boolean;
}

export interface CalendarState {
  calendars: Calendar[];
  events: CalendarEvent[];
  darkMode: boolean;
  currentView: CalendarView;
}