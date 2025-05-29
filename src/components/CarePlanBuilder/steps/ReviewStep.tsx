import React, { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { CarePlan } from '@/types/carePlan';
import { toast } from '@/components/ui/Toast';
import {
  exportToPDF,
  exportToCSV,
  exportToICal,
  generateShareableLink,
} from '@/utils/exportUtils';

interface ReviewStepProps {
  data: Partial<CarePlan>;
  onUpdate: (data: Partial<CarePlan>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

type ExportFormat = 'pdf' | 'json' | 'csv' | 'ical';

const exportFormats = [
  { id: 'pdf', label: 'PDF Dosyası', icon: '📄' },
  { id: 'json', label: 'JSON Verisi', icon: '🔧' },
  { id: 'csv', label: 'CSV Dosyası', icon: '📊' },
  { id: 'ical', label: 'iCal Takvimi', icon: '📅' },
] as const;

export const ReviewStep: React.FC<ReviewStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Validation kontrolü
  const missingFields = React.useMemo(() => {
    const missing: string[] = [];

    if (!data.title) missing.push('Plan başlığı');
    if (!data.startDate) missing.push('Başlangıç tarihi');
    if (!data.medications?.length) missing.push('İlaç bilgileri');
    if (!data.goals?.length) missing.push('Sağlık hedefleri');
    if (!data.metrics?.length) missing.push('Takip metrikleri');

    return missing;
  }, [data]);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    try {
      // Format'a göre export işlemi
      switch (format) {
        case 'pdf':
          await exportToPDF(data);
          break;
        case 'json':
          await exportToJSON(data);
          break;
        case 'csv':
          await exportToCSV(data);
          break;
        case 'ical':
          await exportToICal(data);
          break;
      }
      toast.success('Plan başarıyla dışa aktarıldı');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Dışa aktarma sırasında bir hata oluştu');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      // Paylaşılabilir link oluştur
      const shareableLink = await generateShareableLink(data);
      await navigator.clipboard.writeText(shareableLink);
      toast.success('Paylaşım linki kopyalandı');
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Link oluşturulurken bir hata oluştu');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Validation Uyarısı */}
      {missingFields.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Eksik Bilgiler
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  {missingFields.map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plan Özeti */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Bakım Planı Özeti
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Planınızın detaylı özeti ve dışa aktarma seçenekleri
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Plan Başlığı</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.title}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Durum</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {data.status}
                </span>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Başlangıç Tarihi
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {data.startDate &&
                  format(new Date(data.startDate), 'dd MMMM yyyy', { locale: tr })}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Bitiş Tarihi</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {data.endDate &&
                  format(new Date(data.endDate), 'dd MMMM yyyy', { locale: tr })}
              </dd>
            </div>

            {/* İlaçlar */}
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">İlaçlar</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {data.medications?.map((med) => (
                    <li
                      key={med.id}
                      className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                    >
                      <div className="w-0 flex-1 flex items-center">
                        <span className="ml-2 flex-1 w-0 truncate">
                          {med.name} - {med.dosage} {med.unit}
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="font-medium text-gray-600">
                          {med.frequency}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>

            {/* Hedefler */}
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Sağlık Hedefleri
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {data.goals?.map((goal) => (
                    <li
                      key={goal.id}
                      className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                    >
                      <div className="w-0 flex-1 flex items-center">
                        <span className="ml-2 flex-1 w-0 truncate">
                          {goal.title}
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            goal.status === 'achieved'
                              ? 'bg-green-100 text-green-800'
                              : goal.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {goal.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>

            {/* Metrikler */}
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Takip Metrikleri
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {data.metrics?.map((metric) => (
                    <li
                      key={metric.id}
                      className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                    >
                      <div className="w-0 flex-1 flex items-center">
                        <span className="ml-2 flex-1 w-0 truncate">
                          {metric.name}
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="font-medium text-gray-600">
                          {metric.frequency}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Export Seçenekleri */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Dışa Aktarma Seçenekleri
          </h3>
          <div className="mt-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {exportFormats.map((format) => (
                <button
                  key={format.id}
                  type="button"
                  onClick={() => handleExport(format.id as ExportFormat)}
                  disabled={isExporting}
                  className={`relative rounded-lg p-4 flex flex-col items-center text-center hover:border-gray-400 focus:outline-none ${
                    selectedFormat === format.id
                      ? 'border-2 border-green-500'
                      : 'border-2 border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{format.icon}</span>
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    {format.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Paylaşım */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Planı Paylaş
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Bakım planınızı doktorunuz veya yakınlarınızla paylaşmak için link
              oluşturun.
            </p>
          </div>
          <div className="mt-5">
            <button
              type="button"
              onClick={handleShare}
              disabled={isSharing}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isSharing ? 'Link Oluşturuluyor...' : 'Paylaşım Linki Oluştur'}
            </button>
          </div>
        </div>
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
          type="button"
          onClick={onNext}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Planı Tamamla
        </button>
      </div>
    </div>
  );
};

// JSON export fonksiyonu
const exportToJSON = async (data: Partial<CarePlan>) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `care-plan-${format(new Date(), 'yyyy-MM-dd')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}; 