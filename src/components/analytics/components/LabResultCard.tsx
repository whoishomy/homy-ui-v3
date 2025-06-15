import React from 'react';
import { LabResult } from '@/cases/tayfun/data';

interface LabResultCardProps {
  result: LabResult;
}

export function LabResultCard({ result }: LabResultCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{result.test}</h3>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            result.isAbnormal
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          }`}
        >
          {result.isAbnormal ? 'Anormal' : 'Normal'}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">Değer</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {result.value} {result.unit}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">Referans Aralığı</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {result.referenceRange.min} - {result.referenceRange.max} {result.unit}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">Tarih</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {new Date(result.date).toLocaleDateString('tr-TR')}
          </span>
        </div>
      </div>
    </div>
  );
}
