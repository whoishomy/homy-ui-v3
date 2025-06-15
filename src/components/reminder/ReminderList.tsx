'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Filter,
  MoreVertical,
  Search,
  SortAsc,
  SortDesc,
  Trash2,
  X,
  CheckSquare,
  Square,
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { useReminderStore } from '@/stores/reminderStore';
import { categoryConfig, type ReminderCategory } from '@/types/reminder';
import { BulkActionBar } from './BulkActionBar';

const ReminderList = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategories, setSelectedCategories] = React.useState<ReminderCategory[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const { toast } = useToast();

  const {
    reminders,
    filter,
    sort,
    filteredReminders,
    todayReminders,
    upcomingReminders,
    overdueReminders,
    remindersByCategory,
    setFilter,
    setSort,
    deleteReminder,
    updateReminder,
  } = useReminderStore();

  const stats = {
    total: reminders.length,
    today: todayReminders().length,
    upcoming: upcomingReminders().length,
    overdue: overdueReminders().length,
    byCategory: remindersByCategory(),
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilter({ search: value });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category as ReminderCategory)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category as ReminderCategory];

    setSelectedCategories(newCategories);
    setFilter({ categories: newCategories });
  };

  const handleSort = (field: typeof sort.field) => {
    setSort({
      field,
      direction: sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleDelete = async (id: string) => {
    try {
      deleteReminder(id);
      toast({
        message: 'Hatırlatıcı silindi',
        title: 'Hatırlatıcı silindi',
        description: 'Hatırlatıcı başarıyla silindi.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        message: 'Hata',
        title: 'Hata',
        description: 'Hatırlatıcı silinirken bir hata oluştu.',
        variant: 'error',
      });
    }
  };

  const handleStatusChange = async (id: string, status: 'completed' | 'cancelled') => {
    try {
      updateReminder(id, { status });
      toast({
        message: 'Durum güncellendi',
        title: 'Durum güncellendi',
        description: `Hatırlatıcı ${status === 'completed' ? 'tamamlandı' : 'iptal edildi'}.`,
        variant: 'success',
      });
    } catch (error) {
      toast({
        message: 'Hata',
        title: 'Hata',
        description: 'Durum güncellenirken bir hata oluştu.',
        variant: 'error',
      });
    }
  };

  const handleSelectReminder = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allIds = filteredReminders().map((r) => r.id);
    setSelectedIds((prev) => (prev.length === allIds.length ? [] : allIds));
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Bugün</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.today}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Yaklaşan</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.upcoming}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <X className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium">Gecikmiş</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-destructive">
            {stats.overdue}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Toplam</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.total}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Hatırlatıcı ara..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(categoryConfig).map(([value, config]) => (
            <Button
              key={value}
              variant={selectedCategories.includes(value as ReminderCategory) ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryToggle(value)}
              className="gap-2"
            >
              <span className={config.color}>{config.icon}</span>
              {config.label}
            </Button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Hatırlatıcılar</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="gap-2"
            >
              {selectedIds.length === filteredReminders().length ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              {selectedIds.length > 0 ? 'Seçimi Kaldır' : 'Tümünü Seç'}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('date')}
              className="gap-2"
            >
              Tarih
              {sort.field === 'date' ? (
                sort.direction === 'asc' ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )
              ) : null}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('title')}
              className="gap-2"
            >
              Başlık
              {sort.field === 'title' ? (
                sort.direction === 'asc' ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )
              ) : null}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {filteredReminders().map((reminder) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                'flex items-center justify-between rounded-lg border bg-card p-4',
                reminder.status === 'completed' && 'opacity-60'
              )}
            >
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSelectReminder(reminder.id)}
                  className="h-6 w-6 p-0"
                >
                  {selectedIds.includes(reminder.id) ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </Button>
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full',
                    `${categoryConfig[reminder.category].color?.replace(
                      'text-',
                      'bg-'
                    ) || 'bg-muted'}/10`
                  )}
                >
                  <span className={categoryConfig[reminder.category].color || 'text-muted-foreground'}>
                    {categoryConfig[reminder.category].icon || ''}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">{reminder.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(reminder.date), 'PPP', { locale: tr })} -{' '}
                    {reminder.time}
                  </p>
                </div>
              </div>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[180px] rounded-md border bg-popover p-1 shadow-md"
                    align="end"
                  >
                    {reminder.status === 'active' && (
                      <DropdownMenu.Item
                        className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent"
                        onSelect={() => handleStatusChange(reminder.id, 'completed')}
                      >
                        Tamamlandı olarak işaretle
                      </DropdownMenu.Item>
                    )}
                    {reminder.status === 'active' && (
                      <DropdownMenu.Item
                        className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent"
                        onSelect={() => handleStatusChange(reminder.id, 'cancelled')}
                      >
                        İptal et
                      </DropdownMenu.Item>
                    )}
                    <DropdownMenu.Separator className="my-1 h-px bg-muted" />
                    <DropdownMenu.Item
                      className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-destructive outline-none hover:bg-accent"
                      onSelect={() => handleDelete(reminder.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Sil
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredReminders().length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card/50 py-12">
            <Calendar className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Gösterilecek hatırlatıcı bulunamadı
            </p>
          </div>
        )}
      </div>

      <BulkActionBar
        selectedIds={selectedIds}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
};

export { ReminderList }; 