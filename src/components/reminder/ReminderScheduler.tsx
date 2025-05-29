'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import * as Popover from '@radix-ui/react-popover';
import * as Switch from '@radix-ui/react-switch';
import { Bell, Calendar as CalendarIcon, Clock, X } from 'lucide-react';
import type { z } from 'zod';

import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/hooks/useToast';
import { useReminderStore } from '@/stores/reminderStore';
import {
  reminderFormSchema,
  type ReminderCategory,
  categoryConfig,
  frequencyConfig,
} from '@/types/reminder';

interface ReminderSchedulerProps {
  onSuccess?: () => void;
  defaultValues?: Partial<z.infer<typeof reminderFormSchema>>;
  className?: string;
}

type ReminderFormValues = z.infer<typeof reminderFormSchema>;

export const ReminderScheduler = React.forwardRef<HTMLFormElement, ReminderSchedulerProps>(
  ({ onSuccess, defaultValues, className }, ref) => {
    const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
    const { toast } = useToast();
    const addReminder = useReminderStore((state) => state.addReminder);

    // @ts-ignore: Zod + RHF type inference uyumsuzluğu (geçici çözüm)
    const form = useForm<ReminderFormValues>({
      defaultValues: {
        title: '',
        category: 'general',
        frequency: 'once',
        notificationType: 'toast',
        status: 'active',
        date: new Date(),
        time: format(new Date(), 'HH:mm'),
        ...defaultValues,
      },
      // @ts-ignore: Zod resolver type inference uyumsuzluğu (geçici çözüm)
      resolver: zodResolver(reminderFormSchema),
    });

    const {
      register,
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
      watch,
      setValue,
    } = form;

    const selectedDate = watch('date');
    const selectedFrequency = watch('frequency');

    const handleFormSubmit = async (data: ReminderFormValues) => {
      try {
        const reminder = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        addReminder(reminder);
        toast({
          message: 'Hatırlatıcı oluşturuldu',
          title: 'Hatırlatıcı oluşturuldu',
          description: 'Hatırlatıcınız başarıyla kaydedildi.',
          variant: 'success',
        });
        onSuccess?.();
      } catch (error) {
        toast({
          message: 'Hata',
          title: 'Hata',
          description: 'Hatırlatıcı oluşturulurken bir hata oluştu.',
          variant: 'error',
        });
      }
    };

    return (
      <form
        ref={ref}
        // @ts-ignore: Form handler type inference uyumsuzluğu (geçici çözüm)
        onSubmit={handleSubmit(handleFormSubmit)}
        className={cn('space-y-6', className)}
      >
        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Başlık</Label>
            <Input
              id="title"
              placeholder="Hatırlatıcı başlığı"
              error={errors.title?.message}
              {...register('title')}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              placeholder="Hatırlatıcı detayları (opsiyonel)"
              error={errors.description?.message}
              {...register('description')}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category-select">Kategori</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="category-select" error={errors.category?.message}>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <span className={categoryConfig[field.value as ReminderCategory].color}>
                          {categoryConfig[field.value as ReminderCategory].icon}
                        </span>
                        {categoryConfig[field.value as ReminderCategory].label}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryConfig).map(([value, config]) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <span className={config.color}>{config.icon}</span>
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Date & Time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date-picker">Tarih</Label>
              <Popover.Root open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <Popover.Trigger asChild>
                  <Button
                    id="date-picker"
                    type="button"
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !selectedDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, 'PPP', { locale: tr })
                    ) : (
                      <span>Tarih seçin</span>
                    )}
                  </Button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    className="z-50 rounded-md border bg-popover p-3 shadow-md"
                    align="start"
                  >
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date: Date | undefined) => {
                        setValue('date', date as Date);
                        setIsDatePickerOpen(false);
                      }}
                      locale={tr}
                      disabled={{ before: new Date() }}
                    />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Saat</Label>
              <div className="relative">
                <Input
                  id="time"
                  type="time"
                  error={errors.time?.message}
                  {...register('time')}
                />
                <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label htmlFor="frequency-select">Tekrar</Label>
            <Controller
              name="frequency"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="frequency-select" error={errors.frequency?.message}>
                    <SelectValue>
                      {frequencyConfig[field.value].label}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(frequencyConfig).map(([value, config]) => (
                      <SelectItem key={value} value={value}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* End Date (for recurring reminders) */}
          {selectedFrequency !== 'once' && (
            <div className="space-y-2">
              <Label htmlFor="endDate">Bitiş Tarihi (Opsiyonel)</Label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, 'PPP', { locale: tr })
                        ) : (
                          <span>Bitiş tarihi seçin</span>
                        )}
                      </Button>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content
                        className="z-50 rounded-md border bg-popover p-3 shadow-md"
                        align="start"
                      >
                        <DayPicker
                          mode="single"
                          selected={field.value}
                          onSelect={(date: Date | undefined) => field.onChange(date)}
                          locale={tr}
                          disabled={{ before: selectedDate }}
                        />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                )}
              />
            </div>
          )}

          {/* Push Notifications */}
          <div className="flex items-center space-x-2">
            <Switch.Root
              id="push-notifications"
              checked={watch('notificationType') === 'push'}
              onCheckedChange={(checked) =>
                setValue('notificationType', checked ? 'push' : 'toast')
              }
              className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
            >
              <Switch.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
            </Switch.Root>
            <Label htmlFor="push-notifications" className="cursor-pointer">
              Push Bildirimleri
            </Label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            İptal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </form>
    );
  }
);

ReminderScheduler.displayName = 'ReminderScheduler'; 