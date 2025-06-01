import { EmergencyLabResult } from '@/components/lab-result/EmergencyLabResult';
import type { LabResult } from '@/types/lab-results';
import { ResultDetailDrawer } from '@/components/dashboard/ResultDetailDrawer';

export default function EmergencyExamplePage() {
  // Example critical lab result
  const criticalLabResult: LabResult = {
    id: '123',
    testName: 'Troponin I',
    title: 'Troponin I Testi',
    category: 'cardiology',
    status: 'critical',
    value: 2.5,
    unit: 'ng/mL',
    referenceRange: {
      min: 0,
      max: 0.4,
      unit: 'ng/mL',
    },
    timestamp: new Date().toISOString(),
    orderedBy: 'Dr. Ahmet Yılmaz',
    performedBy: 'Merkez Lab',
    specimenType: 'Kan',
    collectionDate: new Date().toISOString(),
    reportDate: new Date().toISOString(),
    notes: 'Acil değerlendirme gerekli',
    data: [
      {
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 saat önce
        value: 0.3,
      },
      {
        date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 saat önce
        value: 1.2,
      },
      {
        date: new Date().toISOString(), // şimdi
        value: 2.5,
      },
    ],
    trend: 'up',
    clinicalContext: {
      significance: 'Critical',
      relatedTests: ['CK-MB', 'EKG', 'Miyoglobin'],
      doctorNotes: 'Akut koroner sendrom şüphesi, acil kardiyoloji konsültasyonu önerilir.',
    },
    recommendations: [
      'Acil kardiyoloji konsültasyonu',
      'Seri Troponin takibi',
      'EKG monitorizasyonu',
    ],
    insights: [
      {
        type: 'warning',
        content: 'Troponin değerlerinde hızlı yükseliş',
        message: 'Son 24 saatte Troponin değerlerinde kritik artış gözlendi',
        confidence: 0.95,
        source: 'AI Analiz Sistemi',
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Acil Lab Sonucu Örneği</h1>
      <ResultDetailDrawer result={criticalLabResult} isOpen={true} onClose={() => {}} />
    </div>
  );
}
