'use client';

import dynamic from 'next/dynamic';

const ObservationViewer = dynamic(() => import('@/components/neurofocus/ObservationViewer'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
});

export default function ObservationPage() {
  return (
    <div className="container max-w-4xl mx-auto py-10">
      <ObservationViewer />
    </div>
  );
}
