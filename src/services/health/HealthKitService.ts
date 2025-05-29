import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import type { VitalSigns, VitalStatus, VitalTrend, VitalInsight } from '../../types/vitals';
import { EventEmitter } from 'events';
import { DEFAULT_VITAL_RANGES } from '../../types/vitals';

const { HealthKitManager } = NativeModules;

export interface HealthKitPermission {
  type: string;
  read: boolean;
  write: boolean;
}

export interface HealthKitConfig {
  permissions: HealthKitPermission[];
  updateInterval: number; // milliseconds
}

export interface HealthKitReading {
  type: string;
  value: number;
  unit: string;
  timestamp: string;
  device?: {
    name: string;
    model: string;
    manufacturer: string;
  };
}

const DEFAULT_PERMISSIONS: HealthKitPermission[] = [
  { type: 'heartRate', read: true, write: false },
  { type: 'oxygenSaturation', read: true, write: false },
  { type: 'stepCount', read: true, write: false },
  { type: 'sleepAnalysis', read: true, write: false },
  { type: 'mindfulSession', read: true, write: false },
  { type: 'activeEnergyBurned', read: true, write: false },
];

export class HealthKitService extends EventEmitter {
  private static instance: HealthKitService;
  private initialized: boolean = false;
  private eventEmitter!: NativeEventEmitter;
  private eventSubscription: any;
  private lastReadings: Map<string, HealthKitReading> = new Map();
  private vitalTrends: Map<string, VitalTrend> = new Map();
  private insightHistory: VitalInsight[] = [];

  private constructor() {
    super();
    if (Platform.OS === 'ios') {
      this.eventEmitter = new NativeEventEmitter(HealthKitManager);
    }
  }

  public static getInstance(): HealthKitService {
    if (!HealthKitService.instance) {
      HealthKitService.instance = new HealthKitService();
    }
    return HealthKitService.instance;
  }

  public async initialize(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      return false;
    }

