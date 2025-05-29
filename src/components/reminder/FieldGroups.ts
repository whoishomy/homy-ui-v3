import type { Reminder } from '@/types/reminder';

export interface FieldGroup {
  id: string;
  label: string;
  description: string;
  fields: (keyof Reminder)[];
  icon: 'text' | 'calendar' | 'bell' | 'tag' | 'shield';
}

export const FIELD_GROUPS: FieldGroup[] = [
  {
    id: 'content',
    label: 'Content',
    description: 'The main content and purpose of the reminder',
    fields: ['title', 'description'],
    icon: 'text',
  },
  {
    id: 'timing',
    label: 'Timing',
    description: 'When and how often the reminder occurs',
    fields: ['date', 'time', 'frequency', 'endDate'],
    icon: 'calendar',
  },
  {
    id: 'notification',
    label: 'Notification',
    description: 'How you will be notified',
    fields: ['notificationType', 'status'],
    icon: 'bell',
  },
  {
    id: 'organization',
    label: 'Organization',
    description: 'How the reminder is categorized',
    fields: ['category'],
    icon: 'tag',
  },
  {
    id: 'metadata',
    label: 'System Fields',
    description: 'Protected system information',
    fields: ['id', 'createdAt', 'updatedAt'],
    icon: 'shield',
  },
]; 