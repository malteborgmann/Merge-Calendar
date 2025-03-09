# Merge Calendar

A simple and efficient calendar merging tool that allows you to combine multiple iCal calendars into a single view. Perfect for managing multiple calendars from different sources.

## Features

- 🗓️ Merge multiple iCal calendars into one view
- 🎨 Customize how events are displayed (original, busy, custom text)
- 📱 Responsive design with dark mode support
- 📥 Export merged calendar as iCal file
- 💾 Local storage for saving your calendar settings
- 🔄 Real-time calendar updates
- 📊 Multiple view options (month, week, day, agenda)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the preview server:
   ```bash
   npm run preview
   ```

## How to Use

1. Click "Add Calendar" and enter:
   - Calendar Name: A name to identify your calendar
   - Calendar URL: The iCal URL of your calendar (.ics format)

2. Finding iCal URLs:
   - Google Calendar: Calendar settings → "Public address in iCal format"
   - Outlook: Calendar → Share → "Get an iCalendar link"
   - Apple Calendar: Calendar → Share → "Public Calendar"
   - Other calendars: Look for "Export iCal" or "Subscribe to Calendar"

3. Customize display options:
   - Show original event titles
   - Show events as "Busy"
   - Show custom text for events

4. Export your merged calendar:
   - Click "Export as iCal" to download a combined calendar file
   - Import the downloaded file into your preferred calendar app

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- date-fns
- react-big-calendar
- Vite

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.
