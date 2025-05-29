import type { Reminder } from '@/types/reminder';

export type MergeStrategy = 'skip' | 'replace' | 'merge';

export interface MergeResult {
  action: 'added' | 'skipped' | 'merged' | 'replaced';
  reminder: Reminder;
  originalId?: string;
}

export interface MergeOptions {
  strategy: MergeStrategy;
  fields?: (keyof Reminder)[];
}

/**
 * Merges two reminders based on the specified strategy
 */
const mergeReminders = (
  existing: Reminder,
  imported: Reminder,
  fields?: (keyof Reminder)[]
): Reminder => {
  if (!fields || fields.length === 0) {
    // Merge all fields except id, createdAt, and system fields
    const merged = {
      ...existing,
      title: imported.title,
      description: imported.description,
      category: imported.category,
      date: imported.date,
      time: imported.time,
      frequency: imported.frequency,
      status: imported.status,
      notificationType: imported.notificationType,
      endDate: imported.endDate,
      updatedAt: new Date(),
    };
    return merged;
  }

  // Merge only specified fields
  const merged = { ...existing } as Record<keyof Reminder, any>;
  fields.forEach((field) => {
    if (field !== 'id' && field !== 'createdAt') {
      merged[field] = imported[field];
    }
  });
  merged.updatedAt = new Date();

  return merged as Reminder;
};

/**
 * Resolves conflicts between existing and imported reminders
 */
export const resolveConflict = (
  existing: Reminder,
  imported: Reminder,
  options: MergeOptions
): MergeResult => {
  switch (options.strategy) {
    case 'skip':
      return {
        action: 'skipped',
        reminder: existing,
        originalId: imported.id,
      };

    case 'replace':
      return {
        action: 'replaced',
        reminder: {
          ...imported,
          updatedAt: new Date(),
        },
        originalId: existing.id,
      };

    case 'merge':
      return {
        action: 'merged',
        reminder: mergeReminders(existing, imported, options.fields),
        originalId: existing.id,
      };

    default:
      return {
        action: 'skipped',
        reminder: existing,
        originalId: imported.id,
      };
  }
};

/**
 * Processes a list of reminders with conflict resolution
 */
export const processImport = (
  importedReminders: Reminder[],
  existingReminders: Reminder[],
  options: MergeOptions
): {
  results: MergeResult[];
  summary: {
    added: number;
    skipped: number;
    merged: number;
    replaced: number;
  };
} => {
  const results: MergeResult[] = [];
  const existingMap = new Map(existingReminders.map((r) => [r.id, r]));

  const summary = {
    added: 0,
    skipped: 0,
    merged: 0,
    replaced: 0,
  };

  importedReminders.forEach((imported) => {
    const existing = existingMap.get(imported.id);

    if (!existing) {
      // No conflict - add as new
      results.push({
        action: 'added',
        reminder: {
          ...imported,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      summary.added++;
      return;
    }

    // Handle conflict based on strategy
    const result = resolveConflict(existing, imported, options);
    results.push(result);
    summary[result.action]++;
  });

  return { results, summary };
};
