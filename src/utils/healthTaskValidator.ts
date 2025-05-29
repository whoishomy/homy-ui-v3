import type { LabResult } from '../components/dashboard/LabResultsPanel';

interface ValidationRule {
  id: string;
  type: 'range' | 'trend' | 'interaction' | 'frequency' | 'combination';
  severity: 'critical' | 'warning' | 'info';
  condition: {
    field: string;
    operator: '>' | '<' | '==' | '>=' | '<=' | 'in' | 'not_in';
    value: number | string | string[];
    unit?: string;
  };
  message: {
    patient: string;
    clinical: string;
    technical: string;
  };
  references?: {
    source: string;
    link: string;
    lastUpdated: string;
  }[];
}

interface TaskValidation {
  isValid: boolean;
  violations: Array<{
    ruleId: string;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    suggestedAction: string;
  }>;
  safetyChecks: Array<{
    type: string;
    passed: boolean;
    details: string;
  }>;
  recommendations: string[];
}

export interface HealthTask {
  id: string;
  type: 'monitoring' | 'medication' | 'lifestyle' | 'followup';
  parameters: {
    frequency?: string;
    duration?: string;
    threshold?: number;
    action: string;
    dependencies?: string[];
  };
  context: {
    labResult: LabResult;
    clinicalContext?: string;
    patientHistory?: string[];
  };
}

export class HealthTaskValidator {
  private static instance: HealthTaskValidator;
  private validationRules: ValidationRule[];

  private constructor() {
    this.validationRules = this.initializeRules();
  }

  static getInstance(): HealthTaskValidator {
    if (!HealthTaskValidator.instance) {
      HealthTaskValidator.instance = new HealthTaskValidator();
    }
    return HealthTaskValidator.instance;
  }

  private initializeRules(): ValidationRule[] {
    return [
      {
        id: 'GLUCOSE_MONITORING',
        type: 'range',
        severity: 'critical',
        condition: {
          field: 'value',
          operator: '>',
          value: 200,
          unit: 'mg/dL',
        },
        message: {
          patient: 'Your blood sugar is significantly elevated',
          clinical: 'Hyperglycemia requiring immediate attention',
          technical: 'Glucose level exceeds critical threshold',
        },
        references: [
          {
            source: 'ADA Guidelines',
            link: 'https://diabetes.org/guidelines',
            lastUpdated: '2024',
          },
        ],
      },
      {
        id: 'MEDICATION_INTERACTION',
        type: 'interaction',
        severity: 'warning',
        condition: {
          field: 'medications',
          operator: 'in',
          value: ['metformin', 'insulin'],
        },
        message: {
          patient: 'Your medications need careful timing',
          clinical: 'Potential medication interaction detected',
          technical: 'Drug interaction risk assessment required',
        },
      },
    ];
  }

  async validateTask(task: HealthTask): Promise<TaskValidation> {
    const violations = [];
    const safetyChecks = [];
    const recommendations = [];

    // Validate against rules
    for (const rule of this.validationRules) {
      if (this.ruleApplies(task, rule)) {
        const violation = this.checkViolation(task, rule);
        if (violation) {
          violations.push(violation);
        }
      }
    }

    // Perform safety checks
    safetyChecks.push(
      this.checkFrequency(task),
      this.checkDependencies(task),
      this.checkThresholds(task)
    );

    // Generate recommendations
    recommendations.push(...this.generateRecommendations(task, violations));

    return {
      isValid: violations.filter((v) => v.severity === 'critical').length === 0,
      violations,
      safetyChecks,
      recommendations,
    };
  }

  private ruleApplies(task: HealthTask, rule: ValidationRule): boolean {
    switch (rule.type) {
      case 'range':
        return task.type === 'monitoring';
      case 'interaction':
        return task.type === 'medication';
      case 'frequency':
        return !!task.parameters.frequency;
      case 'combination':
        return !!task.parameters.dependencies;
      default:
        return true;
    }
  }

