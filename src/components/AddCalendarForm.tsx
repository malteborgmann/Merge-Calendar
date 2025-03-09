import React, { useState } from 'react';
import { Calendar } from '../types/calendar';
import { generateRandomColor } from '../utils/storage';
import { Plus } from 'lucide-react';

interface AddCalendarFormProps {
  onAdd: (calendar: Calendar) => void;
}

export const AddCalendarForm: React.FC<AddCalendarFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate URL format
      new URL(url);
      
      const newCalendar: Calendar = {
        id: crypto.randomUUID(),
        name,
        url,
        color: generateRandomColor(),
        visible: true,
        displayMode: 'original',
      };

      await onAdd(newCalendar);
      setName('');
      setUrl('');
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid URL')) {
        throw new Error('Please enter a valid URL');
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Calendar Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          iCal URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          required
          disabled={isSubmitting}
          placeholder="https://example.com/calendar.ics"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="h-5 w-5 mr-2" />
        {isSubmitting ? 'Adding Calendar...' : 'Add Calendar'}
      </button>
    </form>
  );
};