export interface LabResult {
  id: string;
  patientId: string;
  testName: string;
  resultValue?: number;
  resultText?: string;
  referenceRange: string;
  unit: string;
  status: 'normal' | 'high' | 'low' | 'critical' | 'pending';
  testDate: string;
  reportedDate: string;
  doctorId?: string;
  insightComment?: string;
  aiConfidenceScore?: number;
}

export interface LabInsight {
  id: string;
  labResultId: string;
  insightType: 'trend' | 'anomaly' | 'recommendation';
  message: string;
  severity: 'info' | 'warning' | 'critical';
  confidence: number;
  generatedAt: string;
}

export interface PDFExportOptions {
  resultIds: string[];
  includeInsights: boolean;
  includeCharts: boolean;
  patientInfo: boolean;
  format: 'A4' | 'Letter';
  language: 'tr' | 'en';
}

export interface LabResultFilters {
  startDate?: string;
  endDate?: string;
  testTypes?: string[];
  status?: LabResult['status'][];
  searchTerm?: string;
}
