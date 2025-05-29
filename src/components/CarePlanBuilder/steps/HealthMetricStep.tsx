import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CarePlan, HealthMetric, healthMetricSchema } from '@/types/carePlan';
import { useCarePlanStore } from '@/store/carePlanStore';
import { toast } from '@/components/ui/Toast';

interface HealthMetricStepProps {
  data: Partial<CarePlan>;
  onUpdate: (data: Partial<CarePlan>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

// Form şeması
const healthMetricFormSchema = z.object({
  metrics: z.array(
    z.object({
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
      relatedGoals: z.array(z.string()).optional(), // Hedef ID'leri
    })
  ),
});

type HealthMetricFormData = z.infer<typeof healthMetricFormSchema>;

const metricTypes = [
  { value: 'number', label: 'Sayısal Değer', example: 'Örn: Kilo, Nabız, Tansiyon' },
  { value: 'boolean', label: 'Evet/Hayır', example: 'Örn: İlaç Alındı mı?' },
  { value: 'range', label: 'Aralık', example: 'Örn: Ağrı Seviyesi (1-10)' },
  { value: 'scale', label: 'Ölçek', example: 'Örn: Ruh Hali (Çok Kötü - Çok İyi)' },
  { value: 'options', label: 'Seçenekler', example: 'Örn: Düşük, Normal, Yüksek' },
] as const;

const measurementFrequencies = [
  { value: 'daily', label: 'Günlük' },
  { value: 'weekly', label: 'Haftalık' },
  { value: 'monthly', label: 'Aylık' },
  { value: 'as_needed', label: 'Gerektiğinde' },
] as const;

export const HealthMetricStep: React.FC<HealthMetricStepProps> = ({
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
    setValue,
  } = useForm<HealthMetricFormData>({
    resolver: zodResolver(healthMetricFormSchema),
    defaultValues: {
      metrics: data.metrics?.length
        ? data.metrics.map((metric) => ({
            ...metric,
            options: metric.options || [],
            reminder: metric.reminder ?? false,
            notifyBeforeMinutes: metric.notifyBeforeMinutes ?? 0,
          }))
        : [
            {
              name: '',
              type: 'number',
              frequency: 'daily',
              reminder: false,
              notifyBeforeMinutes: 0,
              options: [],
            },
          ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'metrics',
  });

  const onSubmit = async (formData: HealthMetricFormData) => {
    try {
      // Form verilerini HealthMetric tipine dönüştür
      const metrics: HealthMetric[] = formData.metrics.map((metric) => ({
        ...metric,
        id: '', // Store'da otomatik oluşturulacak
      }));

      // Zustand store'u güncelle
      onUpdate({ metrics });
      toast.success('Sağlık metrikleri kaydedildi');
      onNext();
    } catch (error) {
      toast.error('Sağlık metrikleri kaydedilirken hata oluştu');
      console.error('HealthMetric form error:', error);
    }
  };

  // Metrik tipine göre ek alanları göster/gizle
  const renderMetricTypeFields = (index: number) => {
    const type = watch(`metrics.${index}.type`);

    switch (type) {
      case 'number':
      case 'range':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Değer
              </label>
              <input
                type="number"
                {...register(`metrics.${index}.minValue`, {
                  valueAsNumber: true,
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Değer
              </label>
              <input
                type="number"
                {...register(`metrics.${index}.maxValue`, {
                  valueAsNumber: true,
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </>
        );

      case 'options':
        return (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Seçenekler (Her satıra bir seçenek yazın)
            </label>
            <textarea
              {...register(`metrics.${index}.options` as const)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="Örn:&#10;Düşük&#10;Normal&#10;Yüksek"
              onChange={(e) => {
                const options = e.target.value.split('\n').filter(Boolean);
                setValue(`metrics.${index}.options`, options);
              }}
              value={watch(`metrics.${index}.options`)?.join('\n') || ''}
            />
          </div>
        );

      case 'scale':
        return (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Ölçek Seçenekleri (Her satıra bir seçenek yazın)
            </label>
            <textarea
              {...register(`metrics.${index}.options` as const)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="Örn:&#10;Çok Kötü&#10;Kötü&#10;Normal&#10;İyi&#10;Çok İyi"
              onChange={(e) => {
                const options = e.target.value.split('\n').filter(Boolean);
                setValue(`metrics.${index}.options`, options);
              }}
              value={watch(`metrics.${index}.options`)?.join('\n') || ''}
            />
          </div>
        );

      default:
        return null;
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
                Metrik #{index + 1}
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
              {/* Metrik Adı */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Metrik Adı
                </label>
                <input
                  type="text"
                  {...register(`metrics.${index}.name`)}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.metrics?.[index]?.name
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                  }`}
                  placeholder="Örn: Kan Şekeri, Nabız, Ağrı Seviyesi"
                />
                {errors.metrics?.[index]?.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.metrics[index]?.name?.message}
                  </p>
                )}
              </div>

              {/* Metrik Tipi */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Metrik Tipi
                </label>
                <select
                  {...register(`metrics.${index}.type`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  {metricTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  {metricTypes.find((t) => t.value === watch(`metrics.${index}.type`))?.example}
                </p>
              </div>

              {/* Birim */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Birim
                </label>
                <input
                  type="text"
                  {...register(`metrics.${index}.unit`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Örn: mg/dL, bpm, derece"
                />
              </div>

              {/* Tip'e göre dinamik alanlar */}
              {renderMetricTypeFields(index)}

              {/* Ölçüm Sıklığı */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ölçüm Sıklığı
                </label>
                <select
                  {...register(`metrics.${index}.frequency`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  {measurementFrequencies.map((freq) => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hatırlatıcı Ayarları */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    {...register(`metrics.${index}.reminder`)}
                    className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Hatırlatıcı Ekle
                  </label>
                </div>
                {watch(`metrics.${index}.reminder`) && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Hatırlatma Süresi (Dakika)
                    </label>
                    <input
                      type="number"
                      {...register(`metrics.${index}.notifyBeforeMinutes`, {
                        valueAsNumber: true,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                )}
              </div>

              {/* Açıklama */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Açıklama
                </label>
                <textarea
                  {...register(`metrics.${index}.description`)}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Metrik hakkında ek açıklamalar..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Metrik Ekleme Butonu */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() =>
            append({
              name: '',
              type: 'number',
              frequency: 'daily',
              reminder: false,
              notifyBeforeMinutes: 0,
              options: [],
            })
          }
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          + Yeni Metrik Ekle
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