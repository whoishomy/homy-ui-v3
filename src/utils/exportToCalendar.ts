import type { Reminder } from '@/types/reminder';

interface ICalEvent {
  BEGIN: string;
  VERSION: string;
  PRODID: string;
  CALSCALE: string;
  METHOD: string;
  'BEGIN:VEVENT': string;
  SUMMARY: string;
  DTSTART: string;
  DTEND: string;
  DESCRIPTION?: string;
  LOCATION?: string;
  UID: string;
  'END:VEVENT': string;
  END: string;
}

/**
 * Converts a date and time string to iCal format (YYYYMMDDTHHmmss)
 */
const formatDateTime = (date: Date, time: string): string => {
  const [hours, minutes] = time.split(':');
  const d = new Date(date);
  d.setHours(parseInt(hours), parseInt(minutes));
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

/**
 * Generates an iCal event string for a single reminder
 */
const generateEvent = (reminder: Reminder): string => {
  const dtstart = formatDateTime(reminder.date, reminder.time);
  // Default duration of 30 minutes if not specified
  const dtend = formatDateTime(
    new Date(reminder.date.getTime() + 30 * 60000),
    reminder.time
  );

  const event: ICalEvent = {
    BEGIN: 'BEGIN:VCALENDAR',
    VERSION: 'VERSION:2.0',
    PRODID: 'PRODID:-//Homy//Reminder//TR',
    CALSCALE: 'CALSCALE:GREGORIAN',
    METHOD: 'METHOD:PUBLISH',
    'BEGIN:VEVENT': 'BEGIN:VEVENT',
    SUMMARY: `SUMMARY:${reminder.title}`,
    DTSTART: `DTSTART:${dtstart}`,
    DTEND: `DTEND:${dtend}`,
    DESCRIPTION: reminder.description ? `DESCRIPTION:${reminder.description}` : undefined,
    UID: `UID:${reminder.id}@homy.reminder`,
    'END:VEVENT': 'END:VEVENT',
    END: 'END:VCALENDAR',
  };

  return Object.values(event)
    .filter(Boolean)
    .join('\r\n');
};

/**
 * Generates an iCal file content for multiple reminders
 */
export const generateICS = (reminders: Reminder[]): string => {
  if (reminders.length === 0) return '';

  const events = reminders.map(generateEvent);
  return events.join('\r\n');
};

/**
 * Triggers the download of an iCal file
 */
export const downloadICS = (filename: string, content: string): void => {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exports reminders to a calendar file
 */
export const exportToCalendar = (reminders: Reminder[]): void => {
  const icsContent = generateICS(reminders);
  if (!icsContent) return;
  
  const filename = reminders.length === 1 
    ? `reminder-${reminders[0].id}.ics`
    : `reminders-${new Date().toISOString().split('T')[0]}.ics`;
    
  downloadICS(filename, icsContent);
}; 