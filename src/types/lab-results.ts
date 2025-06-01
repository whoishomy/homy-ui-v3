import { VitalStatus } from './vitals';

export interface LabResult {
  id: string;
  testName: string;
  title: string;
  category: 'blood' | 'urine' | 'imaging' | 'cardiology' | 'other';
  status: VitalStatus;
  value: number;
  unit: string;
  referenceRange?: {
    min: number;
    max: number;
    unit: string;
  };
  timestamp: string;
  orderedBy: string;
  performedBy: string;
  specimenType?: string;
  collectionDate?: string;
  reportDate?: string;
  notes?: string;
  data: Array<{
    date: string;
    value: number;
  }>;
  trend?: 'up' | 'down' | 'stable';
  clinicalContext?: {
    significance?: string;
    relatedTests?: string[];
    doctorNotes?: string;
  };
  recommendations?: string[];
  insights?: Array<{
    type: 'observation' | 'recommendation' | 'warning';
    content: string;
    message: string;
    confidence: number;
    source: string;
    timestamp: string;
  }>;
}

export interface LabResultHistory {
  value: number;
  timestamp: string;
  status: VitalStatus;
}

export interface LabResultTrend {
  type: 'increasing' | 'decreasing' | 'stable';
  magnitude: number;
  period: string;
  significance: 'normal' | 'concerning' | 'critical';
}

export interface AIGeneratedInsight {
  type: 'observation' | 'recommendation' | 'warning';
  content: string;
  confidence: number;
  source: string;
  timestamp: string;
}