  private checkViolation(
    task: HealthTask,
    rule: ValidationRule
  ): {
    ruleId: string;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    suggestedAction: string;
  } | null {
    const value = this.extractValue(task, rule.condition.field);
    if (!this.evaluateCondition(value, rule.condition)) {
      return {
        ruleId: rule.id,
        severity: rule.severity,
        message: rule.message.clinical,
        suggestedAction: this.generateAction(rule, task),
      };
    }
    return null;
  }

  private extractValue(task: HealthTask, field: string): any {
    if (field === 'value') {
      return task.context.labResult.data[task.context.labResult.data.length - 1].value;
    }
    if (field in task.parameters) {
      return task.parameters[field as keyof typeof task.parameters];
    }
    return undefined;
  }

  private evaluateCondition(
    value: any,
    condition: {
      operator: string;
      value: number | string | string[];
    }
  ): boolean {
    switch (condition.operator) {
      case '>':
        return value > condition.value;
      case '<':
        return value < condition.value;
      case '>=':
        return value >= condition.value;
      case '<=':
        return value <= condition.value;
      case '==':
        return value === condition.value;
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(value);
      case 'not_in':
        return Array.isArray(condition.value) && !condition.value.includes(value);
      default:
        return false;
    }
  }

  private generateAction(rule: ValidationRule, task: HealthTask): string {
    switch (rule.type) {
      case 'range':
        return 'Adjust monitoring frequency and thresholds';
      case 'interaction':
        return 'Review medication schedule and interactions';
      case 'frequency':
        return 'Optimize task timing and frequency';
      case 'combination':
        return 'Evaluate task dependencies and conflicts';
      default:
        return 'Review task parameters and context';
    }
  }

  private checkFrequency(task: HealthTask): {
    type: string;
    passed: boolean;
    details: string;
  } {
    if (!task.parameters.frequency) {
      return {
        type: 'frequency',
        passed: false,
        details: 'Missing frequency specification',
      };
    }

    const isValidFrequency = /^(daily|weekly|monthly|[0-9]+\s+(hour|day|week|month)s?)$/i.test(
      task.parameters.frequency
    );

    return {
      type: 'frequency',
      passed: isValidFrequency,
      details: isValidFrequency ? 'Frequency specification is valid' : 'Invalid frequency format',
    };
  }

  private checkDependencies(task: HealthTask): {
    type: string;
    passed: boolean;
    details: string;
  } {
    const dependencies = task.parameters.dependencies || [];
    const hasCircular = this.detectCircularDependencies(task.id, dependencies);

    return {
      type: 'dependencies',
      passed: !hasCircular,
      details: hasCircular ? 'Circular dependencies detected' : 'Dependencies validation passed',
    };
  }

  private detectCircularDependencies(taskId: string, dependencies: string[]): boolean {
    // Simple circular dependency check
    return dependencies.includes(taskId);
  }

  private checkThresholds(task: HealthTask): {
    type: string;
    passed: boolean;
    details: string;
  } {
    if (task.parameters.threshold === undefined) {
      return {
        type: 'thresholds',
        passed: true,
        details: 'No thresholds specified',
      };
    }

    const isReasonableThreshold = this.validateThresholdRange(
      task.parameters.threshold,
      task.context.labResult
    );

    return {
      type: 'thresholds',
      passed: isReasonableThreshold,
      details: isReasonableThreshold
        ? 'Threshold values are within reasonable range'
        : 'Threshold values require review',
    };
  }

  private validateThresholdRange(threshold: number, labResult: LabResult): boolean {
    if (!labResult.referenceRange) return true;

    const { min, max } = labResult.referenceRange;
    const range = max - min;

    // Check if threshold is within 3 standard deviations of the reference range
    return threshold >= min - range * 1.5 && threshold <= max + range * 1.5;
  }

  private generateRecommendations(
    task: HealthTask,
    violations: Array<{
      severity: string;
      message: string;
    }>
  ): string[] {
    const recommendations = [];

    if (violations.some((v) => v.severity === 'critical')) {
      recommendations.push('Review task parameters with healthcare provider');
    }

    if (task.type === 'monitoring') {
      recommendations.push('Consider adjusting monitoring frequency based on results');
    }

    if (task.type === 'medication') {
      recommendations.push('Verify medication interactions and timing');
    }

    return recommendations;
  }
}
