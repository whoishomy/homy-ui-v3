import React from 'react';
import ParentObservationForm from '@/components/neurofocus/ParentObservationForm';

export default function ErenPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Eren Modülü</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Özel öğrenme ihtiyaçları için dijital destek sistemi
          </p>
        </div>

        <ParentObservationForm />
      </div>
    </div>
  );
}
