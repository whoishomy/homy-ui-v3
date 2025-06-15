import { describe, it, expect  } from '@jest/globals';
import { parseJSON, parseCSV, parseFile } from '../importData';
import type { Reminder } from '@/types/reminder';

describe('Import Data Utils', () => {
  const validReminder: Reminder = {
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

  describe('parseJSON', () => {
    it('should parse valid JSON data', () => {
      const json = JSON.stringify([validReminder]);
      const result = parseJSON(json);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({
        id: 'test-1',
        title: 'Test Reminder'
      });
    });

    it('should handle invalid JSON format', () => {
      const result = parseJSON('invalid json');
      
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Invalid JSON format');
    });

    it('should validate reminder schema', () => {
      const invalidReminder = { ...validReminder, status: 'invalid' };
      const json = JSON.stringify([invalidReminder]);
      const result = parseJSON(json);
      
      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('Invalid reminder at index 0');
    });

    it('should detect duplicate IDs', () => {
      const json = JSON.stringify([validReminder]);
      const result = parseJSON(json, [validReminder.id]);
      
      expect(result.success).toBe(true);
      expect(result.duplicates).toContain(validReminder.id);
      expect(result.data).toHaveLength(0);
    });
  });

  describe('parseCSV', () => {
    const validCSV = `ID,Title,Description,Category,Date,Time,Frequency,Status,NotificationType,CreatedAt,UpdatedAt
test-1,"Test Reminder","Test Description",health,2024-03-25,10:00,once,active,toast,2024-03-24,2024-03-24`;

    it('should parse valid CSV data', () => {
      const result = parseCSV(validCSV);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({
        id: 'test-1',
        title: 'Test Reminder'
      });
    });

    it('should handle invalid CSV format', () => {
      const invalidCSV = 'invalid,csv,format';
      const result = parseCSV(invalidCSV);
      
      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('CSV parsing error');
    });

    it('should validate reminder schema', () => {
      const invalidCSV = validCSV.replace('active', 'invalid');
      const result = parseCSV(invalidCSV);
      
      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('Invalid reminder at row 1');
    });

    it('should detect duplicate IDs', () => {
      const result = parseCSV(validCSV, [validReminder.id]);
      
      expect(result.success).toBe(true);
      expect(result.duplicates).toContain(validReminder.id);
      expect(result.data).toHaveLength(0);
    });
  });

  describe('parseFile', () => {
    it('should parse JSON file', async () => {
      const file = new File(
        [JSON.stringify([validReminder])],
        'test.json',
        { type: 'application/json' }
      );
      
      const result = await parseFile(file);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
    });

    it('should parse CSV file', async () => {
      const csvContent = `ID,Title,Description,Category,Date,Time,Frequency,Status,NotificationType,CreatedAt,UpdatedAt
test-1,"Test Reminder","Test Description",health,2024-03-25,10:00,once,active,toast,2024-03-24,2024-03-24`;
      
      const file = new File(
        [csvContent],
        'test.csv',
        { type: 'text/csv' }
      );
      
      const result = await parseFile(file);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
    });

    it('should reject unsupported file types', async () => {
      const file = new File(
        ['test'],
        'test.txt',
        { type: 'text/plain' }
      );
      
      const result = await parseFile(file);
      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('Unsupported file type');
    });

    it('should handle file read errors', async () => {
      const file = new File(
        [''],
        'test.json',
        { type: 'application/json' }
      );
      
      // Mock file.text() to throw an error
      file.text = () => Promise.reject(new Error('Failed to read file'));
      
      const result = await parseFile(file);
      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('Failed to read file');
    });
  });
}); 