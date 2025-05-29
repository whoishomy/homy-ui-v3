import { AgentContext, AgentOutput } from '../../types';
import type { VitalSigns, VitalStatus, VitalInsight, VitalRange } from '@/types/vitals';
import { fetchMemoryData, updateMemory } from '../../memory';
import { triggerPrompt } from '../../prompt-engine';
import { DEFAULT_VITAL_RANGES } from '@/types/vitals';

interface VitalSignsData {
  vitals: VitalSigns;
  insights: VitalInsight[];
}

export function analyzeVitals(vitals: VitalSigns): VitalInsight[] {
  const insights: VitalInsight[] = [];
  const timestamp = new Date().toISOString();

  // Heart Rate Analysis
  if (vitals.heartRateStatus === 'critical') {
    insights.push({
      timestamp,
      status: 'critical',
      type: 'alert',
      severity: 1,
      trends: ['rising'],
      recommendations: ['Immediate medical attention required'],
      description: `Critical heart rate detected: ${vitals.heartRate} BPM`,
      suggestedActions: ['Contact emergency services', 'Prepare crash cart'],
    });
  } else if (vitals.heartRateStatus === 'high' || vitals.heartRateStatus === 'low') {
    insights.push({
      timestamp,
      status: vitals.heartRateStatus,
      type: 'warning',
      severity: 0.7,
      trends: ['rising'],
      recommendations: ['Monitor closely'],
      description: `Abnormal heart rate: ${vitals.heartRate} BPM`,
      suggestedActions: ['Notify attending physician', 'Increase monitoring frequency'],
    });
  }

  // Blood Pressure Analysis
  if (
    vitals.bpStatus === 'critical' &&
    typeof vitals.systolicBP === 'number' &&
    typeof vitals.diastolicBP === 'number'
  ) {
    insights.push({
      timestamp,
      status: 'critical',
      type: 'alert',
      severity: 1,
      trends: ['rising'],
      recommendations: ['Immediate intervention required'],
      description: `Critical blood pressure: ${vitals.systolicBP}/${vitals.diastolicBP} mmHg`,
      suggestedActions: ['Administer prescribed medication', 'Contact specialist'],
    });
  } else if (
    (vitals.bpStatus === 'high' || vitals.bpStatus === 'low') &&
    typeof vitals.systolicBP === 'number' &&
    typeof vitals.diastolicBP === 'number'
  ) {
    insights.push({
      timestamp,
      status: vitals.bpStatus,
      type: 'warning',
      severity: 0.7,
      trends: ['rising'],
      recommendations: ['Monitor closely'],
      description: `Abnormal blood pressure: ${vitals.systolicBP}/${vitals.diastolicBP} mmHg`,
      suggestedActions: ['Check medication compliance', 'Schedule follow-up'],
    });
  }

  // Temperature Analysis
  if (vitals.temperatureStatus === 'critical' && typeof vitals.temperature === 'number') {
    insights.push({
      timestamp,
      status: 'critical',
      type: 'alert',
      severity: 1,
      trends: ['rising'],
      recommendations: ['Immediate cooling/warming measures'],
      description: `Critical temperature: ${vitals.temperature}°C`,
      suggestedActions: ['Apply temperature management protocol', 'Investigate cause'],
    });
  } else if (
    (vitals.temperatureStatus === 'high' || vitals.temperatureStatus === 'low') &&
    typeof vitals.temperature === 'number'
  ) {
    insights.push({
      timestamp,
      status: vitals.temperatureStatus,
      type: 'warning',
      severity: 0.7,
      trends: ['rising'],
      recommendations: ['Monitor closely'],
      description: `Abnormal temperature: ${vitals.temperature}°C`,
      suggestedActions: ['Adjust environmental controls', 'Check for infection'],
    });
  }

  // Respiratory Rate Analysis
  if (vitals.respiratoryStatus === 'critical' && typeof vitals.respiratoryRate === 'number') {
    insights.push({
      timestamp,
      status: 'critical',
      type: 'alert',
      severity: 1,
      trends: ['rising'],
      recommendations: ['Immediate respiratory support'],
      description: `Critical respiratory rate: ${vitals.respiratoryRate} breaths/min`,
      suggestedActions: ['Prepare for intubation', 'Start oxygen therapy'],
    });
  } else if (
    (vitals.respiratoryStatus === 'high' || vitals.respiratoryStatus === 'low') &&
    typeof vitals.respiratoryRate === 'number'
  ) {
    insights.push({
      timestamp,
      status: vitals.respiratoryStatus,
      type: 'warning',
      severity: 0.7,
      trends: ['rising'],
      recommendations: ['Monitor closely'],
      description: `Abnormal respiratory rate: ${vitals.respiratoryRate} breaths/min`,
      suggestedActions: ['Assess breathing pattern', 'Check oxygen saturation'],
    });
  }

  // Combined Analysis for Multiple Issues
  if (insights.length > 1) {
    insights.push({
      timestamp,
      status: 'critical',
      type: 'alert',
      severity: 1,
      trends: ['rising'],
      recommendations: ['Urgent medical review required'],
      description: 'Multiple vital sign abnormalities detected',
      suggestedActions: ['Activate rapid response team', 'Prepare for possible transfer'],
    });
  }

  return insights;
}

