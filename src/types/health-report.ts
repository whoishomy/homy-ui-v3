import { HealthMetric } from './healthMetric';
import { LabResult } from './lab-results';
import { CarePlan } from './health-report/carePlan';
import { InsightData } from './insight';

export type HealthReportSection =
  | 'patient-info'
  | 'vitals'
  | 'lab-results'
  | 'insights'
  | 'care-plan';

export interface PatientInfo {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  height?: number; // cm
  weight?: number; // kg
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies?: string[];
  chronicConditions?: string[];
}

export interface VitalStats {
  timestamp: string;
  heartRate?: number; // bpm
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  bodyTemperature?: number; // celsius
  oxygenSaturation?: number; // percentage
  respiratoryRate?: number; // breaths per minute
  glucoseLevel?: number; // mg/dL
}

export interface HealthReportMetadata {
  generatedAt: string;
  reportId: string;
  version: string;
  language: 'tr' | 'en';
  generatedBy: string;
  validUntil?: string;
  signature?: string;
}

export interface AIGeneratedInsight {
  type: 'summary' | 'recommendation' | 'alert' | 'trend';
  content: string;
  confidence: number;
  sourceData: string[];
  timestamp: string;
}

export interface HealthReportData {
  metadata: HealthReportMetadata;
  patientInfo: PatientInfo;
  vitals: {
    current: VitalStats;
    history: VitalStats[];
    trends?: {
      metric: keyof VitalStats;
      trend: 'increasing' | 'decreasing' | 'stable';
      significance: 'normal' | 'warning' | 'critical';
    }[];
  };
  labResults: {
    recent: LabResult[];
    historical: LabResult[];
    abnormalFindings?: string[];
  };
  insights: {
    summary: AIGeneratedInsight[];
    recommendations: AIGeneratedInsight[];
    alerts: AIGeneratedInsight[];
  };
  carePlan: {
    current: CarePlan;
    progress: {
      startDate: string;
      completedTasks: number;
      totalTasks: number;
      nextMilestone?: string;
    };
  };
  metrics: {
    healthScore: number; // 0-100
    complianceRate: number; // 0-100
    riskFactors: string[];
    improvements: string[];
  };
  exportOptions: {
    includeSections: HealthReportSection[];
    format: 'pdf' | 'markdown' | 'csv';
    includeGraphs: boolean;
    includeTrends: boolean;
    includeRawData: boolean;
  };
}

export interface HealthReportTemplate {
  sections: HealthReportSection[];
  styles: {
    fonts: {
      primary: string;
      secondary: string;
    };
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      warning: string;
      error: string;
      success: string;
    };
    spacing: {
      unit: number; // in points for PDF
    };
  };
  layout: {
    pageSize: 'A4' | 'Letter';
    orientation: 'portrait' | 'landscape';
    margins: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
}