    try {
      const success = await HealthKitManager.initialize();
      this.initialized = success;
      return success;
    } catch (error) {
      console.error('Failed to initialize HealthKit:', error);
      return false;
    }
  }

  public async requestPermissions(): Promise<boolean> {
    if (!this.initialized || Platform.OS !== 'ios') {
      return false;
    }

    try {
      return await HealthKitManager.requestPermissions();
    } catch (error) {
      console.error('Failed to request HealthKit permissions:', error);
      return false;
    }
  }

  public async startMonitoring(): Promise<void> {
    if (!this.initialized) {
      throw new Error('HealthKit service not initialized');
    }

    if (Platform.OS !== 'ios') {
      throw new Error('HealthKit only available on iOS');
    }

    try {
      await HealthKitManager.startMonitoring();
      this.subscribeToUpdates();
    } catch (error) {
      console.error('Failed to start HealthKit monitoring:', error);
      throw error;
    }
  }

  public stopMonitoring(): void {
    if (Platform.OS === 'ios') {
      HealthKitManager.stopMonitoring();
      this.unsubscribeFromUpdates();
    }
  }

  private subscribeToUpdates(): void {
    if (this.eventSubscription) {
      this.unsubscribeFromUpdates();
    }

    this.eventSubscription = this.eventEmitter.addListener(
      'NewHealthKitData',
      this.handleHealthKitUpdate.bind(this)
    );
  }

  private unsubscribeFromUpdates(): void {
    if (this.eventSubscription) {
      this.eventSubscription.remove();
      this.eventSubscription = null;
    }
  }

  private handleHealthKitUpdate(event: { readings: HealthKitReading[] }): void {
    const { readings } = event;
    this.updateVitalSigns(readings);
  }

  private updateVitalSigns(readings: HealthKitReading[]): void {
    const vitals: Partial<VitalSigns> = {
      measurementType: 'automatic',
      reliability: 0.95,
      timestamp: new Date().toISOString(),
    };

    const insights: VitalInsight[] = [];

    readings.forEach((reading) => {
      // Store reading for trend analysis
      const lastReading = this.lastReadings.get(reading.type);
      this.lastReadings.set(reading.type, reading);

      switch (reading.type) {
        case 'heartRate': {
          vitals.heartRate = reading.value;
          vitals.heartRateStatus = this.getHeartRateStatus(reading.value);
          vitals.heartRateTrend = this.analyzeTrend('heartRate', reading, lastReading);

          // Generate heart rate insights
          if (vitals.heartRateStatus !== 'normal') {
            insights.push(this.generateHeartRateInsight(reading.value, vitals.heartRateTrend));
          }
          break;
        }
        case 'oxygenSaturation': {
          vitals.oxygenSaturation = reading.value;
          vitals.oxygenStatus = this.getOxygenSaturationStatus(reading.value);

          if (vitals.oxygenStatus !== 'normal') {
            insights.push(this.generateOxygenInsight(reading.value));
          }
          break;
        }
        case 'respiratoryRate': {
          vitals.respiratoryRate = reading.value;
          vitals.respiratoryStatus = this.getRespiratoryStatus(reading.value);
          break;
        }
      }
    });

    // Emit both vitals and insights
    this.emit('vitalsUpdate', { vitals, insights });

    // Store insights for pattern recognition
    this.insightHistory = [...this.insightHistory, ...insights].slice(-100);
  }

  private analyzeTrend(
    type: string,
    current: HealthKitReading,
    last?: HealthKitReading
  ): VitalTrend {
    if (!last) return 'stable';

    const range = DEFAULT_VITAL_RANGES[type];
    if (!range) return 'stable';

    const change = current.value - last.value;
    const percentChange = Math.abs(change / last.value);

    if (percentChange < 0.05) return 'stable';
    return change > 0 ? 'rising' : 'falling';
  }

  private generateHeartRateInsight(value: number, trend: VitalTrend): VitalInsight {
    const status = this.getHeartRateStatus(value);
    let description = '';
    let type: 'alert' | 'warning' | 'info' = 'info';
    let severity = 1;

    switch (status) {
      case 'critical':
        description = `Kalp atış hızı ${value} bpm. Bu değer kritik seviyede yüksek.`;
        type = 'alert';
        severity = 3;
        break;
      case 'high':
        description = `Kalp atış hızı ${value} bpm. Bu değer normalin üzerinde.`;
        type = 'warning';
        severity = 2;
        break;
      case 'low':
        description = `Kalp atış hızı ${value} bpm. Bu değer normalin altında.`;
        type = 'warning';
        severity = 2;
        break;
      default:
        description = `Kalp atış hızı ${value} bpm. Bu değer normal aralıkta.`;
        type = 'info';
        severity = 1;
    }

    return {
      timestamp: new Date().toISOString(),
      status,
      type,
      severity,
      trends: [trend],
      recommendations: this.getSuggestedActions('heartRate', value),
      confidence: 0.95,
      description,
      context: {
        relatedVitals: ['heartRate'],
        source: 'HealthKit',
      },
    };
  }

  private generateOxygenInsight(value: number): VitalInsight {
    const status = this.getOxygenSaturationStatus(value);
    let description = '';
    let type: 'alert' | 'warning' | 'info' = 'info';
    let severity = 1;

    switch (status) {
      case 'critical':
        description = `Oksijen satürasyonu %${value}. Bu değer kritik seviyede düşük.`;
        type = 'alert';
        severity = 3;
        break;
      case 'high':
        description = `Oksijen satürasyonu %${value}. Bu değer normalin üzerinde.`;
        type = 'warning';
        severity = 2;
        break;
      case 'low':
        description = `Oksijen satürasyonu %${value}. Bu değer normalin altında.`;
        type = 'warning';
        severity = 2;
        break;
      default:
        description = `Oksijen satürasyonu %${value}. Bu değer normal aralıkta.`;
        type = 'info';
        severity = 1;
    }

    return {
      timestamp: new Date().toISOString(),
      status,
      type,
      severity,
      trends: [],
      recommendations: this.getSuggestedActions('oxygenSaturation', value),
      confidence: 0.95,
      description,
      context: {
        relatedVitals: ['oxygenSaturation'],
        source: 'HealthKit',
      },
    };
  }

  private getSuggestedActions(vitalType: string, value: number): string[] {
    const range = DEFAULT_VITAL_RANGES[vitalType];
    if (!range) return [];

    const actions: string[] = [];

    switch (vitalType) {
      case 'heartRate':
        if (value < range.min) {
          actions.push('Take slow, deep breaths');
          actions.push('Find a quiet place to rest');
          actions.push('Consider checking stress levels');
        } else if (value > range.max) {
          actions.push('Practice calming breathing exercises');
          actions.push('Move to a cooler environment if possible');
          actions.push('Avoid sudden movements');
        }
        break;
      case 'oxygenSaturation':
        if (value < range.min) {
          actions.push('Practice deep breathing exercises');
          actions.push('Move to a well-ventilated area');
          actions.push('Maintain an upright posture');
        }
        break;
    }

    return actions;
  }

  private getRespiratoryStatus(rate: number): VitalStatus {
    const range = DEFAULT_VITAL_RANGES.respiratoryRate;
    if (rate < range.min) return 'low';
    if (rate > range.max) return 'high';
    return 'normal';
  }

  private getHeartRateStatus(heartRate: number): VitalStatus {
    if (heartRate < 60) return 'low';
    if (heartRate > 100) return 'high';
    return 'normal';
  }

  private getOxygenSaturationStatus(spO2: number): VitalStatus {
    if (spO2 < 95) return 'low';
    return 'normal';
  }

  public async getVitalSigns(): Promise<VitalSigns> {
    if (!this.initialized) {
      throw new Error('HealthKit service not initialized');
    }

    try {
      const readings = await HealthKitManager.fetchLatestReadings();
      const vitals: VitalSigns = {
        measurementType: 'automatic',
        reliability: 0.95,
        timestamp: new Date().toISOString(),
        heartRate: 0,
        heartRateStatus: 'normal',
        heartRateTrend: 'stable',
        oxygenSaturation: 0,
        oxygenStatus: 'normal',
      };

      readings.forEach((reading: HealthKitReading) => {
        switch (reading.type) {
          case 'heartRate':
            vitals.heartRate = reading.value;
            vitals.heartRateStatus = this.getHeartRateStatus(reading.value);
            vitals.heartRateTrend = 'stable';
            break;
          case 'oxygenSaturation':
            vitals.oxygenSaturation = reading.value;
            vitals.oxygenStatus = this.getOxygenSaturationStatus(reading.value);
            break;
        }
      });

      return vitals;
    } catch (error) {
      console.error('Failed to fetch vital signs from HealthKit:', error);
      throw error;
    }
  }
}
