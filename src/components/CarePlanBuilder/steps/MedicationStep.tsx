import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CarePlan, Medication, medicationSchema } from '@/types/carePlan';
import { useCarePlanStore } from '@/store/carePlanStore';
import { toast } from '@/components/ui/Toast';

interface MedicationStepProps {
  data: Partial<CarePlan>;
  onUpdate: (data: Partial<CarePlan>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

// Form şeması
const medicationFormSchema = z.object({
  medications: z.array(
    z.object({
      name: z.string().min(2, 'İlaç adı en az 2 karakter olmalıdır'),
      dosage: z.number().positive('Doz pozitif bir sayı olmalıdır'),
      unit: z.enum(['mg', 'ml', 'tablet', 'capsule', 'drop', 'puff', 'injection'] as const),
      frequency: z.enum(['daily', 'weekly', 'monthly', 'as_needed'] as const),
      startDate: z.string(), // HTML input type="date" string döndürür
      endDate: z.string().optional(),
      instructions: z.string().optional(),
      sideEffects: z.array(z.string()).optional(),
      warnings: z.array(z.string()).optional(),
      reminder: z.boolean().default(true),
      notifyBeforeMinutes: z.number().min(0).default(30),
    })
  ),
});

type MedicationFormData = z.infer<typeof medicationFormSchema>;

export const MedicationStep: React.FC<MedicationStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: {
      medications: data.medications?.length
        ? data.medications.map((med) => ({
            ...med,
            startDate: med.startDate.toISOString().split('T')[0],
            endDate: med.endDate ? med.endDate.toISOString().split('T')[0] : undefined,
          }))
        : [
            {
              name: '',
              dosage: 1,
              unit: 'mg',
              frequency: 'daily',
              startDate: new Date().toISOString().split('T')[0],
              reminder: true,
              notifyBeforeMinutes: 30,
            },
          ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medications',
  });

  const onSubmit = async (formData: MedicationFormData) => {
    try {
      // Form verilerini Medication tipine dönüştür
      const medications: Medication[] = formData.medications.map((med) => ({
        ...med,
        id: '', // Store'da otomatik oluşturulacak
        startDate: new Date(med.startDate),
        endDate: med.endDate ? new Date(med.endDate) : undefined,
      }));

      // Zustand store'u güncelle
      onUpdate({ medications });
      toast.success('İlaç bilgileri kaydedildi');
      onNext();
    } catch (error) {
      toast.error('İlaç bilgileri kaydedilirken hata oluştu');
      console.error('Medication form error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                İlaç #{index + 1}
              </h3>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Sil
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* İlaç Adı */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  İlaç Adı
                </label>
                <input
                  type="text"
                  {...register(`medications.${index}.name`)}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.medications?.[index]?.name
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                  }`}
                />
                {errors.medications?.[index]?.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.medications[index]?.name?.message}
                  </p>
                )}
              </div>

              {/* Doz */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Doz
                  </label>
                  <input
                    type="number"
                    {...register(`medications.${index}.dosage`, {
                      valueAsNumber: true,
                    })}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.medications?.[index]?.dosage
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                    }`}
                  />
                  {errors.medications?.[index]?.dosage && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.medications[index]?.dosage?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Birim
                  </label>
                  <select
                    {...register(`medications.${index}.unit`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="mg">mg</option>
                    <option value="ml">ml</option>
                    <option value="tablet">tablet</option>
                    <option value="capsule">kapsül</option>
                    <option value="drop">damla</option>
                    <option value="puff">puf</option>
                    <option value="injection">enjeksiyon</option>
                  </select>
                </div>
              </div>

              {/* Kullanım Sıklığı */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Kullanım Sıklığı
                </label>
                <select
                  {...register(`medications.${index}.frequency`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="daily">Günlük</option>
                  <option value="weekly">Haftalık</option>
                  <option value="monthly">Aylık</option>
                  <option value="as_needed">Gerektiğinde</option>
                </select>
              </div>

              {/* Başlangıç Tarihi */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  {...register(`medications.${index}.startDate`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Bitiş Tarihi (Opsiyonel) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bitiş Tarihi (Opsiyonel)
                </label>
                <input
                  type="date"
                  {...register(`medications.${index}.endDate`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Kullanım Talimatları */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Kullanım Talimatları
                </label>
                <textarea
                  {...register(`medications.${index}.instructions`)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Örn: Yemeklerden sonra, aç karnına vb."
                />
              </div>

              {/* Hatırlatıcı Ayarları */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    {...register(`medications.${index}.reminder`)}
                    className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Hatırlatıcı Ekle
                  </label>
                </div>
                {watch(`medications.${index}.reminder`) && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Hatırlatma Süresi (Dakika)
                    </label>
                    <input
                      type="number"
                      {...register(`medications.${index}.notifyBeforeMinutes`, {
                        valueAsNumber: true,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* İlaç Ekleme Butonu */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() =>
            append({
              name: '',
              dosage: 1,
              unit: 'mg',
              frequency: 'daily',
              startDate: new Date().toISOString().split('T')[0],
              reminder: true,
              notifyBeforeMinutes: 30,
            })
          }
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          + Yeni İlaç Ekle
        </button>
      </div>

      {/* Form Kontrolleri */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrevious}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Geri
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Devam Et'}
        </button>
      </div>
    </form>
  );
}; 