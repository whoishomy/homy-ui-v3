import React from 'react';
import { CarePlan } from '@/types/carePlan';

interface BasicInfoStepProps {
  data: Partial<CarePlan>;
  onUpdate: (data: Partial<CarePlan>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  data,
  onUpdate,
  onNext,
}) => {
  const [formData, setFormData] = React.useState({
    title: data.title || '',
    description: data.description || '',
    patientId: data.patientId || '', // Bu değeri daha sonra auth context'ten alacağız
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Değişiklik yapıldığında ilgili hatayı temizle
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Başlık zorunludur';
    } else if (formData.title.length < 2) {
      newErrors.title = 'Başlık en az 2 karakter olmalıdır';
    }

    if (!formData.patientId.trim()) {
      newErrors.patientId = 'Hasta ID zorunludur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onUpdate({
        title: formData.title,
        description: formData.description,
        patientId: formData.patientId,
      });
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Bakım Planı Başlığı
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.title
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
          }`}
          placeholder="Örn: Diyabet Yönetim Planı"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Açıklama
        </label>
        <textarea
          name="description"
          id="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          placeholder="Bakım planının amacını ve kapsamını açıklayın"
        />
      </div>

      <div>
        <label
          htmlFor="patientId"
          className="block text-sm font-medium text-gray-700"
        >
          Hasta ID
        </label>
        <input
          type="text"
          name="patientId"
          id="patientId"
          value={formData.patientId}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.patientId
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
          }`}
          placeholder="Hasta ID"
        />
        {errors.patientId && (
          <p className="mt-1 text-sm text-red-600">{errors.patientId}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Devam Et
        </button>
      </div>
    </form>
  );
}; 