export function generateSampleVitals(): VitalSigns {
  return {
    measurementType: 'automatic',
    reliability: 0.95,
    timestamp: new Date().toISOString(),
    heartRate: 75,
    heartRateStatus: 'normal',
    heartRateTrend: 'stable',
    systolicBP: 120,
    diastolicBP: 80,
    bpStatus: 'normal',
    temperature: 36.8,
    temperatureStatus: 'normal',
    oxygenSaturation: 98,
    oxygenStatus: 'normal',
    respiratoryRate: 16,
    respiratoryStatus: 'normal',
    painLevel: 0,
    consciousness: 'alert',
  };
}

export function determineVitalStatus(value: number, range: VitalRange): VitalStatus {
  const percentDeviation = Math.abs(
    (value - (range.max + range.min) / 2) / ((range.max - range.min) / 2)
  );

  if (percentDeviation >= range.criticalThreshold) {
    return 'critical';
  } else if (percentDeviation >= range.warningThreshold) {
    return value > range.max ? 'high' : 'low';
  }
  return 'normal';
}

export function updateVitalStatuses(vitals: VitalSigns): void {
  // Heart rate is required
  vitals.heartRateStatus = determineVitalStatus(vitals.heartRate, DEFAULT_VITAL_RANGES.heartRate);

  // Optional vitals
  if (typeof vitals.systolicBP === 'number') {
    vitals.bpStatus = determineVitalStatus(vitals.systolicBP, DEFAULT_VITAL_RANGES.systolicBP);
  }

  if (typeof vitals.temperature === 'number') {
    vitals.temperatureStatus = determineVitalStatus(
      vitals.temperature,
      DEFAULT_VITAL_RANGES.temperature
    );
  }

  if (typeof vitals.respiratoryRate === 'number') {
    vitals.respiratoryStatus = determineVitalStatus(
      vitals.respiratoryRate,
      DEFAULT_VITAL_RANGES.respiratoryRate
    );
  }
}

const processVitalSigns = (vitals: VitalSigns): VitalSigns => {
  // Determine status for each vital sign if value exists
  if (typeof vitals.heartRate === 'number') {
    vitals.heartRateStatus = determineVitalStatus(vitals.heartRate, DEFAULT_VITAL_RANGES.heartRate);
  }
  if (typeof vitals.systolicBP === 'number') {
    vitals.bpStatus = determineVitalStatus(vitals.systolicBP, DEFAULT_VITAL_RANGES.systolicBP);
  }
  if (typeof vitals.temperature === 'number') {
    vitals.temperatureStatus = determineVitalStatus(
      vitals.temperature,
      DEFAULT_VITAL_RANGES.temperature
    );
  }
  if (typeof vitals.respiratoryRate === 'number') {
    vitals.respiratoryStatus = determineVitalStatus(
      vitals.respiratoryRate,
      DEFAULT_VITAL_RANGES.respiratoryRate
    );
  }

  return vitals;
};

export const vitalSignsMonitorAgent = async (context: AgentContext): Promise<AgentOutput> => {
  try {
    // In a real implementation, fetch vital signs from an API
    let vitals = generateSampleVitals();

    // Process vital signs
    vitals = processVitalSigns(vitals);

    // Generate insights
    const insights = analyzeVitals(vitals);

    // Store in memory
    await updateMemory({
      key: `${context.name}-latest`,
      value: {
        vitals,
        insights,
      },
      metadata: {
        timestamp: vitals.timestamp,
        agent: context.name,
      },
    });

    // If critical insights found, trigger the clinical-alert-promptpack
    if (insights.some((i) => i.severity === 1)) {
      await triggerPrompt('clinical-alert', {
        vitals,
        insights,
        context,
      });
    }

    return {
      success: true,
      data: {
        vitals,
        insights,
      },
    };
  } catch (error) {
    console.error('Vital signs monitoring error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
