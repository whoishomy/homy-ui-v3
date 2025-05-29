import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/reminder/FileUpload';
import { FieldMergeSelector } from '@/components/reminder/FieldMergeSelector';
import { FieldComparisonView } from '@/components/reminder/FieldComparisonView';
import { useToast } from '@/hooks/useToast';
import { useReminderStore } from '@/stores/reminderStore';
import { parseFile } from '@/utils/importData';
import { processImport, type MergeStrategy } from '@/utils/mergeStrategy';
import type { Reminder } from '@/types/reminder';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MERGEABLE_FIELDS: (keyof Reminder)[] = [
  'title',
  'description',
  'category',
  'date',
  'time',
  'frequency',
  'status',
  'notificationType',
  'endDate',
  'id',
  'createdAt',
  'updatedAt',
];

export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const { toast } = useToast();
  const { reminders, addReminder, updateReminder } = useReminderStore();
  const [selectedFile, setSelectedFile] = React.useState<File | undefined>();
  const [isImporting, setIsImporting] = React.useState(false);
  const [mergeStrategy, setMergeStrategy] = React.useState<MergeStrategy>('skip');
  const [selectedFields, setSelectedFields] = React.useState<(keyof Reminder)[]>([]);
  const [parsedReminders, setParsedReminders] = React.useState<Reminder[]>([]);
  const [selectedReminderIndex, setSelectedReminderIndex] = React.useState<number>(0);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    try {
      const existingIds = reminders.map(r => r.id);
      const parseResult = await parseFile(file, existingIds);

      if (!parseResult.success) {
        toast({
          message: 'Parse Failed',
          title: 'Parse Failed',
          description: parseResult.errors[0],
          variant: 'error',
        });
        return;
      }

      setParsedReminders(parseResult.data);
      setSelectedReminderIndex(0);
    } catch (error) {
      toast({
        message: 'Parse Failed',
        title: 'Parse Failed',
        description: (error as Error).message,
        variant: 'error',
      });
    }
  };

  const handleClearFile = () => {
    setSelectedFile(undefined);
    setParsedReminders([]);
    setSelectedReminderIndex(0);
  };

  const handleStrategyChange = (strategy: MergeStrategy) => {
    setMergeStrategy(strategy);
    // When switching to merge, pre-select all mergeable fields
    if (strategy === 'merge') {
      setSelectedFields(MERGEABLE_FIELDS.filter(f => !['id', 'createdAt', 'updatedAt'].includes(f)));
    } else {
      setSelectedFields([]);
    }
  };

  const currentReminder = parsedReminders[selectedReminderIndex];
  const matchingExistingReminder = currentReminder
    ? reminders.find(r => r.id === currentReminder.id)
    : undefined;

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    try {
      // Process import with merge strategy and selected fields
      const { results, summary } = processImport(parsedReminders, reminders, {
        strategy: mergeStrategy,
        fields: mergeStrategy === 'merge' ? selectedFields : undefined,
      });

      // Apply changes to store
      results.forEach(result => {
        switch (result.action) {
          case 'added':
            addReminder(result.reminder);
            break;
          case 'merged':
          case 'replaced':
            updateReminder(result.reminder.id, result.reminder);
            break;
          // Skip action doesn't require store update
        }
      });

      // Show success message with summary
      const messages = [];
      if (summary.added > 0) messages.push(`${summary.added} added`);
      if (summary.merged > 0) messages.push(`${summary.merged} merged`);
      if (summary.replaced > 0) messages.push(`${summary.replaced} replaced`);
      if (summary.skipped > 0) messages.push(`${summary.skipped} skipped`);

      toast({
        message: 'Import Successful',
        title: 'Import Successful',
        description: `Import completed: ${messages.join(', ')}.`,
        variant: 'success',
      });

      onOpenChange(false);
      handleClearFile();
    } catch (error) {
      toast({
        message: 'Import Failed',
        title: 'Import Failed',
        description: (error as Error).message,
        variant: 'error',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-card p-6 shadow-lg data-[state=closed]:animate-slide-out-to-top-center data-[state=open]:animate-slide-in-from-top-center">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">
              Import Reminders
            </Dialog.Title>
            <Dialog.Close className="rounded-full p-1.5 hover:bg-muted">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="mt-4">
            <FileUpload
              onFileSelect={handleFileSelect}
              onClear={handleClearFile}
              selectedFile={selectedFile}
              accept={{
                'application/json': ['.json'],
                'text/csv': ['.csv'],
              }}
            />
          </div>

          {currentReminder && matchingExistingReminder && (
            <div className="mt-6 border-t pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Preview Changes</h3>
                {parsedReminders.length > 1 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReminderIndex(i => Math.max(0, i - 1))}
                      disabled={selectedReminderIndex === 0}
                    >
                      Previous
                    </Button>
                    <span className="text-muted-foreground">
                      {selectedReminderIndex + 1} of {parsedReminders.length}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReminderIndex(i => Math.min(parsedReminders.length - 1, i + 1))}
                      disabled={selectedReminderIndex === parsedReminders.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <FieldComparisonView
                  existingReminder={matchingExistingReminder}
                  importedReminder={currentReminder}
                  selectedFields={selectedFields}
                />
              </div>
            </div>
          )}

          <div className="mt-6 border-t pt-6">
            <h3 className="text-sm font-medium mb-3">Conflict Resolution</h3>
            <RadioGroup.Root
              value={mergeStrategy}
              onValueChange={(value: MergeStrategy) => handleStrategyChange(value)}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center">
                <RadioGroup.Item
                  value="skip"
                  id="skip"
                  className="h-4 w-4 rounded-full border border-primary data-[state=checked]:bg-primary"
                >
                  <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-full after:bg-white" />
                </RadioGroup.Item>
                <label htmlFor="skip" className="ml-2 text-sm">
                  Skip duplicates (keep existing)
                </label>
              </div>
              <div className="flex items-center">
                <RadioGroup.Item
                  value="replace"
                  id="replace"
                  className="h-4 w-4 rounded-full border border-primary data-[state=checked]:bg-primary"
                >
                  <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-full after:bg-white" />
                </RadioGroup.Item>
                <label htmlFor="replace" className="ml-2 text-sm">
                  Replace existing with imported
                </label>
              </div>
              <div className="flex items-center">
                <RadioGroup.Item
                  value="merge"
                  id="merge"
                  className="h-4 w-4 rounded-full border border-primary data-[state=checked]:bg-primary"
                >
                  <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-full after:bg-white" />
                </RadioGroup.Item>
                <label htmlFor="merge" className="ml-2 text-sm">
                  Merge imported into existing
                </label>
              </div>
            </RadioGroup.Root>
          </div>

          {mergeStrategy === 'merge' && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-sm font-medium mb-3">Field Selection</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select which fields to update with imported data. Unselected fields will keep their existing values.
              </p>
              <FieldMergeSelector
                fields={MERGEABLE_FIELDS}
                selectedFields={selectedFields}
                onFieldsChange={setSelectedFields}
              />
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="outline">Cancel</Button>
            </Dialog.Close>
            <Button
              onClick={handleImport}
              disabled={!selectedFile || isImporting || (mergeStrategy === 'merge' && selectedFields.length === 0)}
            >
              {isImporting ? 'Importing...' : 'Import'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 