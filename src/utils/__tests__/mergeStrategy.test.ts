import { describe, it, expect, beforeEach  } from '@jest/globals';
import { resolveConflict, processImport, type MergeOptions } from '../mergeStrategy';
import type { Reminder } from '@/types/reminder';

describe('Merge Strategy Utils', () => {
  const baseReminder: Reminder = {
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

  describe('resolveConflict', () => {
    const existing: Reminder = {
      ...baseReminder,
      title: 'Existing Reminder',
      description: 'Existing Description',
    };

    const imported: Reminder = {
      ...baseReminder,
      title: 'Imported Reminder',
      description: 'Imported Description',
    };

    it('should skip conflict when strategy is skip', () => {
      const options: MergeOptions = { strategy: 'skip' };
      const result = resolveConflict(existing, imported, options);

      expect(result.action).toBe('skipped');
      expect(result.reminder).toBe(existing);
      expect(result.originalId).toBe(imported.id);
    });

    it('should replace existing with imported when strategy is replace', () => {
      const options: MergeOptions = { strategy: 'replace' };
      const result = resolveConflict(existing, imported, options);

      expect(result.action).toBe('replaced');
      expect(result.reminder.title).toBe(imported.title);
      expect(result.reminder.description).toBe(imported.description);
      expect(result.originalId).toBe(existing.id);
    });

    it('should merge all fields when strategy is merge without specific fields', () => {
      const options: MergeOptions = { strategy: 'merge' };
      const result = resolveConflict(existing, imported, options);

      expect(result.action).toBe('merged');
      expect(result.reminder.title).toBe(imported.title);
      expect(result.reminder.description).toBe(imported.description);
      expect(result.reminder.id).toBe(existing.id);
      expect(result.reminder.createdAt).toBe(existing.createdAt);
      expect(result.originalId).toBe(existing.id);
    });

    it('should merge only specified fields when fields are provided', () => {
      const options: MergeOptions = {
        strategy: 'merge',
        fields: ['title'],
      };
      const result = resolveConflict(existing, imported, options);

      expect(result.action).toBe('merged');
      expect(result.reminder.title).toBe(imported.title);
      expect(result.reminder.description).toBe(existing.description);
      expect(result.originalId).toBe(existing.id);
    });

    it('should not merge id and createdAt even if specified', () => {
      const options: MergeOptions = {
        strategy: 'merge',
        fields: ['id', 'createdAt', 'title'],
      };
      const result = resolveConflict(existing, imported, options);

      expect(result.reminder.id).toBe(existing.id);
      expect(result.reminder.createdAt).toBe(existing.createdAt);
      expect(result.reminder.title).toBe(imported.title);
    });
  });

  describe('processImport', () => {
    const existingReminders: Reminder[] = [
      {
        ...baseReminder,
        id: 'existing-1',
        title: 'Existing 1',
      },
      {
        ...baseReminder,
        id: 'existing-2',
        title: 'Existing 2',
      },
    ];

    const importedReminders: Reminder[] = [
      {
        ...baseReminder,
        id: 'existing-1',
        title: 'Imported 1',
      },
      {
        ...baseReminder,
        id: 'new-1',
        title: 'New 1',
      },
    ];

    it('should process mixed import with different actions', () => {
      const options: MergeOptions = { strategy: 'merge' };
      const { results, summary } = processImport(
        importedReminders,
        existingReminders,
        options
      );

      expect(results).toHaveLength(2);
      expect(summary).toEqual({
        added: 1,
        skipped: 0,
        merged: 1,
        replaced: 0,
      });

      const merged = results.find(r => r.action === 'merged');
      expect(merged?.reminder.title).toBe('Imported 1');
      expect(merged?.originalId).toBe('existing-1');

      const added = results.find(r => r.action === 'added');
      expect(added?.reminder.title).toBe('New 1');
      expect(added?.originalId).toBeUndefined();
    });

    it('should skip all conflicts when strategy is skip', () => {
      const options: MergeOptions = { strategy: 'skip' };
      const { results, summary } = processImport(
        importedReminders,
        existingReminders,
        options
      );

      expect(summary).toEqual({
        added: 1,
        skipped: 1,
        merged: 0,
        replaced: 0,
      });

      const skipped = results.find(r => r.action === 'skipped');
      expect(skipped?.reminder.title).toBe('Existing 1');
    });

    it('should replace all conflicts when strategy is replace', () => {
      const options: MergeOptions = { strategy: 'replace' };
      const { results, summary } = processImport(
        importedReminders,
        existingReminders,
        options
      );

      expect(summary).toEqual({
        added: 1,
        skipped: 0,
        merged: 0,
        replaced: 1,
      });

      const replaced = results.find(r => r.action === 'replaced');
      expect(replaced?.reminder.title).toBe('Imported 1');
    });

    it('should handle empty import list', () => {
      const options: MergeOptions = { strategy: 'merge' };
      const { results, summary } = processImport(
        [],
        existingReminders,
        options
      );

      expect(results).toHaveLength(0);
      expect(summary).toEqual({
        added: 0,
        skipped: 0,
        merged: 0,
        replaced: 0,
      });
    });

    it('should handle empty existing list', () => {
      const options: MergeOptions = { strategy: 'merge' };
      const { results, summary } = processImport(
        importedReminders,
        [],
        options
      );

      expect(results).toHaveLength(2);
      expect(summary.added).toBe(2);
    });
  });
}); 