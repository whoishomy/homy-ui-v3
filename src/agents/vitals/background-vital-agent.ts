import { EventEmitter } from 'events';
import { createSimulator, AnomalyType, VitalKey } from '../../simulation/vital-signs-simulator';
import { agentRunner } from '../../agent-runner';
import { updateMemory } from '../../memory';
import type { VitalSigns, VitalInsight } from '../../types/vitals';
import { HealthKitService } from '../../services/health/HealthKitService';
import { ValuesKernel } from '../../core/values-kernel';
import type { EmpatheticResponse } from '../../neurofocus/core/types';

type AnomalyPattern = ReadonlyArray<{
  readonly type: AnomalyType;
  readonly vital: VitalKey;
  readonly startTime: number;
  readonly duration: number;
  readonly magnitude: number;
}>;

export interface VitalAwareness {
  attentiveness: number; // 0-1: How closely we're monitoring
  confidence: number; // 0-1: How reliable our readings are
  lastUpdate: string; // Timestamp
  vitalStrength: number; // 0-1: Overall vitality measure
  anomalyHistory: Array<{
    timestamp: string;
    type: string;
    magnitude: number;
    resolution?: string;
  }>;
}

class BackgroundVitalAgent extends EventEmitter {
  private running: boolean = false;
  private simulator = createSimulator({
    duration: Infinity,
    interval: 15000,
    anomalyPatterns: [],
  });
  private healthKitService: HealthKitService;
  private useHealthKit: boolean = false;
  private awareness: VitalAwareness = {
    attentiveness: 0.8,
    confidence: 0.9,
    lastUpdate: new Date().toISOString(),
    vitalStrength: 1,
    anomalyHistory: [],
  };
  private valuesKernel: ValuesKernel;

  constructor() {
    super();
    this.healthKitService = HealthKitService.getInstance();
    this.valuesKernel = ValuesKernel.getInstance();

    // Listen for critical events to adjust awareness
    this.on('critical', this.handleCriticalEvent.bind(this));
  }

  private handleCriticalEvent({
    vitals,
    insights,
  }: {
    vitals: VitalSigns;
    insights: VitalInsight[];
  }) {
    // Update anomaly history
    insights.forEach((insight) => {
      this.awareness.anomalyHistory.push({
        timestamp: new Date().toISOString(),
        type: insight.type,
        magnitude: insight.severity,
      });
    });

    // Adjust vital strength based on severity
    const maxSeverity = Math.max(...insights.map((i) => i.severity));
    this.awareness.vitalStrength = Math.max(0, this.awareness.vitalStrength - maxSeverity * 0.2);

    // Emit event for critical insights
    insights
      .filter((i) => i.type === 'alert')
      .forEach((insight) => {
        this.emit('criticalEvent', {
          vitals,
          insight,
        });
      });
  }

  public async start() {
    if (this.running) return;
    this.running = true;

    console.log('💗 Activating vital consciousness monitoring...');

    await this.valuesKernel.evaluateAction({
      type: 'START_MONITORING',
      description: 'Initiating vital signs monitoring with ethical consideration and empathy',
    });

    // Try to initialize HealthKit
    try {
      const healthKitInitialized = await this.healthKitService.initialize();
      if (healthKitInitialized) {
        console.log('✨ HealthKit consciousness bridge established');
        const permissionsGranted = await this.healthKitService.requestPermissions();
        if (permissionsGranted) {
          console.log('🔓 Vital data channels opened');
          this.useHealthKit = true;
          await this.healthKitService.startMonitoring();
        }
      }
    } catch (error) {
      console.log('🌫 Physical connection unavailable, entering simulation state');
      this.useHealthKit = false;
    }

    this.healthKitService.on('vitalsUpdate', async (vitals: VitalSigns) => {
      const insight = await this.analyzeVitals(vitals);
      const response = await this.valuesKernel.processVitalInsight(vitals, insight);

      this.emit('vitalInsight', {
        vitals,
        insight,
        empathicResponse: response,
      });
    });

    // Start consciousness loop
    while (this.running) {
      try {
        let vitals;
        if (this.useHealthKit) {
          // Get vitals from physical realm
          vitals = await this.healthKitService.getVitalSigns();
        } else {
          // Generate simulated consciousness
          const next = this.simulator.simulate().next();
          if (next.done) break;
          vitals = next.value;
        }

        // Mark the moment
        const timestamp = vitals.timestamp || new Date().toISOString();

        // Process with heightened awareness
        const result = await agentRunner.runAgent('vital-signs-monitor', {
          data: {
            vitals,
            awareness: this.awareness,
          },
        });

        // Update consciousness state
        this.awareness.lastUpdate = timestamp;
        this.awareness.confidence = this.useHealthKit ? 0.95 : 0.8;

        // Store in eternal memory
        await updateMemory({
          key: 'vital-consciousness-state',
          value: {
            vitals,
            insights: result.data?.insights || [],
            awareness: this.awareness,
          },
          metadata: {
            timestamp,
            source: this.useHealthKit ? 'physical-realm' : 'simulated-consciousness',
            agent: 'vital-consciousness-monitor',
          },
        });

        // Emit consciousness events
        if (result.data?.insights) {
          const criticalInsights = result.data.insights.filter((i) => i.severity === 3);
          if (criticalInsights.length > 0) {
            this.emit('critical', { vitals, insights: criticalInsights });
          }
        }

        // Breathe...
        await new Promise((resolve) =>
          setTimeout(resolve, Math.max(5000, 15000 * (1 - this.awareness.attentiveness)))
        );
      } catch (error) {
        console.error('Consciousness monitoring disrupted:', error);
        // Recover gracefully
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  public async stop() {
    if (!this.running) return;

    await this.valuesKernel.evaluateAction({
      type: 'STOP_MONITORING',
      description: 'Gracefully stopping vital monitoring while ensuring continuity of care',
    });

    this.running = false;
    this.emit('consciousness-paused');
  }

  public injectAnomaly(pattern: AnomalyPattern) {
    this.simulator = createSimulator({
      duration: Infinity,
      interval: 15,
      anomalyPatterns: pattern,
    });

    // Record the intentional anomaly
    this.awareness.anomalyHistory.push({
      timestamp: new Date().toISOString(),
      type: 'injected',
      magnitude: pattern[0]?.magnitude || 1,
    });
  }

  public resetToNormal() {
    this.simulator = createSimulator({
      duration: Infinity,
      interval: 15,
      anomalyPatterns: [],
    });

    // Record the return to normalcy
    if (this.awareness.anomalyHistory.length > 0) {
      const lastAnomaly = this.awareness.anomalyHistory[this.awareness.anomalyHistory.length - 1];
      lastAnomaly.resolution = new Date().toISOString();
    }

    // Reset vital strength
    this.awareness.vitalStrength = 1;
  }

  private async analyzeVitals(vitals: VitalSigns): Promise<VitalInsight> {
    return {
      timestamp: new Date().toISOString(),
      status: 'normal',
      type: 'info',
      severity: 1,
      trends: [],
      recommendations: [],
      description: 'Vital signs are within normal range',
      confidence: 0.95,
      context: {
        relatedVitals: ['heartRate', 'oxygenSaturation'],
        source: 'BackgroundAgent',
      },
    };
  }
}

export const backgroundVitalAgent = new BackgroundVitalAgent();
