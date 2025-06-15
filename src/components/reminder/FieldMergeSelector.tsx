import * as React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Reminder } from '@/types/reminder';

interface FieldMergeSelectorProps {
  fields: (keyof Reminder)[];
  selectedFields: (keyof Reminder)[];
  onFieldsChange: (fields: (keyof Reminder)[]) => void;
  className?: string;
}

const FIELD_LABELS: Record<keyof Reminder, string> = {
  title: 'Title',
  description: 'Description',
  category: 'Category',
  date: 'Date',
  time: 'Time',
  frequency: 'Frequency',
  status: 'Status',
  notificationType: 'Notification Type',
  endDate: 'End Date',
  id: 'ID',
  createdAt: 'Created At',
  updatedAt: 'Updated At',
};

const PROTECTED_FIELDS: (keyof Reminder)[] = ['id', 'createdAt', 'updatedAt'];

export function FieldMergeSelector({
  fields,
  selectedFields,
  onFieldsChange,
  className,
}: FieldMergeSelectorProps) {
  const handleFieldToggle = (field: keyof Reminder) => {
    if (PROTECTED_FIELDS.includes(field)) return;

    const newFields = selectedFields.includes(field)
      ? selectedFields.filter((f) => f !== field)
      : [...selectedFields, field];

    onFieldsChange(newFields);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Field</span>
        <div className="flex gap-8">
          <span className="font-medium">Keep Existing</span>
          <span className="font-medium">Use Imported</span>
        </div>
      </div>

      <div className="space-y-2">
        {fields.map((field) => (
          <div
            key={field}
            className={cn(
              'flex items-center justify-between rounded-lg border p-3',
              PROTECTED_FIELDS.includes(field) && 'opacity-50'
            )}
          >
            <span className="text-sm">{FIELD_LABELS[field]}</span>

            <RadioGroup.Root
              value={selectedFields.includes(field) ? 'imported' : 'existing'}
              onValueChange={(value) => {
                handleFieldToggle(field);
              }}
              disabled={PROTECTED_FIELDS.includes(field)}
              className="flex gap-8"
              aria-label={`${FIELD_LABELS[field]} field selection`}
            >
              <div className="flex items-center">
                <RadioGroup.Item
                  value="existing"
                  id={`${field}-existing`}
                  className={cn(
                    'h-4 w-4 rounded-full border border-primary',
                    'focus:outline-none focus:ring-2 focus:ring-primary/20',
                    'data-[state=checked]:border-[5px]'
                  )}
                  aria-label={`Keep existing ${FIELD_LABELS[field].toLowerCase()}`}
                />
              </div>

              <div className="flex items-center">
                <RadioGroup.Item
                  value="imported"
                  id={`${field}-imported`}
                  className={cn(
                    'h-4 w-4 rounded-full border border-primary',
                    'focus:outline-none focus:ring-2 focus:ring-primary/20',
                    'data-[state=checked]:border-[5px]'
                  )}
                  aria-label={`Use imported ${FIELD_LABELS[field].toLowerCase()}`}
                />
              </div>
            </RadioGroup.Root>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Circle className="h-2 w-2 fill-current" />
        <span>Protected fields cannot be modified during import</span>
      </div>
    </div>
  );
}
