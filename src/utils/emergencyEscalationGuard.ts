import type { LabResult } from '../components/dashboard/LabResultsPanel';
import type { HealthTask } from './healthTaskValidator';
import { HealthTaskValidator } from './healthTaskValidator';
import { AuditReadyKit } from './auditReadyKit';

interface EscalationTrigger {
  id: string;
  type: 'lab_result' | 'vital_sign' | 'symptom' | 'medication';
  severity: 'critical' | 'urgent' | 'warning';
  condition: {
    metric: string;
    threshold: number;
    operator: '>' | '<' | '==' | '>=' | '<=';
    unit?: string;
    timeWindow?: {
      duration: number;
      unit: 'minutes' | 'hours' | 'days';
    };
  };
  escalationPath: Array<{
    level: number;
    responders: string[];
    timeToRespond: number; // minutes
    actions: string[];
    fallback?: string[];
  }>;
}

interface EmergencyProtocol {
  id: string;
  name: string;
  description: string;
  triggers: EscalationTrigger[];
  immediateActions: string[];
  notificationTargets: Array<{
    role: string;
    channel: 'sms' | 'email' | 'push' | 'call';
    priority: number;
  }>;
  documentation: {
    required: string[];
    templates?: Record<string, string>;
  };
}

interface EscalationEvent {
  id: string;
  triggerId: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved' | 'false_alarm';
  patient: {
    id: string;
    condition: string;
    vitals?: Record<string, number>;
  };
  escalationPath: {
    currentLevel: number;
    responseTime: number;
    responders: Array<{
      role: string;
      status: 'notified' | 'responded' | 'unavailable';
      timestamp: string;
    }>;
  };
  audit: {
    createdAt: string;
    updatedAt: string;
    actions: Array<{
      timestamp: string;
      action: string;
      actor: string;
      details?: Record<string, any>;
    }>;
  };
}

export class EmergencyEscalationGuard {
  private static instance: EmergencyEscalationGuard;
  private protocols: EmergencyProtocol[];
  private activeEscalations: Map<string, EscalationEvent>;
  private taskValidator: HealthTaskValidator;
  private auditKit: AuditReadyKit;

  private constructor() {
    this.protocols = this.initializeProtocols();
    this.activeEscalations = new Map();
    this.taskValidator = HealthTaskValidator.getInstance();
    this.auditKit = AuditReadyKit.getInstance();
  }

  static getInstance(): EmergencyEscalationGuard {
    if (!EmergencyEscalationGuard.instance) {
      EmergencyEscalationGuard.instance = new EmergencyEscalationGuard();
    }
    return EmergencyEscalationGuard.instance;
  }

  private initializeProtocols(): EmergencyProtocol[] {
    return [
      {
        id: 'CRITICAL_GLUCOSE',
        name: 'Critical Glucose Level Protocol',
        description: 'Emergency protocol for dangerous blood glucose levels',
        triggers: [
          {
            id: 'HIGH_GLUCOSE',
            type: 'lab_result',
            severity: 'critical',
            condition: {
              metric: 'glucose',
              threshold: 400,
              operator: '>',
              unit: 'mg/dL',
              timeWindow: {
                duration: 1,
                unit: 'hours',
              },
            },
            escalationPath: [
              {
                level: 1,
                responders: ['primary_nurse', 'floor_supervisor'],
                timeToRespond: 5,
                actions: ['assess_patient', 'check_vitals', 'prepare_insulin'],
              },
              {
                level: 2,
                responders: ['endocrinologist', 'emergency_physician'],
                timeToRespond: 10,
                actions: ['review_case', 'adjust_treatment', 'monitor_closely'],
              },
            ],
          },
        ],
        immediateActions: [
          'verify_reading',
          'check_ketones',
          'prepare_emergency_insulin',
          'monitor_vitals',
        ],
        notificationTargets: [
          {
            role: 'primary_nurse',
            channel: 'push',
            priority: 1,
          },
          {
            role: 'endocrinologist',
            channel: 'sms',
            priority: 2,
          },
        ],
        documentation: {
          required: ['incident_report', 'treatment_log', 'patient_status'],
          templates: {
            incident_report: 'CRITICAL_GLUCOSE_INCIDENT_TEMPLATE',
            treatment_log: 'GLUCOSE_TREATMENT_LOG_TEMPLATE',
          },
        },
      },
    ];
  }

  async evaluateLabResult(result: LabResult, patientId: string): Promise<void> {
    const relevantProtocols = this.findRelevantProtocols(result);

    for (const protocol of relevantProtocols) {
      for (const trigger of protocol.triggers) {
        if (this.isTriggerActivated(result, trigger)) {
          await this.initiateEscalation(protocol, trigger, result, patientId);
        }
      }
    }
  }

  private findRelevantProtocols(result: LabResult): EmergencyProtocol[] {
    return this.protocols.filter((protocol) =>
      protocol.triggers.some(
        (trigger) =>
          trigger.type === 'lab_result' &&
          trigger.condition.metric.toLowerCase() === result.title.toLowerCase()
      )
    );
  }

  private isTriggerActivated(result: LabResult, trigger: EscalationTrigger): boolean {
    const latestValue = result.data[result.data.length - 1].value;

    switch (trigger.condition.operator) {
      case '>':
        return latestValue > trigger.condition.threshold;
      case '<':
        return latestValue < trigger.condition.threshold;
      case '>=':
        return latestValue >= trigger.condition.threshold;
      case '<=':
        return latestValue <= trigger.condition.threshold;
      case '==':
        return latestValue === trigger.condition.threshold;
      default:
        return false;
    }
  }

