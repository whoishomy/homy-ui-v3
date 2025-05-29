import { VitalStatus, DEFAULT_VITAL_RANGES } from '../types/vitals';

export type AnomalyType = 'spike' | 'gradual-decline' | 'compensatory-response' | 'recovery';
export type VitalKey = keyof typeof DEFAULT_VITAL_RANGES;

export interface SimulationConfig {
  duration: number; // Duration in seconds
  interval: number; // Update interval in seconds
  anomalyPatterns: ReadonlyArray<{
    readonly type: AnomalyType;
    readonly vital: VitalKey;
    readonly startTime: number;
    readonly duration: number;
    readonly magnitude: number;
  }>;
  baselineVitals?: {
    heartRate?: number;
    systolicBP?: number;
    diastolicBP?: number;
    temperature?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
  };
}

// Helper function to determine vital sign status
export function determineStatus(value: number, range: typeof DEFAULT_VITAL_RANGES[VitalKey]): VitalStatus {
  if (value < range.min * 0.8 || value > range.max * 1.2) {
    return 'critical';
  } else if (value < range.min || value > range.max) {
    return value < range.min ? 'low' : 'high';
  }
  return 'normal';
}

interface VitalValues {
  [key: string]: number;
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
}

// Generate vital signs for current timestamp
function generateVitals(timestamp: number, config: SimulationConfig) {
  const baseVitals: VitalValues = {
    heartRate: config.baselineVitals?.heartRate || DEFAULT_VITAL_RANGES.heartRate.min + (DEFAULT_VITAL_RANGES.heartRate.max - DEFAULT_VITAL_RANGES.heartRate.min) * 0.5,
    systolicBP: config.baselineVitals?.systolicBP || DEFAULT_VITAL_RANGES.systolicBP.min + (DEFAULT_VITAL_RANGES.systolicBP.max - DEFAULT_VITAL_RANGES.systolicBP.min) * 0.5,
    diastolicBP: config.baselineVitals?.diastolicBP || DEFAULT_VITAL_RANGES.diastolicBP.min + (DEFAULT_VITAL_RANGES.diastolicBP.max - DEFAULT_VITAL_RANGES.diastolicBP.min) * 0.5,
    temperature: config.baselineVitals?.temperature || DEFAULT_VITAL_RANGES.temperature.min + (DEFAULT_VITAL_RANGES.temperature.max - DEFAULT_VITAL_RANGES.temperature.min) * 0.5,
    respiratoryRate: config.baselineVitals?.respiratoryRate || DEFAULT_VITAL_RANGES.respiratoryRate.min + (DEFAULT_VITAL_RANGES.respiratoryRate.max - DEFAULT_VITAL_RANGES.respiratoryRate.min) * 0.5,
    oxygenSaturation: config.baselineVitals?.oxygenSaturation || DEFAULT_VITAL_RANGES.oxygenSaturation.min + (DEFAULT_VITAL_RANGES.oxygenSaturation.max - DEFAULT_VITAL_RANGES.oxygenSaturation.min) * 0.5,
  };

  // Apply anomalies
  const vitals = { ...baseVitals };
  for (const pattern of config.anomalyPatterns) {
    if (timestamp >= pattern.startTime && timestamp <= pattern.startTime + pattern.duration) {
      const progress = (timestamp - pattern.startTime) / pattern.duration;
      const baseValue = baseVitals[pattern.vital];
      
      switch (pattern.type) {
        case 'gradual-decline':
          vitals[pattern.vital] = baseValue * (1 - progress * pattern.magnitude);
          break;
        case 'spike':
          vitals[pattern.vital] = baseValue * (1 + Math.sin(progress * Math.PI) * pattern.magnitude);
          break;
        case 'compensatory-response':
          vitals[pattern.vital] = baseValue * (1 + progress * pattern.magnitude);
          break;
        case 'recovery':
          vitals[pattern.vital] = baseValue * (1 - pattern.magnitude + progress * pattern.magnitude);
          break;
      }
    }
  }

  // Calculate status for each vital
  return {
    timestamp: new Date(timestamp * 1000).toISOString(),
    heartRate: Math.round(vitals.heartRate),
    heartRateStatus: determineStatus(vitals.heartRate, DEFAULT_VITAL_RANGES.heartRate),
    systolicBP: Math.round(vitals.systolicBP),
    diastolicBP: Math.round(vitals.diastolicBP),
    bpStatus: determineStatus(vitals.systolicBP, DEFAULT_VITAL_RANGES.systolicBP),
    temperature: Number(vitals.temperature.toFixed(1)),
    temperatureStatus: determineStatus(vitals.temperature, DEFAULT_VITAL_RANGES.temperature),
    respiratoryRate: Math.round(vitals.respiratoryRate),
    respiratoryStatus: determineStatus(vitals.respiratoryRate, DEFAULT_VITAL_RANGES.respiratoryRate),
    oxygenSaturation: Math.round(vitals.oxygenSaturation),
    oxygenStatus: determineStatus(vitals.oxygenSaturation, DEFAULT_VITAL_RANGES.oxygenSaturation),
  };
}

// Create simulator instance
export function createSimulator(config: SimulationConfig) {
  let currentTime = 0;
  const endTime = config.duration;

  function* simulate() {
    while (currentTime <= endTime) {
      yield generateVitals(currentTime, config);
      currentTime += config.interval;
    }
  }

  return {
    simulate,
  };
}

export const SAMPLE_ANOMALY_PATTERNS = {
  SEPSIS_PATTERN: [
    {
      type: 'gradual-decline' as AnomalyType,
      vital: 'oxygenSaturation',
      startTime: 0,
      duration: 30,
      magnitude: -0.15,
    },
    {
      type: 'compensatory-response' as AnomalyType,
      vital: 'heartRate',
      startTime: 15,
      duration: 45,
      magnitude: 0.2,
    },
  ],
  MARS_OXYGEN_CRISIS: [
    {
      type: 'gradual-decline' as AnomalyType,
      vital: 'oxygenSaturation',
      startTime: 0,
      duration: 30,
      magnitude: 0.15,
    },
    {
      type: 'compensatory-response' as AnomalyType,
      vital: 'heartRate',
      startTime: 15,
      duration: 45,
      magnitude: 0.2,
    },
    {
      type: 'compensatory-response' as AnomalyType,
      vital: 'respiratoryRate',
      startTime: 20,
      duration: 40,
      magnitude: 0.3,
    },
    {
      type: 'recovery' as AnomalyType,
      vital: 'oxygenSaturation',
      startTime: 60,
      duration: 30,
      magnitude: 0.15,
    },
  ],
  CARDIAC_EVENT: [
    {
      type: 'spike' as AnomalyType,
      vital: 'heartRate',
      startTime: 0,
      duration: 15,
      magnitude: 0.5,
    },
    {
      type: 'gradual-decline' as AnomalyType,
      vital: 'systolicBP',
      startTime: 5,
      duration: 20,
      magnitude: -0.3,
    }
  ]
} as const;
