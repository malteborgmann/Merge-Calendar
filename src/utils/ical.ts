import ICAL from 'ical.js';
import { Calendar, CalendarEvent } from '../types/calendar';

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

export const parseICalURL = async (calendar: Calendar): Promise<CalendarEvent[]> => {
  try {
    let data: string;
    
    // First try direct fetch
    try {
      const response = await fetch(calendar.url, {
        headers: {
          'Accept': 'text/calendar',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      data = await response.text();
    } catch (directError) {
      console.log('Direct fetch failed, trying CORS proxy...');
      
      // Try with CORS proxy
      const proxyResponse = await fetch(`${CORS_PROXY}${calendar.url}`, {
        headers: {
          'Accept': 'text/calendar',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!proxyResponse.ok) {
        throw new Error(`Failed to fetch calendar (${proxyResponse.status}): ${proxyResponse.statusText}`);
      }

      data = await proxyResponse.text();
    }

    // Validate iCal data
    if (!data?.trim()) {
      throw new Error('Calendar data is empty. Please check the URL and try again.');
    }

    if (!data.trim().toUpperCase().includes('BEGIN:VCALENDAR')) {
      throw new Error('Invalid calendar format: The URL does not provide a valid iCal file.');
    }

    // Parse iCal data
    const jcalData = ICAL.parse(data);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');

    if (vevents.length === 0) {
      throw new Error('No events found in the calendar. Please check the URL and try again.');
    }

    const parsedEvents = vevents
      .map((vevent) => {
        try {
          const event = new ICAL.Event(vevent);
          const startDate = event.startDate?.toJSDate();
          const endDate = event.endDate?.toJSDate();

          if (!startDate || !endDate) {
            console.warn('Skipping event with invalid dates:', event.summary);
            return null;
          }

          return {
            id: event.uid || crypto.randomUUID(),
            title: event.summary || 'Untitled Event',
            start: startDate,
            end: endDate,
            calendarId: calendar.id,
            description: event.description || '',
            location: event.location || '',
            allDay: !event.startDate.isDate,
          };
        } catch (eventError) {
          console.warn('Skipping invalid event:', eventError);
          return null;
        }
      })
      .filter((event): event is CalendarEvent => event !== null);

    if (parsedEvents.length === 0) {
      throw new Error('No valid events found in the calendar. Please check the URL and try again.');
    }

    return parsedEvents;
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to parse calendar. Please check if the URL provides a valid iCal format.';
    throw new Error(errorMessage);
  }
};