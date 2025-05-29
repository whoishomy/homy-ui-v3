import { format } from 'date-fns';
import type { Reminder } from '@/types/reminder';
import { validationLogger } from './validationLog';

/**
 * Converts a Date object to a consistent string format
 */
const formatDate = (date: Date): string => {
  return date.toISOString();
};

/**
 * Generates a JSON string from reminders
 */
export const generateJSON = (reminders: Reminder[]): string => {
  const formattedReminders = reminders.map(reminder => ({
    ...reminder,
    date: formatDate(reminder.date),
    createdAt: formatDate(reminder.createdAt),
    updatedAt: formatDate(reminder.updatedAt),
    endDate: reminder.endDate ? formatDate(reminder.endDate) : undefined
  }));
  
  return JSON.stringify(formattedReminders, null, 2);
};

/**
 * Generates a CSV string from reminders
 */
export const generateCSV = (reminders: Reminder[]): string => {
  // Define CSV headers
  const headers = [
    'ID',
    'Title',
    'Description',
    'Category',
    'Date',
    'Time',
    'Frequency',
    'Status',
    'Notification Type',
    'End Date',
    'Created At',
    'Updated At'
  ];

  // Convert reminders to CSV rows
  const rows = reminders.map(reminder => [
    reminder.id,
    `"${reminder.title.replace(/"/g, '""')}"`, // Escape quotes in title
    reminder.description ? `"${reminder.description.replace(/"/g, '""')}"` : '',
    reminder.category,
    format(reminder.date, 'yyyy-MM-dd'),
    reminder.time,
    reminder.frequency,
    reminder.status,
    reminder.notificationType,
    reminder.endDate ? format(reminder.endDate, 'yyyy-MM-dd') : '',
    format(reminder.createdAt, 'yyyy-MM-dd HH:mm:ss'),
    format(reminder.updatedAt, 'yyyy-MM-dd HH:mm:ss')
  ]);

  // Combine headers and rows
  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
};

/**
 * Downloads data as a file
 */
export const downloadFile = (content: string, filename: string, type: string): void => {
  const blob = new Blob([content], { type });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exports reminders to JSON file
 */
export const exportToJSON = (reminders: Reminder[]): void => {
  if (reminders.length === 0) return;
  
  try {
    const content = generateJSON(reminders);
    const filename = reminders.length === 1 
      ? `reminder-${reminders[0].id}.json`
      : `reminders-${new Date().toISOString().split('T')[0]}.json`;
      
    downloadFile(content, filename, 'application/json');
    validationLogger.logExport('json', reminders);
  } catch (error) {
    validationLogger.logExport('json', reminders, error as Error);
    throw error;
  }
};

/**
 * Exports reminders to CSV file
 */
export const exportToCSV = (reminders: Reminder[]): void => {
  if (reminders.length === 0) return;
  
  try {
    const content = generateCSV(reminders);
    const filename = reminders.length === 1 
      ? `reminder-${reminders[0].id}.csv`
      : `reminders-${new Date().toISOString().split('T')[0]}.csv`;
      
    downloadFile(content, filename, 'text/csv;charset=utf-8');
    validationLogger.logExport('csv', reminders);
  } catch (error) {
    validationLogger.logExport('csv', reminders, error as Error);
    throw error;
  }
}; 