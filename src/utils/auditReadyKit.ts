import type { LabResult } from '../components/dashboard/LabResultsPanel';
import type { HealthTask } from './healthTaskValidator';

interface AuditLog {
  timestamp: string;
  action: string;
  actor: string;
  resource: string;
  details: {
    before?: any;
    after?: any;
    reason?: string;
    metadata?: Record<string, any>;
  };
  compliance: {
    policy: string;
    status: 'compliant' | 'non_compliant' | 'review_needed';
    validations: string[];
  };
}

interface CompliancePolicy {
  id: string;
  name: string;
  description: string;
  requirements: Array<{
    id: string;
    description: string;
    validationType: 'data' | 'process' | 'access' | 'security';
    validation: (data: any) => boolean;
  }>;
  references: Array<{
    standard: string;
    section: string;
    requirement: string;
  }>;
}

interface AuditReport {
  summary: {
    totalRecords: number;
    compliantRecords: number;
    violations: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
  details: {
    violations: AuditLog[];
    recommendations: string[];
    requiredActions: string[];
  };
  metadata: {
    generatedAt: string;
    period: {
      start: string;
      end: string;
    };
    policies: string[];
  };
}

export class AuditReadyKit {
  private static instance: AuditReadyKit;
  private auditLogs: AuditLog[];
  private policies: CompliancePolicy[];

  private constructor() {
    this.auditLogs = [];
    this.policies = this.initializePolicies();
  }

  static getInstance(): AuditReadyKit {
    if (!AuditReadyKit.instance) {
      AuditReadyKit.instance = new AuditReadyKit();
    }
    return AuditReadyKit.instance;
  }

  private initializePolicies(): CompliancePolicy[] {
    return [
      {
        id: 'HIPAA_DATA_HANDLING',
        name: 'HIPAA Data Handling',
        description: 'Ensures compliance with HIPAA data handling requirements',
        requirements: [
          {
            id: 'PHI_ENCRYPTION',
            description: 'Protected Health Information must be encrypted',
            validationType: 'security',
            validation: (data) => this.validateEncryption(data),
          },
          {
            id: 'ACCESS_LOGGING',
            description: 'All data access must be logged',
            validationType: 'access',
            validation: (data) => this.validateAccessLogging(data),
          },
        ],
        references: [
          {
            standard: 'HIPAA',
            section: '164.312(a)(2)(iv)',
            requirement: 'Encryption and decryption',
          },
        ],
      },
      {
        id: 'DATA_RETENTION',
        name: 'Data Retention Policy',
        description: 'Ensures proper retention of medical records',
        requirements: [
          {
            id: 'RETENTION_PERIOD',
            description: 'Medical records must be retained for minimum required period',
            validationType: 'process',
            validation: (data) => this.validateRetentionPeriod(data),
          },
        ],
        references: [
          {
            standard: 'State Medical Board',
            section: 'Record Retention',
            requirement: 'Minimum 7 years retention',
          },
        ],
      },
    ];
  }

  logLabResult(result: LabResult, action: string, actor: string): void {
    const log: AuditLog = {
      timestamp: new Date().toISOString(),
      action,
      actor,
      resource: `lab_result:${result.title}`,
      details: {
        before: this.sanitizeForLogging(result),
        metadata: {
          resultType: result.title,
          timestamp: result.data[result.data.length - 1].date,
        },
      },
      compliance: this.checkCompliance(result),
    };

    this.auditLogs.push(log);
  }

  logHealthTask(task: HealthTask, action: string, actor: string): void {
    const log: AuditLog = {
      timestamp: new Date().toISOString(),
      action,
      actor,
      resource: `health_task:${task.id}`,
      details: {
        before: this.sanitizeForLogging(task),
        metadata: {
          taskType: task.type,
          frequency: task.parameters.frequency,
        },
      },
      compliance: this.checkCompliance(task),
    };

    this.auditLogs.push(log);
  }

