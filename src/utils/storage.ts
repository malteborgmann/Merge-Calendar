import { Calendar, CalendarState } from '../types/calendar';

const STORAGE_KEY = 'calendar_app_state';

export const saveState = (state: CalendarState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const loadState = (): CalendarState | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  const state = JSON.parse(saved);
  return {
    ...state,
    events: state.events.map((event: any) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    })),
  };
};

export const generateRandomColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 50%)`;
};