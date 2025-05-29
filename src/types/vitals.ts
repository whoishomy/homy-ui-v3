export type VitalStatus = 'low' | 'normal' | 'high' | 'critical';
export type VitalTrend = 'rising' | 'falling' | 'stable';

export interface VitalSigns {
  measurementType: 'manual' | 'automatic';
  reliability: number;
  timestamp: string;
  
  // Heart rate
  heartRate: number;
  heartRateStatus: VitalStatus;
  heartRateTrend?: VitalTrend;
  
  // Blood pressure
  systolicBP?: number;
  diastolicBP?: number;
  bpStatus?: VitalStatus;
  bpTrend?: VitalTrend;
  
  // Temperature
  temperature?: number;
  temperatureStatus?: VitalStatus;
  
  // Oxygen saturation
  oxygenSaturation: number;
  oxygenStatus: VitalStatus;
  
  // Respiratory rate
  respiratoryRate?: number;
  respiratoryStatus?: VitalStatus;
  respiratoryTrend?: VitalTrend;
  
  // Additional metrics
  painLevel?: number;
  consciousness?: 'alert' | 'verbal' | 'pain' | 'unresponsive';
}

export interface VitalRange {
  min: number;
  max: number;
  warningThreshold: number;
  criticalThreshold: number;
}

export interface VitalInsight {
  timestamp: string;
  status: VitalStatus;
  type: 'alert' | 'warning' | 'info';
  severity: number;
  trends: VitalTrend[];
  recommendations: string[];
  confidence?: number;
  context?: Record<string, any>;
  description: string;
  suggestedActions?: string[];
}

export interface VitalTrendAnalysis {
  vitalSign: keyof VitalSigns;
  period: {
    start: string;
    end: string;
  };
  trend: VitalTrend;
  significance: number; // 0-1 scale
  anomalies?: Array<{
    timestamp: string;
    value: number;
    type: 'spike' | 'drop' | 'sustained';
  }>;
}

export const DEFAULT_VITAL_RANGES: Record<string, VitalRange> = {
  heartRate: {
    min: 60,
    max: 100,
    warningThreshold: 0.2, // 20% deviation
    criticalThreshold: 0.4, // 40% deviation
  },
  systolicBP: {
    min: 90,
    max: 140,
    warningThreshold: 0.15,
    criticalThreshold: 0.3,
  },
  diastolicBP: {
    min: 60,
    max: 90,
    warningThreshold: 0.15,
    criticalThreshold: 0.3,
  },
  temperature: {
    min: 36.1,
    max: 37.2,
    warningThreshold: 0.05,
    criticalThreshold: 0.1,
  },
  respiratoryRate: {
    min: 12,
    max: 20,
    warningThreshold: 0.25,
    criticalThreshold: 0.5,
  },
  oxygenSaturation: {
    min: 95,
    max: 100,
    warningThreshold: 0.05, // 5% drop
    criticalThreshold: 0.1, // 10% drop
  },
} as const;
