import { format } from 'date-fns';
import type { Reminder } from '@/types/reminder';
import { FIELD_GROUPS } from '@/components/reminder/FieldGroups';
import { VALIDATION_RULES } from '@/components/reminder/ValidationRules';
import { downloadFile } from './exportData';
import { validationLogger } from '@/utils/validationLogger';

interface TemplateField {
  name: keyof Reminder;
  description: string;
  required: boolean;
  example: string;
  validationRules: string[];
  group: string;
}

const getTemplateFields = (): TemplateField[] => {
  const fields: TemplateField[] = [];
  
  FIELD_GROUPS.forEach(group => {
    group.fields.forEach(fieldName => {
      // Skip protected fields
      if (['id', 'createdAt', 'updatedAt'].includes(fieldName)) return;
      
      const fieldRules = VALIDATION_RULES
        .filter(rule => rule.field === fieldName)
        .map(rule => rule.message);
      
      const field: TemplateField = {
        name: fieldName,
        description: group.description,
        required: fieldRules.some(rule => rule.includes('must')),
        example: getExampleValue(fieldName),
        validationRules: fieldRules,
        group: group.id
      };
      
      fields.push(field);
    });
  });
  
  return fields;
};

const getExampleValue = (field: keyof Reminder): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const examples: Partial<Record<keyof Reminder, string>> = {
    title: 'Take blood pressure medication',
    description: 'Take 1 tablet with water after breakfast',
    category: 'medication',
    date: format(tomorrow, 'yyyy-MM-dd'),
    time: '09:00',
    frequency: 'daily',
    status: 'active',
    notificationType: 'toast',
    endDate: format(new Date(tomorrow.getTime() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  };
  
  return examples[field] || '';
};

export const generateTemplateJSON = (): string => {
  const fields = getTemplateFields();
  const template = {
    fields,
    example: fields.reduce((acc, field) => {
      acc[field.name] = field.example;
      return acc;
    }, {} as Record<string, string>)
  };
  
  return JSON.stringify(template, null, 2);
};

export const generateTemplateCSV = (): string => {
  const fields = getTemplateFields();
  
  // Headers
  const headers = ['Field', 'Group', 'Description', 'Required', 'Example', 'Validation Rules'];
  
  // Data rows
  const rows = fields.map(field => [
    field.name,
    field.group,
    field.description,
    field.required ? 'Yes' : 'No',
    field.example,
    field.validationRules.join('; ')
  ]);
  
  // Combine headers and rows
  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
};

export const downloadTemplate = (format: 'json' | 'csv'): void => {
  try {
    const content = format === 'json' ? generateTemplateJSON() : generateTemplateCSV();
    const filename = `reminder-template.${format}`;
    const mimeType = format === 'json' ? 'application/json' : 'text/csv;charset=utf-8';
    
    downloadFile(content, filename, mimeType);
    validationLogger.logTemplate(format);
  } catch (error) {
    validationLogger.logTemplate(format, error as Error);
    throw error;
  }
}; 