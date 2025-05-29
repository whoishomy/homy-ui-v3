import { z } from 'zod';

export type ReminderCategory = 'health' | 'medication' | 'exercise' | 'general';
export type ReminderFrequency = 'once' | 'daily' | 'weekly' | 'monthly';
export type ReminderStatus = 'active' | 'completed' | 'missed' | 'cancelled';

const baseReminderSchema = z.object({
  title: z
    .string()
    .min(3, 'Başlık en az 3 karakter olmalıdır')
    .max(50, 'Başlık en fazla 50 karakter olabilir'),
  description: z
    .string()
    .max(200, 'Açıklama en fazla 200 karakter olabilir')
    .optional(),
  category: z.enum(['health', 'medication', 'exercise', 'general']),
  date: z.date(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Geçerli bir saat giriniz'),
  frequency: z.enum(['once', 'daily', 'weekly', 'monthly']),
  notificationType: z.enum(['toast', 'push']),
  status: z.enum(['active', 'completed', 'missed', 'cancelled']),
  endDate: z.date().optional(),
});

export const reminderFormSchema = z.preprocess(
  (data) => {
    if (typeof data === 'object' && data !== null) {
      return {
        ...data,
        notificationType: (data as any).notificationType || 'toast',
        status: (data as any).status || 'active',
      };
    }
    return data;
  },
  baseReminderSchema
);

export const reminderSchema = baseReminderSchema.extend({
  id: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type ReminderFormData = z.infer<typeof reminderFormSchema>;
export type Reminder = z.infer<typeof reminderSchema>;

export const categoryConfig: Record<ReminderCategory, {
  label: string;
  icon: string;
  color: string;
}> = {
  health: {
    label: 'Sağlık',
    icon: 'Heart',
    color: 'text-rose-500 dark:text-rose-400',
  },
  medication: {
    label: 'İlaç',
    icon: 'Pill',
    color: 'text-blue-500 dark:text-blue-400',
  },
  exercise: {
    label: 'Egzersiz',
    icon: 'Dumbbell',
    color: 'text-emerald-500 dark:text-emerald-400',
  },
  general: {
    label: 'Genel',
    icon: 'Bell',
    color: 'text-slate-500 dark:text-slate-400',
  },
};

export const frequencyConfig: Record<ReminderFrequency, {
  label: string;
  description: string;
}> = {
  once: {
    label: 'Bir kez',
    description: 'Sadece seçilen tarih ve saatte',
  },
  daily: {
    label: 'Her gün',
    description: 'Her gün aynı saatte',
  },
  weekly: {
    label: 'Her hafta',
    description: 'Her hafta aynı gün ve saatte',
  },
  monthly: {
    label: 'Her ay',
    description: 'Her ay aynı gün ve saatte',
  },
}; 