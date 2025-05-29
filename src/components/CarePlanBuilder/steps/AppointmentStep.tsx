import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CarePlan, Appointment, appointmentSchema } from '@/types/carePlan';
import { useCarePlanStore } from '@/store/carePlanStore';
import { toast } from '@/components/ui/Toast';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface AppointmentStepProps {
  data: Partial<CarePlan>;
  onUpdate: (data: Partial<CarePlan>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

// Form şeması
const appointmentFormSchema = z.object({
  appointments: z.array(
    z.object({
      title: z.string().min(2, 'Başlık en az 2 karakter olmalıdır'),
      type: z.enum(['checkup', 'treatment', 'test', 'consultation', 'emergency'] as const),
      date: z.string(), // HTML input type="datetime-local" string döndürür
      duration: z.number().min(15, 'Süre en az 15 dakika olmalıdır'),
      location: z.string().optional(),
      doctorName: z.string().optional(),
      notes: z.string().optional(),
      reminder: z.boolean(),
      notifyBeforeMinutes: z.number().min(0),
    })
  ),
});

type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

const appointmentTypes = [
  { value: 'checkup', label: 'Kontrol' },
  { value: 'treatment', label: 'Tedavi' },
  { value: 'test', label: 'Test/Tahlil' },
  { value: 'consultation', label: 'Konsültasyon' },
  { value: 'emergency', label: 'Acil' },
] as const;

export const AppointmentStep: React.FC<AppointmentStepProps> = ({
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
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      appointments: data.appointments?.length
        ? data.appointments.map((apt) => ({
            ...apt,
            date: format(apt.date, "yyyy-MM-dd'T'HH:mm"),
            reminder: apt.reminder ?? true,
            notifyBeforeMinutes: apt.notifyBeforeMinutes ?? 60,
          }))
        : [
            {
              title: '',
              type: 'checkup',
              date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
              duration: 30,
              reminder: true,
              notifyBeforeMinutes: 60,
            },
          ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'appointments',
  });

  const onSubmit = async (formData: AppointmentFormData) => {
    try {
      // Form verilerini Appointment tipine dönüştür
      const appointments: Appointment[] = formData.appointments.map((apt) => ({
        ...apt,
        id: '', // Store'da otomatik oluşturulacak
        date: new Date(apt.date),
      }));

      // Zustand store'u güncelle
      onUpdate({ appointments });
      toast.success('Randevu bilgileri kaydedildi');
      onNext();
    } catch (error) {
      toast.error('Randevu bilgileri kaydedilirken hata oluştu');
      console.error('Appointment form error:', error);
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
                Randevu #{index + 1}
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
              {/* Randevu Başlığı */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Randevu Başlığı
                </label>
                <input
                  type="text"
                  {...register(`appointments.${index}.title`)}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.appointments?.[index]?.title
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                  }`}
                  placeholder="Örn: Kardiyoloji Kontrolü"
                />
                {errors.appointments?.[index]?.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.appointments[index]?.title?.message}
                  </p>
                )}
              </div>

              {/* Randevu Tipi */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Randevu Tipi
                </label>
                <select
                  {...register(`appointments.${index}.type`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  {appointmentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tarih ve Saat */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tarih ve Saat
                </label>
                <input
                  type="datetime-local"
                  {...register(`appointments.${index}.date`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Süre */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Süre (Dakika)
                </label>
                <input
                  type="number"
                  {...register(`appointments.${index}.duration`, {
                    valueAsNumber: true,
                  })}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.appointments?.[index]?.duration
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                  }`}
                  min="15"
                  step="15"
                />
                {errors.appointments?.[index]?.duration && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.appointments[index]?.duration?.message}
                  </p>
                )}
              </div>

              {/* Doktor Adı */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Doktor Adı
                </label>
                <input
                  type="text"
                  {...register(`appointments.${index}.doctorName`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Örn: Dr. Ahmet Yılmaz"
                />
              </div>

              {/* Lokasyon */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lokasyon
                </label>
                <input
                  type="text"
                  {...register(`appointments.${index}.location`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Örn: Özel Hastane A, B Blok, Kat 3"
                />
              </div>

              {/* Notlar */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Notlar
                </label>
                <textarea
                  {...register(`appointments.${index}.notes`)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Örn: Aç karnına gelmeniz gerekmektedir."
                />
              </div>

              {/* Hatırlatıcı Ayarları */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    {...register(`appointments.${index}.reminder`)}
                    className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Hatırlatıcı Ekle
                  </label>
                </div>
                {watch(`appointments.${index}.reminder`) && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Hatırlatma Süresi (Dakika)
                    </label>
                    <input
                      type="number"
                      {...register(`appointments.${index}.notifyBeforeMinutes`, {
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

      {/* Randevu Ekleme Butonu */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() =>
            append({
              title: '',
              type: 'checkup',
              date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
              duration: 30,
              reminder: true,
              notifyBeforeMinutes: 60,
            })
          }
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          + Yeni Randevu Ekle
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