  async generateAuditReport(startDate: string, endDate: string): Promise<AuditReport> {
    const relevantLogs = this.auditLogs.filter(
      (log) => log.timestamp >= startDate && log.timestamp <= endDate
    );

    const violations = relevantLogs.filter((log) => log.compliance.status === 'non_compliant');

    return {
      summary: {
        totalRecords: relevantLogs.length,
        compliantRecords: relevantLogs.length - violations.length,
        violations: violations.length,
        riskLevel: this.calculateRiskLevel(violations),
      },
      details: {
        violations,
        recommendations: this.generateRecommendations(violations),
        requiredActions: this.generateRequiredActions(violations),
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        period: { start: startDate, end: endDate },
        policies: this.policies.map((p) => p.id),
      },
    };
  }

  private sanitizeForLogging(data: any): any {
    // Remove sensitive information before logging
    const sanitized = { ...data };
    delete sanitized.patientId;
    delete sanitized.personalInfo;
    return sanitized;
  }

  private checkCompliance(data: any): {
    policy: string;
    status: 'compliant' | 'non_compliant' | 'review_needed';
    validations: string[];
  } {
    const validations: string[] = [];
    let status: 'compliant' | 'non_compliant' | 'review_needed' = 'compliant';

    for (const policy of this.policies) {
      for (const requirement of policy.requirements) {
        const isValid = requirement.validation(data);
        if (!isValid) {
          validations.push(`Failed: ${requirement.description}`);
          status = 'non_compliant';
        }
      }
    }

    return {
      policy: this.policies.map((p) => p.id).join(', '),
      status,
      validations: validations.length ? validations : ['All checks passed'],
    };
  }

  private validateEncryption(data: any): boolean {
    // Implement actual encryption validation
    return true;
  }

  private validateAccessLogging(data: any): boolean {
    // Implement access logging validation
    return this.auditLogs.some(
      (log) =>
        log.resource === `lab_result:${data.title}` || log.resource === `health_task:${data.id}`
    );
  }

  private validateRetentionPeriod(data: any): boolean {
    if (!data.timestamp) return false;

    const retentionPeriod = 7 * 365 * 24 * 60 * 60 * 1000; // 7 years in milliseconds
    const dataAge = Date.now() - new Date(data.timestamp).getTime();

    return dataAge <= retentionPeriod;
  }

  private calculateRiskLevel(violations: AuditLog[]): 'low' | 'medium' | 'high' {
    const criticalViolations = violations.filter((v) =>
      v.compliance.validations.some((val: string) => val.includes('Critical'))
    ).length;

    if (criticalViolations > 0) return 'high';
    if (violations.length > 10) return 'medium';
    return 'low';
  }

  private generateRecommendations(violations: AuditLog[]): string[] {
    const recommendations = new Set<string>();

    violations.forEach((violation) => {
      if (
        violation.compliance.validations.includes(
          'Failed: Protected Health Information must be encrypted'
        )
      ) {
        recommendations.add('Implement encryption for all PHI data');
      }
      if (violation.compliance.validations.includes('Failed: All data access must be logged')) {
        recommendations.add('Enable comprehensive access logging');
      }
    });

    return Array.from(recommendations);
  }

  private generateRequiredActions(violations: AuditLog[]): string[] {
    const actions = new Set<string>();

    violations.forEach((violation) => {
      if (violation.compliance.status === 'non_compliant') {
        actions.add(`Review and fix compliance issues for ${violation.resource}`);
      }
      if (violation.compliance.status === 'review_needed') {
        actions.add(`Manual review required for ${violation.resource}`);
      }
    });

    return Array.from(actions);
  }

  // Utility methods for external use
  async validateCompliance(data: any): Promise<boolean> {
    const compliance = this.checkCompliance(data);
    return compliance.status === 'compliant';
  }

  async getAuditLogs(resource: string): Promise<AuditLog[]> {
    return this.auditLogs.filter((log) => log.resource === resource);
  }

  async getPolicies(): Promise<CompliancePolicy[]> {
    return this.policies;
  }
}
