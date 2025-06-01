import { useForm } from 'react-hook-form';
import { CarePlan, Medication } from '@/types/carePlan';

export interface MedicationFormData {
  medications: Array<{
    id?: string;
    name: string;
    dosage: number;
    unit: 'mg' | 'ml' | 'tablet' | 'capsule' | 'drop' | 'puff' | 'injection';
    frequency: 'daily' | 'weekly' | 'monthly' | 'as_needed';
    startDate: string;
    endDate?: string;
    instructions?: string;
    sideEffects: string[];
    warnings: string[];
    reminder: boolean;
    notifyBeforeMinutes: number;
  }>;
}

export function useMedicationForm(data: Partial<CarePlan>) {
  return useForm<MedicationFormData>({
    defaultValues: {
      medications: data.medications?.length
        ? data.medications.map((med) => ({
            ...med,
            id: med.id || undefined,
            startDate: med.startDate.toISOString().split('T')[0],
            endDate: med.endDate ? med.endDate.toISOString().split('T')[0] : undefined,
            sideEffects: med.sideEffects || [],
            warnings: med.warnings || [],
          }))
        : [
            {
              id: undefined,
              name: '',
              dosage: 1,
              unit: 'mg',
              frequency: 'daily',
              startDate: new Date().toISOString().split('T')[0],
              reminder: true,
              notifyBeforeMinutes: 30,
              sideEffects: [],
              warnings: [],
            },
          ],
    },
  });
}