  private async initiateEscalation(
    protocol: EmergencyProtocol,
    trigger: EscalationTrigger,
    result: LabResult,
    patientId: string
  ): Promise<void> {
    const escalationId = `${trigger.id}_${patientId}_${Date.now()}`;

    const escalationEvent: EscalationEvent = {
      id: escalationId,
      triggerId: trigger.id,
      timestamp: new Date().toISOString(),
      status: 'active',
      patient: {
        id: patientId,
        condition: result.title,
        vitals: {
          [result.title]: result.data[result.data.length - 1].value,
        },
      },
      escalationPath: {
        currentLevel: 1,
        responseTime: 0,
        responders: [],
      },
      audit: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        actions: [
          {
            timestamp: new Date().toISOString(),
            action: 'escalation_initiated',
            actor: 'system',
            details: {
              protocol: protocol.id,
              trigger: trigger.id,
              value: result.data[result.data.length - 1].value,
            },
          },
        ],
      },
    };

    this.activeEscalations.set(escalationId, escalationEvent);
    await this.executeImmediateActions(protocol, escalationEvent);
    await this.notifyResponders(protocol, trigger, escalationEvent);
    await this.logEscalation(escalationEvent);
  }

  private async executeImmediateActions(
    protocol: EmergencyProtocol,
    escalation: EscalationEvent
  ): Promise<void> {
    for (const action of protocol.immediateActions) {
      await this.executeAction(action, escalation);
      this.logAction(escalation.id, action, 'system');
    }
  }

  private async executeAction(action: string, escalation: EscalationEvent): Promise<void> {
    // Implement action execution logic
    console.log(`Executing action: ${action} for escalation: ${escalation.id}`);
  }

  private async notifyResponders(
    protocol: EmergencyProtocol,
    trigger: EscalationTrigger,
    escalation: EscalationEvent
  ): Promise<void> {
    const currentLevel = escalation.escalationPath.currentLevel;
    const levelConfig = trigger.escalationPath.find((path) => path.level === currentLevel);

    if (!levelConfig) return;

    for (const responder of levelConfig.responders) {
      const notificationTarget = protocol.notificationTargets.find(
        (target) => target.role === responder
      );

      if (notificationTarget) {
        await this.sendNotification(notificationTarget, escalation);
        escalation.escalationPath.responders.push({
          role: responder,
          status: 'notified',
          timestamp: new Date().toISOString(),
        });
      }
    }

    this.updateEscalation(escalation);
  }

  private async sendNotification(
    target: { role: string; channel: 'sms' | 'email' | 'push' | 'call'; priority: number },
    escalation: EscalationEvent
  ): Promise<void> {
    // Implement notification logic
    console.log(
      `Sending ${target.channel} notification to ${target.role} for escalation: ${escalation.id}`
    );
  }

  private updateEscalation(escalation: EscalationEvent): void {
    escalation.audit.updatedAt = new Date().toISOString();
    this.activeEscalations.set(escalation.id, escalation);
  }

  private async logEscalation(escalation: EscalationEvent): Promise<void> {
    await this.auditKit.logHealthTask(
      {
        id: escalation.id,
        type: 'monitoring',
        parameters: {
          action: 'emergency_escalation',
          threshold: 0,
        },
        context: {
          clinicalContext: `Emergency escalation for ${escalation.patient.condition}`,
          patientHistory: [`Escalation triggered at ${escalation.timestamp}`],
        },
      } as HealthTask,
      'emergency_escalation',
      'system'
    );
  }

  private logAction(escalationId: string, action: string, actor: string): void {
    const escalation = this.activeEscalations.get(escalationId);
    if (!escalation) return;

    escalation.audit.actions.push({
      timestamp: new Date().toISOString(),
      action,
      actor,
    });

    this.updateEscalation(escalation);
  }

  // Public methods for external interaction
  async acknowledgeEscalation(escalationId: string, responder: string): Promise<void> {
    const escalation = this.activeEscalations.get(escalationId);
    if (!escalation) return;

    const responderRecord = escalation.escalationPath.responders.find((r) => r.role === responder);
    if (responderRecord) {
      responderRecord.status = 'responded';
      responderRecord.timestamp = new Date().toISOString();
    }

    escalation.status = 'acknowledged';
    this.logAction(escalationId, 'escalation_acknowledged', responder);
    this.updateEscalation(escalation);
  }

  async resolveEscalation(
    escalationId: string,
    resolver: string,
    resolution: Record<string, any>
  ): Promise<void> {
    const escalation = this.activeEscalations.get(escalationId);
    if (!escalation) return;

    escalation.status = 'resolved';
    this.logAction(escalationId, 'escalation_resolved', resolver);
    this.updateEscalation(escalation);

    await this.auditKit.logHealthTask(
      {
        id: escalationId,
        type: 'monitoring',
        parameters: {
          action: 'emergency_resolution',
          threshold: 0,
        },
        context: {
          clinicalContext: `Emergency resolved for ${escalation.patient.condition}`,
          patientHistory: [`Resolution details: ${JSON.stringify(resolution)}`],
        },
      } as HealthTask,
      'emergency_resolution',
      resolver
    );
  }

  async getActiveEscalations(): Promise<EscalationEvent[]> {
    return Array.from(this.activeEscalations.values()).filter(
      (escalation) => escalation.status === 'active' || escalation.status === 'acknowledged'
    );
  }

  async getEscalationHistory(patientId: string): Promise<EscalationEvent[]> {
    return Array.from(this.activeEscalations.values()).filter(
      (escalation) => escalation.patient.id === patientId
    );
  }
}
