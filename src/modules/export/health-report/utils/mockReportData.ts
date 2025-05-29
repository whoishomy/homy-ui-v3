import { HealthReportData, VitalStats, AIGeneratedInsight } from '@/types/health-report';
import { LabResult, LabResultStatus, LabResultCategory, LabResultTrend } from '@/types/lab-results';

const generateMockVitals = (): VitalStats => ({
  timestamp: new Date().toISOString(),
  heartRate: 75 + Math.floor(Math.random() * 10),
  bloodPressure: {
    systolic: 120 + Math.floor(Math.random() * 10),
    diastolic: 80 + Math.floor(Math.random() * 5),
  },
  bodyTemperature: 36.5 + Math.random(),
  oxygenSaturation: 97 + Math.floor(Math.random() * 3),
  respiratoryRate: 16 + Math.floor(Math.random() * 4),
  glucoseLevel: 90 + Math.floor(Math.random() * 20),
});

const generateMockLabResults = (): LabResult[] => [
  {
    id: crypto.randomUUID(),
    testName: 'Hemoglobin',
    category: 'blood',
    date: new Date().toISOString(),
    value: 14.5,
    unit: 'g/dL',
    referenceRange: { min: 12, max: 16, unit: 'g/dL', ageSpecific: true, genderSpecific: true },
    status: 'normal',
    trend: 'stable',
    laboratory: 'Central Lab',
    methodology: {
      name: 'Spektrofotometri',
      device: 'Roche Cobas 8000',
      sampleType: 'Serum',
      processingTime: '45 dakika',
      description: 'Hemoglobin ölçümü için spektrofotometrik analiz yöntemi',
      limitations: [
        'Hemoliz varlığında sonuçlar etkilenebilir',
        'Lipemik numunelerde interferans olabilir',
        'Yüksek bilirubin düzeyleri ölçümü etkileyebilir',
      ],
    },
    orderedBy: 'Dr. Mehmet Yılmaz',
    reportedBy: 'Lab. Uzm. Ayşe Demir',
    notes: 'Normal referans aralığında',
    sampleCollectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    sampleProcessedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    resultAvailableAt: new Date().toISOString(),
    verifiedAt: new Date().toISOString(),
    verifiedBy: 'Lab. Uzm. Ayşe Demir',
    insights: [
      {
        type: 'summary',
        content: 'Hemoglobin değeri normal aralıkta ve stabil seyrediyor.',
        confidence: 0.95,
        sourceData: ['vitals', 'lab-history'],
        timestamp: new Date().toISOString(),
      },
      {
        type: 'trend',
        content: 'Son 3 ölçümde hafif yükseliş trendi gözleniyor.',
        confidence: 0.85,
        sourceData: ['lab-history'],
        timestamp: new Date().toISOString(),
      },
      {
        type: 'recommendation',
        content: 'Demir açısından zengin beslenmenin sürdürülmesi önerilir.',
        confidence: 0.88,
        sourceData: ['nutrition-data', 'lab-history'],
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    testName: 'Glucose (Fasting)',
    category: 'blood',
    date: new Date().toISOString(),
    value: 95,
    unit: 'mg/dL',
    referenceRange: { min: 70, max: 100, unit: 'mg/dL' },
    status: 'normal',
    trend: 'decreasing',
    laboratory: 'Central Lab',
    methodology: {
      name: 'Enzimatik Yöntem',
      device: 'Roche Cobas 8000',
      sampleType: 'Plazma',
      processingTime: '30 dakika',
      description: 'Açlık kan şekeri ölçümü için enzimatik analiz yöntemi',
      limitations: [
        'Hemoliz varlığında sonuçlar etkilenebilir',
        'Glikolitik inhibitör kullanılmayan numunelerde glukoz düzeyi düşük çıkabilir',
        'Numune stabilitesi oda sıcaklığında 2 saattir',
      ],
    },
    orderedBy: 'Dr. Mehmet Yılmaz',
    reportedBy: 'Lab. Uzm. Ayşe Demir',
    notes: 'Açlık kan şekeri normal sınırlarda',
    sampleCollectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    sampleProcessedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    resultAvailableAt: new Date().toISOString(),
    verifiedAt: new Date().toISOString(),
    verifiedBy: 'Lab. Uzm. Ayşe Demir',
    insights: [
      {
        type: 'summary',
        content: 'Açlık kan şekeri normal aralıkta ve düşüş eğiliminde.',
        confidence: 0.92,
        sourceData: ['lab-history'],
        timestamp: new Date().toISOString(),
      },
      {
        type: 'alert',
        content: 'Son 6 ayda %15 düşüş gözlendi. Takip önerilir.',
        confidence: 0.89,
        sourceData: ['lab-history', 'clinical-guidelines'],
        timestamp: new Date().toISOString(),
      },
    ],
  },
];

const generateMockInsights = (): AIGeneratedInsight[] => [
  {
    type: 'summary',
    content: 'Genel sağlık durumu stabil seyrediyor. Vital bulgular normal aralıkta.',
    confidence: 0.92,
    sourceData: ['vitals', 'lab-results'],
    timestamp: new Date().toISOString(),
  },
  {
    type: 'recommendation',
    content: 'Günlük su tüketiminin artırılması önerilir. Mevcut tüketim hedefin altında.',
    confidence: 0.85,
    sourceData: ['activity-log', 'health-goals'],
    timestamp: new Date().toISOString(),
  },
];

export const generateMockHealthReport = (): HealthReportData => ({
  metadata: {
    generatedAt: new Date().toISOString(),
    reportId: `HR-${Date.now()}`,
    version: '1.0.0',
    language: 'tr',
    generatedBy: 'HomyOS Health Report Engine',
  },
  patientInfo: {
    id: 'P-12345',
    fullName: 'Ahmet Yılmaz',
    dateOfBirth: '1985-06-15',
    gender: 'male',
    height: 178,
    weight: 75,
    bloodType: 'A+',
    allergies: ['Penicillin'],
    chronicConditions: [],
  },
  vitals: {
    current: generateMockVitals(),
    history: Array(5)
      .fill(null)
      .map(() => generateMockVitals()),
    trends: [
      {
        metric: 'heartRate',
        trend: 'stable',
        significance: 'normal',
      },
    ],
  },
  labResults: {
    recent: generateMockLabResults(),
    historical: generateMockLabResults(),
    abnormalFindings: [],
  },
  insights: {
    summary: generateMockInsights(),
    recommendations: generateMockInsights(),
    alerts: [],
  },
  carePlan: {
    current: {
      id: 'CP-789',
      title: 'Genel Sağlık İyileştirme Planı',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
    },
    progress: {
      startDate: new Date().toISOString(),
      completedTasks: 8,
      totalTasks: 12,
      nextMilestone: 'Haftalık Kontrol',
    },
  },
  metrics: {
    healthScore: 85,
    complianceRate: 92,
    riskFactors: ['Sedentary Lifestyle'],
    improvements: ['Improved Sleep Pattern', 'Regular Exercise'],
  },
  exportOptions: {
    includeSections: ['patient-info', 'vitals', 'lab-results', 'insights', 'care-plan'],
    format: 'pdf',
    includeGraphs: true,
    includeTrends: true,
    includeRawData: false,
  },
});
