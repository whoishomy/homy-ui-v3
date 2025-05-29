import * as React from 'react';
import { ArrowRight, Check, X, Minus, FileText, Calendar, Bell, Tag, Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Reminder } from '@/types/reminder';
import { FIELD_GROUPS, type FieldGroup } from './FieldGroups';
import { getFieldValidationMessage, validateReminder } from './ValidationRules';

interface FieldComparisonViewProps {
  existingReminder: Reminder;
  importedReminder: Reminder;
  selectedFields: (keyof Reminder)[];
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

const GROUP_ICONS = {
  text: FileText,
  calendar: Calendar,
  bell: Bell,
  tag: Tag,
  shield: Shield,
} as const;

const formatValue = (field: keyof Reminder, value: any): string => {
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  return String(value ?? '—');
};

const FieldRow = ({
  field,
  existingValue,
  importedValue,
  isSelected,
  isProtected,
  reminder,
}: {
  field: keyof Reminder;
  existingValue: any;
  importedValue: any;
  isSelected: boolean;
  isProtected: boolean;
  reminder: Reminder;
}) => {
  const hasChanged = formatValue(field, existingValue) !== formatValue(field, importedValue);
  const willChange = hasChanged && isSelected && !isProtected;
  const validationMessage = willChange ? getFieldValidationMessage(field, importedValue, reminder) : null;
  const isError = validationMessage && !validationMessage.includes('Consider');

  return (
    <div
      className={cn(
        'grid grid-cols-[1fr,auto,1fr] items-center gap-4 rounded-lg border p-3',
        isProtected && 'opacity-50 bg-muted/10',
        willChange && !isError && 'border-primary/50 bg-primary/5',
        willChange && isError && 'border-destructive/50 bg-destructive/5'
      )}
    >
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Existing</p>
        <p className="text-sm">{formatValue(field, existingValue)}</p>
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="text-xs font-medium">{FIELD_LABELS[field]}</p>
        <div className="rounded-full p-1">
          {isProtected ? (
            <Minus className="h-4 w-4 text-muted-foreground" />
          ) : willChange ? (
            isError ? (
              <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
            ) : (
              <ArrowRight className="h-4 w-4 text-primary animate-pulse" />
            )
          ) : hasChanged ? (
            <X className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Check className="h-4 w-4 text-success" />
          )}
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Imported</p>
        <p
          className={cn(
            'text-sm',
            willChange && !isError && 'text-primary font-medium',
            willChange && isError && 'text-destructive font-medium'
          )}
        >
          {formatValue(field, importedValue)}
        </p>
        {validationMessage && (
          <p className={cn(
            'text-xs mt-1',
            isError ? 'text-destructive' : 'text-muted-foreground'
          )}>
            {validationMessage}
          </p>
        )}
      </div>
    </div>
  );
};

const FieldGroup = ({
  group,
  existingReminder,
  importedReminder,
  selectedFields,
  hasChanges,
}: {
  group: FieldGroup;
  existingReminder: Reminder;
  importedReminder: Reminder;
  selectedFields: (keyof Reminder)[];
  hasChanges: boolean;
}) => {
  const Icon = GROUP_ICONS[group.icon];
  const fieldsWithChanges = group.fields.filter(
    field => formatValue(field, existingReminder[field]) !== formatValue(field, importedReminder[field])
  );
  const hasSelectedChanges = fieldsWithChanges.some(field => selectedFields.includes(field));
  
  // Check for validation errors in this group
  const validationResult = validateReminder(importedReminder);
  const groupErrors = validationResult.errors.filter(error => error.group === group.id);
  const hasErrors = groupErrors.some(error => 
    error.severity === 'error' && 
    selectedFields.includes(error.field) && 
    formatValue(error.field, existingReminder[error.field]) !== formatValue(error.field, importedReminder[error.field])
  );

  if (!hasChanges && group.id !== 'metadata') {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={cn(
          'rounded-lg p-2',
          hasSelectedChanges && !hasErrors && 'bg-primary/5 text-primary',
          hasSelectedChanges && hasErrors && 'bg-destructive/5 text-destructive',
          !hasChanges && 'text-muted-foreground'
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-sm font-medium">{group.label}</h4>
          <p className="text-xs text-muted-foreground">{group.description}</p>
        </div>
      </div>
      <div className="space-y-2 pl-8">
        {group.fields.map(field => (
          <FieldRow
            key={field}
            field={field}
            existingValue={existingReminder[field]}
            importedValue={importedReminder[field]}
            isSelected={selectedFields.includes(field)}
            isProtected={PROTECTED_FIELDS.includes(field)}
            reminder={importedReminder}
          />
        ))}
      </div>
    </div>
  );
};

export function FieldComparisonView({
  existingReminder,
  importedReminder,
  selectedFields,
  className,
}: FieldComparisonViewProps) {
  const changedFields = Object.keys(FIELD_LABELS).filter(
    field => formatValue(field as keyof Reminder, existingReminder[field as keyof Reminder]) !== 
            formatValue(field as keyof Reminder, importedReminder[field as keyof Reminder])
  ) as (keyof Reminder)[];

  const validationResult = validateReminder(importedReminder);
  const hasErrors = validationResult.errors.some(error => 
    error.severity === 'error' && 
    selectedFields.includes(error.field) && 
    changedFields.includes(error.field)
  );

  return (
    <div className={cn('space-y-6', className)}>
      {FIELD_GROUPS.map(group => (
        <FieldGroup
          key={group.id}
          group={group}
          existingReminder={existingReminder}
          importedReminder={importedReminder}
          selectedFields={selectedFields}
          hasChanges={group.fields.some(field => changedFields.includes(field))}
        />
      ))}

      <div className="flex items-start gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-primary" />
          <span>Will be updated</span>
        </div>
        <div className="flex items-center gap-2">
          <X className="h-4 w-4" />
          <span>Will keep existing</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-success" />
          <span>No change needed</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <span>Validation error</span>
        </div>
      </div>
    </div>
  );
} 