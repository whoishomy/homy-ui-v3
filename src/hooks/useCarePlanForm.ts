import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type CarePlanStatus } from '@/types/carePlan';

// Define base schemas
const medicationSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().min(2),
    dosage: z.number().positive(),
    unit: z.enum(['mg', 'ml', 'tablet', 'capsule', 'drop', 'puff', 'injection']),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'as_needed']),
    startDate: z.date(),
    reminder: z.boolean(),
    notifyBeforeMinutes: z.number().min(0, 'Bildirim süresi negatif olamaz'),
  })
  .strict();

const appointmentSchema = z
  .object({
    id: z.string().uuid().optional(),
    title: z.string().min(2),
    type: z.enum(['checkup', 'treatment', 'test', 'consultation', 'emergency']),
    date: z.date(),
    duration: z.number().min(15),
    reminder: z.boolean(),
    notifyBeforeMinutes: z.number().min(0, 'Bildirim süresi negatif olamaz'),
  })
  .strict();

const goalSchema = z
  .object({
    id: z.string().uuid().optional(),
    title: z.string().min(2),
    targetDate: z.date(),
    reminder: z.boolean(),
  })
  .strict();

const metricSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(2),
    type: z.enum(['number', 'boolean', 'range', 'scale', 'options']),
    reminder: z.boolean(),
    notifyBeforeMinutes: z.number().min(0, 'Bildirim süresi negatif olamaz'),
  })
  .strict();

// Define the form schema
const carePlanFormSchema = z
  .object({
    patientId: z.string().uuid().optional(),
    title: z.string().min(2, 'Plan başlığı en az 2 karakter olmalıdır'),
    description: z.string().optional(),
    startDate: z.date(),
    endDate: z.date().optional(),
    status: z.enum(['draft', 'active', 'completed', 'cancelled', 'paused']),
    medications: z.array(medicationSchema),
    appointments: z.array(appointmentSchema),
    goals: z.array(goalSchema),
    metrics: z.array(metricSchema),
    tags: z.array(z.string()),
    notes: z.string().optional(),
  })
  .strict();

export type CarePlanFormValues = z.infer<typeof carePlanFormSchema>;

const defaultFormValues: Partial<CarePlanFormValues> = {
  status: 'draft',
  medications: [],
  appointments: [],
  goals: [],
  metrics: [],
  tags: [],
};

interface UseCarePlanFormProps {
  defaultValues?: Partial<CarePlanFormValues>;
}

export const useCarePlanForm = ({ defaultValues }: UseCarePlanFormProps = {}) => {
  const form = useForm<CarePlanFormValues>({
    resolver: zodResolver(carePlanFormSchema),
    mode: 'onChange',
    defaultValues: {
      ...defaultFormValues,
      ...defaultValues,
    },
  });

  return {
    form,
    formState: form.formState,
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues,
    handleSubmit: form.handleSubmit,
    reset: form.reset,
    register: form.register,
    control: form.control,
  };
};
