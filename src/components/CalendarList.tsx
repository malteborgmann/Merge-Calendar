import React from 'react';
import { Calendar, EventDisplayMode } from '../types/calendar';
import { Eye, EyeOff, Trash2 } from 'lucide-react';

interface CalendarListProps {
  calendars: Calendar[];
  onToggleVisibility: (id: string) => void;
  onChangeDisplayMode: (id: string, mode: EventDisplayMode) => void;
  onUpdateCustomText: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export const CalendarList: React.FC<CalendarListProps> = ({
  calendars,
  onToggleVisibility,
  onChangeDisplayMode,
  onUpdateCustomText,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      {calendars.map((calendar) => (
        <div
          key={calendar.id}
          className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: calendar.color }}
              />
              <span className="font-medium text-gray-900 dark:text-white">{calendar.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleVisibility(calendar.id)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                title={calendar.visible ? 'Hide Calendar' : 'Show Calendar'}
              >
                {calendar.visible ? (
                  <Eye className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
              <button
                onClick={() => onDelete(calendar.id)}
                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors duration-200"
                title="Delete Calendar"
              >
                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <select
              value={calendar.displayMode}
              onChange={(e) => onChangeDisplayMode(calendar.id, e.target.value as EventDisplayMode)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="original">Show Original Title</option>
              <option value="busy">Show as Busy</option>
              <option value="custom">Custom Text</option>
            </select>
            {calendar.displayMode === 'custom' && (
              <input
                type="text"
                value={calendar.customText || ''}
                onChange={(e) => onUpdateCustomText(calendar.id, e.target.value)}
                placeholder="Enter custom text"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};