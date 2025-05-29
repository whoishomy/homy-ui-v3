import type { Reminder } from '@/types/reminder';
import { FIELD_GROUPS } from './FieldGroups';

export interface ValidationRule {
  field: keyof Reminder;
  validate: (value: any, reminder: Reminder) => boolean;
  message: string;
  group: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    field: keyof Reminder;
    message: string;
    group: string;
    severity: 'error' | 'warning';
  }>;
}

const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

const isValidTime = (time: string): boolean => {
  return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
};

export const VALIDATION_RULES: ValidationRule[] = [
  // Content Group
  {
    field: 'title',
    validate: (value) => typeof value === 'string' && value.length >= 3 && value.length <= 100,
    message: 'Title must be between 3 and 100 characters',
    group: 'content',
    severity: 'error',
  },
  {
    field: 'description',
    validate: (value) => !value || (typeof value === 'string' && value.length <= 500),
    message: 'Description must not exceed 500 characters',
    group: 'content',
    severity: 'error',
  },

  // Timing Group
  {
    field: 'date',
    validate: (value) => isValidDate(value) && new Date(value) >= new Date(new Date().setHours(0, 0, 0, 0)),
    message: 'Date must be today or in the future',
    group: 'timing',
    severity: 'error',
  },
  {
    field: 'time',
    validate: (value) => isValidTime(value),
    message: 'Time must be in HH:MM format',
    group: 'timing',
    severity: 'error',
  },
  {
    field: 'frequency',
    validate: (value) => ['once', 'daily', 'weekly', 'monthly'].includes(value),
    message: 'Invalid frequency value',
    group: 'timing',
    severity: 'error',
  },
  {
    field: 'endDate',
    validate: (value, reminder) => {
      if (!value) return true;
      if (!isValidDate(value)) return false;
      return reminder.frequency !== 'once' && new Date(value) >= new Date(reminder.date);
    },
    message: 'End date must be after start date and only for recurring reminders',
    group: 'timing',
    severity: 'error',
  },

  // Notification Group
  {
    field: 'notificationType',
    validate: (value) => ['toast', 'email', 'push'].includes(value),
    message: 'Invalid notification type',
    group: 'notification',
    severity: 'error',
  },
  {
    field: 'status',
    validate: (value) => ['active', 'completed', 'cancelled'].includes(value),
    message: 'Invalid status value',
    group: 'notification',
    severity: 'error',
  },

  // Organization Group
  {
    field: 'category',
    validate: (value) => ['health', 'medication', 'exercise', 'general'].includes(value),
    message: 'Invalid category',
    group: 'organization',
    severity: 'error',
  },

  // Business Logic Validations
  {
    field: 'date',
    validate: (value, reminder) => {
      if (reminder.frequency === 'once') return true;
      const date = new Date(value);
      const today = new Date();
      return date <= new Date(today.setMonth(today.getMonth() + 3));
    },
    message: 'Recurring reminders should not start more than 3 months in advance',
    group: 'timing',
    severity: 'warning',
  },
  {
    field: 'endDate',
    validate: (value, reminder) => {
      if (!value || reminder.frequency === 'once') return true;
      const endDate = new Date(value);
      const startDate = new Date(reminder.date);
      const threeMonths = new Date(startDate);
      threeMonths.setMonth(threeMonths.getMonth() + 3);
      return endDate <= threeMonths;
    },
    message: 'Consider shorter recurring periods for better adherence',
    group: 'timing',
    severity: 'warning',
  },
];

export function validateReminder(reminder: Reminder): ValidationResult {
  const errors = VALIDATION_RULES
    .map(rule => {
      const isValid = rule.validate(reminder[rule.field], reminder);
      if (!isValid) {
        return {
          field: rule.field,
          message: rule.message,
          group: rule.group,
          severity: rule.severity,
        };
      }
      return null;
    })
    .filter((error): error is NonNullable<typeof error> => error !== null);

  return {
    isValid: errors.filter(error => error.severity === 'error').length === 0,
    errors,
  };
}

export function getFieldValidationMessage(
  field: keyof Reminder,
  value: any,
  reminder: Reminder
): string | null {
  const rules = VALIDATION_RULES.filter(rule => rule.field === field);
  for (const rule of rules) {
    if (!rule.validate(value, reminder)) {
      return rule.message;
    }
  }
  return null;
} 