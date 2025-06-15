import { describe, it, expect, jest, beforeEach  } from '@jest/globals';
import { generateJSON, generateCSV, downloadFile, exportToJSON, exportToCSV } from '../exportData';
import type { Reminder } from '@/types/reminder';

describe('Export Data Utils', () => {
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
    updatedAt: new Date('2024-03-24')
  };

  describe('generateJSON', () => {
    it('should generate valid JSON string', () => {
      const json = generateJSON([mockReminder]);
      const parsed = JSON.parse(json);
      
      expect(parsed).toHaveLength(1);
      expect(parsed[0]).toMatchObject({
        id: 'test-1',
        title: 'Test Reminder',
        description: 'Test Description',
        category: 'health',
        time: '10:00',
        frequency: 'once',
        status: 'active',
        notificationType: 'toast'
      });
      
      // Check date formats
      expect(parsed[0].date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(parsed[0].createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(parsed[0].updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should handle empty array', () => {
      const json = generateJSON([]);
      expect(json).toBe('[]');
    });
  });

  describe('generateCSV', () => {
    it('should generate valid CSV string with headers', () => {
      const csv = generateCSV([mockReminder]);
      const lines = csv.split('\n');
      
      // Check headers
      expect(lines[0]).toContain('ID,Title,Description,Category,Date');
      
      // Check data
      expect(lines[1]).toContain('test-1,"Test Reminder","Test Description",health');
      expect(lines[1]).toContain('10:00,once,active,toast');
    });

    it('should handle empty array', () => {
      const csv = generateCSV([]);
      const lines = csv.split('\n');
      
      // Should only contain headers
      expect(lines).toHaveLength(1);
      expect(lines[0]).toContain('ID,Title,Description');
    });

    it('should properly escape quotes in text fields', () => {
      const reminderWithQuotes: Reminder = {
        ...mockReminder,
        title: 'Test "Quoted" Title',
        description: 'Description with "quotes"'
      };
      
      const csv = generateCSV([reminderWithQuotes]);
      const lines = csv.split('\n');
      
      expect(lines[1]).toContain('"Test ""Quoted"" Title"');
      expect(lines[1]).toContain('"Description with ""quotes"""');
    });
  });

  describe('downloadFile', () => {
    let createObjectURLSpy: any;
    let revokeObjectURLSpy: any;
    let appendChildSpy: any;
    let removeChildSpy: any;
    let clickSpy: any;

    beforeEach(() => {
      createObjectURLSpy = jest.spyOn(window.URL, 'createObjectURL');
      revokeObjectURLSpy = jest.spyOn(window.URL, 'revokeObjectURL');
      appendChildSpy = jest.spyOn(document.body, 'appendChild');
      removeChildSpy = jest.spyOn(document.body, 'removeChild');
      clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click');
      
      createObjectURLSpy.mockReturnValue('blob:test-url');
    });

    it('should create and trigger download link', () => {
      downloadFile('test content', 'test.json', 'application/json');
      
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
    });

    it('should set correct file type', () => {
      downloadFile('test content', 'test.json', 'application/json');
      
      const blob = createObjectURLSpy.mock.calls[0][0];
      expect(blob.type).toBe('application/json');
    });
  });

  describe('exportToJSON', () => {
    it('should not proceed with empty array', () => {
      const createObjectURLSpy = jest.spyOn(window.URL, 'createObjectURL');
      exportToJSON([]);
      expect(createObjectURLSpy).not.toHaveBeenCalled();
    });

    it('should generate correct filename for single reminder', () => {
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      exportToJSON([mockReminder]);
      
      const link = appendChildSpy.mock.calls[0][0] as HTMLAnchorElement;
      expect(link.getAttribute('download')).toBe(`reminder-${mockReminder.id}.json`);
    });

    it('should generate correct filename for multiple reminders', () => {
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      const today = new Date().toISOString().split('T')[0];
      
      exportToJSON([mockReminder, { ...mockReminder, id: 'test-2' }]);
      
      const link = appendChildSpy.mock.calls[0][0] as HTMLAnchorElement;
      expect(link.getAttribute('download')).toBe(`reminders-${today}.json`);
    });
  });

  describe('exportToCSV', () => {
    it('should not proceed with empty array', () => {
      const createObjectURLSpy = jest.spyOn(window.URL, 'createObjectURL');
      exportToCSV([]);
      expect(createObjectURLSpy).not.toHaveBeenCalled();
    });

    it('should generate correct filename for single reminder', () => {
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      exportToCSV([mockReminder]);
      
      const link = appendChildSpy.mock.calls[0][0] as HTMLAnchorElement;
      expect(link.getAttribute('download')).toBe(`reminder-${mockReminder.id}.csv`);
    });

    it('should generate correct filename for multiple reminders', () => {
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      const today = new Date().toISOString().split('T')[0];
      
      exportToCSV([mockReminder, { ...mockReminder, id: 'test-2' }]);
      
      const link = appendChildSpy.mock.calls[0][0] as HTMLAnchorElement;
      expect(link.getAttribute('download')).toBe(`reminders-${today}.csv`);
    });
  });
}); 