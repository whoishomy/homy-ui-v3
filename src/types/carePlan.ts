import { z } from 'zod';

// Base types
export type CarePlanStatus = 'draft' | 'active' | 'completed' | 'cancelled' | 'paused';
export type MedicationFrequency = 'daily' | 'weekly' | 'monthly' | 'as_needed';
export type MedicationUnit = 'mg' | 'ml' | 'tablet' | 'capsule' | 'drop' | 'puff' | 'injection';
export type AppointmentType = 'checkup' | 'treatment' | 'test' | 'consultation' | 'emergency';
export type MetricType = 'number' | 'boolean' | 'range' | 'scale' | 'options';

// Medication Schema
export const medicationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, 'İlaç adı en az 2 karakter olmalıdır'),
  dosage: z.number().positive('Doz pozitif bir sayı olmalıdır'),
  unit: z.enum(['mg', 'ml', 'tablet', 'capsule', 'drop', 'puff', 'injection'] as const),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'as_needed'] as const),
  startDate: z.date(),
  endDate: z.date().optional(),
  instructions: z.string().optional(),
  sideEffects: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
  reminder: z.boolean().default(true),
  notifyBeforeMinutes: z.number().min(0).default(30),
});

// Appointment Schema
export const appointmentSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2, 'Başlık en az 2 karakter olmalıdır'),
  type: z.enum(['checkup', 'treatment', 'test', 'consultation', 'emergency'] as const),
  date: z.date(),
  duration: z.number().min(15, 'Süre en az 15 dakika olmalıdır'),
  location: z.string().optional(),
  doctorName: z.string().optional(),
  notes: z.string().optional(),
  reminder: z.boolean().default(true),
  notifyBeforeMinutes: z.number().min(0).default(60),
});

// Health Goal Schema
export const healthGoalSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2, 'Hedef başlığı en az 2 karakter olmalıdır'),
  description: z.string().optional(),
  targetDate: z.date(),
  targetValue: z.union([z.number(), z.boolean(), z.string()]),
  currentValue: z.union([z.number(), z.boolean(), z.string()]).optional(),
  unit: z.string().optional(),
  status: z.enum(['not_started', 'in_progress', 'achieved', 'missed'] as const),
  category: z.enum(['weight', 'exercise', 'nutrition', 'sleep', 'mental', 'other'] as const),
  reminder: z.boolean().default(false),
  checkInFrequency: z.enum(['daily', 'weekly', 'monthly'] as const).optional(),
});

// Health Metric Schema
export const healthMetricSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Metrik adı en az 2 karakter olmalıdır'),
  type: z.enum(['number', 'boolean', 'range', 'scale', 'options'] as const),
  unit: z.string().optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  options: z.array(z.string()).optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'as_needed'] as const),
  reminder: z.boolean(),
  notifyBeforeMinutes: z.number().min(0),
  description: z.string().optional(),
  relatedGoals: z.array(z.string()).optional(),
});

// Care Plan Schema
export const carePlanSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  title: z.string().min(2, 'Plan başlığı en az 2 karakter olmalıdır'),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  status: z.enum(['draft', 'active', 'completed', 'cancelled', 'paused'] as const),
  medications: z.array(medicationSchema),
  appointments: z.array(appointmentSchema),
  goals: z.array(healthGoalSchema),
  metrics: z.array(healthMetricSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// Type Exports
export type Medication = z.infer<typeof medicationSchema>;
export type Appointment = z.infer<typeof appointmentSchema>;
export type HealthGoal = z.infer<typeof healthGoalSchema>;
export type HealthMetric = z.infer<typeof healthMetricSchema>;
export type CarePlan = z.infer<typeof carePlanSchema>;
