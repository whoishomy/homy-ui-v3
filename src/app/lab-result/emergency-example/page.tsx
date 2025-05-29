import { EmergencyLabResult } from '@/components/lab-result/EmergencyLabResult';
import type { LabResult } from '@/components/dashboard/LabResultsPanel';

export default function EmergencyExamplePage() {
  // Example critical lab result
  const criticalLabResult: LabResult = {
    id: 'wbc-001',
    title: 'WBC Count',
    description: 'White Blood Cell Count',
    unit: 'K/µL',
    data: [
      { date: '2024-03-10', value: 8.2 },
      { date: '2024-03-15', value: 12.5 },
      { date: '2024-03-20', value: 22.5 }, // Critical value
    ],
    referenceRange: {
      min: 4.5,
      max: 11.0,
    },
    trend: 'up',
    severity: 'critical',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <EmergencyLabResult
        labResult={criticalLabResult}
        patientId="P123456"
        patientName="John Doe"
      />
    </div>
  );
}
