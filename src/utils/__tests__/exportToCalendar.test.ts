import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateICS, downloadICS, exportToCalendar } from '../exportToCalendar';
import type { Reminder } from '@/types/reminder';

describe('Calendar Export Utils', () => {
  const mockReminder: Reminder = {
    id: 'test-1',
    title: 'Test Reminder',
    description: 'Test Description',
    category: 'health',
    date: new Date('2024-03-25'),
    time: '10:00',
    frequency: 'once',
    status: 'active',
    notificationType: 'toast',
    createdAt: new Date('2024-03-24'),
    updatedAt: new Date('2024-03-24'),
  };

  describe('generateICS', () => {
    it('should generate valid iCal content for a single reminder', () => {
      const icsContent = generateICS([mockReminder]);
      
      expect(icsContent).toContain('BEGIN:VCALENDAR');
      expect(icsContent).toContain('VERSION:2.0');
      expect(icsContent).toContain(`SUMMARY:${mockReminder.title}`);
      expect(icsContent).toContain(`DESCRIPTION:${mockReminder.description}`);
      expect(icsContent).toContain('DTSTART:20240325T100000Z');
      expect(icsContent).toContain('END:VCALENDAR');
    });

    it('should generate valid iCal content for multiple reminders', () => {
      const secondReminder: Reminder = {
        ...mockReminder,
        id: 'test-2',
        title: 'Second Reminder',
        time: '14:00',
      };

      const icsContent = generateICS([mockReminder, secondReminder]);
      
      expect(icsContent).toContain('SUMMARY:Test Reminder');
      expect(icsContent).toContain('SUMMARY:Second Reminder');
      expect(icsContent).toContain('DTSTART:20240325T100000Z');
      expect(icsContent).toContain('DTSTART:20240325T140000Z');
    });

    it('should return empty string for empty reminders array', () => {
      const icsContent = generateICS([]);
      expect(icsContent).toBe('');
    });
  });

  describe('downloadICS', () => {
    let createObjectURLSpy: any;
    let revokeObjectURLSpy: any;

    beforeEach(() => {
      createObjectURLSpy = vi.spyOn(window.URL, 'createObjectURL');
      revokeObjectURLSpy = vi.spyOn(window.URL, 'revokeObjectURL');
      createObjectURLSpy.mockReturnValue('blob:test-url');
    });

    it('should create and trigger download link', () => {
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');
      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click');

      downloadICS('test.ics', 'test content');

      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
    });
  });

  describe('exportToCalendar', () => {
    it('should generate filename with reminder id for single reminder', () => {
      const downloadSpy = vi.spyOn(window.URL, 'createObjectURL');
      
      exportToCalendar([mockReminder]);
      
      expect(downloadSpy).toHaveBeenCalled();
      const link = document.querySelector('a');
      expect(link?.getAttribute('download')).toContain('reminder-test-1.ics');
    });

    it('should generate filename with date for multiple reminders', () => {
      const downloadSpy = vi.spyOn(window.URL, 'createObjectURL');
      const today = new Date().toISOString().split('T')[0];
      
      exportToCalendar([mockReminder, { ...mockReminder, id: 'test-2' }]);
      
      expect(downloadSpy).toHaveBeenCalled();
      const link = document.querySelector('a');
      expect(link?.getAttribute('download')).toBe(`reminders-${today}.ics`);
    });

    it('should not proceed if reminders array is empty', () => {
      const downloadSpy = vi.spyOn(window.URL, 'createObjectURL');
      
      exportToCalendar([]);
      
      expect(downloadSpy).not.toHaveBeenCalled();
    });
  });
}); 