import { parse as parseCSVString } from 'papaparse';
import { z } from 'zod';
import { reminderSchema, type Reminder } from '@/types/reminder';

export interface ImportResult {
  success: boolean;
  data: Reminder[];
  errors: string[];
  duplicates: string[];
}

/**
 * Validates a single reminder using Zod schema
 */
const validateReminder = (data: Record<string, unknown>): z.SafeParseReturnType<unknown, Reminder> => {
  // Convert date strings to Date objects
  const parsedData = {
    ...data,
    date: data.date ? new Date(data.date as string) : undefined,
    createdAt: data.createdAt ? new Date(data.createdAt as string) : new Date(),
    updatedAt: data.updatedAt ? new Date(data.updatedAt as string) : new Date(),
    endDate: data.endDate ? new Date(data.endDate as string) : undefined,
  };
  
  return reminderSchema.safeParse(parsedData);
};

/**
 * Parses and validates JSON data
 */
export const parseJSON = (jsonString: string, existingIds: string[] = []): ImportResult => {
  try {
    const result: ImportResult = {
      success: false,
      data: [],
      errors: [],
      duplicates: [],
    };

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      result.errors.push('Invalid JSON format');
      return result;
    }

    if (!Array.isArray(parsed)) {
      result.errors.push('JSON data must be an array of reminders');
      return result;
    }

    parsed.forEach((item, index) => {
      if (typeof item !== 'object' || item === null) {
        result.errors.push(`Invalid reminder at index ${index}: must be an object`);
        return;
      }

      const validation = validateReminder(item as Record<string, unknown>);
      
      if (!validation.success) {
        result.errors.push(
          `Invalid reminder at index ${index}: ${validation.error.errors.map(e => e.message).join(', ')}`
        );
        return;
      }

      const reminder = validation.data;
      if (existingIds.includes(reminder.id)) {
        result.duplicates.push(reminder.id);
        return;
      }

      result.data.push(reminder);
    });

    result.success = result.errors.length === 0;
    return result;
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [(error as Error).message],
      duplicates: [],
    };
  }
};

/**
 * Parses and validates CSV data
 */
export const parseCSV = (csvString: string, existingIds: string[] = []): ImportResult => {
  try {
    const result: ImportResult = {
      success: false,
      data: [],
      errors: [],
      duplicates: [],
    };

    const parsed = parseCSVString(csvString, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Convert CSV headers to camelCase
        return header
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
      },
    });

    if (parsed.errors.length > 0) {
      result.errors = parsed.errors.map(error => 
        `CSV parsing error at row ${error.row}: ${error.message}`
      );
      return result;
    }

    parsed.data.forEach((row, index) => {
      const validation = validateReminder(row as Record<string, unknown>);
      
      if (!validation.success) {
        result.errors.push(
          `Invalid reminder at row ${index + 1}: ${validation.error.errors.map(e => e.message).join(', ')}`
        );
        return;
      }

      const reminder = validation.data;
      if (existingIds.includes(reminder.id)) {
        result.duplicates.push(reminder.id);
        return;
      }

      result.data.push(reminder);
    });

    result.success = result.errors.length === 0;
    return result;
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [(error as Error).message],
      duplicates: [],
    };
  }
};

/**
 * Determines file type and parses accordingly
 */
export const parseFile = async (file: File, existingIds: string[] = []): Promise<ImportResult> => {
  try {
    const content = await file.text();
    
    switch (file.type) {
      case 'application/json':
        return parseJSON(content, existingIds);
      case 'text/csv':
        return parseCSV(content, existingIds);
      default:
        return {
          success: false,
          data: [],
          errors: ['Unsupported file type. Please use JSON or CSV files.'],
          duplicates: [],
        };
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [`Failed to read file: ${(error as Error).message}`],
      duplicates: [],
    };
  }
}; 