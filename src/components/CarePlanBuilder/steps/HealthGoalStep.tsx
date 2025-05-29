import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CarePlan, HealthGoal, healthGoalSchema } from '@/types/carePlan';
import { useCarePlanStore } from '@/store/carePlanStore';
import { toast } from '@/components/ui/Toast';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface HealthGoalStepProps {
  data: Partial<CarePlan>;
  onUpdate: (data: Partial<CarePlan>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

// Form şeması
const healthGoalFormSchema = z.object({
  goals: z.array(
    z.object({
      title: z.string().min(2, 'Hedef başlığı en az 2 karakter olmalıdır'),
      description: z.string().min(10, 'Hedef açıklaması en az 10 karakter olmalıdır'),
      category: z.enum(['weight', 'exercise', 'nutrition', 'sleep', 'mental', 'other'] as const),
      targetDate: z.string(), // HTML input type="date" string döndürür
      targetValue: z.union([z.string(), z.number(), z.boolean()]),
      currentValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
      unit: z.string().optional(),
      status: z.enum(['not_started', 'in_progress', 'achieved', 'missed'] as const),
      reminder: z.boolean(),
      checkInFrequency: z.enum(['daily', 'weekly', 'monthly'] as const),
      notes: z.string().optional(),
    })
  ),
});

type HealthGoalFormData = z.infer<typeof healthGoalFormSchema>;

const goalCategories = [
  { value: 'weight', label: 'Kilo Yönetimi' },
  { value: 'exercise', label: 'Egzersiz' },
  { value: 'nutrition', label: 'Beslenme' },
  { value: 'sleep', label: 'Uyku' },
  { value: 'mental', label: 'Mental Sağlık' },
  { value: 'other', label: 'Diğer' },
] as const;

const goalStatuses = [
  { value: 'not_started', label: 'Başlanmadı', color: 'bg-gray-100 text-gray-800' },
  { value: 'in_progress', label: 'Devam Ediyor', color: 'bg-blue-100 text-blue-800' },
  { value: 'achieved', label: 'Tamamlandı', color: 'bg-green-100 text-green-800' },
  { value: 'missed', label: 'Kaçırıldı', color: 'bg-red-100 text-red-800' },
] as const;

const checkInFrequencies = [
  { value: 'daily', label: 'Günlük' },
  { value: 'weekly', label: 'Haftalık' },
  { value: 'monthly', label: 'Aylık' },
] as const;

export const HealthGoalStep: React.FC<HealthGoalStepProps> = ({
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
  } = useForm<HealthGoalFormData>({
    resolver: zodResolver(healthGoalFormSchema),
    defaultValues: {
      goals: data.goals?.length
        ? data.goals.map((goal) => ({
            ...goal,
            targetDate: format(goal.targetDate, 'yyyy-MM-dd'),
            targetValue: goal.targetValue.toString(),
            currentValue: goal.currentValue?.toString(),
            reminder: goal.reminder ?? true,
            checkInFrequency: goal.checkInFrequency ?? 'weekly',
          }))
        : [
            {
              title: '',
              description: '',
              category: 'other',
              targetDate: format(new Date(), 'yyyy-MM-dd'),
              targetValue: '',
              status: 'not_started',
              reminder: true,
              checkInFrequency: 'weekly',
            },
          ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'goals',
  });

  const onSubmit = async (formData: HealthGoalFormData) => {
    try {
      // Form verilerini HealthGoal tipine dönüştür
      const goals: HealthGoal[] = formData.goals.map((goal) => ({
        ...goal,
        id: '', // Store'da otomatik oluşturulacak
        targetDate: new Date(goal.targetDate),
        targetValue: goal.targetValue,
        currentValue: goal.currentValue,
      }));

      // Zustand store'u güncelle
      onUpdate({ goals });
      toast.success('Sağlık hedefleri kaydedildi');
      onNext();
    } catch (error) {
      toast.error('Sağlık hedefleri kaydedilirken hata oluştu');
      console.error('HealthGoal form error:', error);
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
                Hedef #{index + 1}
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
              {/* Hedef Başlığı */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Hedef Başlığı
                </label>
                <input
                  type="text"
                  {...register(`goals.${index}.title`)}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.goals?.[index]?.title
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                  }`}
                  placeholder="Örn: Günlük 10.000 Adım"
                />
                {errors.goals?.[index]?.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.goals[index]?.title?.message}
                  </p>
                )}
              </div>

              {/* Hedef Açıklaması */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Hedef Açıklaması
                </label>
                <textarea
                  {...register(`goals.${index}.description`)}
                  rows={3}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.goals?.[index]?.description
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                  }`}
                  placeholder="Hedefin detaylı açıklaması..."
                />
                {errors.goals?.[index]?.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.goals[index]?.description?.message}
                  </p>
                )}
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Kategori
                </label>
                <select
                  {...register(`goals.${index}.category`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  {goalCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hedef Tarihi */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hedef Tarihi
                </label>
                <input
                  type="date"
                  {...register(`goals.${index}.targetDate`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Hedef Değeri */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hedef Değeri
                </label>
                <input
                  type="text"
                  {...register(`goals.${index}.targetValue`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Örn: 10000, true, 75kg"
                />
              </div>

              {/* Mevcut Değer */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mevcut Değer
                </label>
                <input
                  type="text"
                  {...register(`goals.${index}.currentValue`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Örn: 5000, false, 80kg"
                />
              </div>

              {/* Birim */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Birim
                </label>
                <input
                  type="text"
                  {...register(`goals.${index}.unit`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Örn: adım, kg, saat"
                />
              </div>

              {/* İlerleme Durumu */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Durum
                </label>
                <select
                  {...register(`goals.${index}.status`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  {goalStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hatırlatıcı Ayarları */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    {...register(`goals.${index}.reminder`)}
                    className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Hatırlatıcı Ekle
                  </label>
                </div>
                {watch(`goals.${index}.reminder`) && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Kontrol Sıklığı
                    </label>
                    <select
                      {...register(`goals.${index}.checkInFrequency`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    >
                      {checkInFrequencies.map((freq) => (
                        <option key={freq.value} value={freq.value}>
                          {freq.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Notlar */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Notlar
                </label>
                <textarea
                  {...register(`goals.${index}.notes`)}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Ek notlar..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hedef Ekleme Butonu */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() =>
            append({
              title: '',
              description: '',
              category: 'other',
              targetDate: format(new Date(), 'yyyy-MM-dd'),
              targetValue: '',
              currentValue: '',
              status: 'not_started',
              reminder: true,
              checkInFrequency: 'weekly',
            })
          }
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          + Yeni Hedef Ekle
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