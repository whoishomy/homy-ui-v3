'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  CheckSquare,
  Clock,
  Trash2,
  X,
  CalendarClock,
  Download,
  FileJson,
  FileSpreadsheet,
  Upload,
  FileDown,
  FileText
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { useReminderStore } from '@/stores/reminderStore';
import type { Reminder } from '@/types/reminder';
import { exportToCalendar } from '@/utils/exportToCalendar';
import { exportToJSON, exportToCSV } from '@/utils/exportData';
import { downloadTemplate } from '@/utils/templateGenerator';
import { validationLogger } from '@/utils/validationLog';
import { ImportDialog } from './ImportDialog';

interface BulkActionBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export const BulkActionBar = React.forwardRef<HTMLDivElement, BulkActionBarProps>(
  ({ selectedIds, onClearSelection }, ref) => {
    const { toast } = useToast();
    const { reminders, updateReminder, deleteReminder } = useReminderStore();
    const [importDialogOpen, setImportDialogOpen] = React.useState(false);

    const handleBulkComplete = async () => {
      try {
        selectedIds.forEach((id) => {
          updateReminder(id, { status: 'completed' });
        });
        toast({
          message: 'Hatırlatıcılar tamamlandı',
          title: 'Hatırlatıcılar tamamlandı',
          description: `${selectedIds.length} hatırlatıcı tamamlandı olarak işaretlendi.`,
          variant: 'success',
        });
        onClearSelection();
      } catch (error) {
        toast({
          message: 'Hata oluştu',
          title: 'Hata',
          description: 'Hatırlatıcılar güncellenirken bir hata oluştu.',
          variant: 'error',
        });
      }
    };

    const handleBulkDelete = async () => {
      try {
        selectedIds.forEach((id) => {
          deleteReminder(id);
        });
        toast({
          message: 'Hatırlatıcılar silindi',
          title: 'Hatırlatıcılar silindi',
          description: `${selectedIds.length} hatırlatıcı silindi.`,
          variant: 'success',
        });
        onClearSelection();
      } catch (error) {
        toast({
          message: 'Hata oluştu',
          title: 'Hata',
          description: 'Hatırlatıcılar silinirken bir hata oluştu.',
          variant: 'error',
        });
      }
    };

    const handleExportToCalendar = async () => {
      try {
        const selectedReminders = reminders.filter((r: Reminder) => selectedIds.includes(r.id));
        exportToCalendar(selectedReminders);
        toast({
          message: 'Takvim dışa aktarıldı',
          title: 'Takvim Dışa Aktarıldı',
          description: `${selectedIds.length} hatırlatıcı takvim dosyasına aktarıldı.`,
          variant: 'success',
        });
      } catch (error) {
        toast({
          message: 'Hata oluştu',
          title: 'Hata',
          description: 'Takvim dışa aktarılırken bir hata oluştu.',
          variant: 'error',
        });
      }
    };

    const handleExportToJSON = async () => {
      try {
        const selectedReminders = reminders.filter((r: Reminder) => selectedIds.includes(r.id));
        exportToJSON(selectedReminders);
        toast({
          message: 'JSON dışa aktarıldı',
          title: 'JSON Dışa Aktarıldı',
          description: `${selectedIds.length} hatırlatıcı JSON dosyasına aktarıldı.`,
          variant: 'success',
        });
      } catch (error) {
        toast({
          message: 'Hata oluştu',
          title: 'Hata',
          description: 'JSON dışa aktarılırken bir hata oluştu.',
          variant: 'error',
        });
      }
    };

    const handleExportToCSV = async () => {
      try {
        const selectedReminders = reminders.filter((r: Reminder) => selectedIds.includes(r.id));
        exportToCSV(selectedReminders);
        toast({
          message: 'CSV dışa aktarıldı',
          title: 'CSV Dışa Aktarıldı',
          description: `${selectedIds.length} hatırlatıcı CSV dosyasına aktarıldı.`,
          variant: 'success',
        });
      } catch (error) {
        toast({
          message: 'Hata oluştu',
          title: 'Hata',
          description: 'CSV dışa aktarılırken bir hata oluştu.',
          variant: 'error',
        });
      }
    };

    const handleDownloadTemplate = async (format: 'json' | 'csv') => {
      try {
        downloadTemplate(format);
        toast({
          message: 'Şablon indirildi',
          title: 'Şablon İndirildi',
          description: `Hatırlatıcı şablonu ${format.toUpperCase()} formatında indirildi.`,
          variant: 'success',
        });
      } catch (error) {
        toast({
          message: 'Hata oluştu',
          title: 'Hata',
          description: 'Şablon indirilirken bir hata oluştu.',
          variant: 'error',
        });
      }
    };

    const handleExportValidationLog = async (format: 'json' | 'csv') => {
      try {
        const content = validationLogger.exportLog(format);
        const filename = `validation-log-${new Date().toISOString().split('T')[0]}.${format}`;
        const mimeType = format === 'json' ? 'application/json' : 'text/csv;charset=utf-8';
        
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          message: 'Doğrulama günlüğü indirildi',
          title: 'Günlük İndirildi',
          description: `Doğrulama günlüğü ${format.toUpperCase()} formatında indirildi.`,
          variant: 'success',
        });
      } catch (error) {
        toast({
          message: 'Hata oluştu',
          title: 'Hata',
          description: 'Doğrulama günlüğü indirilirken bir hata oluştu.',
          variant: 'error',
        });
      }
    };

    return (
      <>
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform rounded-lg border bg-card p-4 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckSquare className="h-4 w-4" />
                  <span>{selectedIds.length} seçili</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkComplete}
                    className="gap-2"
                  >
                    <CheckSquare className="h-4 w-4" />
                    Tamamlandı
                  </Button>

                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Dışa Aktar
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className="w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                      <DropdownMenu.Label className="px-2 py-1.5 text-sm font-semibold">
                        Dışa Aktar
                      </DropdownMenu.Label>
                      <DropdownMenu.Separator className="my-1 h-px bg-muted" />
                      <DropdownMenu.Item
                        className="flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        onSelect={handleExportToCalendar}
                      >
                        <CalendarClock className="h-4 w-4" />
                        Takvime Aktar
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        className="flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        onSelect={handleExportToJSON}
                      >
                        <FileJson className="h-4 w-4" />
                        JSON Olarak İndir
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        className="flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        onSelect={handleExportToCSV}
                      >
                        <FileSpreadsheet className="h-4 w-4" />
                        CSV Olarak İndir
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="my-1 h-px bg-muted" />
                      <DropdownMenu.Label className="px-2 py-1.5 text-sm font-semibold">
                        Şablonlar
                      </DropdownMenu.Label>
                      <DropdownMenu.Item
                        className="flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        onSelect={() => handleDownloadTemplate('json')}
                      >
                        <FileDown className="h-4 w-4" />
                        JSON Şablonu İndir
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        className="flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        onSelect={() => handleDownloadTemplate('csv')}
                      >
                        <FileDown className="h-4 w-4" />
                        CSV Şablonu İndir
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="my-1 h-px bg-muted" />
                      <DropdownMenu.Label className="px-2 py-1.5 text-sm font-semibold">
                        Doğrulama Günlüğü
                      </DropdownMenu.Label>
                      <DropdownMenu.Item
                        className="flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        onSelect={() => handleExportValidationLog('json')}
                      >
                        <FileText className="h-4 w-4" />
                        JSON Günlüğü İndir
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        className="flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        onSelect={() => handleExportValidationLog('csv')}
                      >
                        <FileText className="h-4 w-4" />
                        CSV Günlüğü İndir
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setImportDialogOpen(true)}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    İçe Aktar
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Sil
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearSelection}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    İptal
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ImportDialog
          open={importDialogOpen}
          onOpenChange={setImportDialogOpen}
        />
      </>
    );
  }
);

BulkActionBar.displayName = 'BulkActionBar'; 