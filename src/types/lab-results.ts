import { z } from 'zod';
import { AIGeneratedInsight } from './health-report';

// Base types
export type LabResultStatus = 'normal' | 'low' | 'high' | 'critical_low' | 'critical_high';
export type LabResultCategory = 'blood' | 'urine' | 'imaging' | 'cardiology' | 'other';
export type LabResultTrend = 'increasing' | 'decreasing' | 'stable' | 'fluctuating';

// Reference Range Schema
export const referenceRangeSchema = z.object({
  min: z.number(),
  max: z.number(),
  unit: z.string(),
  ageSpecific: z.boolean().optional(),
  genderSpecific: z.boolean().optional(),
});

// Test Methodology Schema
export const testMethodologySchema = z.object({
  name: z.string(),
  device: z.string(),
  sampleType: z.string(),
  processingTime: z.string(),
  description: z.string().optional(),
  limitations: z.array(z.string()).optional(),
});

// Lab Result Schema
export const labResultSchema = z.object({
  id: z.string().uuid(),
  testName: z.string().min(2, 'Test adı en az 2 karakter olmalıdır'),
  category: z.enum(['blood', 'urine', 'imaging', 'cardiology', 'other'] as const),
  date: z.string().datetime(),
  value: z.number(),
  unit: z.string(),
  referenceRange: referenceRangeSchema,
  status: z.enum(['normal', 'low', 'high', 'critical_low', 'critical_high'] as const),
  trend: z.enum(['increasing', 'decreasing', 'stable', 'fluctuating'] as const),
  laboratory: z.string(),
  methodology: testMethodologySchema.optional(),
  notes: z.string().optional(),
  orderedBy: z.string().optional(),
  reportedBy: z.string().optional(),
  reportUrl: z.string().url().optional(),
  verifiedAt: z.string().datetime().optional(),
  verifiedBy: z.string().optional(),
  sampleCollectedAt: z.string().datetime().optional(),
  sampleProcessedAt: z.string().datetime().optional(),
  resultAvailableAt: z.string().datetime().optional(),
  insights: z.array(z.custom<AIGeneratedInsight>()).optional(),
});

// Lab Result History Schema
export const labResultHistorySchema = z.object({
  testId: z.string().uuid(),
  history: z.array(labResultSchema),
  metadata: z.object({
    lastUpdated: z.string().datetime(),
    totalCount: z.number(),
    averageValue: z.number().optional(),
    standardDeviation: z.number().optional(),
  }),
});

// Type Exports
export type ReferenceRange = z.infer<typeof referenceRangeSchema>;
export type TestMethodology = z.infer<typeof testMethodologySchema>;
export type LabResult = z.infer<typeof labResultSchema>;
export type LabResultHistory = z.infer<typeof labResultHistorySchema>;
